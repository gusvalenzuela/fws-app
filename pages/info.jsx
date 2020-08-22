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
          <header className="page-header">Information</header>
          <div className="page-content">
            <h1>🚧Page is under construction👷‍♂️</h1>
            <h3>
              Please come back again soon and I'll have that information for
              you.
            </h3>
          </div>
          <div className="page-footer">ℹ Page</div>
        </div>
      </main>
      <Footer />
    </main>
  );
};

export default Player;
