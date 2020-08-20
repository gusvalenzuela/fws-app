import React, { useEffect } from "react";
import Head from "next/head";
import Nav from "../components/Nav";
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
      <Nav />
      <div className="">Dashboard</div>
      <div className="main-content ">hi player</div>
      <Footer />
    </main>
  );
};

export default Player;
