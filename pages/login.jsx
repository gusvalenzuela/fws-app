import React, { useEffect } from "react";
import Head from "next/head";
import LoginForm from "../components/LoginForm";
import { useRouter } from "next/router";
import { useCurrentUser } from "../lib/hooks";

const LoginPage = () => {
  const router = useRouter();
  const [user] = useCurrentUser();
  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) router.push("/");
  }, [user]);

  return (
    <main id="login">
      <Head>
        <title>FWS | Login</title>
      </Head>
      <div className="main-content">
        <header className="page-header">
          <h1>Get ready to make your picks!</h1>
        </header>
        <div className="page-content">
          <LoginForm />
          <p style={{ color: "#777", textAlign: "center" }}>
            Note: This app is for ENTERTAINMENT USE ONLY. <br />
            Use as is.
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
