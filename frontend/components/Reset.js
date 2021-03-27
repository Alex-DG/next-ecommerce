import Link from 'next/link'
import Form from './styles/Form'
import useForm from '../lib/useForm'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import ErrorMessage from './ErrorMessage'

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $token: String!
    $password: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`

const Reset = ({ token }) => {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  })

  const [reset, { data, loading, error }] = useMutation(RESET_MUTATION, {
    variables: inputs,
  })

  // In that case we can have error from the the mutation return or this other case
  const successfulError = data?.redeemUserPasswordResetToken.code
    ? data?.redeemUserPasswordResetToken
    : undefined

  const handleSubmit = async (e) => {
    e.preventDefault()
    await reset().catch(console.error)
    console.log({ error })
    resetForm()
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Rest Your Password</h2>

      <ErrorMessage {...{ error: error || successfulError }} />

      <fieldset disabled={loading}>
        {data?.redeemUserPasswordResetToken === null && (
          <p>
            Success! You can now <Link href="/signin">Sign In</Link>
          </p>
        )}

        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          ></input>
        </label>

        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          ></input>
        </label>

        <button type="submit">Request Reset</button>
      </fieldset>
    </Form>
  )
}

export default Reset
