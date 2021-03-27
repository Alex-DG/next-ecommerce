import Form from './styles/Form'
import useForm from '../lib/useForm'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import ErrorMessage from './ErrorMessage'

const defaultValues = {
  email: '',
}

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`

const RequestReset = () => {
  const { inputs, handleChange, resetForm } = useForm(defaultValues)
  const { email } = inputs

  const [requestreset, { data, loading, error }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: inputs,
    }
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    await requestreset().catch(console.error)
    resetForm()
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Request A Password Reset</h2>

      <ErrorMessage {...{ error }} />

      <fieldset disabled={loading}>
        {data?.sendUserPasswordResetLink === null && (
          <p>Success! Check your email for a link!</p>
        )}

        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={email}
            onChange={handleChange}
          ></input>
        </label>

        <button type="submit">Request Reset</button>
      </fieldset>
    </Form>
  )
}

export default RequestReset
