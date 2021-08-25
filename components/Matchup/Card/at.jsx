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
  userPick,
  user,
  tiebreak,
  lockDate,
  compactCards,
}) => {
  const homeTeam = matchup.home_team
  const awayTeam = matchup.away_team
  const favoriteTeam =
    matchup.line_?.favorite === homeTeam.team_id ? homeTeam : awayTeam
  const underdogTeam =
    matchup.line_?.favorite === homeTeam.team_id ? awayTeam : homeTeam
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const sport = 2
  // is past event when it has a score obj with final confirmed,
  // or 5 hours have passed after event start
  const isPastEvent =
    (matchup.event_status && matchup.event_status === 'STATUS_FINAL') ||
    Date.parse(matchup.event_date) + 1000 * 60 * 60 * 5 < Date.now()
  const isLocked =
    Date.parse(matchup.event_date) < Date.now()
      ? 'past'
      : Date.parse(matchup.event_date) >= lockDate && lockDate < Date.now()
      ? 'after lock date'
      : false
  const initToast = React.useRef(null)
  const lockedToast = React.useRef(null)
  const loginToPickToast = React.useRef(null)

  const handleTeamSelection = async (event) => {
    const newlySelectedTeam =
      Number(event.currentTarget.dataset.team_id) === matchup.away_team_id
        ? awayTeam
        : homeTeam

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
    setSelectedTeam(newlySelectedTeam)
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
      selectedTeamId: Number(newlySelectedTeam.team_id) || 2754,
      matchupId: matchup.event_id,
    }
    const res = await fetch('/api/picks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPick),
    })
    setIsUpdating(false)

    if (res.status === 200) {
      // const { updatedResults } = await res.json()
      // console.log(updatedResults)
      // update the state of selectedTeam as confirmation
      setSelectedTeam(newlySelectedTeam)
      // updating the toast alert and setting the autoclose
      toast.update(initToast.current, {
        render: (
          <>
            Week {matchup?.week} pick updated to{' '}
            {newlySelectedTeam?.abbreviation}.
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
    setSelectedTeam(null) // clear selected team for refresh
    if (!userPick) return null
    return setSelectedTeam(
      userPick.selectedTeamId === awayTeam.team_id ? awayTeam : homeTeam
    )
  }, [userPick, awayTeam, homeTeam])

  const buildTeamCard = (team) => (
    <Grid.Column
      color={Number(selectedTeam?.team_id) === team.team_id ? 'black' : null}
      onClick={handleTeamSelection}
      className={`${Style.teamContainer} team-container ${
        Number(selectedTeam?.team_id) === team.team_id ? 'picked' : ''
      }`}
      verticalAlign="middle"
      data-team_id={team.team_id}
      data-team_name={team.abbreviation}
      data-event={matchup.event_id}
      id={!compactCards ? undefined : 'team-container'}
      stretched
      // width="6"
    >
      {
        /* selected team tag */
        Number(selectedTeam?.team_id) === team.team_id && (
          <p
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 99,
              background: 'rgb(255, 174, 174)',
              color: 'var(--color-dark, --main-black, black)',
              width: '100%',
              margin: 'auto',
              textTransform: 'full-width',
            }}
          >
            SELECTED
          </p>
        )
      }
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
        {!compactCards &&
        !user.prefersModernLayout &&
        team.team_id === homeTeam.team_id
          ? `${team.name}`.toUpperCase()
          : !compactCards
          ? team.name
          : !user.prefersModernLayout && team.team_id === homeTeam.team_id
          ? `${team.abbreviation}`.toLowerCase()
          : team.abbreviation}
        {!compactCards && <br />}
        {!compactCards &&
        !user.prefersModernLayout &&
        team.team_id === homeTeam.team_id
          ? `${team.mascot}`.toUpperCase()
          : !compactCards && team.mascot}
      </h3>
      {/* team name  */}
      {/* Line spread */}
      <p
        style={{
          margin: 0,
          display: 'flex',
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          fontSize: '1.3rem',
          color: 'red',
          fontWeight: '800',
        }}
      >
        {
          // displays the point spread for favorite (-0.5)
          !user.prefersModernLayout ? (
            <span style={{ visibility: 'hidden' }}>--</span> // display and hide an equivalent element to keep balance layout
          ) : matchup.line_ && team.team_id === matchup.line_.favorite ? (
            matchup.line_.point_spread
          ) : (
            <span style={{ visibility: 'hidden' }}>--</span>
          )
        }
      </p>
    </Grid.Column>
  )

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
              // or favorite team if prefersModernLayout = false
              buildTeamCard(
                user && user.prefersModernLayout ? awayTeam : favoriteTeam
              )
            }
            {
              /* 
              this divider has slight changes 
              varied on the sport type
             (i.e.american football vs mma) 
             */
              <MatchupDivider
                compactCards={compactCards}
                isPastEvent={isPastEvent}
                selectedTeam={selectedTeam}
                matchup={matchup}
                sport={sport}
                prefersModernLayout={user && user.prefersModernLayout}
                userPick={!!userPick}
              />
            }

            {
              // home team
              // or underdog team if prefersModernLayout = false
              buildTeamCard(
                user && user.prefersModernLayout ? homeTeam : underdogTeam
              )
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
              matchup.event_status === 'STATUS_FINAL' ? (
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
            user={user}
            eventId={matchup.event_id}
            hometeam={matchup.home_team}
            awayteam={matchup.away_team}
            tiebreaker={(userPick && userPick.tiebreaker) || 1}
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
