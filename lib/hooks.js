import useSWR from 'swr'
import fetcher from './fetch'

const swrDefaultOptions = {
  revalidateOnFocus: false,
  errorRetryCount: 2,
}

export function useAllPicks() {
  const { data } = useSWR(`/api/picks`, fetcher, swrDefaultOptions)
  const picks = data ? data.picks : null
  return [picks]
}

export function useUser(id) {
  const { data: userData, error } = useSWR(`/api/user/${id}`, fetcher)
  const { data: pickData } = useSWR(`/api/picks/${id}`, fetcher)
  const user = userData ? userData.user : null
  const userPicks = (pickData && pickData.picks) || null
  if (user) {
    user.picks = userPicks
  }
  return {
    user,
    isLoading: !error && !userData,
    isError: error,
  }
}
// export function useUserStandings(id) {
//   const { data, error } = useSWR(`/api/standings/${id}`, fetcher)
//     return {
//     standings: data ? data.standings : null,
//     isLoading: !error && !data,
//     hasError: !!error,
//     error
//   }
// }
export function useUserPicks(userId) {
  const { data, mutate } = useSWR(() => `/api/picks/${userId}`, fetcher)
  const picks = data || null
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
    () => `/api/matchups/${sport}/${yr}/${week}`,
    fetcher
  )
  return {
    schedule: data || null,
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
