import React from "react";

const PlayerDashboard = ({ user, msg }) => {
  return (
    <>
      <style jsx>
        {`
          .player-container {
            max-width: 800px;
            margin: auto;
            height: fit-content;
            padding: 1.5rem;
            background-color: #fff7f7;
          }
          .player-container h1 {
            text-align: left;
          }
          .player-container p {
            text-align: left;
            font-weight: 900;
            color: red;
          }
        `}
      </style>
      <div className="player-container">
        <h1>{user ? user?.name : "Demo Account"}</h1>
        <p>
          {user?.locked_in
            ? "All GOOD To Go"
            : `Picks locked at the scheduled time of the first Sunday game`}
        </p>
        {/* msg received on count of picks left to make*/}
        {msg ? (
          <p
            style={{
              color: "black",
            }}
          >
            {msg}
          </p>
        ) : null}
      </div>
    </>
  );
};

export default PlayerDashboard;
