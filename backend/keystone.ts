import { createAuth } from '@keystone-next/auth'

import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session'

import { config, createSchema } from '@keystone-next/keystone/schema'
import 'dotenv/config'

import { User } from './schemas/User'
import { Product } from './schemas/Product'
import { ProductImage } from './schemas/ProductImage'

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
  // TODO: add in initla roles here
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
      // TODO: add data seeding here
    },
    lists: createSchema({
      // Schema items go in here
      User,
      Product,
      ProductImage,
    }),
    ui: {
      // TODO: change this for roles
      isAccessAllowed: ({ session }) => {
        console.log('[session]', { session })
        return !!session?.data
      },
    },
    session: withItemData(statelessSessions(sessionConfig), {
      // Graphql Query
      User: `id name email`,
    }),
  })
)
