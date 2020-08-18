import React from "react";

const TimeDisplay = ({ dt }) => {
  let options = {
    weekday: "long",
    month: "long",
    year: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    time: "numeric",
    timeZoneName: "short",
  };
  return (
    <span className="current-time-container">
      {`${dt.toLocaleDateString([], options)}`}
    </span>
  );
};

export default TimeDisplay;
