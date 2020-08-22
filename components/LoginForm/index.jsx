import React, { useState } from "react";
import { useCurrentUser } from "../../lib/hooks";
import { Icon } from "semantic-ui-react";

const LoginForm = () => {
  const [u, { mutate }] = useCurrentUser();

  const [errorMsg, setErrorMsg] = useState(null);

  async function onSubmit(e) {
    setTimeout(() => {
      setErrorMsg(null);
    }, 3000);
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
            max-width: 300px;
            transition: box-shadow 0.2s ease 0s;
          }
          form {
            margin-bottom: 1rem;
          }
          form.login input {
            width: 90%;
            border: none;
            border-bottom: 2px solid black;
            padding: 0.5rem 0.1rem;
            margin-bottom: 1.25rem;
          }
          form.login button {
            display: block;
            margin: auto;
            padding: 0.5rem 1rem;
          }
        `}
      </style>
      <div className="form">
        <form className="login" onSubmit={onSubmit}>
          {errorMsg ? <p style={{ color: "red" }}>{errorMsg}</p> : null}
          <Icon name="envelope" aria-label="Email" />{" "}
          <input
            required
            id="email"
            type="email"
            name="email"
            autoComplete="true"
            placeholder="Email"
          />
          {/* <label htmlFor="password">Password: </label> */}
          <Icon name="lock" aria-label="Password" />{" "}
          <input
            required
            id="password"
            type="password"
            autoComplete="true"
            name="current-password"
            placeholder="Password"
          />
          <button type="submit">Login</button>
        </form>
        <a href="/forget-password">Forgot password?</a>
      </div>
    </>
  );
};

export default LoginForm;
