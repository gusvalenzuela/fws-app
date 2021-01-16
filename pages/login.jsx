import React, { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import LoginForm from '../components/LoginForm'
import { useCurrentUser } from '../lib/hooks'

const LoginPage = () => {
  const router = useRouter()
  const [user, { mutate }] = useCurrentUser()

  useEffect(() => {
    if (!user) return
    // redirect to home if user is authenticated
    router.push('/')
  }, [user, router])

  return (
    <main id="login">
      <Head>
        <title>FWS | Login</title>
      </Head>
      <div className="main-content">
        <header className="page-header">
          <h1 className="hero">Log In!</h1>
        </header>
        <div className="page-content">
          <LoginForm mutate={mutate} />
          <p
            style={{
              color: '#777',
              textAlign: 'center',
            }}
          >
            <b>Disclaimer: </b>This app is for ENTERTAINMENT USE ONLY. Very much
            in alpha and subject to change without notice.
          </p>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
