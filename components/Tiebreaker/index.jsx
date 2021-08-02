import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { toast } from 'react-toastify'

const Tiebreaker = ({
  isLocked,
  eventId,
  hometeam,
  awayteam,
  tiebreaker,
  finalTiebreaker,
  user,
}) => {
  const [isUpdating, setIsUpdating] = React.useState(false)
  const tiebreakToast = React.useRef(null)
  const loginToPickToast = React.useRef(null)

  const tiebreakerOptions = () => {
    // function that creates the dropdown options needed for tiebreaker
    // min 1 (declared in i), max 192 (declared in max)
    const max = 192
    const optionsArray = []

    for (let i = 1; i < max + 1; i++) {
      optionsArray.push({
        key: i,
        text: i,
        value: i,
      })
    }
    return optionsArray
  }

  const handleTiebreakerSubmit = async (input) => {
    if (isUpdating) return

    // if no signed in user, display message about logging in
    if (!user) {
      // check to see to no similar toast is active (prevent dupes)
      if (!toast.isActive(loginToPickToast.current)) {
        loginToPickToast.current = toast.dark(
          'LOG IN TO START SETTING TIEBREAKERS!',
          {
            toastId: 'toast-not-loggedin',
          }
        )
      }
      return
    }

    // initializing the toast
    tiebreakToast.current = toast.info(
      `Updating tiebreaker to ${input}, please wait...`,
      {
        autoClose: false,
        closeButton: false,
      }
    )
    setIsUpdating(true)

    // append this tiebreaker (input param) to
    // eventId of matchup (i.e. MNF)
    const newTiebreakerPick = {
      matchupId: eventId,
      tiebreaker: Number(input),
    }
    const res = await fetch('/api/picks/', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTiebreakerPick),
    })

    setIsUpdating(false)
    if (res.status === 200) {
      // TODO: return new pick, or specific message
      // console.log(pick);
      // setTiebreaker(newTiebreakerPick.tiebreaker)
      // updating the toast alert and setting the autoclose
      toast.update(tiebreakToast.current, {
        render: (
          <>
            🎉 Tiebreaker updated to {input}!<br />
            <i style={{ fontSize: 'small' }}>
              Total points scored in {awayteam.abbreviation} @{' '}
              {hometeam.abbreviation} game.
            </i>
          </>
        ),
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
        closeButton: null,
      })
    } else {
      // check to see to no similar toast is active (prevent dupes)
      const errText = await res.text()
      toast.update(tiebreakToast.current, {
        render: errText,
        type: toast.TYPE.ERROR,
        autoClose: 5000,
        closeButton: null,
      })
    }
  }

  return (
    <>
      {/* <p>(D) = Divisional matchup</p> */}
      <div
        style={{
          border: 'none',
          padding: '.25rem 1rem 1rem',
          textAlign: 'center',
        }}
      >
        <b>Your Tiebreaker: </b>
        <Dropdown
          disabled={!!isLocked}
          closeOnChange
          closeOnBlur
          closeOnEscape
          className="tiebreaker-dropdown"
          // placeholder="Select a week"
          selection
          options={tiebreakerOptions()}
          onChange={(e, { value }) => handleTiebreakerSubmit(value)}
          value={tiebreaker}
          compact
          labeled
        />{' '}
        (
        {`Total points scored in ${awayteam.abbreviation} vs. ${hometeam.abbreviation} game`}
        )
        <p
          style={{
            display: `${!finalTiebreaker && 'none'}`,
            color: 'red',
          }}
        >
          Actual Tiebreaker <b>{finalTiebreaker}</b>
        </p>
        <br />
      </div>
    </>
  )
}

export default Tiebreaker
