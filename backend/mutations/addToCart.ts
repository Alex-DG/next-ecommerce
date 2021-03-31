import { Session } from '../types'
import { KeystoneContext } from '@keystone-next/types'
import { CartItemCreateInput } from '../.keystone/schema-types'

const addToCart = async (
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> => {
  const session: Session = context.session

  // Query the current user see if he is signed in
  if (!session.itemId) {
    throw new Error('You must be logged in to do this')
  }

  // Query the current user  cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: session.itemId }, product: { id: productId } },
    resolveFields: 'id,quantity',
  })

  const [existingCartItem] = allCartItems

  if (existingCartItem) {
    console.log(
      `There are already ${existingCartItem.quantity}, increment by 1`
    )

    // See if the current item is in their cart
    // If it is, increment by 1
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
      resolveFields: false,
    })
  }

  // If it is not, create a new cart item!
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: session.itemId } },
    },
    resolveFields: false,
  })
}

export default addToCart
