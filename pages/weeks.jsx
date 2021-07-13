import React, { useState, useEffect } from 'react'
import { Divider, Dropdown, Header, Checkbox } from 'semantic-ui-react'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import Head from 'next/head'
import {
  useUser,
  useCurrentUser,
  useSchedule,
  useSportTeams,
  useUserPicksByWeek,
} from '../lib/hooks'
import { generateNumbersArray } from '../lib/utils'
import Store from '../lib/stores/FootballPool'
import Loader from '../components/SemanticLoader'
import MatchupCard from '../components/Matchup/Card'
import TimeDisplay from '../components/TimeDisplay'
import PlayerDashboard from '../components/PlayerDashboard'

function Weeks({ query }) {
  // Stored variables
  const week = Store((s) => s.week) || Store.getState().currentWeek // Store.week initializes as undefined
  const seasonType =
    Store((s) => s.seasonType) || Store.getState().currentSeasonType // Store.seasonType initializes as undefined
  const seasonYear =
    Store((s) => s.seasonYear) || Store.getState().currentSeasonYear // Store.seasonYear initializes as undefined
  const selectedUserId = Store((s) => s.selectedUser) // "Store" selectedUser = undefined ? user will be used instead (used when clicking "Home" for example)
  // Hooks
  const [currentUser] = useCurrentUser()
  const { sportTeams } = useSportTeams(query.sport)
  const {
    schedule,
    lockDate,
    isLoading: scheduleIsLoading,
  } = useSchedule(query.sport, query.yr, week)
  // States
  const [Sport] = useState(2) // 2 = NFL, 7 = UFC
  // TODO: use ref for userPicks instead?
  // doesn't need to be in state
  const [teamsOnBye, setTeamsOnBye] = useState([])
  const [tiebreakMatch, setTiebreakMatch] = useState(false)
  const [allPicked, setAllPicked] = useState(false)
  const [compactCards, setCompactCards] = useState(false)
  const [weeklyRecord, setWeeklyRecord] = useState('0 - 0')
  // LAST
  const { user: selectedUser, isLoading } = useUser(
    !selectedUserId ? currentUser?._id : selectedUserId
  ) // place last as it looks for user._id when no selected user found

  const { picks: userPicks } = useUserPicksByWeek(
    (Date.now() > lockDate && selectedUserId) || currentUser?._id,
    week
  )

  // MAIN use effect
  useEffect(() => {
    if (!week || !schedule || !sportTeams) return
    setWeeklyRecord('0 - 0')

    // Determine which teams on Bye Week (i.e. not scheduled)
    const scheduledTeams = schedule
      .map((matchup) => [matchup.home_team_id, matchup.away_team_id])
      .flat()

    const byeteams = sportTeams.filter(
      (team) =>
        !scheduledTeams?.includes(team.team_id) &&
        ![1766, 1767, 2754].includes(team.team_id) // TODO: is am. football specific for now
    )
    setTeamsOnBye(byeteams)

    // set tiebreak matchup to last one of the week (assumes it is sorted)
    // TODO: this should be pre-determined and in record
    setTiebreakMatch(schedule[schedule.length - 1])

    if (!userPicks) return

    // find how many of the user's picks (selected_team)
    // match the schedule's winning team (winner)
    // TODO: save/retrieve records in database
    const wins = userPicks?.filter((p) => {
      const w = schedule.findIndex(
        (e) =>
          e.event_id === p.matchupId && e.winner === Number(p.selectedTeamId)
      )

      return w !== -1
    })

    if (wins) {
      setWeeklyRecord(`${wins.length} - ${userPicks.length - wins.length}`)
    }
    // find pick associated with each event in week
    // return the index
    const eventsPicked = schedule.map((e) =>
      userPicks?.findIndex((p) => p.matchupId === e.event_id)
    )
    // if no pick found for an event (i.e. user has not
    // picked for the event yet) findIndex returns -1
    // see if the above returns each event with a pick association
    const allEventsPicked = eventsPicked.every((p) => p >= 0)
    if (userPicks?.length && allEventsPicked) {
      setAllPicked(true)
    } else {
      setAllPicked(false)
    }
  }, [
    week,
    sportTeams,
    Sport,
    seasonType,
    seasonYear,
    schedule,
    // selectedUser,
    userPicks,
  ])

  // console.log(`events this week ${week}`, events);

  return (
    <main id="weeks">
      <Head>
        <title>FWS | Weekly Matchups</title>
      </Head>

      <div className="main-content">
        {!scheduleIsLoading && schedule?.length ? (
          <>
            <div className="page-header week-header">
              <TimeDisplay />
              <br />
              {
                // "2020 Regular Season"

                `${schedule[0].season_year} ${schedule[0].season_type}: `
              }
              {
                // "Week 2" [Dropdown]
              }
              <Dropdown
                className="week-dropdown"
                onChange={(e, { value }) => Store.setState({ week: value })}
                options={generateNumbersArray(1, 17).map((num) => ({
                  key: num,
                  value: num,
                  text: `Week ${num}`,
                }))}
                value={week}
                text={`Week ${week?.toString()}`}
                inline
              />

              {
                // "(Sep 16-22)"
                `(${schedule[0].week_detail})`
              }
            </div>
            <div className="page-content">
              <section>
                <PlayerDashboard
                  lockDate={lockDate}
                  allPicked={allPicked}
                  user={!isLoading ? selectedUser : currentUser}
                  otherUser={
                    selectedUser?._id === currentUser?._id
                      ? false
                      : selectedUser
                  }
                  weeklyRecord={weeklyRecord}
                />
              </section>
              <section>
                {/* Toggle compact cards on/off  */}
                <Checkbox
                  className="compact-cards"
                  label="Compact cards"
                  toggle
                  onChange={() => setCompactCards(!compactCards)}
                />
              </section>
              {
                /* 
                    for each game of the week, make a header or divider and a matchup card component 
                    Caveat: -- only displays other user's if Date now is after the lockdate (i.e. after first Sunday Game)
                */
                // if selected user is same as current user display all picks
                // or it's past the first Sunday game of the week (picks are locked date)
                // render the matchups and the corresponding user's picks
                currentUser?._id === selectedUser?._id ||
                Date.now() >= lockDate ? (
                  schedule.map((matchup, inx) => {
                    const currentMatchupEventDate = new Date(matchup.event_date)
                    const previousMatchupEventDate = new Date(
                      schedule[inx - 1]?.event_date
                    )

                    let print = true
                    // before rendering any event, it checks to see if it is the 1st time printing the event day (Mo, Tu, etc..)
                    // this is for the header of each "matchup day" subsection.
                    // we print the first date in the week every time (i.e. index 0)
                    if (inx > 0) {
                      // check if the previous day of the week in the mapping is the same as current
                      if (
                        previousMatchupEventDate.getDay() ===
                        currentMatchupEventDate.getDay()
                      ) {
                        // if it is the same day as the previous
                        // do not print, by setting print to false
                        print = false
                      } else {
                        //  print it
                        print = true
                      }
                    }

                    return (
                      <section key={matchup.event_id}>
                        {!print ? (
                          <Divider
                            // content={matchup.schedule?.event_name}
                            className="container-divider"
                          />
                        ) : (
                          <h1
                            className="matchup-day-header"
                            key={`header-${matchup.event_date}`}
                          >
                            {currentMatchupEventDate.toDateString()}
                          </h1>
                        )}

                        <MatchupCard
                          compactCards={compactCards}
                          lockDate={lockDate}
                          matchup={matchup}
                          userPick={userPicks?.find(
                            (p) => p.matchupId === matchup.event_id
                          )}
                          user={currentUser}
                          tiebreak={
                            tiebreakMatch &&
                            tiebreakMatch?.event_id === matchup.event_id
                          }
                        />
                      </section>
                    )
                  })
                ) : selectedUser && Date.now() < lockDate ? (
                  <>
                    <p
                      style={{
                        textAlign: 'justify',
                        padding: '1rem',
                        maxWidth: '800px',
                        margin: 'auto',
                      }}
                    >
                      <b>Note:</b> Other users&apos; picks are not viewable
                      until after the start of the first Sunday game.
                    </p>
                  </>
                ) : null
              }
            </div>
            <div className="page-footer">
              {teamsOnBye?.length > 0 && (
                <Divider horizontal>
                  <Header as="h4">Teams on Bye</Header>
                </Divider>
              )}
              {
                // from the complete list of sportTeams
                // if the team is not included in the currently scheduled teams (depending on week being viewed)
                // add it to display of "bye-week" teams
                teamsOnBye?.map((team) => (
                  /* team logo / image  */
                  <CloudinaryContext
                    key={`bye-${team.abbreviation}`}
                    cloudName="fwscloud"
                    style={{ display: 'inline', margin: '.5rem 1rem' }}
                  >
                    {/* hosting the images on cloudinary */}
                    <Image
                      publicId={`NFL-Team_logos/${
                        team.abbreviation || 'nfl'
                      }.png`}
                      alt={`${team.abbreviation}'s team logo`}
                      id="team-logo-img"
                    >
                      <Transformation width="42" height="42" crop="thumb" />
                      <Transformation
                        overlay={{
                          fontFamily: 'Times',
                          fontSize: 20,
                          text: `${team.mascot}`,
                        }}
                        y="30"
                      />
                    </Image>
                  </CloudinaryContext>
                ))
              }
            </div>
          </>
        ) : (
          <Loader text="Loading matchups..." />
        )}
      </div>
    </main>
  )
}

export default React.memo(Weeks)

export async function getServerSideProps(context) {
  const { sport, yr } = context.query

  if (!sport && !yr) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      query: { sport, yr },
    }, // will be passed to the page component as props
  }
}
