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
        <header className="page-header">
          <div className="hero">
            <h1>
              <span className="brand-name"></span> brings picking sides in major
              sporting events to your fingertips.
            </h1>
            <div
              style={{
                alignItems: "center",
              }}
            >
              <a className="button" name="signup" href="/signup">
                <span>Sign up for FREE!</span>
              </a>
              <a className="button" name="login" href="/login">
                <span>Log In</span>
              </a>
            </div>
          </div>
        </header>
        <div className="page-content"></div>

        <div className="page-footer">
          <i>FOR ENTERTAINMENT USE ONLY</i>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
