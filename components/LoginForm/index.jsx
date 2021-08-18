import React, { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { Icon } from 'semantic-ui-react'
import Loader from '../DualRingLoader'

const { NEXT_PUBLIC_DEMO_PSWD } = process.env

const LoginForm = ({ mutate, demoAccount, setIsLoggingIn, isLoggingIn }) => {
  const [errorMsg, setErrorMsg] = useState(null)

  if (demoAccount) {
    const demo = {
      email: 'demo@email.com',
      password: NEXT_PUBLIC_DEMO_PSWD,
    }
    handleDemoLogin(demo)
  }

  async function handleDemoLogin(acct) {
    const res = await axios.post('/api/auth', acct)

    return postPostLogin(res)
  }

  async function postPostLogin(res) {
    if (res.status === 200) {
      mutate(res.data.user)
    } else {
      setErrorMsg('Incorrect username or password. Try again!')
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    setIsLoggingIn(true)
    // clear any error msg after 3sec
    setTimeout(() => {
      setErrorMsg(null)
    }, 3000)

    const body = {
      email: e.currentTarget.email.value.trim(),
      password: e.currentTarget.password.value.trim(),
    }
    const res = await axios.post('/api/auth', body)

    return postPostLogin(res)
  }

  if (demoAccount) return <Loader text="Logging in as Demo, please wait..." />

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
          form.login input {
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
            color: var(--color1, --color-dark, lightblue);
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
        {isLoggingIn ? (
          <Loader text="Logging you in, please wait..." />
        ) : (
          <>
            <form className="login" onSubmit={onSubmit}>
              {errorMsg ? <p style={{ color: 'red' }}>{errorMsg}</p> : null}
              <label htmlFor="#email">
                <Icon name="envelope" aria-label="Email" />{' '}
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
                <Icon name="lock" aria-label="Password" />{' '}
                <input
                  required
                  id="password"
                  type="password"
                  autoComplete="true"
                  name="current-password"
                  placeholder="Password"
                />
              </label>
              <button className="button" type="submit">
                <span>LOG IN</span>
              </button>
            </form>
            <Link href="/forget-password">
              <a>Forgot password?</a>
            </Link>
            <br />
            <Link href="/signup">
              <a>Don&apos;t have an account?</a>
            </Link>
          </>
        )}
      </div>
    </>
  )
}

export default LoginForm
