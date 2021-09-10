import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { getProviders, signIn, useSession } from 'next-auth/client'
import PropTypes from 'prop-types'
import Loader from '../components/DualRingLoader'
import SignInForm from '../components/SignInForm'
import Store from '../lib/stores/FootballPool'

const SignInPage = ({ demoAccount, providers }) => {
  const router = useRouter()
  const [session] = useSession()
  const darkMode = Store((s) => s.darkMode)
  const season = Store((s) => ({
    week: s.week || s.currentWeek,
    year: s.seasonYear || s.currentSeasonYear,
  }))
  const sport = 'football'

  if (demoAccount) {
    // sign in using email credentials
    // signIn('demo', {
    //   callbackUrl: 'http://localhost:3000',
    //   email: 'demo@email.com',
    // })
  }

  useEffect(() => {
    if (!session || !season) return
    // redirect to home if user (session) is logged in
    if (session.user) {
      router.push(`/weeks?sport=${sport}&yr=${season.year}`)
    }
  }, [session, router, season])

  return (
    <>
      <style jsx>{`
        .page-header {
          background: no-repeat 50% 40% / cover
            url(./assets/images/stadium-long-shot.jpg);
        }
      `}</style>
      <Head>
        <title>FWS | Sign In</title>
      </Head>
      <main id="signin" className="signin">
        <header className="page-header">
          <h2 className="hero">Let&apos;s go!</h2>
        </header>
        <div className="page-content">
          {demoAccount ? (
            <Loader text="Signing in as Demo, please wait..." />
          ) : (
            <SignInForm
              providers={providers}
              signIn={signIn}
              darkMode={darkMode}
              demoAccount={demoAccount || null}
            />
          )}
          <p
            style={{
              color: `${darkMode ? '#ccc' : '#222'}`,
              textAlign: 'left',
              maxWidth: '375px',
              margin: 'auto',
            }}
          >
            <b>Disclaimer: </b>
            <br />
            This app is for ENTERTAINMENT USE ONLY. Very much in alpha and
            subject to change without notice.
          </p>
        </div>
        <div className="page-footer" />
      </main>
    </>
  )
}

export default SignInPage

SignInPage.propTypes = {
  demoAccount: PropTypes.oneOf([PropTypes.string, null]),
  providers: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.oneOf(['oauth', 'email', 'credentials']),
      signinUrl: PropTypes.string,
      callbackUrl: PropTypes.string,
    })
  ).isRequired,
}
SignInPage.defaultProps = {
  demoAccount: null,
}

export async function getServerSideProps({ query }) {
  const demoAccount = query.demo || null
  const providers = await getProviders()
  return {
    props: {
      demoAccount,
      providers,
    }, // will be passed to the page component as props
  }
}
