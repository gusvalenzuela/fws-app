/* 
Global CSS cannot be imported from files other than your Custom <App>. 
Please move all global CSS imports to src\pages\_app.js.
Read more: https://err.sh/next.js/css-global
*/
import React, { useEffect } from 'react'
import Moment from 'react-moment'
import { ToastContainer } from 'react-toastify'
import { week_start_days as weekStartDates } from '../lib/stores/startDays.json'
import { useAllUsers } from '../lib/hooks'
import Store from '../lib/stores/FootballPool'
import Menubar from '../components/Menubar'
import Footer from '../components/Footer'
// import { Loader, Dimmer } from "semantic-ui-react";
import './_app.css'
import 'semantic-ui-css/semantic.min.css'
import 'react-toastify/dist/ReactToastify.css'

// This default export is required in a new `pages/_app.js\x` file.
export default function MyApp({ Component, pageProps }) {
  const [users] = useAllUsers()

  // on mount
  useEffect(() => {
    // Start the pooled timer which runs every 1 second(s)
    // (60000 milliseconds) by default.
    Moment.startPooledTimer(1000)

    // startDateIndex finds the first date that is not in the past
    // for the start of the nfl week (wednesday)
    const startDateIndex = weekStartDates.findIndex(
      (date) => Date.parse(date) > Date.now()
    )
    // use that startDate to mark the week shown when the user first logs in
    // if startDate is negative (i.e. out of bounds)
    //  use last week ([array].length == "weeks" in array)
    Store.setState({
      currentWeek:
        startDateIndex < 0 ? weekStartDates.length : startDateIndex + 1,
      currentSeasonYear: 2020,
      Moment,
    })
  }, [])

  return (
    <>
      <Menubar users={users} />
      <ToastContainer
        // limit={3}
        newestOnTop
        // hideProgressBar
        role="dialog"
        position="top-center"
      />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}
