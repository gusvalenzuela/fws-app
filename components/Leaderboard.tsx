import React from 'react'
import type { LeaderboardPlayer } from '../additional'
import { useLeaderboard } from '../lib/hooks'
import Store from '../lib/stores/FootballPool'
import WeekDropdown from './WeekDropdown'
import SeasonDropdown from './SeasonDropdown'
import DualRingLoader from './DualRingLoader'

export default function LeaderboardTable({ category }) {
  const isWeeklyType = category === 'weekly'
  const sport = 'football'
  const season = Store((s) => ({
    week: s.week || s.currentWeek,
    year: s.seasonYear || s.currentSeasonYear,
  }))

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
          color: var(--main-black, black);
          padding: unset;
          width: 94%;
        }
        thead {
          background: #000;
          color: #fff;
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
          {leaderboard ? (
            leaderboard.map((player: LeaderboardPlayer, ind: number) => (
              <tr key={`${Math.random() * Date.now()}`}>
                <td>#{ind + 1}</td>
                <td>{player.user?.name}</td>
                <td>{player.wins?.length}</td>
                <td>{player.losses?.length}</td>
                <td>{Math.round(player.winPercent * 100)}%</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} rowSpan={10}>
                <DualRingLoader text="Fetching weekly records" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}
