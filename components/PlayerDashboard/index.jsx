import React from "react";

const PlayerDashboard = ({ user, msg, otherUser, allPicked }) => {
  return (
    <>
      <style jsx>
        {`
          .player-container {
            max-width: 800px;
            margin: auto;
            height: fit-content;
            padding: 1.5rem;
            background-color: #243EC2;
          }
          .player-container.picked {
            background-color: #ddf5d1;
          }
          .player-container h1 {
            text-align: left;
          }
          .player-container p.all-picked {
            text-align: left;
            font-weight: 900;
            color: #135813;
          }
          .player-container p.picks-remaining {
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
      <div
        className={`player-container ${otherUser ? "other-user" : ""} ${
          allPicked ? "picked" : ""
        }`}
      >
        <h1 style={{ color: `${allPicked ? "#000" : "#fff"}` }}>
          {user && otherUser
            ? `${user.name}'s picks.`
            : user
            ? "Your picks."
            : "Demo Account"}
        </h1>
        {!otherUser && (
          <>
            {
              // find count of all selected teams on screen (i.e. picks made)
              allPicked ? (
                <p className="all-picked">
                  All this week's matchups have been selected. 
                </p>
              ) : (
                <p className="picks-remaining">
                  Picks locked at the scheduled time of the first Sunday game
                </p>
              )
            }

            {/* // user?.locked_in
            //   ? "All GOOD To Go"
            //   : `Picks locked at the scheduled time of the first Sunday game` */}
          </>
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
