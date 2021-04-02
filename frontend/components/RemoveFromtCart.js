import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import styled from 'styled-components'

const BigButton = styled.button`
  font-size: 3rem;
  background: none !important;
  border: 0 !important;

  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`

const update = (cache, payload) => {
  // Cache.identify get the card item as `CardItem:id`
  cache.evict(cache.identify(payload.data.deleteCartItem))
}

// Remove from cart by item id (/!\ item id is != from product id ;))
const RemoveFromtCart = ({ id }) => {
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { id },
    update,
    // TODO: at the moment it seems optimisticResponse is not working/there is bug with it, check their doc if they fix it in a future update. So for now I kept it commented
    // optimisticResponse: {
    //   deleteCartItem: {
    //     __typename: 'CartItem',
    //     id,
    //   },
    // },
  })

  return (
    <BigButton
      disabled={loading}
      onClick={removeFromCart}
      type="button"
      title="Remove This Item from Cart"
    >
      &times;
    </BigButton>
  )
}

export default RemoveFromtCart
