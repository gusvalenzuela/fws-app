import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Img from 'next/image'
import SeasonDropdown from '../../../components/SeasonDropdown'
import Store from '../../../lib/stores/FootballPool'
import { useCurrentUser, useUserStandings, useUser } from '../../../lib/hooks'

export default function UserPage({ userId }) {
  const [currentUser] = useCurrentUser()
  const { user, isLoading: userIsLoading } = useUser(userId)
  const { name, email, bio, profilePicture } = user || {}
  const isCurrentUser = currentUser?._id === user?._id
  const seasonYear = Store((s) => s.seasonYear || s.currentSeasonYear)
  const { standings } = useUserStandings(userId, seasonYear)

  // React.useEffect(() => {
  //   console.log(standings)
  // }, [standings])

  return (
    <>
      <style jsx>
        {`
          h2 {
            text-align: left;
            margin-right: 0.5rem;
          }
          img {
            width: 10rem;
            height: auto;
            border-radius: 50%;
            box-shadow: rgba(0, 0, 0, 0.05) 0 10px 20px 1px;
            margin-right: 1.5rem;
            background-color: #f3f3f3;
          }
          p {
            font-family: monospace;
            color: #444;
            margin: 0.25rem 0 0.75rem;
          }
          a {
            margin-left: 0.25rem;
          }
          .page-content {
            text-align: left;
          }
          .page-content .user-info {
            display: flex;
            align-items: center;
            max-width: 800px;
            margin: auto;
            padding: 1rem;
            background-color: #1b309442;
          }
          .user-info section {
            width: 100%;
          }
          .user-info button {
            float: right;
            margin: 0 0.25rem;
          }
        `}
      </style>
      <Head>
        <title>FWS | {name}</title>
      </Head>

      <main id="account" className="account">
        <header className="page-header">
          <h1 className="hero">My Account</h1>
        </header>
        <div className="page-content">
          {userIsLoading ? (
            <div className="user-info">Loading information...</div>
          ) : (
            <>
              <div className="user-info">
                <Img src={profilePicture} width="256" height="256" alt={name} />
                <section>
                  <div>
                    <h2>{name}</h2>
                  </div>
                  Bio
                  <p>{bio}</p>
                  Email
                  <p>{email}</p>
                  {isCurrentUser && (
                    <Link passHref href="/settings">
                      <button type="button">Edit Account</button>
                    </Link>
                  )}
                </section>
              </div>
              <div>
                <h3>My Record:</h3>
                <SeasonDropdown />
                <br />
                {standings?.length
                  ? standings.map((weeklyRecord) => (
                      <p key={weeklyRecord._id}>
                        Week {weeklyRecord.week} Record:{' '}
                        {weeklyRecord.wins?.length}-
                        {weeklyRecord.losses?.length}
                      </p>
                    ))
                  : `No records found for ${seasonYear}`}
              </div>
            </>
          )}
        </div>

        <div className="page-footer">Thank you for playing!</div>
      </main>
    </>
  )
}
export async function getServerSideProps({ params }) {
  const { userId } = { ...params }
  if (!userId) {
    return {
      notFound: true,
    }
  }
  return {
    props: { userId }, // will be passed to the page component as props
  }
}
