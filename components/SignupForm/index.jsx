import React, { useState } from 'react'
import Link from 'next/link'
import { Icon } from 'semantic-ui-react'

const SignupForm = ({ mutate }) => {
  const [errorMsg, setErrorMsg] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const body = {
      email: e.currentTarget.email.value,
      name: e.currentTarget.name.value,
      password: e.currentTarget.password.value,
    }
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.status === 201) {
      const userObj = await res.json()
      mutate(userObj)
    } else {
      setErrorMsg(await res.text())
    }
  }
  return (
    <>
      <style jsx>
        {`
          div.form {
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.24);
            padding: 1.5rem;
            margin: 2.5rem auto;
            max-width: 300px;
            transition: box-shadow 0.2s ease 0s;
            background: #ffff;
            text-align: center;
          }
          form {
            margin-bottom: 1rem;
          }
          label {
            display: inline-block;
            width: 100%;
          }
          form.signup input {
            width: 75%;
            border: none;
            border-bottom: 2px solid black;
            padding: 0.5rem 0.1rem;
            margin-bottom: 1.25rem;
          }
          .button {
            border: 1px solid transparent;
            padding: 1rem;
            width: 50%;
            margin: auto;
            margin-top: 0.5rem;
            background-color: var(--color-light, --main-white, #ddd);
            color: var(--color1, --color-dark, --main-black, #000);
          }
          .button:hover,
          .button:active {
            background-color: var(--color1, --color-dark, lightblue);
            color: var(--main-white, white);
          }
          .button:active {
            border: 1px solid black;
            cursor: wait;
            background-color: var(--color-dark, black);
          }
          /* // when pointer is a mouse (fine) */
          @media (hover: hover) and (pointer: fine) {
            .button:hover {
              cursor: pointer;
              opacity: 0.9;
            }
          }
        `}
      </style>
      <div className="form">
        <form className="signup" onSubmit={handleSubmit}>
          {errorMsg ? <p style={{ color: 'red' }}>{errorMsg}</p> : null}
          <label htmlFor="#name">
            <Icon name="user" size="big" aria-label="Username" />
            <input
              required
              id="name"
              type="name"
              name="name"
              autoComplete="true"
              placeholder="Username"
            />
          </label>
          <label htmlFor="#email">
            <Icon name="envelope" size="big" aria-label="Email" />
            <input
              required
              id="email"
              type="email"
              name="email"
              autoComplete="true"
              placeholder="Email"
            />
          </label>
          <label htmlFor="#password">
            <Icon name="lock" size="big" aria-label="Password" />
            <input
              required
              id="password"
              type="password"
              name="new-password"
              autoComplete="true"
              placeholder="Password"
            />
          </label>
          <button className="button" type="submit">
            Sign up
          </button>
        </form>
        <Link href="/login">
          <a>Already have an account?</a>
        </Link>
      </div>
    </>
  )
}

export default SignupForm
