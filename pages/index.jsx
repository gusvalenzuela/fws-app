/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCurrentUser } from '../lib/hooks'

const HomePage = () => {
  const router = useRouter()
  const [user] = useCurrentUser()
  if (user) router.push('/weeks?sport=nfl&yr=2020')
  return (
    <div className="container">
      <Head>
        <title>FWS | HOME</title>
      </Head>
      <main id="index" className="index">
        <header className="page-header">
          <div className="hero">
            <h1>
              <span className="brand-name" /> brings picking sides in major
              sporting events<sup>*</sup> to your fingertips.
            </h1>

            <div
              style={{
                alignItems: 'center',
              }}
            >
              <a
                role="button"
                tabIndex={0}
                className="button"
                name="signup"
                onClick={() => {
                  router.push('/signup')
                }}
              >
                <span>Sign up for FREE!</span>
              </a>
              <a
                role="button"
                tabIndex={0}
                className="button"
                name="login"
                onClick={() => {
                  router.push('/login')
                }}
              >
                <span>Log In</span>
              </a>
            </div>
            <i style={{ fontSize: 'x-small' }}>
              <sup>*</sup>Currently only featuring American Football.
            </i>
            <a
              role="button"
              tabIndex={0}
              className="demo-link"
              onClick={() => {
                router.push('/weeks?sport=nfl&yr=2020')
              }}
            >
              Use Demo Account
            </a>
          </div>
        </header>
        <div className="page-content">
          {' '}
          <p
            style={{
              color: '#777',
              textAlign: 'center',
              margin: 'auto',
              fontSize: '18px',
            }}
          >
            <b>FOR ENTERTAINMENT USE ONLY.</b> <br />
            Subject to change without notice.
            <br /> Please play responsibly.{' '}
            <span
              role="img"
              aria-label="Winking face emoji"
              alt="Winking face emoji"
            >
              😉
            </span>
          </p>
        </div>

        <div className="page-footer" />
      </main>
    </div>
  )
}

export default HomePage
