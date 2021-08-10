/* 
Global CSS cannot be imported from files other than your Custom <App>. 
Please move all global CSS imports to src\pages\_app.js.
Read more: https://err.sh/next.js/css-global
*/
import React, { useEffect } from 'react'
import Moment from 'react-moment'
import { ToastContainer } from 'react-toastify'
import startDates from '../lib/stores/startDays.json'
import Store from '../lib/stores/FootballPool'
import Menubar from '../components/Menubar'
import Footer from '../components/Footer'
import './_app.css'
import 'semantic-ui-css/semantic.min.css'
import 'react-toastify/dist/ReactToastify.css'

const { week_start_days: weekStartDates } = startDates
// This default export is required in a new `pages/_app.js\x` file.
export default function MyApp({ Component, pageProps }) {
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
      currentSeasonYear: 2021,
      Moment,
    })
  }, [])

  return (
    <>
      <Menubar />
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
