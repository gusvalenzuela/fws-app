import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { getSession } from 'next-auth/client'
import ProfileSection from '../components/ProfileSection'
import { useCurrentUser } from '../lib/hooks'

const SettingPage = () => {
  const [user, { mutate }] = useCurrentUser()

  return (
    <>
      <Head>
        <title>FWS | Settings</title>
      </Head>
      <main id="settings" className="settings">
        <header className="page-header">
          <h1>
            {!user || user.isDemo
              ? 'Please sign in'
              : `Change your account's settings:`}
          </h1>
        </header>
        {user && !user.isDemo ? (
          <div className="page-content">
            <ProfileSection user={user} mutateUser={mutate} />
          </div>
        ) : null}

        <div className="page-footer">
          <span role="img" aria-label="Party popper emoji">
            🎉
          </span>
        </div>
      </main>
    </>
  )
}

export default SettingPage

export async function getServerSideProps(ctx) {
  const { req } = ctx
  // use handler to extract user from session
  const session = await getSession({ req })

  // route if no user
  if (
    !session ||
    !session?.user
    // || session?.user.isDemo
  ) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  // if user found, extract from req and return as prop
  // this currentUser is used when user hook is unavailable
  return { props: { currentUser: session.user } }
}

SettingPage.propTypes = {
  currentUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    bio: PropTypes.string,
    email: PropTypes.string,
    emailVerified: PropTypes.bool,
    isAdmin: PropTypes.bool,
    prefersModernLayout: PropTypes.bool,
    profilePicture: PropTypes.string,
  }).isRequired,
}
