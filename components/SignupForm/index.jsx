import React, { useState } from "react";
import { useCurrentUser } from "../../lib/hooks";
import { Icon } from "semantic-ui-react";

const SignupForm = () => {
  const [u, { mutate }] = useCurrentUser();

  const [errorMsg, setErrorMsg] = useState("");

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
    <>
      <style jsx>
        {`
          div.form {
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
            padding: 1.5rem;
            margin: 2.5rem auto;
            max-width: 350px;
            transition: box-shadow 0.2s ease 0s;
            background: #ffff;
          }
          form {
            margin-bottom: 1rem;
          }
          form.signup input {
            width: 85%;
            border: none;
            border-bottom: 2px solid black;
            padding: 0.5rem 0.1rem;
            margin-bottom: 1.25rem;
          }
        `}
      </style>
      <div className="form">
        <form className="signup" onSubmit={handleSubmit}>
          {errorMsg ? <p style={{ color: "red" }}>{errorMsg}</p> : null}
          <Icon name="user" size="big" aria-label="Username" />{" "}
          <input
            required
            id="name"
            type="name"
            name="name"
            autoComplete="true"
            placeholder="Username"
          />
          <Icon name="envelope" size="big" aria-label="Email" />{" "}
          <input
            required
            id="email"
            type="email"
            name="email"
            autoComplete="true"
            placeholder="Email"
          />
          <Icon name="lock" size="big" aria-label="Password" />{" "}
          <input
            required
            id="password"
            type="password"
            name="new-password"
            autoComplete="true"
            placeholder="Password"
          />
          <button className="button" type="submit">
            Sign up
          </button>
        </form>
        <a href="/login">Already have an account?</a>
      </div>
    </>
  );
};

export default SignupForm;
