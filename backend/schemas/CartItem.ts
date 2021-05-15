import { integer, relationship } from '@keystone-next/fields'
import { list } from '@keystone-next/keystone/schema'
import { isSignedIn, permissions, rules } from '../access'

export const CartItem = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: rules.canOrder,
    delete: rules.canOrder,
  },
  ui: {
    isHidden: (args) => !permissions.canSeeBackend(args),

    // Create Default KeystoneJS UI column display
    listView: {
      initialColumns: ['product', 'quantity', 'user'],
    },
  },
  fields: {
    // TODO: Custom Label in here
    quantity: integer({
      defaultValue: 1,
      isRequired: true,
    }),
    product: relationship({ ref: 'Product' }),
    user: relationship({ ref: 'User.cart' }),
  },
})
