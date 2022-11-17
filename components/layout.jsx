import React from 'react'
import Menubar from './Menubar'
import Footer from './Footer'

const Layout = ({ children, darkMode }) => (
  <>
    <Menubar darkMode={darkMode} />
    {children}
    <Footer darkMode={darkMode} />
  </>
)
export default Layout
