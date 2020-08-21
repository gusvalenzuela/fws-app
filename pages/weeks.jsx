import Head from "next/head";
import Footer from "../components/Footer";
import MatchupCard from "../components/MatchupCard";
import TimeDisplay from "../components/TimeDisplay";
import PlayerDashboard from "../components/PlayerDashboard";
import React, { useState, useEffect } from "react";
import Schedule from "../lib/local_schedule_events.json";
import { Dropdown, Divider } from "semantic-ui-react";
import { useCurrentUser } from "../lib/hooks";

function Weeks() {
  const [user] = useCurrentUser();
  const [curTime, setCurTime] = useState(new Date(Date.now()));
  const [userPicks, setUserPicks] = useState([]);
  const [events, setEvents] = useState(null);
  const [week, setWeek] = useState(1);
  const [tiebreaker, setTiebreaker] = useState(0);
  const [tiebreakerMatchup, setTiebreakerMatchup] = useState(null);

  // on mount
  useEffect(() => {
    // sort by event date
    Schedule.events.sort(
      (a, b) => new Date(a.event_date) - new Date(b.event_date)
    );

    // update current time every second
    setInterval(() => {
      setCurTime(new Date(Date.now()));
    }, 1000);
  }, []);

  // on week set
  useEffect(() => {
    // filter out the desired week
    let filteredEvents = Schedule.events.filter((i) =>
      i.schedule && i.schedule.week === week ? i : null
    );
    setEvents(filteredEvents);
    setTiebreakerMatchup(filteredEvents[filteredEvents.length - 1]);
  }, [week]);

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
      event_id: tiebreakerMatchup && tiebreakerMatchup.event_id,
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
      const { picks } = await res.json();
      setUserPicks(picks);
    } else {
      console.log(`something went wrong`);
    }
  }

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
      <div className="main-content">
        <div className="page-header">
          <h1>
            <TimeDisplay dt={curTime} />
          </h1>
          <div className="week-header">
            <Dropdown
              // placeholder="Select a week"
              // header="Select a week"
              selection
              options={weeksOptions()}
              onChange={(e, data) => setWeek(data.value)}
              text={`Week ${week.toString()} (${
                events && events[0].schedule?.week_detail
              })`}
              labeled
              className="week-dropdown"
              compact
            />{" "}
            {events &&
              events.length > 0 &&
              ` - ${events[0].schedule.season_year} ${events[0].schedule.season_type} `}
          </div>
        </div>
        <div className="page-content">
          <PlayerDashboard user={user} />
          {/* for each game of the week, make a matchup card component */}
          {events &&
            events.length > 0 &&
            events.map((matchup, inx) => {
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
                    <Divider
                      // content={matchup.schedule?.event_name}
                      className="container-divider"
                    />
                  ) : (
                    <h1 className="matchup-day-header" key={inx}>
                      {new Date(matchup.event_date).toDateString()}
                    </h1>
                  )}

                  <MatchupCard
                    key={matchup.event_id}
                    matchup={matchup}
                    userPicks={userPicks}
                    getUserPicks={getUserPicks}
                    // mdScreen={viewportMin.matches}
                  />
                </>
              );
            })}
        </div>
        <div className="page-footer">
          <p>(D) = Divisional matchup</p>
          <div>
            <b>Your Tiebreaker: </b>
            <Dropdown
              // placeholder="Select a week"
              selection
              options={tiebreakerOptions()}
              onChange={(e, { value }) => setTiebreaker(value)}
              text={tiebreaker.toString()}
              compact
              labeled
            />{" "}
            (
            {tiebreakerMatchup &&
              `Total points scored in ${tiebreakerMatchup.teams_normalized[0].abbreviation} vs. ${tiebreakerMatchup.teams_normalized[1].abbreviation} game`}
            )
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
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default Weeks;
