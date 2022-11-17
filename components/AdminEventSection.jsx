import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'

const AdminEventSection = ({ event }) => {
  const msgDefault = { message: '', isError: false }
  const eventId = event.event_id
  const [isUpdating, setIsUpdating] = useState(false)
  const [msg, setMsg] = useState(msgDefault)
  const homeTeamScoreRef = useRef()
  const awayTeamScoreRef = useRef()
  const pointSpreadRef = useRef()

  useEffect(() => {
    pointSpreadRef.current.value = -(event?.line_?.point_spread || 0.5)
    homeTeamScoreRef.current.value = event?.home_score
    awayTeamScoreRef.current.value = event?.away_score
    // console.log(event);
  }, [event])

  const handleScoreSubmit = async (evt) => {
    evt.preventDefault()
    setTimeout(() => {
      setMsg(msgDefault) // clear any displayed messages after 4.2 secs
    }, 4200)

    if (isUpdating) return
    setIsUpdating(true)
    const formData = {
      event_id: eventId,
      sport_id: 2,
      home_score: homeTeamScoreRef.current.value,
      away_score: awayTeamScoreRef.current.value,
      final: document.getElementById(`final-${eventId}`).checked,
    }
    const res = await fetch('/api/matchups', {
      method: 'PATCH',
      body: JSON.stringify(formData),
    })
    setIsUpdating(false)
    if (res.status === 200) {
      setMsg({ message: 'Event updated' })
    } else {
      setMsg({ message: await res.text(), isError: true })
    }
  }
  const handleLineSubmit = async (evt) => {
    evt.preventDefault()
    setTimeout(() => {
      setMsg(msgDefault) // clear any displayed messages after 4.2 secs
    }, 4200)
    if (isUpdating) return
    const formElements = evt.currentTarget.elements
    setIsUpdating(true)
    const formData = {
      event_id: eventId,
      sport_id: 2,
      line_: {
        point_spread: Number(-pointSpreadRef.current.value),
        favorite: Number(formElements['favorite-team'].value),
      },
    }

    const res = await fetch(`/api/matchups`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    setIsUpdating(false)
    if (res.status === 200) {
      setMsg({ message: 'Point Spread updated' })
    } else {
      // console.log(`or else`)
      setMsg({ message: await res.text(), isError: true })
    }
  }
  const handleDateChangeSubmit = async (evt) => {
    if (isUpdating) return
    setTimeout(() => {
      setMsg(msgDefault) // clear any displayed messages after 4.2 secs
    }, 4200)
    const formElements = evt.currentTarget.elements
    evt.preventDefault()
    const dateInput = formElements['event-date'].value
    const timeInput = formElements['event-time'].value
    // convert the input Date & Time to UTC for updating event (using moment)
    // format: 2020-10-14T01:00:00Z
    if (dateInput === '') {
      setMsg({ message: `Date cannot be null`, isError: true })
    }
    if (timeInput === '') {
      setMsg({ message: `Time cannot be null`, isError: true })
    }

    if (dateInput !== '' && timeInput !== '') {
      setIsUpdating(true)
      const eventDateTime = moment(
        `${formElements['event-date'].value}T${formElements['event-time'].value}`
      )
        .utc()
        .format()

      const formData = {
        event_id: eventId,
        sport_id: 2,
        event_date: eventDateTime,
      }

      const res = await fetch('/api/matchups', {
        method: 'PATCH',
        body: JSON.stringify(formData),
      })
      setIsUpdating(false)
      if (res.status === 200) {
        // console.log(await res.json())
        setMsg({ message: 'Event updated' })
      } else {
        setMsg({ message: await res.text(), isError: true })
      }
    }

    // end handleSubmitDateTime
  }

  return (
    <>
      <style jsx>{`
        section {
          padding: 1rem;
          margin-bottom: 2rem;
          border: 1px solid red;
          width: fit-content;
          justify-content: center;
        }
        form {
          display: grid;
          text-align: center;
        }
        form * {
          margin: 4px;
        }
        form button {
          margin: 1rem;
        }
        button {
          width: fit-content;
          margin: auto !;
        }
      `}</style>
      <section>
        <h3>{event.event_name || 'Event Name'}</h3>
        {msg.message ? (
          <p
            style={{
              color: msg.isError ? 'red' : '#0070f3',
              textAlign: 'center',
            }}
          >
            {msg.message}
          </p>
        ) : null}

        <form id={`score-form-${event.event_id}`} onSubmit={handleScoreSubmit}>
          <span>
            {event.away_team?.abbreviation || 'Away Team'}{' '}
            <input
              placeholder="Score"
              required
              id={`score-${event.away_team_id}`}
              min="0"
              name="away-team"
              type="number"
              ref={awayTeamScoreRef}
            />
          </span>
          <span>
            {event.home_team?.abbreviation || 'Home Team'}{' '}
            <input
              required
              placeholder="Score"
              id={`score-${event.home_team_id}`}
              name="home-team"
              min="0"
              type="number"
              ref={homeTeamScoreRef}
            />
          </span>
          <label htmlFor={`final-${eventId}`}>
            Final Score?
            <input
              id={`final-${eventId}`}
              name={`final-${eventId}`}
              type="checkbox"
              defaultChecked={event.event_status === 'STATUS_FINAL'}
            />
          </label>

          <button disabled={isUpdating} type="submit">
            Save
          </button>
        </form>
        <form id={`line-form-${event.event_id}`} onSubmit={handleLineSubmit}>
          <p>Set Favorite:</p>
          <span>
            <label htmlFor={`${event.away_team?.abbreviation}`}>
              {`${event.away_team?.abbreviation}`}
              <input
                id={`favteam-${event.away_team?.abbreviation}`}
                value={`${event.away_team_id}`}
                name="favorite-team"
                type="radio"
                defaultChecked={event.line_?.favorite === event.away_team_id}
              />
            </label>
            <label htmlFor={`${event.home_team?.abbreviation}`}>
              {`${event.home_team?.abbreviation}`}
              <input
                id={`${event.home_team?.abbreviation}`}
                value={`${event.home_team_id}`}
                name="favorite-team"
                type="radio"
                defaultChecked={event.line_?.favorite === event.home_team_id}
              />
            </label>
          </span>
          <span>
            <label htmlFor="point-spread">
              Point Spread:
              <input
                placeholder="ex. 0.5"
                // required
                id={`pointspread-${event.away_team?.abbreviation}`}
                name="point-spread"
                type="number"
                max={999.5}
                min={0.5}
                // step={0.5}
                required
                ref={pointSpreadRef}
              />
            </label>
          </span>

          <button disabled={isUpdating} type="submit">
            Save Line
          </button>
        </form>
        <form
          id={`date-form-${event.event_id}`}
          onSubmit={handleDateChangeSubmit}
        >
          <p>New Event Date:</p>
          <span>
            <input
              id={`date-${event.event_date}`}
              name="event-date"
              type="date"
              defaultValue={`${moment(event.event_date).format('YYYY-MM-DD')}`}
            />
            <input
              id={`time-${event.event_date}`}
              name="event-time"
              type="time"
              defaultValue={`${moment(event.event_date).format('HH:mm')}`}
            />
          </span>

          <button disabled={isUpdating} type="submit">
            Change Date
          </button>
        </form>
      </section>
    </>
  )
}

export default AdminEventSection
