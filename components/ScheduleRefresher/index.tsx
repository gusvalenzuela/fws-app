import React from 'react'
import type { FormEvent } from 'react'
import { convertToNewSchema } from './createScheduleForMongo'
import StartDays from '../../lib/stores/startDays.json'

const ScheduleRefresher = () => {
  const startDates = StartDays.week_start_days
  const currentWeek = startDates.findIndex(
    (d: string) => Date.parse(d) > Date.now()
  )
  const weekInputRef = React.useRef(null)
  // message, updating, error
  const msgDefault = { message: '', isError: false }
  const [msg, setMsg] = React.useState(msgDefault)
  const [isUpdating, setIsUpdating] = React.useState(false)
  // ...
  const grabGamesFromAPI = async () => {
    const queryURI = `https://www.espn.com/nfl/schedule/_/week/${weekInputRef.current.value}/seasontype/2?xhr=1`
    // grab events from the ESPN schedule endpoint
    const footballGames = await fetch(queryURI).then(async (r) => r.json())

    return footballGames
  }

  const patchMatchupstoDB = async (data) => {
    // patch the incoming events into our DB
    // don't need to return anything
    const { matchups } = await fetch(`/api/matchups`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(async (r) => r.json())

    if (!matchups) {
      setMsg({
        ...msg,
        message: 'Update complete with no information',
      })
    } else {
      const reducer = (_prev, curr, ind: number) => {
        let updatedOk: number

        if (curr.ok) {
          updatedOk = ind + 1
        }
        return `Updated ${updatedOk} / ${ind + 1}`
      }
      setMsg({
        ...msg,
        message: matchups.reduce(reducer),
      })
    }
  }
  const clearUpdating = () => {
    setIsUpdating(false)
    setTimeout(
      () =>
        setMsg({
          ...msg,
          message: '',
        }),
      3000
    )
  }
  const handlePickWinnerRefresh = async (evt: FormEvent) => {
    evt.preventDefault()
    setIsUpdating(true)
    try {
      const footballGames = await grabGamesFromAPI()
      // stop if error in retrieving from API
      if (!footballGames) return
      // convert to a friendly array i can upload to mongodb
      const formattedGames = await convertToNewSchema(
        // TODO make type for API schedule
        footballGames.content?.schedule,
        weekInputRef.current.value
      )

      if (formattedGames) {
        await patchMatchupstoDB(formattedGames)
      }
    } catch (error) {
      setMsg({
        ...msg,
        message: 'Something went wrong, open the console.',
        isError: true,
      })
      console.log(error)
    }

    clearUpdating()
  }

  return (
    <>
      <label htmlFor="#week-input">
        Week:
        <input
          id="week-input"
          type="number"
          ref={weekInputRef}
          defaultValue={currentWeek}
          name="week-input"
          title="week-to-update"
        />
      </label>
      {msg?.message ? <p>{msg.message}</p> : null}
      <form id="update-matchups" onSubmit={handlePickWinnerRefresh}>
        <button type="submit" disabled={isUpdating}>
          Update Matchups
        </button>
      </form>
      <br />
    </>
  )
}

export default ScheduleRefresher
