import Head from "next/head";
import Foot from "../components/Foot";
import React from "react";

function Home() {

  return (
    <div className="container">
      <Head>
        <title>FWS | HOME</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
       FUN WITH SPORTS
      </main>

      <Foot />
    </div>
  );
}

export default Home;
