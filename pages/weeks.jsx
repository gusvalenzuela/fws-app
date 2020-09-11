import Head from "next/head";
import MatchupCard from "../components/Matchup/Card";
import TimeDisplay from "../components/TimeDisplay";
import PlayerDashboard from "../components/PlayerDashboard";
import React, { useState, useEffect } from "react";
import { Divider } from "semantic-ui-react";
import {
  useCurrentUser,
  getPlayerPicks,
  useUser,
  useSchedule,
} from "../lib/hooks";
import Store from "../lib/stores/FootballPool";

// import NFLSchedule from "../lib/schedules/nfl/events.json";

function Weeks() {
  const [user] = useCurrentUser();
  const [Sport, setSport] = useState(2); //2 =
  const [userPicks, setUserPicks] = useState([]);
  const [tiebreakMatch, setTiebreakMatch] = useState(false);
  const [events, setEvents] = useState([]);
  const week = Store.getState().week;
  // "State store" has selectedUser as undefined
  // on refresh "weeks" page
  const selectedUser = useUser(Store.getState().selectedUser);
  const [dbSchedule] = useSchedule(Sport, 2020);
  // const dbSchedule = NFLSchedule;
  const [playerPicks] = getPlayerPicks(
    Store.getState().selectedUser || (user && user._id)
  );

  const getWeekNumber = (date) => {
    let datetoCompare = date ? new Date(date) : new Date();
    let onejan = new Date(datetoCompare.getFullYear(), 0, 1);
    let week = Math.ceil(
      ((datetoCompare - onejan) / 86400000 + onejan.getDay() + 1) / 7
    );
    return week;
  };

  // on week, dbschedule set
  useEffect(() => {
    // // sort by event date
    dbSchedule?.events.sort(
      (a, b) => new Date(a.event_date) - new Date(b.event_date)
    );
    // filter out the desired week
    let filteredEvents = dbSchedule?.events.filter((event) => {
      // switch case to set "weekly events"
      switch (event.sport_id) {
        case 2:
          if (event.schedule?.week === week) {
            return event;
          }
          break;
        case 7:
          // sport_id = 7 is UFC
          // does not have weeks in schedule
          // if (event.schedule.event_name.includes("Fight Night")) {
          //   return event;
          // }
          if (getWeekNumber(event.event_date) === getWeekNumber() + 1) {
            return event;
          }
          break;
        default:
          break;
      }
    });
    if (filteredEvents && filteredEvents.length > 0) {
      setEvents(filteredEvents);
    }
  }, [week, dbSchedule]);

  // on events set
  useEffect(() => {
    // playerPicks default = current user
    // else selected user stored in state store
    let currentPicks = playerPicks?.filter((p) =>
      p.matchup?.week === week ? p : null
    );
    setUserPicks(currentPicks);
    // set tiebreak match to last of the week's events
    setTiebreakMatch(events[events.length - 1]);
  }, [events, playerPicks, Sport, selectedUser]);

  // console.log(`events this week ${week}`, events);

  return (
    <main id="weeks">
      <Head>
        <title>FWS | Weekly Matchups</title>
      </Head>

      <div className="main-content">
        <div className="page-header">
          <div className="week-header">
            {events?.length > 0 &&
              `${events[0].schedule.season_year} ${events[0].schedule.season_type}:`}
            <span style={{ color: "#FE9AAC" }}>{` Week ${week.toString()} (${
              events &&
              events.length > 0 &&
              (events[0].schedule?.week_detail ||
                events[0].schedule?.event_name)
            })`}</span>
            <div className="current-time-container">
              <TimeDisplay />
            </div>
          </div>
        </div>
        <div className="page-content">
          <span style={selectedUser && { background: "#777" }}>
            <PlayerDashboard
              user={selectedUser || user}
              otherUser={selectedUser ? true : false}
            />
          </span>
          {/* for each game of the week, make a header or divider and a matchup card component */}

          {events?.length > 0 &&
            events?.map((matchup, inx) => {
              // before rendering any event, it checks to see if it is the 1st time printing the event day (Mo, Tu, etc..)
              // this is for the header of each "matchup day" subsection.
              let print;
              // we print the first date in the week every time (i.e. index 0)
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
                  //  print it
                  print = true;
                }
              } else {
                // when inx = 0, print day
                print = true;
              }

              return (
                <span key={matchup.event_id}>
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
                    matchup={matchup}
                    userPicks={userPicks}
                    user={user ? true : false}
                    tiebreak={
                      tiebreakMatch?.event_id === matchup.event_id
                        ? true
                        : false
                    }
                  />
                </span>
              );
            })}
        </div>
        <div className="page-footer"></div>
      </div>
    </main>
  );
}

export default Weeks;
