import React, { useState, useEffect } from 'react'
import { useCurrentUser, useSchedule } from '../lib/hooks'
import Store from '../lib/stores/FootballPool'
import AdminEventSection from '../components/AdminEventSection'
import WeekDropdown from '../components/WeekDropdown'
import SeasonDropdown from '../components/SeasonDropdown'
import DualRingLoader from '../components/DualRingLoader'

const AdminPage = () => {
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
  // Other state
  const [events, setEvents] = useState([]) // events held in state

  // on week, schedule set
  useEffect(() => {
    // sort by event date
    schedule?.sort((a, b) => new Date(a.event_date) - new Date(b.event_date))

    // filter out the desired week
    const filteredEvents = schedule?.filter(
      (event) => event.week === week && event.season_type === 'Regular Season'
    )

    if (filteredEvents && filteredEvents.length > 0) {
      setEvents(filteredEvents)
    }
  }, [week, schedule])

  if (!user || !user?.isAdmin) {
    return (
      <>
        <p>Please sign in as an Administrator.</p>
      </>
    )
  }
  return (
    <>
      <main id="index" className="index">
        <div className="main-content">
          <header className="page-header">
            <h1>Game scores:</h1>
          </header>
          <div className="page-content">
            <SeasonDropdown season={season} setSeasonYear={setSeason} />
            <WeekDropdown week={week} setWeek={setWeek} />
            {!scheduleIsLoading && events.length ? (
              events.map((event) => (
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
        </div>
      </main>
    </>
  )
}

export default AdminPage
