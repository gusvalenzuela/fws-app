import React from "react";
import Head from "next/head";
import Footer from "../components/Footer";

const Player = () => {
  return (
    <main id="info">
      <Head>
        <title>FWS | Information</title>
      </Head>
      <main>
        <div className="main-content">
          <header className="page-header">
            <h1>Information</h1>
          </header>
          <div className="page-content">
            <h2>🚧Page is under construction👷‍♂️</h2>
            <h4>
              Please come back again soon and I'll have that information for
              you.
            </h4>
          </div>
          <div className="page-footer">ℹ Page</div>
        </div>
      </main>
      <Footer />
    </main>
  );
};

export default Player;
