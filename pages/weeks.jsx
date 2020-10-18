import Head from "next/head";
import MatchupCard from "../components/Matchup/Card";
import TimeDisplay from "../components/TimeDisplay";
import PlayerDashboard from "../components/PlayerDashboard";
import React, { useState, useEffect } from "react";
import { Divider, Loader, Dimmer, Dropdown, Header } from "semantic-ui-react";
import {
  useCurrentUser,
  getPlayerPicks,
  useUser,
  useTeams,
  useSchedule,
} from "../lib/hooks";
import Store from "../lib/stores/FootballPool";
import { generateNumbersArray } from "../lib/utils";
import { Image, Transformation, CloudinaryContext } from "cloudinary-react";

function Weeks() {
  const [user] = useCurrentUser();
  const [Sport] = useState(2); // 2 = NFL, 7 = UFC
  const [nflTeams] = useTeams(2, 2020); // args = (sport_id, season_year)
  const [dbSchedule] = useSchedule(2, 2020); // args = (sport_id, season_year)
  const [userPicks, setUserPicks] = useState([]);
  const [teamsOnBye, setTeamsOnBye] = useState([]);
  const [tiebreakMatch, setTiebreakMatch] = useState(false);
  const [events, setEvents] = useState([]);
  const [lockDate, setLockDate] = useState(undefined);
  const [allPicked, setAllPicked] = useState(false);
  // const dbSchedule = Store((s) => s.schedule_alt);
  const week = Store((s) => s.week) || Store.getState().currentWeek; // Store.week initializes as undefined
  const selectedUserId = Store((s) => s.selectedUser); // "Store" selectedUser = undefined ? user will be used instead (used when clicking "Home" for example)
  const selectedUser = useUser(!selectedUserId ? user?._id : selectedUserId);
  const [playerPicks] = getPlayerPicks(selectedUserId || user?._id);

  // load schedule into global store when received from db
  useEffect(() => {}, [dbSchedule]);

  // on week, dbschedule set
  useEffect(() => {
    if (!dbSchedule && !week) return;

    var scheduledTeams = [];
    var sunday;
    // filter out the desired week
    let filteredEvents = dbSchedule?.events.filter((event) => {
      // switch case to set "weekly events"
      switch (event.sport_id) {
        case 2:
          if (event.week === week && event.home_team_id < 100) {
            // push teams that are scheduled for the chosen week into an array
            scheduledTeams.push(event.home_team_id, event.away_team_id);
            // find the first sunday
            if (!sunday && new Date(event.event_date).getDay() === 0) {
              sunday = Date.parse(event.event_date);
            }
            return event;
          }
          break;
        default:
          break;
      }
    });

    if (filteredEvents && filteredEvents.length > 0 && nflTeams) {
      // sort by event date
      filteredEvents.sort(
        (a, b) => new Date(a.event_date) - new Date(b.event_date)
      );
      // find teams on bye
      // when team is NOT in the scheduledteams list put together during week filtering
      const byeteams = nflTeams.filter(
        (team) => !scheduledTeams.includes(team.team_id)
      );
      setTeamsOnBye(byeteams);

      // when a sunday has been found
      // set as lockdate
      if (sunday) {
        setLockDate(sunday);
      }

      setEvents(filteredEvents);
    }
  }, [week, dbSchedule, nflTeams]);

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

  // on userpicks set
  useEffect(() => {
    if (userPicks?.length > 0 && userPicks?.length === events?.length) {
      setAllPicked(true);
    } else {
      setAllPicked(false);
    }
  }, [userPicks, events]);

  // console.log(`events this week ${week}`, events);

  return (
    <main id="weeks">
      <Head>
        <title>FWS | Weekly Matchups</title>
      </Head>

      <div className="main-content">
        {events && events?.length > 0 ? (
          <>
            <div className="page-header week-header">
              <TimeDisplay />
              <br />
              {
                // "2020 Regular Season"
                events?.length > 0 &&
                  `${
                    events[0].season_year || events[0].schedule?.season_year
                  } ${
                    events[0].season_type || events[0].schedule?.season_type
                  }: `
              }
              {
                // "Week 2" [Dropdown]

                <Dropdown
                  className="week-dropdown"
                  onChange={(e, { value }) => Store.setState({ week: value })}
                  options={generateNumbersArray(1, 17).map(
                    (num) =>
                      (num = { key: num, value: num, text: `Week ${num}` })
                  )}
                  value={week}
                  text={`Week ${week?.toString()}`}
                  inline
                />
              }
              {
                // "(Sep 16-22)"
                `(${events?.length > 0 && events[0].week_detail})`
              }
            </div>
            <div className="page-content">
              <span style={selectedUser && { background: "#777" }}>
                <PlayerDashboard
                  lockDate={lockDate}
                  allPicked={allPicked}
                  user={selectedUser || user}
                  otherUser={
                    selectedUser?._id === user?._id ? false : selectedUser
                  }
                />
              </span>

              {
                /* 
          for each game of the week, make a header or divider and a matchup card component 
          Caveat: -- only displays other user's if Date now is after the lockdate (i.e. after first Sunday Game)
          */
                // if selected user is same as current user display all picks
                // or it's past the first Sunday game of the week (picks are locked date)
                // render the matchups and the corresponding user's picks
                user?._id === selectedUser?._id || Date.now() >= lockDate ? (
                  events.map((matchup, inx) => {
                    let print;
                    // before rendering any event, it checks to see if it is the 1st time printing the event day (Mo, Tu, etc..)
                    // this is for the header of each "matchup day" subsection.
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
                          lockDate={lockDate}
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
                  })
                ) : selectedUser && Date.now() < lockDate ? (
                  <>
                    <p
                      style={{
                        textAlign: "justify",
                        padding: "1rem",
                        maxWidth: "800px",
                        margin: "auto",
                      }}
                    >
                      <b>Note:</b> Other users' picks are not viewable until
                      after the start of the first Sunday game.
                    </p>
                  </>
                ) : null
              }
            </div>
            <div className="page-footer">
              {teamsOnBye?.length > 0 && (
                <Divider horizontal>
                  <Header as="h4">Teams on Bye</Header>
                </Divider>
              )}
              {
                // from the complete list of nflTeams
                // if the team is not included in the currently scheduled teams (depending on week being viewed)
                // add it to display of "bye-week" teams
                teamsOnBye?.map((team) => (
                  /* team logo / image  */
                  <CloudinaryContext
                    key={`bye-${team.abbreviation}`}
                    cloudName="fwscloud"
                    style={{ display: "inline", margin: ".5rem 1rem" }}
                  >
                    {/* hosting the images on cloudinary */}
                    <Image
                      publicId={`NFL-Team_logos/${
                        team.abbreviation || "nfl"
                      }.png`}
                      alt={`${team.abbreviation}'s team logo`}
                      id="team-logo-img"
                    >
                      <Transformation width="42" height="42" crop="thumb" />
                      <Transformation
                        overlay={{
                          fontFamily: "Times",
                          fontSize: 20,
                          text: `${team.mascot}`,
                        }}
                        y="30"
                      />
                    </Image>
                  </CloudinaryContext>
                ))
              }
            </div>
          </>
        ) : (
          <Dimmer inverted active>
            <Loader size="large">Loading matchups.</Loader>
          </Dimmer>
        )}
      </div>
    </main>
  );
}

export default Weeks;
