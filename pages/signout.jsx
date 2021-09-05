import React from 'react'
import { signOut, useSession } from 'next-auth/client'
import Head from 'next/head'
import { useRouter } from 'next/router'

const LogoutPage = () => {
  const [session] = useSession()
  const router = useRouter()
  const [signingOff, setSigningOff] = React.useState(false)

  React.useEffect(() => {
    if (!session?.user) {
      router.replace('/')
    }
  }, [session, router])

  return (
    <>
      <style jsx>{`
        button.button {
          margin: 0 0 0.75rem;
          padding: 0.75rem 1rem;
          border: none;
          font-size: 1rem;
          border-radius: var(--border-radius, 2px);
          transition: all 0.1s ease-in-out;
          box-shadow: 0 0.15rem 0.3rem rgba(0, 0, 0, 0.15),
            inset 0 0.1rem 0.2rem var(--color-background),
            inset 0 -0.1rem 0.1rem rgba(0, 0, 0, 0.05);
          font-weight: 500;
          position: relative;
        }
        button.button:hover {
          cursor: pointer;
          background-color: var(--brand-color1);
          color: #fff;
        }
        button.button:active,
        button.button:visited {
          background-color: var(--brand-color1);
          color: #000;
        }
        button.button:active {
          cursor: wait;
        }
      `}</style>
      <Head>
        <title>FWS | Logout</title>
      </Head>
      <main id="logout" className="logout">
        {/* <header className="page-header">Until next time</header> */}
        <div className="page-content">
          {!session || signingOff ? (
            <h2>Goodbye. Come back soon!</h2>
          ) : (
            <>
              <h2>Are you sure you want to sign out?</h2>
              <button
                type="button"
                onClick={() => {
                  setSigningOff(true)
                  signOut({ redirect: '/' })
                }}
                className="button"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
        <div className="page-footer" />
      </main>
    </>
  )
}

export default LogoutPage
