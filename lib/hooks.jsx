import useSWR from "swr";
import fetcher from "./fetch";

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
export function getPick(id) {
  const { data } = useSWR(`/api/picks/${id}`, fetcher, {
    revalidateOnFocus: false,
  });
  console.log(data)
  return data ? data : null;
}
