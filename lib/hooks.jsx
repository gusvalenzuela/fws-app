import useSWR from "swr";
import fetcher from "./fetch";
import { use } from "passport";

export function useCurrentUser() {
  const { data, mutate } = useSWR("/api/user", fetcher);
  const user = data ? data.user : null;
  return [user, { mutate }];
}

export function useUser(id) {
  const { data } = useSWR(`/api/users/${id}`, fetcher, {
    revalidateOnFocus: false,
  });
  return data ? data.user : null;
}
