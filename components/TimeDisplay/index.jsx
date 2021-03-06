import React from 'react'
import Moment from 'react-moment'

const TimeDisplay = () => (
  <>
    <Moment className="time" format="dddd, MMMM DD, YYYY - hh:mm:ss A" tz="" />
  </>
)

export default TimeDisplay
