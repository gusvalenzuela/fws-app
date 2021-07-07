import React, { useState } from 'react'
import Link from 'next/link'
import { Icon } from 'semantic-ui-react'
import Loader from '../SemanticLoader'

const { NEXT_PUBLIC_DEMO_PSWD } = process.env

const LoginForm = ({ mutate, demoAccount }) => {
  const [errorMsg, setErrorMsg] = useState(null)

  if (demoAccount) {
    const demo = {
      email: 'demo@email.com',
      password: NEXT_PUBLIC_DEMO_PSWD,
    }
    handleDemoLogin(demo)
  }

  async function handleDemoLogin(acct) {
    const res = await postLogin(acct)

    return postPostLogin(res)
  }

  async function postLogin(body) {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    return response
  }

  async function postPostLogin(res) {
    if (res.status === 200) {
      const userObj = await res.json()
      mutate(userObj)
    } else {
      setErrorMsg('Incorrect username or password. Try again!')
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    // clear any error msg after 3sec
    setTimeout(() => {
      setErrorMsg(null)
    }, 3000)

    const body = {
      email: e.currentTarget.email.value.trim(),
      password: e.currentTarget.password.value.trim(),
    }
    const res = await postLogin(body)

    return postPostLogin(res)
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
            background: #ffff;
          }
          form {
            margin-bottom: 2rem;
          }
          form.login input {
            width: 90%;
            border: none;
            border-bottom: 2px solid black;
            padding: 0.5rem 0.1rem;
            margin-bottom: 1.25rem;
          }
        `}
      </style>
      {demoAccount ? (
        <Loader text="Logging into Demo account" />
      ) : (
        <div className="form">
          <form className="login" onSubmit={onSubmit}>
            {errorMsg ? <p style={{ color: 'red' }}>{errorMsg}</p> : null}
            <div>
              <Icon name="envelope" aria-label="Email" />{' '}
              <input
                required
                id="email"
                type="email"
                name="email"
                autoComplete="true"
                placeholder="Email"
              />
            </div>
            <div>
              <Icon name="lock" aria-label="Password" />{' '}
              <input
                required
                id="password"
                type="password"
                autoComplete="true"
                name="current-password"
                placeholder="Password"
              />
            </div>
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
        </div>
      )}
    </>
  )
}

export default LoginForm
