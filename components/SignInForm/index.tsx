import React from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import FormContents from './FormContents'

const SignInForm = ({ providers, signIn, darkMode }) => {
  const router = useRouter()
  const [emailLinkStatus, setEmailLinkStatus] = React.useState({
    sending: false,
    error: false,
    complete: false,
  })

  return (
    <>
      <style jsx>
        {`
          div.form {
            box-shadow: 0 2px 5px
              rgba(${!darkMode ? '0, 0, 0' : '255, 255, 255'}, 0.24);
            padding: 1.5rem;
            margin: 2.5rem auto;
            max-width: 300px;
            transition: box-shadow 0.2s ease 0s;
            background: var(
              ${darkMode ? '--color-dark, #678' : '--main-white, #ccc'}
            );
            color: var(
              ${!darkMode ? '--color-dark, #678' : '--main-white, #ccc'}
            );
            text-align: center;
            border: 1px solid transparent;
          }
        `}
      </style>
      <div className="form">
        {!emailLinkStatus.error && emailLinkStatus.complete ? (
          <p>Check your email for link to sign in</p>
        ) : emailLinkStatus.error && emailLinkStatus.complete ? (
          <button type="button" onClick={() => router.reload()}>
            Try Again
          </button>
        ) : (
          <FormContents
            providers={providers}
            signIn={signIn}
            darkMode={darkMode}
            emailLinkStatus={emailLinkStatus}
            setEmailLinkStatus={setEmailLinkStatus}
          />
        )}
      </div>
    </>
  )
}

export default SignInForm

SignInForm.propTypes = {
  providers: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.oneOf(['oauth', 'email', 'credentials']),
      signinUrl: PropTypes.string,
      callbackUrl: PropTypes.string,
    })
  ).isRequired,
  signIn: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
}
