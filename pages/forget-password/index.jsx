import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const ForgetPasswordPage = () => {
  const router = useRouter()
  async function handleSubmit(e) {
    e.preventDefault(e)

    const body = {
      email: e.currentTarget.email.value,
    }

    const res = await fetch('/api/user/password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.status === 200) router.replace('/')
  }

  return (
    <>
      <Head>
        <title>Forget password</title>
      </Head>
      <main id="forget-password" className="forget-password">
        <header className="page-header">
          <h2>Forget password</h2>
        </header>
        <div className="page-content">
          <form style={{ textAlign: 'center' }} onSubmit={handleSubmit}>
            <p>Do not worry. Simply enter your email address below.</p>
            <label htmlFor="email">
              <input id="email" type="email" placeholder="Email" />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>

        <footer className="page-footer">
          <span role="img" aria-label="Party popper emoji">
            🎉
          </span>
        </footer>
      </main>
    </>
  )
}

export default ForgetPasswordPage
