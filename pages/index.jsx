import React from "react";
import Head from "next/head";
import { useCurrentUser } from "../lib/hooks";
import { useRouter } from "next/router";

const HomePage = () => {
  const router = useRouter();
  const [user] = useCurrentUser();
  if (user) router.push("/weeks");
  return (
    <div className="container">
      <Head>
        <title>FWS | HOME</title>
      </Head>
      <main id="index" className="index">
        <div className="main-content">
          <header className="page-header">
            <h1>Welcome to Fun with Sports!</h1>
          </header>
          <div className="page-content">
            <div
              style={{
                margin: "auto",
                minHeight: "500px",
                maxWidth: "800px",
                padding: "2rem",
                boxShadow: "0 5px 10px rgba(0, 0, 0, 0.12)",
              }}
            >
              <a href="/login">Log In</a> or
              <a href="/signup"> Sign Up</a> to start making your picks.
            </div>
          </div>

          <div className="page-footer">🎉</div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
