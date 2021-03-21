import { useRouter } from 'next/dist/client/router'
import React from 'react'

import Pagination from '../../components/Pagination'
import Products from '../../components/Products'

export default function OrderPage() {
  const { query } = useRouter()
  const page = parseInt(query.page)

  return (
    <>
      <Pagination page={page || 1} />
      <Products page={page || 1} />
      <Pagination page={page || 1} />
    </>
  )
}
