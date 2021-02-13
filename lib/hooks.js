import useSWR from 'swr'
import fetcher from './fetch'

const swrDefaultOptions = {
  revalidateOnFocus: false,
  errorRetryCount: 2,
}

export function usePlayerPicks(userId) {
  const { data } = useSWR(`/api/picks/${userId}`, fetcher)
  const picks = data ? data.picks : null
  return [picks]
}
export function useAllPicks() {
  const { data } = useSWR(`/api/picks`, fetcher, swrDefaultOptions)
  const picks = data ? data.picks : null
  return [picks]
}
export function useSchedule(sport, season) {
  const { data } = useSWR(`/api/schedule/${sport}&${season}`, fetcher)
  const schedule = data ? data.schedule : null
  return [schedule]
}

export function useCurrentUser() {
  const { data, mutate } = useSWR(() => '/api/user', fetcher)
  const user = data ? data.user : null
  return [user, { mutate }]
}

export function useAllUsers() {
  const { data } = useSWR(() => '/api/users', fetcher, swrDefaultOptions)
  const users = data ? data.users : null
  return [users]
}

export function useUser(id) {
  const { data } = useSWR(`/api/users/${id}`, fetcher, swrDefaultOptions)
  return data ? data.user : null
}

export function useMatchups() {
  const { data } = useSWR(`/api/matchups`, fetcher, swrDefaultOptions)
  const matchups = data ? data.matchups : null
  return [matchups]
}
