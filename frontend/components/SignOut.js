import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import React from 'react'
import { CURRENT_USER_QUERY } from '../components/User'

const SIGN_OUT_MUTATION = gql`
  mutation {
    endSession
  }
`

const SignOut = () => {
  const [signout] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  })

  return (
    <button type="submit" onClick={signout}>
      Sign Out
    </button>
  )
}

export default SignOut
