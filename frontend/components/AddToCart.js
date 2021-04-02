import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import React from 'react'
import { CURRENT_USER_QUERY } from './User'

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CARD($id: ID!) {
    addToCart(productId: $id) {
      id
    }
  }
`

const AddToCart = ({ id }) => {
  const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  })

  return (
    <button disabled={loading} type="button" onClick={addToCart}>
      Add To Cart 🛒
    </button>
  )
}

export default AddToCart
