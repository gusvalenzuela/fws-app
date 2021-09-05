import React from 'react'
import Moment from 'react-moment'

const TimeDisplay = () => {
  const timeZone = 'America/Los_Angeles'
  // console.log(window)
  return (
    <Moment
      className="time"
      format="ddd, MMM DD, 'YY - hh:mm:ss A zz"
      tz={timeZone}
    />
  )
}
export default TimeDisplay
