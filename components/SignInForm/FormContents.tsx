/* eslint-disable react/jsx-boolean-value */
import React from 'react'
import PropTypes from 'prop-types'
import { ClientSafeProvider } from 'next-auth/client'
import { Icon, SemanticICONS } from 'semantic-ui-react'
import { EmailButton } from './Buttons'
import Styles from './index.module.css'

const emailCheck =
  /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i

const SignInFormContents = ({
  providers,
  signIn,
  darkMode,
  emailLinkStatus,
  setEmailLinkStatus,
}) => {
  const emailProviderInputRef = React.useRef(null)
  const [emailValidation, setEmailValidation] = React.useState({
    error: false,
    message: 'Please enter a valid email address.',
  })

  const handleEmailProviderSubmit = async (ev) => {
    const emailAddress = emailProviderInputRef.current.value
    ev.preventDefault()
    // check email input value against the regexp
    // testing for common email string combinations
    if (!emailCheck.exec(emailAddress)) {
      setEmailValidation({ ...emailValidation, error: true })
      return
    }
    // sending
    setEmailLinkStatus({ ...emailLinkStatus, sending: true })
    // awaiting response
    const emailSignInRes = await signIn('email', {
      email: emailAddress,
      redirect: false,
    })
    // sent
    setEmailLinkStatus({ ...emailLinkStatus, sending: false })
    emailProviderInputRef.current.value = ''

    if (emailSignInRes?.ok) {
      setEmailLinkStatus({ ...emailLinkStatus, error: false, complete: true })
    } else {
      setEmailLinkStatus({ ...emailLinkStatus, error: true, complete: true })
    }
  }

  return (
    <>
      <style jsx={true}>
        {`
          hr {
            position: relative;
            height: 1em;
            display: block;
            border: 0;
            border-top: 1px solid #433;
            margin: 1.5em auto 0;
            overflow: visible;
          }
          hr::before {
            content: 'or';
            position: relative;
            background: var(
              ${darkMode ? '--color-dark, #678' : '--main-white, #ccc'}
            );
            color: #888;
            padding: 0 0.4rem;
            top: -0.75rem;
          }
          label {
            font-weight: 500;
            text-align: left;
            margin-bottom: 0.25rem;
            display: block;
          }
          input[type] {
            box-sizing: border-box;
            display: block;
            width: 100%;
            padding: 0.5rem 1rem;
            margin: auto;
            margin-top: 0.5rem;
            border: 1px solid ${!emailValidation.error ? '#433d' : 'red'};
            background: #fff;
            font-size: 1rem;
            border-radius: 1px;
            box-shadow: inset 0 0.1rem 0.2rem rgba(0, 0, 0, 0.2);
            color: #333;
          }
        `}
      </style>
      <h4>Sign in with:</h4>
      {providers ? (
        Object.values(providers).map((provider: ClientSafeProvider) => {
          if (!['Demo', 'Email'].includes(provider.name)) {
            // semantic-ui graciously provides icons for most popular providers
            // (google, twitter, github, facebook, etc) but we have to convert
            // the incoming provider name (string) into an enum that the
            // Icon component will accept.
            // Use type assertion ('as') and import the enum type (SemanticICONS)
            // to convert from a proper string to an option in enum array
            // https://www.typescriptlang.org/docs/handbook/jsx.html

            // TODO check to see if name is in list before conversion
            const providerIconName =
              (provider.name.toLowerCase() as SemanticICONS) || 'circle'
            return (
              // return a button for each provider signin flow

              <button
                className={`${Styles.signInButton} ${
                  darkMode ? Styles.darkMode : Styles.lightMode
                }`}
                key={provider.id}
                type="button"
                onClick={() => signIn(provider.id)}
              >
                <Icon name={providerIconName} />
                {provider.name}
              </button>
            )
          }
          return null
        })
      ) : (
        <>
          <div
            className={`${Styles.signInButton} ${
              darkMode ? Styles.darkMode : Styles.lightMode
            }`}
          >
            ¯\_(ツ)_/¯
          </div>
          <p>
            Something&apos;s wrong. No sign-in providers.
            <br /> Contact the site administrator.
          </p>
        </>
      )}
      <hr />
      <label htmlFor="input-for-email-provider">
        Email
        <input
          disabled={emailLinkStatus.sending}
          ref={emailProviderInputRef}
          id="input-for-email-provider"
          required
          type="email"
          placeholder="email@example.com"
          onFocus={() =>
            setEmailValidation({
              ...emailValidation,
              error: false,
            })
          }
        />
      </label>{' '}
      {emailValidation.error ? (
        <p style={{ color: 'red' }}>{emailValidation.message}</p>
      ) : null}
      <EmailButton
        emailLinkStatus={emailLinkStatus}
        signIn={handleEmailProviderSubmit}
      />
      {/* <DemoButton signIn={signIn} /> */}
    </>
  )
}

export default SignInFormContents

SignInFormContents.propTypes = {
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
  setEmailLinkStatus: PropTypes.func.isRequired,
  emailLinkStatus: PropTypes.shape({
    sending: PropTypes.bool,
    error: PropTypes.bool,
    complete: PropTypes.bool,
  }).isRequired,
}
