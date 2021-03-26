import Form from './styles/Form'
import useForm from '../lib/useForm'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { CURRENT_USER_QUERY } from './User'
import ErrorMessage from './ErrorMessage'

const defaultValues = {
  email: '',
  password: '',
  name: '',
}

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $name: String!
    $email: String!
    $password: String!
  ) {
    createUser(data: { name: $name, email: $email, password: $password }) {
      id
      email
      name
    }
  }
`

const SignUp = () => {
  const { inputs, handleChange, resetForm } = useForm(defaultValues)
  const { email, password, name } = inputs

  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION, {
    variables: inputs,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup().catch(console.error)
    resetForm()
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Sign Up For An Account</h2>

      <ErrorMessage {...{ error }} />

      <fieldset disabled={loading}>
        {data?.createUser && (
          <p>
            Signed up with {data.createUser.email} - Please Go Head and Sign in!
          </p>
        )}

        <label htmlFor="name">
          Your Name
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={name}
            autoComplete="name"
            onChange={handleChange}
          ></input>
        </label>

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

export default SignUp
