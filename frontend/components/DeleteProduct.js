import React from 'react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`

const update = (cache, payload) => {
  // Cache.evict: we select the item in apollo cache to remove
  cache.evict(cache.identify(payload.data.deleteProduct))
}

const DeleteProduct = ({ id, children }) => {
  console.log(id)
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT_MUTATION, {
    variables: { id },
    update,
  })

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        if (confirm('are you sure you want to delet this item?')) {
          deleteProduct().catch((err) => alert(err.message))
        }
      }}
    >
      {children}
    </button>
  )
}

export default DeleteProduct
