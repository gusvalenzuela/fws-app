import useSWR from 'swr'
import fetcher from './fetch'

const swrDefaultOptions = {
  revalidateOnFocus: false,
  errorRetryCount: 2,
}

export function useUser(id) {
  const { data: userData, error } = useSWR(
    id ? `/api/user/${id}` : null,
    fetcher
  )
  const user = userData ? userData.user : null
  return {
    user,
    isLoading: !error && !userData,
    isError: !!error,
  }
}
export function useLeaderboard(sport, yr, week) {
  // if no week is given, database retrieves all picks for that year
  const { data, error } = useSWR(
    yr && sport
      ? `/api/leaderboard?sport=${sport}&yr=${yr}&week=${week}`
      : null,
    fetcher
  )

  return {
    leaderboard: data ? data.leaderboard : null,
    isLoading: !error && !data,
    hasError: !!error,
    error,
  }
}

export function useUserStandings(userId, seasonYr) {
  const { data, error } = useSWR(
    userId && seasonYr ? `/api/user/${userId}/standings/${seasonYr}` : null,
    fetcher
  )
  return {
    standings: data ? data.standings : null,
    isLoading: !error && !data,
    hasError: !!error,
    error,
  }
}

export function useUserPicksByWeek(userId, week, yr) {
  const { data, mutate } = useSWR(
    userId && week && yr ? `/api/picks/${userId}?week=${week}&yr=${yr}` : null,
    fetcher
  )
  const picks = data ? data.picks : null
  return { picks, mutate }
}

export function useCurrentUser() {
  const { data, mutate } = useSWR('/api/user', fetcher)
  const user = data ? data.user : null
  return [user, { mutate }]
}
export function useAllUsers() {
  const { data } = useSWR('/api/users', fetcher, swrDefaultOptions)
  const allUsers = data ? data.users : null
  return [allUsers]
}

export function useSchedule(sport, yr, week) {
  const { data, error } = useSWR(
    week && yr && sport ? `/api/matchups/${sport}/${yr}/${week}` : null,
    fetcher
  )
  return {
    schedule: data ? data.matchups : null,
    lockDate: data ? data.lockDate : null,
    scheduleIsLoading: !error && !data,
    scheduleHasError: !!error,
  }
}
export function useSportTeams(sport) {
  const { data, error } = useSWR(
    sport ? `/api/teams?sport=${sport}` : null,
    fetcher
  )
  return {
    sportTeams: data || null,
    sportTeamsIsLoading: !error && !data,
    sportTeamsHasError: !!error,
  }
}
