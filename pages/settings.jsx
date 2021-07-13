import React from 'react'
import ProfileSection from '../components/ProfileSection'
import { useCurrentUser } from '../lib/hooks'

const SettingPage = () => {
  const [user] = useCurrentUser()

  if (!user) {
    return (
      <>
        <p>Please sign in</p>
      </>
    )
  }
  return (
    <>
      <main id="index" className="index">
        <div className="main-content">
          <header className="page-header">
            <h1>Change your account&apos;s settings:</h1>
          </header>
          <div className="page-content">
            <ProfileSection />
          </div>

          <div className="page-footer">
            <span role="img" aria-label="Party popper emoji">
              🎉
            </span>
          </div>
        </div>
      </main>
    </>
  )
}

export default SettingPage
