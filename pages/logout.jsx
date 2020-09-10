import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCurrentUser } from "../lib/hooks";

const LogoutPage = () => {
  const router = useRouter();
  const [user, { mutate }] = useCurrentUser();

  useEffect(() => {
    logOut();
  }, []);

  async function logOut() {
    const res = await fetch("/api/auth", {
      method: "DELETE",
    });
    if (res.status === 204) {
      mutate({});
    }
    router.push("/");
  }

  return (
    <main id="logout">
      <Head>
        <title>FWS | Logged Out</title>
      </Head>
      <div className="main-content">
        <header className="page-header">Come back soon!</header>
        <div className="page-content">
          <h2>You've been succesfully logged out</h2>
        </div>
      </div>
    </main>
  );
};

export default LogoutPage;
