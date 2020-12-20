import React, { useState, useEffect } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { generateNumbersArray } from '../lib/utils'
import { useCurrentUser } from '../lib/hooks'
import Store from '../lib/stores/FootballPool'
import AdminEventSection from '../components/AdminEventSection'

const RUNDOWN_KEY = process.env.NEXT_PUBLIC_RUNDOWN_KEY
const AdminPage = () => {
  // message, updating, error
  const msgDefault = { message: '', isError: false }
  const [msg, setMsg] = useState(msgDefault)
  // const [isUpdating, setIsUpdating] = useState(false);
  // Stored variables
  const dbSchedule = Store((s) => s.schedule)
  // Fetches
  const [user] = useCurrentUser()
  // Other state
  const [events, setEvents] = useState([]) // events held in state
  const week = Store((s) => s.week || s.currentWeek) //

  // on week, dbschedule set
  useEffect(() => {
    // sort by event date
    dbSchedule?.events.sort(
      (a, b) => new Date(a.event_date) - new Date(b.event_date)
    )

    // filter out the desired week
    const filteredEvents = dbSchedule?.events.filter(
      (event) => event.week === week && event.season_type === 'Regular Season'
    )

    if (filteredEvents && filteredEvents.length > 0) {
      setEvents(filteredEvents)
    }
  }, [week, dbSchedule])

  const handlePickWinnerRefresh = async (evt) => {
    evt.preventDefault()
    setMsg({ ...msg, message: 'disabled' })
    const fromDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
      .toISOString()
      .split('T')[0] // date, 3 days ago
    const rundownQuery = `https://therundown-therundown-v1.p.rapidapi.com/sports/2/schedule?from=${fromDate}&limit=${32}`
    const rundownHeaders = new Headers({
      'x-rapidapi-host': 'therundown-therundown-v1.p.rapidapi.com',
      'x-rapidapi-key': RUNDOWN_KEY,
    })
    const rundownFetchOptions = {
      headers: rundownHeaders,
    }
    try {
      // grab events from the Rundown API
      const rundownEvents = await fetch(rundownQuery, rundownFetchOptions).then(
        async (r) => ({
          events: await r.json(),
          reqRemaining: r.headers.get('X-RateLimit-requests-Remaining'),
        })
      )

      // patch the incoming rundown events into our DB
      // don't need to return  anything
      await fetch('/api/schedule', {
        method: 'PATCH',
        body: JSON.stringify(rundownEvents.events.schedules),
      }).then((r) => r)

      // grab events from the DB
      // (trick: while it retrieves FINAL events, it also determines a winner)
      // [warning: make sure there's a betting line on the matchup!]
      const savedEvents = await fetch('/api/schedule').then((r) => r.json())

      // // then patch again, with newly determined winners
      const results = await fetch('/api/schedule', {
        method: 'PATCH',
        body: JSON.stringify(savedEvents),
      })
      setMsg({ ...msg, message: results.statusText })
    } catch (error) {
      // console.log(error)
    }
  }

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
            <form id="mark-winner" onSubmit={handlePickWinnerRefresh}>
              <button type="submit" disabled={msg.message === 'disabled'}>
                Update Pick Winners
              </button>
            </form>
            <Dropdown
              className="week-dropdown"
              onChange={(e, { value }) => Store.setState({ week: value })}
              options={generateNumbersArray(1, 17).map((num) => ({
                key: num,
                value: num,
                text: `Week ${num}`,
              }))}
              value={week}
              text={`Week ${week.toString()}`}
              inline
            />
            {events.length > 0 &&
              events.map((event) => {
                return <AdminEventSection key={event?.event_id} event={event} />
              })}
          </div>

          <div className="page-footer">🎉</div>
        </div>
      </main>
    </>
  )
}

export default AdminPage
