import React from 'react'

// Footer.propTypes = {
//   darkMode: PropTypes.boolean.isRequired,
// }

export default function Footer({ darkMode }) {
  return (
    <>
      <style jsx>{`
        footer.footer {
          position: relative;
          display: flex;
          // background: var(--color2, --main-white, #fff);
          border-top: 4px solid var(--brand-color1, red);
          margin-top: 5px;
          padding: 1rem 1rem 5rem;
          justify-content: center;
          background-color: var(--main-${darkMode ? 'black' : 'white'});
          color: var(--main-${darkMode ? 'white' : 'black'});
        }
        .footer span {
          color: var(--main-${darkMode ? 'white' : 'black'});
          margin-left: 5px;
        }
      `}</style>
      <footer className="footer">
        <span> &copy; 2020-2021 </span>
        <a href="https://gusvalenzuela.com/"> \\ Gus Valenzuela</a>
        <a href="https://github.com/gusvalenzuela/fws-app"> \\ code</a>
      </footer>
    </>
  )
}
