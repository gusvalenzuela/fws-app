import useSWR from 'swr'
import fetcher from './fetch'

const swrDefaultOptions = {
  revalidateOnFocus: false,
  errorRetryCount: 2,
}

export function useUser(id) {
  const { data: userData, error } = useSWR(`/api/user/${id}`, fetcher)
  const user = userData ? userData.user : null
  return {
    user,
    isLoading: !error && !userData,
    isError: error,
  }
}
export function useLeaderboard(sport, yr, week) {
  const { data, error } = useSWR(
    `/api/leaderboard?sport=${sport}&yr=${yr}&week=${week}`,
    fetcher
  )
  return {
    leaderboard: data ? data.leaderboard : null,
    isLoading: !error && !data,
    hasError: !!error,
    error,
  }
}
export function useUserPicksByWeek(userId, week, yr) {
  const { data, mutate } = useSWR(
    week ? () => `/api/picks/${userId}?week=${week}&yr=${yr}` : null,
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
    week && yr && sport ? () => `/api/matchups/${sport}/${yr}/${week}` : null,
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
  const { data, error } = useSWR(() => `/api/teams?sport=${sport}`, fetcher)
  return {
    sportTeams: data || null,
    sportTeamsIsLoading: !error && !data,
    sportTeamsHasError: !!error,
  }
}
