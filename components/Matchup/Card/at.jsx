import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Image, Transformation, Placeholder } from 'cloudinary-react'
import { toast } from 'react-toastify'
import { Grid, Segment, Icon } from 'semantic-ui-react'
import { MatchupShape, UserShape, UserPickShape } from '../../../lib/proptypes'
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
  darkMode,
  timeZone,
}) => {
  const homeTeam = matchup.home_team
  const awayTeam = matchup.away_team
  const favoriteTeam =
    matchup.line_?.favorite === homeTeam?.team_id ? homeTeam : awayTeam
  const underdogTeam =
    matchup.line_?.favorite === homeTeam?.team_id ? awayTeam : homeTeam
  const prefersModernLayout = user ? user.prefersModernLayout : true

  const [selectedTeam, setSelectedTeam] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [tbValue, setTbValue] = useState(1)
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
    // don't do anything if clicked team is already selected
    if (newlySelectedTeam.team_id === selectedTeam?.team_id) return null
    // wait for Mongo DB to respond
    if (isUpdating) return toast.info('Still updating, please wait')
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
            Week {matchup.week} pick updated to{' '}
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
    setSelectedTeam(
      userPick.selectedTeamId === awayTeam.team_id ? awayTeam : homeTeam
    )
    if (tiebreak && userPick.tiebreaker) {
      setTbValue(userPick.tiebreaker)
    }
    return () => {}
  }, [userPick, awayTeam, homeTeam, tbValue, tiebreak])

  const buildTeamCard = (team) => {
    const isSelectedTeam = Number(selectedTeam?.team_id) === team.team_id
    return (
      <Grid.Column
        onClick={handleTeamSelection}
        className={`${Style.teamContainer} team-container ${
          isSelectedTeam ? 'picked' : ''
        }`}
        verticalAlign="middle"
        data-team_id={team.team_id}
        data-team_name={team.abbreviation}
        data-event={matchup.event_id}
        stretched
      >
        {/* selected team tag */}
        <span
          className={Style.selectionCheckBox}
          style={{
            width: '100%',
          }}
        >
          <Icon
            name={isSelectedTeam ? 'check square outline' : 'square outline'}
            size="large"
            // color="grey"
            // inverted
          />
        </span>
        <section
          className={!compactCards ? undefined : Style.compactCards}
          style={
            prefersModernLayout
              ? { gridTemplateColumns: '1fr 1fr 1fr' }
              : { gridTemplateColumns: '1fr 1fr' }
          }
        >
          {/* team logo / image  */}
          {
            /* hosting the images on cloudinary */
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
                height={!compactCards ? '150' : '75'}
                width={!compactCards ? '150' : '75'}
                crop="fit"
              />
            </Image>
          }
          <h4
            style={
              compactCards
                ? {
                    margin: '0',
                    marginRight: '5px',
                  }
                : { marginBottom: '2px' }
            }
          >
            {!compactCards ? team.name : team.abbreviation}
            {!compactCards && <br />}
            {!compactCards && team.mascot}
            <br />
            {/* {!compactCards && <br />} */}
          </h4>
          {/* team record  */}
          {!compactCards && (
            <h4 style={{ margin: '0', fontSize: '.75rem' }}>
              {homeTeam.team_id === team.team_id
                ? matchup.home_record
                : matchup.away_record}
            </h4>
          )}
          {
            /* Line spread
             */
            prefersModernLayout && (
              <p className={Style.lineSpread}>
                {
                  // displays the point spread for favorite (0.5)
                  team.team_id === matchup.line_?.favorite ? (
                    -matchup.line_.point_spread
                  ) : (
                    <span style={{ visibility: 'hidden' }}>--</span> // display and hide an equivalent element to keep balance layout
                  )
                }
              </p>
            )
          }
        </section>
      </Grid.Column>
    )
  }

  return (
    <>
      <Segment
        loading={!matchup.event_id}
        attached
        raised
        className={Style.matchupSegment}
      >
        <div
          className={Style.matchupSegmentOverlay}
          style={{
            background: !darkMode ? '#fff3' : '#000b',
          }}
        />
        <div
          className={Style.matchupGrid}
          style={{
            backgroundColor: 'grey',
            background: isPastEvent
              ? '#e6e6e6'
              : `linear-gradient(125deg, var(--color-${awayTeam?.abbreviation}-primary, white) 50%, var(--color-${homeTeam?.abbreviation}-primary, grey) 50%)`,
          }}
        >
          <Grid columns="equal">
            {/*
            buildTeamCard function returns a grid column for any team fed.
            takes in specific team Obj containing abbr, name, mascot, and more  */}
            <section className={Style.awayFavorite}>
              {prefersModernLayout && awayTeam.team_id === favoriteTeam.team_id
                ? 'F'
                : prefersModernLayout &&
                  homeTeam.team_id === favoriteTeam.team_id
                ? 'U'
                : !prefersModernLayout &&
                  awayTeam.team_id === favoriteTeam.team_id
                ? 'A'
                : 'H'}
            </section>
            {
              // away team
              // or favorite team if prefersModernLayout = false
              buildTeamCard(prefersModernLayout ? awayTeam : favoriteTeam)
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
                prefersModernLayout={prefersModernLayout}
                userPick={!!userPick}
              />
            }

            {
              // home team
              // or underdog team if prefersModernLayout = false
              buildTeamCard(prefersModernLayout ? homeTeam : underdogTeam)
            }
            <section className={Style.homeUnderdog}>
              {prefersModernLayout && homeTeam.team_id === favoriteTeam.team_id
                ? 'F'
                : prefersModernLayout &&
                  awayTeam.team_id === favoriteTeam.team_id
                ? 'U'
                : !prefersModernLayout &&
                  awayTeam.team_id === favoriteTeam.team_id
                ? 'H'
                : 'A'}
            </section>
          </Grid>
        </div>
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
            matchup && matchup.event_status === 'STATUS_FINAL' ? (
              <>
                <Grid.Column className={Style.finalColumn}>
                  <h3>
                    {!prefersModernLayout &&
                    homeTeam.team_id === matchup.line_?.favorite
                      ? matchup.home_score
                      : matchup.away_score}
                  </h3>
                </Grid.Column>
                <Grid.Column className={Style.finalColumn} width={3}>
                  <span style={{ fontSize: 'medium' }}>
                    {matchup.event_status_detail.toUpperCase() || 'FINAL'}
                  </span>
                </Grid.Column>
                <Grid.Column className={Style.finalColumn}>
                  <h3>
                    {!prefersModernLayout &&
                    homeTeam.team_id === matchup.line_?.favorite
                      ? matchup.away_score
                      : matchup.home_score}
                  </h3>
                </Grid.Column>
              </>
            ) : (
              <Grid.Column>
                <h4>
                  {matchup &&
                    new Intl.DateTimeFormat('default', {
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      timeZoneName: 'short',
                      timeZone: timeZone || 'America/Los_Angeles',
                      // weekday: "short",
                    }).format(
                      new Date(matchup.event_date || '2021-01-01T05:00:00Z')
                    )}{' '}
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
          isLocked={!!isLocked}
          user={user}
          eventId={matchup.event_id}
          hometeam={matchup.home_team}
          awayteam={matchup.away_team}
          tiebreaker={tbValue}
          setTbValue={setTbValue}
          finalTiebreaker={
            matchup.event_status === 'STATUS_FINAL' &&
            matchup.away_score + matchup.home_score
          }
        />
      )}
    </>
  )
}

export default MatchupCardAt

MatchupCardAt.propTypes = {
  matchup: PropTypes.shape(MatchupShape).isRequired,
  userPick: PropTypes.shape(UserPickShape),
  user: PropTypes.shape(UserShape),
  tiebreak: PropTypes.bool.isRequired,
  lockDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  compactCards: PropTypes.bool,
  darkMode: PropTypes.bool,
  timeZone: PropTypes.string,
}

MatchupCardAt.defaultProps = {
  darkMode: false,
  compactCards: true,
  timeZone: 'America/Los_Angeles',
  userPick: null,
  user: null,
}
