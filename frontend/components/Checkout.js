import styled from 'styled-components'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement } from '@stripe/react-stripe-js'
import SickButton from './styles/SickButton'

const CheckouFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border-radius: 1px solid rgba(0, 0, 0, 0.06);
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

const handleSubmit = (e) => {
  e.preventDefault()
  console.log('TODO!')
}

const Checkout = () => {
  return (
    <>
      <Elements stripe={stripeLib}>
        <CheckouFormStyles onSubmit={handleSubmit}>
          <CardElement />
          <SickButton>Check Out Now</SickButton>
        </CheckouFormStyles>
      </Elements>
    </>
  )
}
export default Checkout
