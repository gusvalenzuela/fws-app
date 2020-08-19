import React from "react";
import Style from "./PlayerDashboard.module.css";

const PlayerDashboard = ({ user }) => {
  return (
    <div className={Style.playerContainer}>
      <span>{user && user.name}</span>
    </div>
  );
};

export default PlayerDashboard;
