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
    <>
      <style jsx>{`
        #index .page-header {
          padding: 0;
          text-align: left;
        }
        #index .hero {
          background: no-repeat center/cover
            url(./assets/images/closeup-stadium-seats.jpg);
        }
        a.button {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 98%;
          max-width: 250px;
          height: 50px;
          text-decoration: none;
          text-transform: uppercase;
          font-size: 14px;
          font-weight: 700;
          background: var(--brand-color1);
          color: var(--color-light);
          padding: 0.5rem 1rem;
          margin-bottom: 8px;
          margin-right: 8px;
          justify-content: center;
        }
        a.button span {
          cursor: default;
        }

        a.demo-link {
          cursor: pointer;
          color: var(--color-light);
          margin: 2.8rem 0 1rem;
          text-shadow: 1px 1px 1px #00000041;
          background: linear-gradient(transparent 35%, #00000077);
          padding: 1rem;
          display: block;
          width: max-content;
        }
        a.demo-link:hover {
          /* color: #000000; */
          background: linear-gradient(transparent 35%, #000000ff);
        }
        a.demo-link:active {
          color: #ffffff59;
          background: linear-gradient(transparent 35%, #ffffff09);
        }
      `}</style>
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
                  router.push('/login?demo=7')
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
    </>
  )
}

export default HomePage
