import React from 'react'
import PropTypes from 'prop-types'
import type { LeaderboardPlayer } from '../additional'
import { useLeaderboard } from '../lib/hooks'
import Store from '../lib/stores/FootballPool'
import WeekDropdown from './WeekDropdown'
import SeasonDropdown from './SeasonDropdown'
import DualRingLoader from './DualRingLoader'

const LeaderboardTable = ({ category }) => {
  const isWeeklyType = category === 'weekly'
  const sport = 'football'
  const season = Store((s) => ({
    week: s.week || s.currentWeek,
    year: s.seasonYear || s.currentSeasonYear,
  }))
  const darkMode = Store((s) => s.darkMode)

  // send a desired week ONLY if user goes to "/leaderboard/weekly"
  // otherwise "/leaderboard/season" omits week arg
  const { leaderboard } = useLeaderboard(
    sport,
    season.year,
    category === 'weekly' ? season.week : null
  )

  return (
    <>
      <style jsx>{`
        h3,
        table {
          text-align: center;
        }
        table {
          background-color: transparent;
          color: var(--main-${darkMode ? 'white' : 'black'}, black);
          padding: unset;
          width: 94%;
        }
        thead {
          background: ${darkMode ? '#fff' : '#000'};
          color: ${!darkMode ? '#fff' : '#000'};
        }
      `}</style>
      <table>
        <caption>
          <SeasonDropdown /> {isWeeklyType && <WeekDropdown />} Leaderboard
        </caption>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>W</th>
            <th>L</th>
            <th>Win %</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard?.length ? (
            leaderboard.map((player: LeaderboardPlayer, ind: number) => (
              <tr key={`${Math.random() * Date.now()}`}>
                <td>{ind + 1}</td>
                <td>{player.user?.name}</td>
                <td>{player.wins?.length}</td>
                <td>{player.losses?.length}</td>
                <td>{Math.round(player.winPercent * 100)}%</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} rowSpan={10}>
                {leaderboard && (leaderboard.msg || !leaderboard.length) ? (
                  leaderboard.msg ||
                  `No ${
                    isWeeklyType
                      ? `${season.year} Week ${season.week}`
                      : `${season.year} overall season`
                  } records`
                ) : (
                  <DualRingLoader
                    text={`Fetching ${
                      isWeeklyType
                        ? `${season.year} Week ${season.week}`
                        : `${season.year} overall season`
                    } records`}
                  />
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}
export default LeaderboardTable

LeaderboardTable.propTypes = {
  category: PropTypes.oneOf(['weekly', 'season']).isRequired,
}
