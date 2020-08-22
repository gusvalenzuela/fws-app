import React, { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCurrentUser } from "../lib/hooks";

const LogoutPage = () => {
  const router = useRouter();
  // const [errorMsg, setErrorMsg] = useState("");
  const [user] = useCurrentUser();

  useEffect(() => {
    if (user) logOut();
  }, []);

  async function logOut() {
    const res = await fetch("/api/auth", {
      method: "DELETE",
    });
    if (res.status === 200) {
      router.push("/logout");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      router.push("/");
    }
  }

  return (
    <>
      <Head>
        <title>FWS | Logged Out</title>
      </Head>
      <h2>You've been logged out.</h2>
      <Link href="/forget-password">
        <a>Forget password</a>
      </Link>
    </>
  );
};

export default LogoutPage;
