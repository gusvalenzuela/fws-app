import Head from "next/head";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import MatchupCard from "../components/MatchupCard";
import React, { useState, useEffect } from "react";
import Schedule from "../local_schedule_events.json";
import { Dropdown } from "semantic-ui-react";

function Weeks() {
  const [week, setWeek] = useState(1);

  var events = Schedule.events.filter((i) =>
    i.schedule && i.schedule.week === week ? i : null
  );

  // const datesSorted = [...events.map((i) => i.event_date)].sort();

  // events.forEach((i) => {
  //   let tsh = new Date(Date.UTC(i.event_date));
  //   console.log(tsh.getDate());
  // });
  const weeksOptions = () => {
    // because the weeks here are iterable numerically (1-17)
    // it's easier to make a function that creates the dropdown options needed
    var max = 17;
    var optionsArray = [];
    for (let i = 1; i < max; i++) {
      optionsArray.push({
        key: i,
        text: i,
        value: i,
        // image: { avatar: true, src: "/images/avatar/small/matt.jpg" },
      });
    }
    return optionsArray;
  };
  const tiebreakerOptions = () => {
    // function that creates the dropdown options needed for tiebreaker
    // min 1 (declared in i), max 192 (declared in max)
    var max = 192;
    var optionsArray = [];

    for (let i = 1; i < max; i++) {
      optionsArray.push({
        key: i,
        text: i,
        value: i,
        // image: { avatar: true, src: "/images/avatar/small/matt.jpg" },
      });
    }
    return optionsArray;
  };

  // useEffect(() => {
  //   console.log(variable);
  // }, [variable]);

  console.log(`events this week ${week}`, events);

  const handleTeamSelection = (evt) => {
    let childEl = evt.currentTarget.children[0];
    if (childEl.className === "selected") {
      evt.currentTarget.children[0].className = "";
    } else {
      evt.currentTarget.children[0].className = "selected";
    }
    console.log(evt.target.className);
  };
  return (
    <main id="weeks">
      <Head>
        <title>FWS | Weekly Matchups</title>
      </Head>
      <Nav />
      <div className="main-content">
        <div className="page-header">
          <h1>Today is: Friday, October 21st, 2049 7:55PM</h1>
          <Dropdown
            // placeholder="Select a week"
            fluid
            selection
            options={weeksOptions()}
            onChange={(e, data) => setWeek(data.value)}
            text={`Week ${week.toString()}`}
            labeled
            icon="search"
          />
        </div>
        <div className="page-content">
          {/* for each game of the week, make a matchup card component */}
          {events.map((matchup) => {
            return (
              <MatchupCard
                key={matchup.event_id}
                matchup={matchup}
                handleTeamSelection={handleTeamSelection}
              />
            );
          })}
        </div>
        <div className="page-footer">
          <p>(D) = Divisional matchup</p>
          <div>
            <b>Your Tiebreaker</b>
            <select></select>
            <span
              style={{
                display: `${
                  "check if MNF || tiebreaker game is finished"
                    ? "none"
                    : "none"
                }`,
              }}
            >
              Actual Tiebreaker{`tiebreakerscore`}
            </span>
            <br />
            (Total points scored in {`tiebreaker matchup`} game)
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default Weeks;
