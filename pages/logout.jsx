import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCurrentUser } from '../lib/hooks'

const LogoutPage = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const { mutate } = currentUser[1]

  fetch('/api/auth', {
    method: 'DELETE',
  }).then((res) => {
    if (res.status === 204) {
      mutate({})
    }
    router.push('/')
  })

  return (
    <main id="logout">
      <Head>
        <title>FWS | Logout</title>
      </Head>
      <div className="main-content">
        <header className="page-header">Come back soon!</header>
        <div className="page-content">
          <h2>You are being logged out</h2>
        </div>
      </div>
    </main>
  )
}

export default LogoutPage
