import React from 'react'
import ItemStyles from './styles/ItemStyles'
import Title from './styles/Title'
import PriceTag from './styles/PriceTag'

import Link from 'next/link'
import formatMoney from '../lib/formatMoney'
import DeleteProduct from './DeleteProduct'
import AddToCart from './AddToCart'

const Product = ({ product }) => {
  const { id, name, price, description } = product

  return (
    <ItemStyles>
      <img
        src={product?.photo?.image?.publicUrlTransformed}
        alt={product?.photo?.altText}
      />

      <Title>
        <Link href={`/product/${id}`}>{name}</Link>
      </Title>

      <PriceTag>{formatMoney(price)}</PriceTag>

      <p>{description}</p>

      <div className="buttonList">
        <Link
          href={{
            pathname: '/update',
            query: {
              id: product.id,
            },
          }}
        >
          Edit ✏️
        </Link>
        <DeleteProduct {...{ id }}>Delete</DeleteProduct>
        <AddToCart {...{ id }}>Add To Cart</AddToCart>
      </div>
    </ItemStyles>
  )
}

export default Product
