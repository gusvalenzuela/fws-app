import React from 'react'
import Head from 'next/head'
import ProfileSection from '../components/ProfileSection'
import { useCurrentUser } from '../lib/hooks'

const SettingPage = () => {
  const [user] = useCurrentUser()

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
              : 'Change your account&apos;s settings:'}
          </h1>
        </header>
        {user && !user.isDemo ? (
          <div className="page-content">
            <ProfileSection />
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
