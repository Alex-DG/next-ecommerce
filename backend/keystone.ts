import { createAuth } from '@keystone-next/auth'

import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session'

import { config, createSchema } from '@keystone-next/keystone/schema'
import 'dotenv/config'

import { sendResetEmail } from './lib/mail'

import { Role } from './schemas/Role'
import { User } from './schemas/User'
import { Product } from './schemas/Product'
import { CartItem } from './schemas/CartItem'
import { Order } from './schemas/Order'
import { OrderItem } from './schemas/OrderItem'
import { ProductImage } from './schemas/ProductImage'
import { permissionsList } from './schemas/fields'

import { insertSeedData } from './seed-data'
import { extendGraphqlSchema } from './mutations'

const databaseURL =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial'

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long they stay signe in
  secret: process.env.COOKIE_SECRET,
}

// Define how keystone login system will work
const { withAuth } = createAuth({
  listKey: 'User', // schema responsible for who is signing in
  identityField: 'email', // user will use their email to sign in
  secretField: 'password', // user will use their password to sign in
  initFirstItem: {
    fields: ['name', 'email', 'password'],
  },
  passwordResetLink: {
    sendToken: async (args) => {
      await sendResetEmail(args.token, args.identity)
    },
  },
  // TODO: add initial roles here
})

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      async onConnect(keystone) {
        console.log('Connected to the database!')

        if (process.argv.includes('--seed-data')) {
          await insertSeedData(keystone)
        }
      },
    },
    lists: createSchema({
      // Schema items go in here!!
      User,
      Product,
      ProductImage,
      CartItem,
      OrderItem,
      Order,
      Role,
    }),
    extendGraphqlSchema,
    ui: {
      isAccessAllowed: ({ session, endSession }) => {
        console.log({ session })

        const isSession = !!session?.data
        const isRole = !!session?.data?.role // role is null for frontent customer

        if (!isRole) endSession()

        return isSession && isRole
      },
    },

    session: withItemData(statelessSessions(sessionConfig), {
      // Graphql Query data of the logged in user for every session
      User: `id name email role { ${permissionsList.join(' ')} }`,
    }),
  })
)
