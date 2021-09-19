import React from 'react'
import Menubar from './Menubar'
import Footer from './Footer'

function Layout({ children, darkMode }) {
  return (
    <>
      <Menubar darkMode={darkMode} />
      {children}
      <Footer darkMode={darkMode} />
    </>
  )
}

export default Layout
