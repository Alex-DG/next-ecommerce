import { useState } from 'react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import styled from 'styled-components'
import { useRouter } from 'next/dist/client/router'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

import nProgress from 'nprogress'
import SickButton from './styles/SickButton'
import ErrorMessage from './ErrorMessage'

const CheckouFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border-radius: 1px solid rgba(0, 0, 0, 0.06);
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

const CheckoutForm = () => {
  const router = useRouter()
  const [error, setError] = useState()
  const [loading, setLoading] = useState()

  const elements = useElements()
  const stripe = useStripe()

  const [checkout, { error: graphQLError }] = useMutation(CREATE_ORDER_MUTATION)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    nProgress.start()

    // Create the payment method via stripe (token comes back here if successful)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    })

    console.log({ paymentMethod })

    if (error) {
      nProgress.done()
      setError(error)
      return
    }

    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    })

    console.log(`Finished with the order!`)
    console.log(order)

    // Change the page to view the order
    router.push({
      pathname: '/order',
      query: { id: order.data.checkout.id },
    })

    setLoading(false)
    nProgress.done()
  }

  return (
    <CheckouFormStyles onSubmit={handleSubmit}>
      {error && <p style={{ fontSize: 12 }}>{error.message}</p>}
      {graphQLError && <p style={{ fontSize: 12 }}>{graphQLError.message}</p>}
      <CardElement />
      <SickButton>Check Out Now</SickButton>
    </CheckouFormStyles>
  )
}

const Checkout = () => {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  )
}
export default Checkout
