import React from 'react'
import PropTypes from 'prop-types'
import { ClientSafeProvider } from 'next-auth/client'
import { Icon, SemanticICONS } from 'semantic-ui-react'
// import DemoButton from './DemoButton'
import Styles from './index.module.css'

const SignInForm = ({ providers, signIn, darkMode }) => (
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
      <h4>Sign in with:</h4>
      {providers &&
        Object.values(providers).map((provider: ClientSafeProvider) => {
          if (provider.name !== 'Demo') {
            // semantic-ui graciously provides icons for most popular providers
            // (google, twitter, github, facebook, etc) but we have to convert
            // the incoming provider name (string) into an enum that the
            // Icon component will accept.
            // Use type assertion ('as') and import the enum type (SemanticICONS)
            // to convert from a proper string to an option in enum array
            // https://www.typescriptlang.org/docs/handbook/jsx.html

            // TODO check to see if name is in list before conversion
            const providerName =
              (provider.name.toLowerCase() as SemanticICONS) || 'circle'
            return (
              // return a button for each provider signin flow
              // background-color:
              // );
              // color: var(${darkMode ? '--color-dark, #678' : '--main-white, #ccc'});
              <button
                className={`${Styles.signInButton} ${
                  darkMode ? Styles.darkMode : Styles.lightMode
                }`}
                key={provider.id}
                type="button"
                onClick={() => signIn(provider.id)}
              >
                <Icon name={providerName} />
                {provider.name}
              </button>
            )
          }
          return null
        })}
      {/* <DemoButton signIn={signIn} /> */}
    </div>
  </>
)

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
