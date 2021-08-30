import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Store from '../lib/stores/FootballPool'
import LoginForm from '../components/LoginForm'
import { useCurrentUser } from '../lib/hooks'

const LoginPage = ({ demoAccount }) => {
  const router = useRouter()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [user, { mutate }] = useCurrentUser()

  const darkMode = Store((s) => s.darkMode)
  const season = Store((s) => ({
    week: s.week || s.currentWeek,
    year: s.seasonYear || s.currentSeasonYear,
  }))
  const sport = 'football'

  useEffect(() => {
    if (!user || !season) return null
    // redirect to home if user is logged in
    router.push(`/weeks?sport=${sport}&yr=${season.year}`)

    // set loggingIn as false
    setIsLoggingIn(false)
    return () => {}
  }, [user, router, season])

  return (
    <>
      <style jsx>{`
        .page-header {
          background: no-repeat 50% 40% / cover
            url(./assets/images/stadium-long-shot.jpg);
        }
      `}</style>
      <Head>
        <title>FWS | Login</title>
      </Head>
      <main id="login" className="login">
        <header className="page-header">
          <h1 className="hero">Log In!</h1>
        </header>
        <div className="page-content">
          <LoginForm
            darkMode={darkMode}
            setIsLoggingIn={setIsLoggingIn}
            demoAccount={demoAccount}
            mutate={mutate}
            isLoggingIn={isLoggingIn}
          />
          <p
            style={{
              color: `${darkMode ? '#ccc' : '#222'}`,
              textAlign: 'center',
              maxWidth: '375px',
              margin: 'auto',
            }}
          >
            <b>Disclaimer: </b>
            This app is for ENTERTAINMENT USE ONLY. Very much in alpha and
            subject to change without notice.
          </p>
        </div>
        <div className="page-footer" />
      </main>
    </>
  )
}

export default LoginPage

LoginPage.propTypes = {
  demoAccount: PropTypes.oneOf([PropTypes.string, null]),
}

LoginPage.defaultProps = {
  demoAccount: null,
}

export async function getServerSideProps({ query }) {
  const demoAccount = query.demo || null
  return {
    props: {
      demoAccount,
    }, // will be passed to the page component as props
  }
}
