import React from 'react'
import ItemStyles from './styles/ItemStyles'
import Title from './styles/Title'
import PriceTag from './styles/PriceTag'
import Router from 'next/router'

import Link from 'next/link'
import formatMoney from '../lib/formatMoney'

const Product = ({ product }) => {
  const { id, name, price, description } = product

  const handleViewProduct = () => {
    Router.push({
      pathname: `/product/${id}`,
    })
  }

  return (
    <ItemStyles onClick={handleViewProduct}>
      <img
        src={product?.photo?.image?.publicUrlTransformed}
        alt={product?.photo?.altText}
      />

      <Title>
        <Link href={`/product/${id}`}>{name}</Link>
      </Title>

      <PriceTag>{formatMoney(price)}</PriceTag>

      <p>{description}</p>
    </ItemStyles>
  )
}

export default Product
