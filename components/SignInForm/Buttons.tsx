import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'
import Styles from './index.module.css'

const inlineStyles = (id: string) => (
  <style jsx>{`
    #${id}.signInButton {
      background-color: var(--color-light, --main-white, #ddd);
      color: var(--color1, blue);
    }

    #${id}.signInButton:hover {
      background-color: var(--color-dark, black);
      color: var(--color-light, --main-white, #ddd);
      border: 1px solid transparent;
      cursor: wait;
    }
    #${id}.signInButton:active {
      background-color: var(--color-dark, black);
      color: var(--color1, blue);
      border: 1px solid transparent;
      cursor: wait;
    }
    /* // when pointer is a mouse (fine) */
    @media (hover: hover) and (pointer: fine) {
      #${id}.signInButton:hover {
        cursor: pointer;
        opacity: 0.9;
      }
    }
  `}</style>
)

const SignInButtons = ({
  signIn,
  btnId,
  btnText,
  iconName,
  emailLinkStatus,
}) => (
  <>
    {
      /* JSX Style Element (<style jsx>) */
      inlineStyles(btnId)
    }
    {/* return a different button to use other signin flows */}
    <button
      className={`${Styles.signInButton} signInButton`}
      id={btnId}
      type="button"
      onClick={signIn}
      disabled={emailLinkStatus.sending}
    >
      <Icon name={iconName} />
      {emailLinkStatus.sending ? 'Sending' : btnText}
    </button>
  </>
)

const EmailButton = (props) => (
  <SignInButtons
    {...props}
    btnText="Send Link"
    // signIn={parentSignIn}
    btnId="emailSignInButton"
    iconName="envelope"
  />
)
const DemoButton = (props) => (
  <SignInButtons
    {...props}
    btnText="Demo Account"
    // signIn={parentSignIn}
    btnId="demoSignInButton"
    iconName="universal access"
  />
)

export { EmailButton, DemoButton }

SignInButtons.propTypes = {
  signIn: PropTypes.func.isRequired,
  emailLinkStatus: PropTypes.shape({
    sending: PropTypes.bool,
    error: PropTypes.bool,
    complete: PropTypes.bool,
  }).isRequired,
  btnId: PropTypes.string,
  btnText: PropTypes.string,
  iconName: PropTypes.string,
}
SignInButtons.defaultProps = {
  btnId: 'customSignInButton',
  btnText: 'Sign In',
  iconName: 'universal access',
}
