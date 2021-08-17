import React from 'react'
import Head from 'next/head'
import LeaderboardTable from '../components/Leaderboard'

const LeaderboardPage = () => (
  <>
    <style>
      {`
        h1 {
          text-align: center;
        }
      `}
    </style>
    <Head>
      <title>FWS | Leaderboard</title>
    </Head>
    <main id="leaderboard" className="leaderboard">
      {/* <header className="page-header">
          <h1>Weekly Leaderboard</h1>
        </header> */}
      <div className="page-content">
        <LeaderboardTable />
      </div>
      <div className="page-footer">
        <span role="img" aria-label="Party popper emoji">
          🎉
        </span>
      </div>
    </main>
  </>
)
export default LeaderboardPage
