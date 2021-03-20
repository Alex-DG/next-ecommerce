import React from 'react'
import UpdateProduct from '../components/UpdateProduct'

const UpdatePage = ({ query }) => {
  const { id } = query
  return (
    <div>
      <UpdateProduct {...{ id }} />
    </div>
  )
}

export default UpdatePage
