import React, { useEffect } from "react";
import Head from "next/head";
import Footer from "../components/Footer";
import { getPicks } from "../lib/hooks";

const Player = () => {
  async function getUserInfo() {
    // const res = await fetch("/api/picks", {
    //   method: "GET",
    // });
    // if (res.status === 200) {
    //   const { picks } = await res.json();
    //   setUserPicks(picks);
    // } else {
    //   console.log(`something went wrong`);
    // }
  }
  const picks = getPicks();
  useEffect(() => {
    console.log(picks);
  }, [picks]);
  return (
    <main id="player">
      <Head>
        <title>FWS | Player</title>
      </Head>
      <main>
        <div className="main-content">
          <h1 className="page-header">Welcome, Player.</h1>
          <h2 className="page-content">🚧Page is under construction👷‍♂️</h2>
          <div className="page-footer">👋</div>
        </div>
      </main>
      <Footer />
    </main>
  );
};

export default Player;
