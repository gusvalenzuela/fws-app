import React, { useState, useEffect } from 'react'
import { Checkbox } from 'semantic-ui-react'
import Head from 'next/head'
import type { GetServerSideProps } from 'next/types'
import type { SportsTeam, SportsMatchup } from '../additional'
import {
  useUser,
  useCurrentUser,
  useSchedule,
  useSportTeams,
  useUserPicksByWeek,
} from '../lib/hooks'
import TimeDisplay from '../components/TimeDisplay'
import Loader from '../components/DualRingLoader'
import WeekDropdown from '../components/WeekDropdown'
import SeasonDropdown from '../components/SeasonDropdown'
import MatchupCardSection from '../components/Matchup/Section'
import ByeTeamsSection from '../components/ByeTeamsSection'
import PlayerDashboard from '../components/PlayerDashboard'
import Store from '../lib/stores/FootballPool'

function Weeks({ query }) {
  // Stored variables
  const week = Store((s) => s.week || s.currentWeek) // Store.week initializes as undefined
  const seasonType = Store((s) => s.seasonType || s.currentSeasonType) // Store.seasonType initializes as undefined
  const seasonYear = Store((s) => s.seasonYear || s.currentSeasonYear) // Store.seasonYear initializes as undefined
  const selectedUserId = Store((s) => s.selectedUser) // "Store" selectedUser = undefined ? user will be used instead (used when clicking "Home" for example)
  // Hooks
  const [currentUser] = useCurrentUser()
  const { sportTeams } = useSportTeams(query.sport)
  const {
    schedule,
    lockDate,
    isLoading: scheduleIsLoading,
  } = useSchedule(query.sport, seasonYear, week)
  // States
  const [Sport] = useState(2) // 2 = NFL, 7 = UFC
  const [teamsOnBye, setTeamsOnBye] = useState([])
  const [tiebreakMatch, setTiebreakMatch] = useState({ event_id: null })
  const [allPicked, setAllPicked] = useState(false)
  const [compactCards, setCompactCards] = useState(false)
  const [weeklyRecord, setWeeklyRecord] = useState(null)
  // LAST
  // place last as it looks for user._id when no selected user found
  const { user: selectedUser, isLoading } = useUser(
    selectedUserId || currentUser?._id
  )

  const { picks: userPicks } = useUserPicksByWeek(
    (Date.now() > lockDate && selectedUserId) || currentUser?._id,
    week,
    seasonYear
  )

  const [modernLayout, setModernLayout] = useState(
    currentUser?.prefersModernLayout || true
  )

  // MAIN use effect
  useEffect(() => {
    if (!week || !schedule || !sportTeams) return
    setWeeklyRecord(null)
    // Determine which teams on Bye Week (i.e. not scheduled)
    const scheduledTeams: Array<number> = schedule
      .map((matchup: SportsMatchup) => [
        matchup.home_team_id,
        matchup.away_team_id,
      ])
      .flat()

    const byeteams: Array<SportsTeam> = sportTeams.filter(
      (team: SportsTeam) =>
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
  }, [week, sportTeams, Sport, seasonType, seasonYear, schedule, userPicks])

  // console.log(`events this week ${week}`, events);

  return (
    <main id="weeks">
      <Head>
        <title>FWS | Weekly Matchups</title>
      </Head>

      <div className="page-header week-header">
        <TimeDisplay />
        <br />
        {
          // "2020 Regular Season"

          <SeasonDropdown />
        }
        {
          // "Week 2" [Dropdown]
        }
        <WeekDropdown />

        {
          // "(Sep 16-22)"
          schedule?.length ? `(${schedule[0].week_detail})` : null
        }
      </div>
      <div className="page-content">
        {!scheduleIsLoading && schedule?.length ? (
          <>
            <section>
              <PlayerDashboard
                lockDate={lockDate}
                allPicked={allPicked}
                user={!isLoading ? selectedUser : currentUser}
                otherUser={
                  selectedUser?._id === currentUser?._id ? false : selectedUser
                }
                weeklyRecord={weeklyRecord}
              />
            </section>
            <section
              style={{ display: 'flex', justifyContent: 'space-around' }}
            >
              {/* Toggle Modern Layout on/off  */}
              <Checkbox
                className="modern-layout toggle-box"
                label="Modern Layout"
                toggle
                checked={modernLayout}
                onChange={() => setModernLayout(!modernLayout)}
              />
              {/* Toggle compact cards on/off  */}
              <Checkbox
                className="compact-cards toggle-box"
                label="Compact Cards"
                toggle
                checked={compactCards}
                onChange={() => setCompactCards(!compactCards)}
              />
            </section>
            <details
              style={{ textAlign: 'left', maxWidth: '350px', margin: 'auto' }}
            >
              <summary style={{ textAlign: 'center' }}>
                Click to read more about modern vs old layout
              </summary>
              <b>Modern Layout:</b> AWAY team is on the left and HOME team is on
              the right (indicated with an @ symbol in middle). Favorite is team
              with red number under their name.
              <br />
              <b>Old Layout:</b> FAVORITE team is on the left and UNDERDOG is on
              the right. Number in middle is the point-spread needed to cover by
              favorite (left). HOME is team with all capitalized name.
              <br />
            </details>
            {
              /* 
                Caveat: -- only displays other user's if Date now 
                is after the lockdate (i.e. after first Sunday Game) 
              */
              // if selected user is same as current user display all picks
              // or it's past the first Sunday game of the week (picks are locked date)
              // render the matchups and the corresponding user's picks
              currentUser?._id === selectedUser?._id ||
              Date.now() >= lockDate ? (
                <MatchupCardSection
                  schedule={schedule}
                  modernLayout={modernLayout}
                  currentUser={currentUser}
                  lockDate={lockDate}
                  userPicks={userPicks}
                  compactCards={compactCards}
                  tiebreakMatch={tiebreakMatch}
                />
              ) : selectedUser && Date.now() < lockDate ? (
                <p
                  style={{
                    textAlign: 'justify',
                    padding: '1rem',
                    maxWidth: '800px',
                    margin: 'auto',
                  }}
                >
                  <b>Note:</b> Other users&apos; picks are not viewable until
                  after the start of the first Sunday game.
                </p>
              ) : null
            }
          </>
        ) : (
          <section>
            <Loader text="Loading matchups..." />
          </section>
        )}
      </div>
      <div className="page-footer">
        <ByeTeamsSection teams={teamsOnBye.length && teamsOnBye} />
      </div>
    </main>
  )
}

export default React.memo(Weeks)

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { sport, yr } = context.query

  if (!sport) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {
      query: { sport, yr },
    }, // will be passed to the page component as props
  }
}
