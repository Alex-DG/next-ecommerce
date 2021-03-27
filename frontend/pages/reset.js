import React from 'react'
import RequestReset from '../components/RequestReset'
import Reset from '../components/Reset'

const ResetPage = ({ query }) => {
  if (!query.token) {
    return (
      <div>
        <p>Sorry no reset request found! Please try again.</p>
        <RequestReset />
      </div>
    )
  }
  return (
    <div>
      <Reset token={query.token} />
    </div>
  )
}

export default ResetPage
