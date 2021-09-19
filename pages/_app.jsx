/* 
Global CSS cannot be imported from files other than your Custom <App>. 
Please move all global CSS imports to src\pages\_app.js.
Read more: https://err.sh/next.js/css-global
*/
import React, { useEffect } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import 'semantic-ui-css/semantic.min.css'
import './_app.css'
import Moment from 'react-moment'
import 'moment-timezone'
import { Provider } from 'next-auth/client'
import { ToastContainer } from 'react-toastify'
import startDates from '../lib/stores/startDays.json'
import { useAllUsers } from '../lib/hooks'
import Layout from '../components/layout'
import Store from '../lib/stores/FootballPool'

const { week_start_days: weekStartDates } = startDates

// This default export is required in a new `pages/_app.js\x` file.
export default function MyApp({ Component, pageProps }) {
  const [users] = useAllUsers()
  const storedUsers = Store((s) => s.allUsers)
  const darkMode = Store((s) => s.darkMode)

  // Mount & M O M E N T
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
      currentWeek: startDateIndex < 0 ? weekStartDates.length : startDateIndex,
      currentSeasonYear: 2021,
      Moment,
    })
  }, [])

  // on users
  useEffect(() => {
    if ((!storedUsers || !storedUsers.length) && users) {
      Store.setState({ allUsers: users })
    }
  }, [users, storedUsers])

  return (
    <Provider session={pageProps.session}>
      <Layout darkMode={darkMode}>
        <ToastContainer
          limit={4}
          newestOnTop
          // hideProgressBar
          role="dialog"
          position="top-center"
        />
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}
