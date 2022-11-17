import React from 'react'
import PropTypes from 'prop-types'

const Footer = ({ darkMode }) => (
  <>
    <style jsx>{`
      footer.footer,
      .footer-content {
        position: relative;
        display: flex;
        justify-content: space-between;
      }
      footer.footer {
        // background: var(--color2, --main-white, #fff);
        border-top: 4px solid var(--brand-color1, red);
        margin-top: 5px;
        padding: 1rem 1rem 5rem;
        background-color: var(--main-${darkMode ? 'black' : 'white'});
        color: var(--main-${darkMode ? 'white' : 'black'});
      }
      .footer-content {
        margin: auto;
        width: 100%;
        max-width: 800px;
      }
      .footer span {
        color: var(--main-${darkMode ? 'white' : 'black'});
        // margin-left: 5px;
      }
    `}</style>
    <footer className="footer">
      <div className="footer-content">
        <span>
          &copy; 2020-2022{' '}
          <a href="https://gusvalenzuela.com/"> \\ Gus Valenzuela</a>
        </span>

        <a href="https://github.com/gusvalenzuela/fws-app">source code</a>
      </div>
    </footer>
  </>
)

export default Footer

Footer.propTypes = {
  darkMode: PropTypes.bool.isRequired,
}
