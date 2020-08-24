import useSWR from "swr";
import fetcher from "./fetch";

export function getPlayerPicks() {
  const { data, error } = useSWR("/api/picks", fetcher, {
    shouldRetryOnError: false,
  });
  // console.log(error)
  const picks = data ? data.picks : null;
  // const user = data ? data.user : null;
  return [picks];
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

