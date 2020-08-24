import Head from "next/head";
import MatchupCard from "../components/MatchupCard";
import TimeDisplay from "../components/TimeDisplay";
import PlayerDashboard from "../components/PlayerDashboard";
import Tiebreaker from "../components/Tiebreaker";
import React, { useState, useEffect } from "react";
import Schedule from "../lib/local_schedule_events.json";
import { Dropdown, Divider } from "semantic-ui-react";
import { useCurrentUser, getPlayerPicks } from "../lib/hooks";
// import Store from "../lib/pick-store";

function Weeks() {
  const [playerPicks] = getPlayerPicks();
  const [user] = useCurrentUser();
  const [curTime, setCurTime] = useState(new Date(Date.now()));
  const [userPicks, setUserPicks] = useState([]);
  const [lockedInMsg, setLockedInMsg] = useState("");
  const [tiebreakMatch, setTiebreakMatch] = useState(false);
  const [events, setEvents] = useState([]);
  const [week, setWeek] = useState(1);

  // on mount
  useEffect(() => {
    clearInterval(timer);
    // update current time every second
    const timer = setInterval(() => {
      setCurTime(new Date(Date.now()));
    }, 1000);
    // sort by event date
    Schedule.events.sort(
      (a, b) => new Date(a.event_date) - new Date(b.event_date)
    );
    
  }, []);

  // on week set
  useEffect(() => {
    // filter out the desired week
    let filteredEvents = Schedule.events.filter((i) =>
      i.schedule && i.schedule.week === week ? i : null
    );
    setEvents(filteredEvents);
  }, [week]);

  // on events set
  useEffect(() => {
    let currentPicks = playerPicks?.filter((p) =>
      p.matchup?.week === week ? p : null
    );
    setUserPicks(currentPicks);
    // set tiebreak match to last of the week's events
    setTiebreakMatch(events[events.length - 1]);
  }, [events, playerPicks, week]);

  // if (events?.length - newPicks?.length <= 3) {
  //   setLockedInMsg(
  //     `You've only ${
  //       events.length - newPicks.length
  //     } matchups left to choose from this week.`
  //   );
  // } else if (events?.length && newPicks?.length) {
  //   setLockedInMsg(
  //     `You've picked in ${newPicks.length}/${events.length} of the matchups this week.`
  //   );
  // }

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

  // console.log(`events this week ${week}`, events);

  return (
    <main id="weeks">
      <Head>
        <title>FWS | Weekly Matchups</title>
      </Head>
      <div className="main-content">
        <div className="page-header">
          <h3>
            <TimeDisplay dt={curTime} />
          </h3>
          <div className="week-header">
            {events?.length > 0 &&
              `${events[0].schedule.season_year} ${events[0].schedule.season_type}:`}{" "}
            <Dropdown
              className="week-dropdown"
              closeOnChange
              compact
              selection
              lazyLoad
              options={weeksOptions()}
              onChange={(e, { value }) => setWeek(value)}
              text={`Week ${week.toString()} (${
                events && events.length > 0 && events[0].schedule?.week_detail
              })`}
              labeled
            />
          </div>
        </div>
        <div className="page-content">
          <PlayerDashboard user={user} />
          {/* for each game of the week, make a matchup card component */}
          {events?.length > 0 &&
            events?.map((matchup, inx) => {
              // before rendering any event, it checks to see if it is the 1st time printing the event day (Mo, Tu, etc..)
              // this is for the header of each "matchup day" subsection.
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
                    key={matchup?.event_id}
                    matchup={matchup}
                    userPicks={userPicks}
                    user={user}
                    Tiebreaker={
                      tiebreakMatch?.event_id === matchup.event_id
                        ? Tiebreaker
                        : false
                    }
                  />
                </>
              );
            })}
        </div>
        <div className="page-footer"></div>
      </div>
    </main>
  );
}

export default Weeks;
