import React from "react";
import Head from "next/head";
import { useCurrentUser } from "../lib/hooks";
import { useRouter } from "next/router";

const HomePage = () => {
  const router = useRouter();
  const [user] = useCurrentUser();
  if (user) router.push("/weeks");
  return (
    <div className="container">
      <Head>
        <title>FWS | HOME</title>
      </Head>
      <main id="index" className="index">
        <header className="page-header">
          <div className="hero">
            <h1>
              <span className="brand-name"></span> brings picking sides in major
              sporting events<sup>*</sup> to your fingertips.
            </h1>

            <div
              style={{
                alignItems: "center",
              }}
            >
              <a
                className="button"
                name="signup"
                onClick={() => {
                  router.push("/signup");
                }}
              >
                <span>Sign up for FREE!</span>
              </a>
              <a
                className="button"
                name="login"
                onClick={() => {
                  router.push("/login");
                }}
              >
                <span>Log In</span>
              </a>
            </div>
            <i style={{ fontSize: "x-small" }}>
              <sup>*</sup>Currently only featuring American Football.
            </i>
            <a
              className="demo-link"
              onClick={() => {
                router.push("/weeks");
              }}
            >
              See Demo Account
            </a>
          </div>
        </header>
        <div className="page-content">
          {" "}
          <p
            style={{
              color: "#777",
              textAlign: "center",
              margin: "auto",
              fontSize: "18px",
            }}
          >
            <b>FOR ENTERTAINMENT USE ONLY.</b> <br />
            Subject to change without notice.
            <br /> Please play responsibly.{" "}
            <span
              role="image"
              aria-label="Winking face emoji"
              alt="Winking face emoji"
            >
              😉
            </span>
          </p>
        </div>

        <div className="page-footer"></div>
      </main>
    </div>
  );
};

export default HomePage;
