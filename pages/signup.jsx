import React, { useEffect } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import SignupForm from '../components/SignupForm'
import { useCurrentUser } from '../lib/hooks'

function SignupPage() {
  const [user, { mutate }] = useCurrentUser()

  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) Router.replace('/')
  }, [user])

  return (
    <>
      <style jsx>{`
        .page-header {
          background: no-repeat 50% 10% / cover
            url(./assets/images/whiteline-on-field.jpg);
        }
      `}</style>
      <main id="signup">
        <Head>
          <title>FWS | Sign Up</title>
        </Head>
        <div className="main-content">
          <header className="page-header">
            <h1 className="hero">Sign Up!</h1>
          </header>
          <div className="page-content">
            <SignupForm mutate={mutate} />
            <p
              style={{
                color: '#777',
                textAlign: 'center',
                width: '80%',
                margin: 'auto',
              }}
            >
              Note: The database is public. For your privacy, please avoid using
              your personal, work email.
            </p>
          </div>
          <div className="page-footer">ℹ Page</div>
        </div>
      </main>
    </>
  )
}

export default SignupPage
