import useSWR from 'swr'
import fetcher from './fetch'

const swrDefaultOptions = {
  revalidateOnFocus: false,
  errorRetryCount: 2,
}

export function usePlayerPicks(userId) {
  const { data } = useSWR(() => `/api/picks/${userId}`, fetcher)
  const picks = data ? data.picks : null
  return [picks]
}
export function useAllPicks() {
  const { data } = useSWR(`/api/picks`, fetcher, swrDefaultOptions)
  const picks = data ? data.picks : null
  return [picks]
}
export function useSchedule(sport, season) {
  const { data } = useSWR(
    `/api/schedule/${sport}&${season}`,
    fetcher,
    swrDefaultOptions
  )
  const schedule = data ? data.schedule : null
  return [schedule]
}

export function useUser(id) {
  const { data: userData } = useSWR(
    () => `/api/user/${id}`,
    fetcher,
    swrDefaultOptions
  )
  const { data: pickData } = useSWR(
    () => `/api/picks/${id}`,
    fetcher,
    swrDefaultOptions
  )
  const user = userData ? userData.user : null
  const userPicks = pickData ? pickData.picks : null
  if (user) {
    user.picks = userPicks
  }
  return [user]
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
