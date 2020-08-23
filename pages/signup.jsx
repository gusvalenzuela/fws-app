import React, { useState, useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import SignupForm from "../components/SignupForm";
import { useCurrentUser } from "../lib/hooks";

function SignupPage() {
  const [user, { mutate }] = useCurrentUser();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) Router.replace("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value,
      name: e.currentTarget.name.value,
      password: e.currentTarget.password.value,
    };
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 201) {
      const userObj = await res.json();
      mutate(userObj);
    } else {
      setErrorMsg(await res.text());
    }
  };

  return (
    <main id="signup">
      <Head>
        <title>FWS | Sign Up</title>
      </Head>
      <div className="main-content">
        <header className="page-header">
          <h1>Sign Up</h1>
        </header>
        <div className="page-content">
          <SignupForm />
          <p style={{ color: "#777", textAlign: "center" }}>
            Note: The database is public. For your privacy, please avoid using
            your personal, work email.
          </p>
        </div>
        <div className="page-footer">ℹ Page</div>
      </div>
    </main>
  );
}

export default SignupPage;
