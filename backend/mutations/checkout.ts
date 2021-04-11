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

  // Convert card items to order items!
  const orderItems = cartItems.map((cartItem) => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id } },
    }
    return orderItem
  })
  console.log('> Gonna create the order')

  // Create the order and finally return it!
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } },
    },
    resolveFields: false,
  })

  // Clean up any old cart item
  const cartItemIds = user.cart.map((cartItem) => cartItem.id)
  console.log('> Gonna create delete cartItems')

  await context.lists.CartItem.deleteMany({
    ids: cartItemIds,
  })

  return order
}

export default checkout
