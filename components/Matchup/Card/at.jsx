/*  eslint-disable no-underscore-dangle  */
import React, { useState, useEffect } from 'react'
import {
  Image,
  Transformation,
  // CloudinaryContext,
  Placeholder,
} from 'cloudinary-react'
import { toast } from 'react-toastify'
import { Grid, Segment } from 'semantic-ui-react'
import MatchupDivider from '../Divider'
import Tiebreaker from '../../Tiebreaker'
import Style from './Card.module.css'

const MatchupCardAt = ({
  matchup,
  userPicks,
  user,
  tiebreak,
  lockDate,
  compactCards,
}) => {
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [sport, setSport] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  // is past event when it has a score obj with final confirmed,
  // or 5 hours have passed after event start
  const [isPastEvent] = useState(
    (matchup.event_status && matchup.event_status === 'STATUS_FINAL') ||
      Date.parse(matchup.event_date) + 1000 * 60 * 60 * 5 < Date.now()
  )
  const [isLocked, setisLocked] = useState(true)
  const [tiebreaker, setTiebreaker] = useState(null)
  const initToast = React.useRef(null)
  const lockedToast = React.useRef(null)
  const loginToPickToast = React.useRef(null)
  const handleTeamSelection = async (event) => {
    const selectedTeamId = Number(event.currentTarget.dataset.team_id)

    if (isUpdating) return toast.info('Still updating, please wait') // wait for Mongo DB to respond
    if (isLocked) {
      // check to see to no similar toast is active (prevent dupes)
      if (!toast.isActive(lockedToast.current)) {
        lockedToast.current = toast.error(
          'That match is now locked.\nPlease try another matchup.',
          {
            toastId: 'toast-locked-pick',
          }
        )
      }
      return null
    }
    // set selected team even if no user logged in
    // it is confirmed if pick is updated successfully
    setSelectedTeam(
      selectedTeamId === matchup.away_team_id
        ? matchup.away_team
        : matchup.home_team
    )
    // if no signed in user, display message about logging in
    if (!user) {
      // check to see to no similar toast is active (prevent dupes)
      if (!toast.isActive(loginToPickToast.current)) {
        loginToPickToast.current = toast.dark('LOG IN TO LOCK YOUR PICK!', {
          toastId: 'toast-not-loggedin',
        })
      }
      return null
    }

    // initializing the toast
    initToast.current = toast.info(
      `Updating pick to ${event.currentTarget.dataset.team_name}, please wait...`,
      {
        // toastId: "toast-update-pick",
        autoClose: false,
        closeButton: false,
      }
    )
    setIsUpdating(true)

    const newPick = {
      sport_id: matchup.sport_id,
      event_id: matchup.event_id,
      event_date: matchup.event_date,
      season_year: matchup.season_year,
      season_type: matchup.season_type,
      week: matchup.week,
      selected_team:
        selectedTeamId === matchup.away_team_id
          ? matchup.away_team
          : matchup.home_team,
      matchup: {
        away_team_id: matchup.away_team_id,
        home_team_id: matchup.home_team_id,
        line_: {
          point_spread: matchup.line_?.point_spread,
          favorite: matchup.line_?.favorite,
        },
      },
    }
    const res = await fetch('/api/picks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPick),
    })
    setIsUpdating(false)

    if (res.status === 200) {
      const pick = await res.json()
      // PATCH /api/picks returns the updated pick
      setSelectedTeam(pick.selected_team)
      // updating the toast alert and setting the autoclose
      toast.update(initToast.current, {
        render: (
          <>
            Week {pick.matchup?.week || pick.week} pick updated to{' '}
            {pick.selected_team.abbreviation}.
            <br />
            <b style={{ fontSize: 'small' }}>
              Good luck!{' '}
              <span role="img" aria-label="Noise-maker">
                🎉
              </span>
            </b>
          </>
        ),
        type: toast.TYPE.SUCCESS,
        autoClose: 3000,
        closeButton: null,
      })
    } else {
      const errMsg = (await res.text()).toUpperCase()
      // updating the toast alert with error and setting the autoclose
      toast.update(initToast.current, {
        render: errMsg,
        type: toast.TYPE.ERROR,
        autoClose: 6000,
        hideProgressBar: false,
        closeButton: null,
      })
    }

    return () => {}
  }

  useEffect(() => {
    // eslint-disable-next-line no-console

    setSport(matchup.sport_id)
    setSelectedTeam(null) // clear selected team for refresh
    //  look in the user's picks
    for (let i = 0; i < userPicks?.length; i += 1) {
      const pick = userPicks[i]

      if (pick?.event_id === matchup?.event_id) {
        setSelectedTeam(pick.selected_team)
        // if it is also the tiebreak match, set the tiebreaker value used in Tiebreaker component
        if (tiebreak) {
          setTiebreaker(pick.tiebreaker)
        }
        return
      }
    }
  }, [userPicks, matchup, tiebreak])

  useEffect(() => {
    // determine locked-pick status
    // if the event date is in the past, then locked is true
    /* if event date is on or after the first Sunday game start of the viewed week
      AND the lockdate is in the past (changes after first Sunday begins)
     */
    setisLocked(
      Date.parse(matchup.event_date) < Date.now()
        ? 'past'
        : Date.parse(matchup.event_date) >= lockDate && lockDate < Date.now()
        ? 'after lock date'
        : false
    )
  }, [matchup, lockDate])

  const buildTeamCard = (team) => {
    return (
      <Grid.Column
        color={selectedTeam?.team_id === team.team_id ? 'black' : null}
        onClick={handleTeamSelection}
        className={`${Style.teamContainer} team-container ${
          selectedTeam?.team_id === team.team_id ? 'picked' : ''
        }`}
        verticalAlign="middle"
        data-team_id={team.team_id}
        data-team_name={team.abbreviation}
        data-event={matchup.event_id}
        id={compactCards && 'team-container'}
        stretched
        // width="6"
      >
        {/* team logo / image  */}
        {/* hosting the images on cloudinary */}
        <Image
          cloudName="fwscloud"
          publicId={`NFL-Team_logos/${
            sport === 2 ? team.abbreviation : 'nfl'
          }.png`}
          loading="lazy"
          alt={`${team.abbreviation}'s team logo`}
          title={`${team.name} ${team.mascot}`}
          id="team-logo-img"
        >
          <Placeholder type="vectorize" />
          <Transformation
            quality="auto"
            fetchFormat="auto"
            height={!compactCards ? '175' : '75'}
            width={!compactCards ? '175' : '75'}
            crop="fit"
          />
        </Image>
        <h3>
          {!compactCards ? team.name : team.abbreviation}
          {!compactCards && <br />}
          {!compactCards && team.mascot}
        </h3>
        {/* team name  */}
        {/* <h4>{`$ $`}</h4> */}
        {/* Line spread */}
        <p
          style={{
            margin: 0,
            fontSize: '1.3rem',
            color: 'red',
            fontWeight: '800',
          }}
        >
          {
            // displays the point spread for favorite (-0.5)
            matchup.line_ && team.team_id === matchup.line_.favorite ? (
              matchup.line_.point_spread
            ) : (
              <span style={{ visibility: 'hidden' }}>--</span> // display and hide an equivalent element to keep balance layout
            )
          }
        </p>
      </Grid.Column>
    )
  }

  return (
    <>
      <div className={Style.matchupContainer}>
        <Segment attached tertiary={isPastEvent} raised>
          <Grid columns="equal">
            {/* 
            buildTeamCard function returns a grid column for any team fed.
            takes in specific team Obj containing abbr, name, mascot, and more  */}
            {
              // away team
              buildTeamCard(matchup.away_team)
            }
            {/* // this divider has slight changes // varied on the sport type
          (i.e.american football vs mma) */}
            <MatchupDivider
              compactCards={compactCards}
              isPastEvent={isPastEvent}
              selectedTeam={selectedTeam}
              matchup={matchup}
              sport={sport}
            />
            {
              // home team
              buildTeamCard(matchup.home_team)
            }
          </Grid>
        </Segment>
        <Segment
          color="grey"
          inverted
          tertiary={isPastEvent}
          attached="bottom"
          textAlign="center"
          size="mini"
        >
          <Grid columns="equal">
            {
              // if a past event, display the final scores
              // else any necessary information
              isPastEvent && matchup.event_status === 'STATUS_FINAL' ? (
                <>
                  <Grid.Column className={Style.finalColumn}>
                    <h3>{matchup.away_score}</h3>
                  </Grid.Column>
                  <Grid.Column className={Style.finalColumn} width={3}>
                    <span style={{ fontSize: 'medium' }}>
                      {matchup.event_status_detail.toUpperCase() || 'FINAL'}
                    </span>
                  </Grid.Column>
                  <Grid.Column className={Style.finalColumn}>
                    <h3>{matchup.home_score}</h3>
                  </Grid.Column>
                </>
              ) : (
                <Grid.Column>
                  <h4>
                    {new Intl.DateTimeFormat('default', {
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      timeZoneName: 'short',
                      // weekday: "short",
                    }).format(new Date(matchup.event_date))}{' '}
                    - {matchup.broadcast}
                  </h4>
                </Grid.Column>
              )
            }
          </Grid>
        </Segment>

        {/* This displays only on the last matchup or what is the tiebreaker  */}
        {tiebreak && (
          <Tiebreaker
            isLocked={isLocked}
            tiebreaker={tiebreaker}
            setTiebreaker={setTiebreaker}
            user={user}
            eventId={matchup.event_id}
            hometeam={matchup.home_team}
            awayteam={matchup.away_team}
            finalTiebreaker={
              matchup.event_status === 'STATUS_FINAL' &&
              matchup.away_score + matchup.home_score
            }
          />
        )}
      </div>
    </>
  )
}

export default MatchupCardAt
