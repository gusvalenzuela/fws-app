import useSWR from "swr";
import fetcher from "./fetch";

const swrOptions = {
  revalidateOnFocus: false,
};

export function getPlayerPicks(userId) {
  const { data, error } = useSWR(`/api/picks/${userId}`, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });
  const picks = data ? data.picks : null;
  return [picks];
}
export function useSchedule(sport, season) {
  const { data } = useSWR(
    `/api/schedule/${sport}&${season}`,
    fetcher,
    swrOptions
  );
  const schedule = data ? data.schedule : null;
  return [schedule];
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
  const { data } = useSWR(`/api/users/${id}`, fetcher, swrOptions);
  return data ? data.user : null;
}

// export function useTeams(sport, season) {
//   const { data } = useSWR(`/api/teams/${sport}&${season}`, fetcher, swrOptions);
//   const teams = data ? data.teams : null;
//   return [teams];
// }
