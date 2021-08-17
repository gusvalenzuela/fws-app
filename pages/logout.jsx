import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCurrentUser } from '../lib/hooks'

const LogoutPage = () => {
  const router = useRouter()
  const [currentUser, { mutate }] = useCurrentUser()

  React.useEffect(() => {
    if (!currentUser) return router.push('/')
    const logUserOut = async () => {
      const res = await axios.delete('/api/auth')
      if (res.status === 204) {
        mutate({})
      }
      router.push('/')
    }

    return logUserOut()
  }, [mutate, router, currentUser])

  return (
    <>
      <Head>
        <title>FWS | Logout</title>
      </Head>
      <main id="logout" className="logout">
        <header className="page-header">Come back soon!</header>
        <div className="page-content">
          <h2>
            {currentUser
              ? 'You are being logged out'
              : 'You have been logged out'}
          </h2>
        </div>
        <div className="page-footer" />
      </main>
    </>
  )
}

export default LogoutPage
