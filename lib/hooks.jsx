import useSWR from "swr";
import fetcher from "./fetch";

// const fetcher = (url) => fetch(url).then((r) => r.json());

export function getPlayerPicks(userId) {
  const { data, error } = useSWR(`/api/picks/${userId}`, fetcher, {
    shouldRetryOnError: false,
  });
  const picks = data ? data.picks : null;
  return [picks];
}
export function useSchedule(sport, season) {
  const { data } = useSWR(`/api/schedule/${sport}&${season}`, fetcher, {
    revalidateOnFocus: false,
  });
  const schedule = data ? data.schedule : null;
  return [schedule];
}
export function useTeams(sport, season) {
  const { data } = useSWR(`/api/teams/${sport}&${season}`, fetcher);
  const teams = data ? data.teams : null;
  return [teams];
}

export function useCurrentUser() {
  const { data, mutate } = useSWR("/api/user", fetcher);
  const user = data ? data.user : null;
  return [user, { mutate }];
}

export function getAllUsers() {
  const { data } = useSWR("/api/users", fetcher);
  const users = data ? data.users : null;
  return [users];
}

export function useUser(id) {
  const { data } = useSWR(`/api/users/${id}`, fetcher, {
    revalidateOnFocus: false,
  });
  return data ? data.user : null;
}
