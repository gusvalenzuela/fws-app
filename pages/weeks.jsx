import Head from "next/head";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import MatchupCard from "../components/MatchupCard";
import React, { useState, useEffect } from "react";
import Schedule from "../lib/local_schedule_events.json";
import { Dropdown, Divider } from "semantic-ui-react";
import { useCurrentUser } from "../lib/hooks";

function Weeks() {
  const [week, setWeek] = useState(5);
  const [user] = useCurrentUser();
  const [userPicks, setUserPicks] = useState([]);

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
    for (let i = 1; i < max + 1; i++) {
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

    for (let i = 1; i < max + 1; i++) {
      optionsArray.push({
        key: i,
        text: i,
        value: i,
        // image: { avatar: true, src: "/images/avatar/small/matt.jpg" },
      });
    }
    return optionsArray;
  };

  async function getUserPicks() {
    const res = await fetch("/api/picks", {
      method: "GET",
    });
    if (res.status === 200) {
      const response = await res.json();
      setUserPicks(response.picks);
    } else {
      console.log(`something went wrong`);
    }
  }

  useEffect(() => {
    if (userPicks && userPicks.length > 0) {
      // updating the visuals for the current user's picks
      // picks fetched from db
      userPicks.map((pick) => {
        let element = document.getElementById(`${pick.team_selected}`);
        // confirming it's the same event
        if (element && element.dataset.event === pick.event_id) {
          element.classList.toggle("team-selected");
        }
      });
    }
  }, [userPicks]);

  useEffect(() => {
    let teams = document.querySelectorAll(`.team-container`);
    teams.forEach((team) => {
      team.classList.remove("team-selected");
    });
    getUserPicks();
  }, [week]);

  // console.log(`events this week ${week}`, events);

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
            selection
            options={weeksOptions()}
            onChange={(e, data) => setWeek(data.value)}
            text={`Week ${week.toString()}`}
            labeled
          />
        </div>
        <div className="page-content">
          <h1 className="week-header">Week {week}!</h1>
          <Divider />
          {/* for each game of the week, make a matchup card component */}
          {events.map((matchup, inx) => {
            return (
              <MatchupCard
                key={inx}
                matchup={matchup}
                // mdScreen={viewportMin.matches}
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
