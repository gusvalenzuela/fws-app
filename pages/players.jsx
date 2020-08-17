import React from "react";
import Head from "next/head";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

function Player() {
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
}

export default Player;
