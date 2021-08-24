import React from 'react'
import Head from 'next/head'
import type { GetServerSideProps } from 'next'
import LeaderboardTable from '../../../components/Leaderboard'

const LeaderboardPage = ({ type }) => (
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
        <LeaderboardTable category={type} />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { type } = context.query

  if (!type || !['weekly', 'season'].includes(type.toString())) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {
      type,
    }, // will be passed to the page component as props
  }
}
