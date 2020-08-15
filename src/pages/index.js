import Head from "next/head";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import React from "react";

function Home() {
  return (
    <div className="container">
      <Head>
        <title>FWS | HOME</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <main>FUN WITH SPORTS</main>

      <Footer />
    </div>
  );
}

export default Home;
