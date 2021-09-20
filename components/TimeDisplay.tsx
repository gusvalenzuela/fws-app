import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import 'moment-timezone'

const TimeDisplay = ({ userTimeZone }) => {
  const [time, setTime] = React.useState(Date.now())
  return (
    <Moment
      className="time"
      format="ddd, MMM DD, 'YY - hh:mm:ss A zz"
      tz={userTimeZone}
      onChange={() => setTime(Date.now())}
      interval={1000}
      date={time}
    />
  )
}
export default React.memo(TimeDisplay)

TimeDisplay.propTypes = {
  // TODO: make enum
  userTimeZone: PropTypes.string,
}
TimeDisplay.defaultProps = {
  userTimeZone: 'America/Los_Angeles',
}
