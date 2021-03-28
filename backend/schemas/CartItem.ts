import { integer, relationship } from '@keystone-next/fields'
import { list } from '@keystone-next/keystone/schema'

export const CartItem = list({
  ui: {
    // Create Default KeystoneJS UI column display
    listView: {
      initialColumns: ['product', 'quantity', 'user'],
    },
  },
  fields: {
    // TODO: custom label in here
    quantity: integer({
      defaultValue: 1,
      isRequired: true,
    }),
    product: relationship({ ref: 'Product' }),
    user: relationship({ ref: 'User.cart' }),
  },
})
