import { Session } from '../types'
import { KeystoneContext } from '@keystone-next/types'
import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types'
import stripeConfig from '../lib/stripe'

interface Arguments {
  token: string
}

// make a fake graphql tagged template literal
const graphql = String.raw

const checkout = async (
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): // @ts-ignore
Promise<OrderCreateInput> => {
  const session: Session = context.session
  const userId = session.itemId

  // Query the current user see if he is signed in
  if (!userId) {
    throw new Error('Sorry! You must be logged in to do this')
  }

  // Query the current user
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
      id
      name
      email
      cart {
        id
        quantity
        product {
          name
          price
          description
          id
          photo {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }
    `,
  })
  console.dir(user, { depth: null })

  // Calcul the total price for their order
  const cartItems = user.cart.filter((cartItem) => cartItem.product)
  const amount = cartItems.reduce(function (
    tally: number,
    cartItem: CartItemCreateInput
  ) {
    // @ts-ignore
    return tally + cartItem.quantity * cartItem.product.price
  },
  0)
  console.log(amount)

  // Create the charge with the stripe library
  const charge = await stripeConfig.paymentIntents
    .create({
      amount,
      currency: 'USD',
      confirm: true,
      payment_method: token,
    })
    .catch((err) => {
      console.log(err)
      throw new Error(err.message)
    })
  console.log(charge)

  //   return {}
}

export default checkout
