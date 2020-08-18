import Head from "next/head";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import MatchupCard from "../components/MatchupCard";
import React, { useState, useEffect } from "react";
import Schedule from "../lib/local_schedule_events.json";
import { Dropdown, Divider } from "semantic-ui-react";
import { useCurrentUser } from "../lib/hooks";

function Weeks() {
  const [user] = useCurrentUser();
  const [week, setWeek] = useState(1);
  const [tiebreaker, setTiebreaker] = useState(1);
  const [userPicks, setUserPicks] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  // sort by event date
  Schedule.events.sort(
    (a, b) => new Date(a.event_date) - new Date(b.event_date)
  );

  var events = Schedule.events.filter((i) =>
    i.schedule && i.schedule.week === week ? i : null
  );

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

  const handleTiebreakerSubmit = async () => {
    // append this tiebreaker to
    // event_id of matchup (i.e. MNF)
    let tiePick = {
      event_id: "something",
      tiebreaker: tiebreaker,
    };
    const res = await fetch("/api/picks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tiePick),
    });

    if (res.status === 200) {
      await res.json();
      // setMsg({ message: "Pick updated" });
    } else {
      // setMsg({ message: await res.text(), isError: true });
    }
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
    // grab all divs with class "team-container"
    let teams = document.querySelectorAll(`.team-container`);
    // cycle through and remove "team-selected" class
    // we be reapplied when userPicks are redownloaded
    teams.forEach((team) => {
      team.classList.remove("team-selected");
    });
    // triggers a re-render when a "pick" is made
    // setupdating is sent to each MatchupCard 
    if (!isUpdating) {
      getUserPicks();
    }
  }, [week, isUpdating]);

  useEffect(() => {
    // add bounce delay
    handleTiebreakerSubmit();
  }, [tiebreaker]);

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
            // before rendering any event, it checks to see if it is the 1st time printing the event day (Mo, Tu, etc..)
            // this is for the header of each "matchup day" subsection
            let print;
            // we print the first date in the week every time
            if (inx > 0) {
              // check if the previous day of the week in the mapping is the same as current
              if (
                new Date(events[inx - 1].event_date).getDay() ===
                new Date(matchup.event_date).getDay()
              ) {
                // if it is the same day as the previous
                // do not print, by setting print to false
                print = false;
              } else {
                // else print it
                print = true;
              }
            } else {
              // when inx = 0, print day
              print = true;
            }

            return (
              <>
                {!print ? (
                  ""
                ) : (
                  <h1 key={inx}>
                    {new Date(matchup.event_date).toDateString()}
                  </h1>
                )}

                <MatchupCard
                  key={matchup.event_id}
                  matchup={matchup}
                  isUpdating={isUpdating}
                  setIsUpdating={setIsUpdating}
                  // mdScreen={viewportMin.matches}
                />
              </>
            );
          })}
        </div>
        <div className="page-footer">
          <p>(D) = Divisional matchup</p>
          <div>
            <b>Your Tiebreaker</b>
            <Dropdown
              // placeholder="Select a week"
              selection
              options={tiebreakerOptions()}
              onChange={(e, { value }) => setTiebreaker(value)}
              text={tiebreaker.toString()}
              labeled
            />
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
