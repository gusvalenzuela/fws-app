import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCurrentUser } from '../lib/hooks'

const LogoutPage = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const { mutate } = currentUser[1]

  axios.delete('/api/auth').then((res) => {
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
