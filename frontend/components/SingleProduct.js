import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import Head from 'next/head'
import styled from 'styled-components'
import DisplayError from './ErrorMessage'

const ProductStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  max-width: var(--maxWidth);
  justify-content: center;
  align-items: top;
  gap: 2rem;
  img {
    width: 100%;
    object-fit: contain;
  }
`

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      name
      price
      description
      id
      photo {
        id
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`

const SingleProduct = ({ id }) => {
  const { data, loading, error } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: {
      id,
    },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <DisplayError {...{ error }} />

  const { name, photo, description } = data.Product
  const { image, altText } = photo

  return (
    <ProductStyles>
      <Head>
        <title>Sick Fits | {name}</title>
      </Head>

      <img src={image.publicUrlTransformed} alt={altText} />

      <div className="details">
        <h2>{name}</h2>
        <p>{description}</p>
      </div>
    </ProductStyles>
  )
}

export default SingleProduct
