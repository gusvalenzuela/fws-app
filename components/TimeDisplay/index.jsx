import React, { useState } from "react";

const TimeDisplay = () => {
  const [curTime, setCurTime] = useState(new Date(Date.now()));
  // update current time every second
  // setInterval(() => {
  //   setCurTime(new Date(Date.now()));
  // }, 1000);
  let options = {
    weekday: "long",
    month: "long",
    year: "numeric",
    day: "numeric",
    // hour: "numeric",
    // minute: "numeric",
    // second: "numeric",
    // time: "numeric",
    // timeZoneName: "short",
  };
  return <span>{`${curTime.toLocaleDateString([], options)}`}</span>;
};

export default TimeDisplay;
