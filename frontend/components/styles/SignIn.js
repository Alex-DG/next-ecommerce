import Form from './Form'
import useForm from '../../lib/useForm'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { CURRENT_USER_QUERY } from '../User'
import ErrorMessage from '../ErrorMessage'

const defaultValues = {
  email: '',
  password: '',
}

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`

const SignIn = () => {
  const { inputs, handleChange, resetForm } = useForm(defaultValues)
  const { email, password } = inputs

  const [signin, { data, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: {
      email,
      password,
    },
    refetchQueries: [{ query: CURRENT_USER_QUERY }], // refetch user and update Nav
  })

  // Get error on auth failure
  const error =
    data?.authenticateUserWithPassword.__typename ===
    'UserAuthenticationWithPasswordFailure'
      ? data?.authenticateUserWithPassword
      : undefined

  console.log(error)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signin()
    resetForm()
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <ErrorMessage {...{ error }} />

      <fieldset disabled={loading}>
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

        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={password}
            onChange={handleChange}
          ></input>
        </label>

        <button type="submit">Submit</button>
      </fieldset>
    </Form>
  )
}

export default SignIn
