import React, { useState, useEffect } from 'react'
import {
  Divider,
  Loader,
  Dimmer,
  Dropdown,
  Header,
  Checkbox,
} from 'semantic-ui-react'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import Head from 'next/head'
import middleware from '../middlewares/middleware'
import { useCurrentUser, useUser } from '../lib/hooks'
import { getSchedule } from '../lib/db'
import { generateNumbersArray } from '../lib/utils'
import Store from '../lib/stores/FootballPool'
import MatchupCard from '../components/Matchup/Card'
import TimeDisplay from '../components/TimeDisplay'
import PlayerDashboard from '../components/PlayerDashboard'

function Weeks({ schedule }) {
  const [currentUser] = useCurrentUser()
  const [Sport] = useState(2) // 2 = NFL, 7 = UFC
  const [userPicks, setUserPicks] = useState([])
  const [teamsOnBye, setTeamsOnBye] = useState([])
  const [events, setEvents] = useState([])
  const [tiebreakMatch, setTiebreakMatch] = useState(false)
  const [lockDate, setLockDate] = useState(undefined)
  const [allPicked, setAllPicked] = useState(false)
  const [compactCards, setCompactCards] = useState(false)
  const [weeklyRecord, setWeeklyRecord] = useState('0 - 0')
  // Stored variables
  const nflTeams = schedule.teams
  const week = Store((s) => s.week) || Store.getState().currentWeek // Store.week initializes as undefined
  const seasonType =
    Store((s) => s.seasonType) || Store.getState().currentSeasonType // Store.seasonType initializes as undefined
  const seasonYear =
    Store((s) => s.seasonYear) || Store.getState().currentSeasonYear // Store.seasonYear initializes as undefined
  const selectedUserId = Store((s) => s.selectedUser) // "Store" selectedUser = undefined ? user will be used instead (used when clicking "Home" for example)
  // LAST
  const [selectedUser] = useUser(
    !selectedUserId ? currentUser?._id : selectedUserId
  ) // place last as it looks for user._id when no selected user found
  const cleanup = (stuff) => stuff

  // on week, schedule set
  useEffect(() => {
    if (!week) return
    const scheduledTeams = []

    let sunday
    // filter out the desired week
    const filteredEvents = schedule?.events
      .filter((event) => {
        // switch case to set "weekly events"
        switch (event.sport_id) {
          case 2:
            if (
              event.week === week &&
              event.season_year === seasonYear &&
              event.season_type === 'Regular Season'
            ) {
              // push teams that are scheduled for the chosen week into an array
              scheduledTeams.push(event.home_team_id, event.away_team_id)
              // find the first sunday
              if (!sunday && new Date(event.event_date).getDay() === 0) {
                sunday = Date.parse(event.event_date)
              }

              return true
            }
            break
          default:
            break
        }
        return false
      })
      .sort((a, b) => Date.parse(a.event_date) - Date.parse(b.event_date))

    if (filteredEvents && filteredEvents.length && nflTeams) {
      if (seasonType === 'Regular Season') {
        // find teams on bye
        // when team is NOT in the scheduledteams list put together during week filtering
        const byeteams = nflTeams.filter(
          (team) => !scheduledTeams.includes(team.team_id)
        )
        setTeamsOnBye(byeteams)
      }

      // when a sunday has been found
      // set as lockdate
      if (sunday) {
        setLockDate(sunday)
      }
    }
    cleanup(setEvents(filteredEvents || []))
  }, [week, nflTeams, Sport, seasonType, seasonYear, schedule.events])

  // on events set
  useEffect(() => {
    // playerPicks default = current user
    // else selected user stored in state store
    const currentPicks = selectedUser?.picks?.filter(
      (p) => p.matchup?.week === week
    )

    setUserPicks(currentPicks)
    // set tiebreak match to last of the week's events
    setTiebreakMatch(events[events.length - 1])
    return cleanup
  }, [events, selectedUser, week])

  // on userpicks set
  useEffect(() => {
    if (!userPicks && !events) return
    setWeeklyRecord('0 - 0')
    // find how many of the user's picks (selected_tean) match the events winning team (line_.winner)
    const wins = userPicks?.filter((p) => {
      const w = events.findIndex(
        (e) =>
          e.event_id === p.matchup?._id &&
          // eslint-disable-next-line no-underscore-dangle
          e.line_?.winner === Number(p.selectedTeam?.team_id)
      )

      return w !== -1
    })

    if (wins) {
      setWeeklyRecord(`${wins.length} - ${userPicks.length - wins.length}`)
    }
    // find pick associated with each event in week
    // return the index
    const eventsPicked = events.map((e) =>
      userPicks.findIndex((p) => p.event_id === e.event_id)
    )
    // if no pick found for an event (i.e. user has not picked for the event yet) findIndex returns -1
    // see if the above returns each event with a pick association
    const allEventsPicked = eventsPicked.every((p) => p >= 0)
    if (userPicks?.length > 0 && allEventsPicked) {
      setAllPicked(true)
    } else {
      setAllPicked(false)
    }
  }, [userPicks, events])

  // console.log(`events this week ${week}`, events);

  return (
    <main id="weeks">
      <Head>
        <title>FWS | Weekly Matchups</title>
      </Head>

      <div className="main-content">
        {events && events?.length ? (
          <>
            <div className="page-header week-header">
              <TimeDisplay />
              <br />
              {
                // "2020 Regular Season"

                `${events[0].season_year} ${events[0].season_type}: `
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
                `(${events[0].week_detail})`
              }
            </div>
            <div className="page-content">
              <section>
                <PlayerDashboard
                  lockDate={lockDate}
                  allPicked={allPicked}
                  user={selectedUser || currentUser}
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
                  events.map((matchup, inx) => {
                    const currentMatchupEventDate = new Date(matchup.event_date)
                    const previousMatchupEventDate = new Date(
                      events[inx - 1]?.event_date
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
                          userPicks={userPicks}
                          user={currentUser}
                          tiebreak={
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
                // from the complete list of nflTeams
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
          <Dimmer inverted active>
            <Loader size="large">Loading matchups.</Loader>
          </Dimmer>
        )}
      </div>
    </main>
  )
}

export default Weeks

export async function getServerSideProps(context) {
  const request = context.req
  await middleware.run(request, context.res)
  const { sport, yr } = context.query

  const schedule = await getSchedule(
    request,
    sport,
    yr || new Date().getFullYear()
  )

  if (!schedule) {
    context.res.statusCode = 404
    return {
      notFound: true,
    }
  }

  return {
    props: {
      schedule,
    }, // will be passed to the page component as props
  }
}
