/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const HomePage = () => {
  const router = useRouter()
  const { data: session, status } = useSession()

  React.useEffect(() => {
    if (session?.user) router.push('/weeks?sport=football&yr=2021')
  }, [router, session, status])

  return (
    <>
      <style>{`
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
          background-color: var(--brand-color1);
          color: var(--color-light);
          padding: 0.5rem 1rem;
          margin-bottom: 8px;
          margin-right: 8px;
          justify-content: center;
        }
        a.button:hover {
          cursor: pointer;
          opacity: 0.9;
          background-color: var(--color-light, #ddd);
          color: var(--brand-color1, red);
        }
        a.button:active,
        a.button:visited {
          background-color: var(--color-dark, #222);
          color: var(--color-light, #ddd);
        }
        button.demo-link {
          border: none;
          cursor: pointer;
          color: #f5f5f5;
          margin: 2.8rem 0 1rem;
          text-shadow: 1px 1px 1px #00000041;
          background: linear-gradient(transparent 35%, #00000077);
          padding: 1rem;
          display: block;
          width: max-content;
        }
        button.demo-link:hover {
          /* color: #000000; */
          background: linear-gradient(transparent 35%, #000000ff);
        }
        button.demo-link:active,
        button.demo-link:visited {
          color: #ffffff59;
          background: linear-gradient(transparent 35%, #ffffff09);
        }

        a.button:active,
        button.demo-link:active {
          cursor: wait;
        }
      `}</style>
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
                onClick={() => {
                  router.push('/signin')
                }}
              >
                <span>Sign up for FREE!</span>
              </a>
              <a
                role="button"
                tabIndex={0}
                className="button"
                onClick={() => {
                  router.push('/signin')
                }}
              >
                <span>Sign In</span>
              </a>
            </div>
            <i style={{ fontSize: 'x-small' }}>
              <sup>*</sup>Currently only featuring American Football.
            </i>
            <button
              title="Signing in to Demo account coming back soon! See without signing in for now"
              type="button"
              className="demo-link"
              onClick={(e) => {
                e.currentTarget.disabled = true
                router.push('/weeks?sport=football')
              }}
            >
              See Demo
            </button>
          </div>
        </header>
        <div className="page-content">
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
              // alt="Winking face emoji"
            >
              😉
            </span>
          </p>
        </div>

        <div className="page-footer" />
      </main>
    </>
  )
}

export default HomePage
