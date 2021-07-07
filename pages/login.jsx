import React, { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Store from '../lib/stores/FootballPool'
import LoginForm from '../components/LoginForm'
import { useCurrentUser } from '../lib/hooks'

const LoginPage = ({ demoAccount }) => {
  const router = useRouter()
  const [user, { mutate }] = useCurrentUser()
  const season = Store((s) => ({
    week: s.week || s.currentWeek,
    year: s.seasonYear || s.currentSeasonYear,
  }))
  const sport = 'football'

  useEffect(() => {
    if (!user && !season) return null
    // redirect to home if user is logged in
    return router.push(`/weeks?sport=${sport}&yr=${season.year}`)
  }, [user, router, season])

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
          <LoginForm demoAccount={demoAccount} mutate={mutate} />
          <p
            style={{
              color: '#777',
              textAlign: 'center',
            }}
          >
            <b>Disclaimer: </b>
            This app is for ENTERTAINMENT USE ONLY. Very much in alpha and
            subject to change without notice.
          </p>
        </div>
      </div>
    </main>
  )
}

export default LoginPage

export async function getServerSideProps({ query }) {
  const demoAccount = query.demo || null
  return {
    props: {
      demoAccount,
    }, // will be passed to the page component as props
  }
}
