import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useCurrentUser, getAllUsers } from "../lib/hooks";

const Standings = () => {
  const [dbUsers] = getAllUsers();
  const [user] = useCurrentUser();

  // useEffect(() => {
  //   console.log(dbUsers);
  // }, [dbUsers]);

  return (
    <main id="standings">
      <Head>
        <title>FWS | Standings</title>
      </Head>
      <main>
        <div className="main-content">
          <header className="page-header">
            <h1>Welcome, Player.</h1>
          </header>
          <div className="page-content">
            {dbUsers?.length > 0
              ? dbUsers.map((user) => {
                  return (
                    <div key={user._id}>
                      {/* <h3>
                        {user.name} has {user.picks.length} picks made.
                      </h3> */}
                      <h3>
                        {user.name} has made the following picks for Week {1}:
                      </h3>
                      <span>
                        {user.picks &&
                          user.picks.map((pick) => {
                            if (pick.matchup?.week !== 1) return;
                            return (
                              <span
                                key={pick.event_id}
                                style={{
                                  backgroundColor: `${
                                    pick.winning_team &&
                                    pick.winning_team === pick.selected_team
                                      ? "green"
                                      : "transparent"
                                  }`,
                                }}
                              >
                                {" "}
                                {pick.selected_team}{" "}
                              </span>
                            );
                          })}
                      </span>
                    </div>
                  );
                })
              : ""}
          </div>
          <div className="page-footer">👋</div>
        </div>
      </main>
    </main>
  );
};

export default Standings;
