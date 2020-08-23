import React from "react";
import Head from "next/head";

const Home = () => {
  return (
    <div className="container">
      <Head>
        <title>FWS | HOME</title>
      </Head>
      <main id="index" className="index">
        <div className="main-content">
          <header className="page-header">
            Welcome to Fun with Sports!
          </header>
          <div className="page-content">
            {/* <h1>This is Fun with Sports!</h1> */}
            <h2>Log in or Sign Up to start making your picks.</h2>
          </div>

          <div className="page-footer">🎉</div>
        </div>
      </main>
    </div>
  );
};

export default Home;
