import React, { useState, useEffect } from "react";
import Head from "next/head";
import SortableTable from "../components/SortableTable";
import { Dropdown, Divider } from "semantic-ui-react";
import { getAllUsers } from "../lib/hooks";
import UserContext from "../utils/UserContext";

const InfoPage = () => {
  const [standingsToView, setStandingsToView] = useState("weekly");
  const [users] = getAllUsers();
  const standingsDropdownContent = (
    <>
      <span>Weekly Standings</span>
      <br />
      <span>Week 1</span>
    </>
  );
  const standingsOptions = [
    { key: "w", text: "weekly", value: "weekly" },
    { key: "y", text: "yearly", value: "yearly" },
    // { key: "a", text: "all-time", value: "a" },
  ];
  const weeklyOptions = () => {
    // because the weeks here are iterable numerically (1-17)
    // it's easier to make a function that creates the dropdown options needed
    var max = 17;
    var min = 1;

    var optionsArray = [];
    for (let i = min; i < max + 1; i++) {
      optionsArray.push({
        key: i,
        text: i,
        value: i,
      });
    }
    return optionsArray;
  };
  const seasonOptions = [
    { key: "w", text: "weekly", value: "weekly" },
    { key: "y", text: "yearly", value: "yearly" },
    // { key: "a", text: "all-time", value: "a" },
  ];

  useEffect(() => {
    console.log(users);
  }, [users]);

  return (
    <UserContext.Provider value={{ users }}>
      <main id="info">
        <Head>
          <title>FWS | Information</title>
        </Head>
        <div className="main-content">
          <header className="page-header">
            <span>
              <Dropdown
                upward
                floating
                inline
                onChange={(e, { value }) => setStandingsToView(value)}
                options={standingsOptions}
                trigger={standingsDropdownContent}
                defaultValue="weekly"
              />{" "}
            </span>
          </header>
          <div className="page-content">
            <h2>🚧Page is under construction👷‍♂️</h2>
            <div style={{ background: "purple", height: "20vh" }}>
              <SortableTable />
            </div>
          </div>
          <div className="page-footer">ℹ Page</div>
        </div>
      </main>
    </UserContext.Provider>
  );
};

export default InfoPage;
