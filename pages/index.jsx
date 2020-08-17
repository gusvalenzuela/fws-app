import React from "react";
import Head from "next/head";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { useCurrentUser } from "../lib/hooks";

const Home = () => {
  const [user] = useCurrentUser();
  return (
    <div className="container">
      <Head>
        <title>FWS | HOME</title>
      </Head>
      <Nav />
      <main>
        <header>Welcome {user ? user.name : "to FWS"}!</header>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
