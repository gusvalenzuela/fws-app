import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import type { GetServerSideProps } from 'next/types'
import { Icon } from 'semantic-ui-react'
import type { SportsTeam, SportsMatchup } from '../additional'
import {
  useUser,
  useCurrentUser,
  useSchedule,
  useSportTeams,
  useUserPicksByWeek,
} from '../lib/hooks'
import WeekDropdown from '../components/WeekDropdown'
import SeasonDropdown from '../components/SeasonDropdown'
import MatchupCardSection from '../components/Matchup/Section'
import ByeTeamsSection from '../components/ByeTeamsSection'
import PlayerDashboard from '../components/PlayerDashboard'
import Store from '../lib/stores/FootballPool'

const TimeDisplay: any = dynamic(() => import('../components/TimeDisplay'), {
  loading: () => null,
  ssr: false,
})
function Weeks({ query }) {
  // Stored variables
  const week = Store((s) => s.week || s.currentWeek) // Store.week initializes as undefined
  const seasonType = Store((s) => s.seasonType || s.currentSeasonType) // Store.seasonType initializes as undefined
  const seasonYear = Store((s) => s.seasonYear || s.currentSeasonYear) // Store.seasonYear initializes as undefined
  const selectedUserId = Store((s) => s.selectedUser) // "Store" selectedUser = undefined ? user will be used instead (used when clicking "Home" for example)
  const darkMode = Store((s) => s.darkMode)
  const userTimeZone = Store((s) => s.timeZone)
  // Hooks
  const [currentUser] = useCurrentUser()
  const { sportTeams } = useSportTeams(query)
  const {
    schedule,
    lockDate,
    // isLoading: scheduleIsLoading,
  } = useSchedule(query, seasonYear, week)
  // States
  const [Sport] = useState(2) // 2 = NFL, 7 = UFC
  const [teamsOnBye, setTeamsOnBye] = useState([])
  const [tiebreakMatch, setTiebreakMatch] = useState({ event_id: null })
  const [allPicked, setAllPicked] = useState(false)
  const [compactCards, setCompactCards] = useState(true)
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

  // MAIN use effect
  useEffect(() => {
    // console.log(selectedUser)
    setTeamsOnBye(null)
    setWeeklyRecord(null)
    setAllPicked(false)
    if (!week || !schedule || !sportTeams) return
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

  return (
    <main id="weeks">
      <Head>
        <title>FWS | Weekly Matchups</title>
      </Head>
      <div className="page-header week-header">
        <TimeDisplay userTimeZone={userTimeZone} />
        <br />
        {/* "2020 Regular Season" */}
        <SeasonDropdown />
        {/* "Week 2" [Dropdown] */}
        <WeekDropdown />
        {
          // "(Sep 16-22)"
          schedule?.length ? `(${schedule[0].week_detail})` : null
        }
      </div>
      <div className="page-content">
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
          <span
            role="radio"
            tabIndex={0}
            aria-checked={compactCards}
            style={{
              color: `var(${!darkMode ? 'light' : 'dark'}-mode)`,
              background: `transparent`,
              float: 'left',
              cursor: 'pointer',
              padding: '.5rem',
              opacity: `${compactCards ? '1' : '.8'}`,
            }}
            id={`${darkMode ? 'dark' : 'light'}ModeCheckbox`}
            onClick={() => setCompactCards(!compactCards)}
          >
            {/* Toggle compact cards on/off  */}
            <Icon name="expand arrows alternate" inverted={darkMode} /> Cards
          </span>
        </section>

        <MatchupCardSection
          darkMode={darkMode}
          timeZone={userTimeZone}
          schedule={schedule}
          // modernLayout={!!currentUser?.prefersModernLayout || true}
          currentUser={currentUser}
          isCurrentUser={currentUser?._id === selectedUser?._id}
          lockDate={lockDate}
          userPicks={
            currentUser?._id === selectedUser?._id || Date.now() >= lockDate
              ? userPicks
              : null
          }
          compactCards={compactCards}
          tiebreakMatch={tiebreakMatch}
        />
      </div>
      <div className="page-footer">
        {teamsOnBye ? (
          <ByeTeamsSection teams={teamsOnBye.length && teamsOnBye} />
        ) : null}
      </div>
    </main>
  )
}

Weeks.propTypes = {
  query: PropTypes.string.isRequired,
}

export default React.memo(Weeks)

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { sport } = context.query

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
      query: sport,
    }, // will be passed to the page component as props
  }
}
