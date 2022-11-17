import React, { useState } from 'react'
import { useCurrentUser, useSchedule } from '../lib/hooks'
import Store from '../lib/stores/FootballPool'
import AdminEventSection from '../components/AdminEventSection'
import WeekDropdown from '../components/WeekDropdown'
import SeasonDropdown from '../components/SeasonDropdown'
import DualRingLoader from '../components/DualRingLoader'
import ScheduleRefresher from '../components/ScheduleRefresher'

const AdminPage = ({ apiURL }) => {
  const [season, setSeason] = useState(
    Store((s) => s.seasonYear) || Store.getState().currentSeasonYear
  )
  const [week, setWeek] = useState(
    Store((s) => s.week) || Store.getState().currentWeek
  )
  const { schedule, scheduleIsLoading } = useSchedule('nfl', season, week)

  // const [isUpdating, setIsUpdating] = useState(false);
  // Stored variables
  // Fetches
  const [user] = useCurrentUser()

  if (!user?.isAdmin || !user) {
    return (
      <main>
        <h2 className="page-header">
          Please sign in as an Administrator to view this page
        </h2>
      </main>
    )
  }
  return (
    <main id="admin" className="admin">
      <header className="page-header">
        <h1>Game scores:</h1>
      </header>
      <div className="page-content">
        <ScheduleRefresher url={apiURL} />
        <SeasonDropdown season={season} setSeasonYear={setSeason} />
        <WeekDropdown week={week} setWeek={setWeek} />
        {!scheduleIsLoading && schedule.length ? (
          schedule.map((event) => (
            <AdminEventSection key={event?.event_id} event={event} />
          ))
        ) : (
          <DualRingLoader />
        )}
      </div>

      <div className="page-footer">
        <span role="img" aria-label="Party popper emoji">
          🎉
        </span>
      </div>
    </main>
  )
}

export default AdminPage

export async function getStaticProps() {
  return {
    props: { apiURL: process.env.SPORT_API_QUERY },
  }
}
