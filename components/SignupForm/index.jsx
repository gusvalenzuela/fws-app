import React, { useState } from "react";
import Link from "next/Link";
import { useCurrentUser } from "../../lib/hooks";

const SignupForm = () => {
  
  const [u, { mutate }] = useCurrentUser();

  const [errorMsg, setErrorMsg] = useState("");
  
  async function onSubmit(e) {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value.trim(),
      password: e.currentTarget.password.value.trim(),
    };
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 200) {
      const userObj = await res.json();
      mutate(userObj);
    } else {
      setErrorMsg("Incorrect username or password. Try again!");
    }
  }
  return (
    <>
      <style jsx>
        {`
          div.form {
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
            padding: 1.5rem;
            margin: 2.5rem auto;
            max-width: 576px;
            text-align: left !important;
            transition: box-shadow 0.2s ease 0s;
          }
          form.login input {
            margin-bottom: 0.75rem;
          }
          form.login button {
            margin-bottom: 3.75rem;
            padding: ;
          }
        `}
      </style>
      <div className="form">
        <form className="login" onSubmit={onSubmit}>
          {errorMsg ? <p style={{ color: "red" }}>{errorMsg}</p> : null}
          <label htmlFor="email">Email Address: </label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="true"
            placeholder="example@email.com"
          />

          <label htmlFor="password">Password: </label>
          <input
            id="password"
            type="password"
            autoComplete="true"
            name="current-password"
            placeholder="password"
          />

          <button type="submit">SignupForm HEHEHE</button>
        </form>
        <Link href="/forget-password">
          <a>Forgot password?</a>
        </Link>
        <p style={{ color: "#777", textAlign: "center" }}>
          Note: This app is for ENTERTAINMENT USE ONLY. <br />
          Comes as is.
        </p>
      </div>
    </>
  );
};

export default SignupForm;
