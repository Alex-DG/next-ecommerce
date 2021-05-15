import { useUser } from './User'
import SignIn from './SignIn'

const PleaseSignIn = ({ children }) => {
  const me = useUser()
  console.log({ me })
  if (!me) return <SignIn />
  return children
}

export default PleaseSignIn
