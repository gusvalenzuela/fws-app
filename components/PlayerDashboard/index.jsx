import React from "react";

const PlayerDashboard = ({ user, msg, otherUser }) => {
  // console.log(user.picks)
  return (
    <>
      <style jsx>
        {`
          .player-container {
            max-width: 800px;
            margin: auto;
            height: fit-content;
            padding: 1.5rem;
            background-color: #1b3094;
          }
          .player-container h1 {
            text-align: left;
            color: #fff;
          }
          .player-container p {
            text-align: left;
            font-weight: 900;
            color: #fff70f;
          }
          .player-container.other-user {
            background: #213ab8dd;
          }
          .player-container.other-user::before {
            content: "YOU ARE VIEWING";
            color: #fff;
            font-weight: 800;
            text-decoration: underline;
          }
        `}
      </style>
      <div className={`player-container${otherUser ? " other-user" : ""}`}>
        <h1>{user ? `${user?.name}'s picks.` : "Demo Account"}</h1>
        {!otherUser && (
          <p>
            {user?.locked_in
              ? "All GOOD To Go"
              : `Picks locked at the scheduled time of the first Sunday game`}
          </p>
        )}

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
