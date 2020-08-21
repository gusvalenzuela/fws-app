import React from "react";
import Head from "next/head";
import Footer from "../components/Footer";
import { useCurrentUser } from "../lib/hooks";

const Home = () => {
  const [user] = useCurrentUser();
  return (
    <div className="container">
      <Head>
        <title>FWS | HOME</title>
      </Head>
      <main id="index" className="index">
        <div className="main-content">
          <header className="page-header">
            Welcome {user ? user.name : "to FWS"}!
          </header>
          <div className="page-content">
            <h1>This is Fun with Sports!</h1>
            <h2>Log in to start making your picks.</h2>
          </div>

          <div className="page-footer">👋</div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
