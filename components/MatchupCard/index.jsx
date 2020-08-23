import React, { useState, useEffect } from "react";
import { Grid, Segment, Icon } from "semantic-ui-react";
import Style from "./MatchupCard.module.css";

const MatchupCard = ({ matchup, userPicks, user }) => {
  const [msg, setMsg] = useState({ message: null, isError: false });
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  // on mount
  useEffect(() => {
    // look for (filter) the event_id in the user's picks
    // if found, set the selected team
    userPicks?.filter((p) =>
      p.event_id === matchup.event_id ? setSelectedTeam(p.selected_team) : null
    );
  }, [userPicks]);

  const handleTeamSelection = async (event) => {
    // if any message is used whilst team picking, clear it after 2 secs
    setTimeout(() => {
      setMsg({ ...msg, message: null });
    }, 2000);
    // event.preventDefault();
    if (isUpdating) return;
    // if no signed in user, display message about logging in
    if (!user) return setMsg({ ...msg, message: "Login to make your pick!" });
    setIsUpdating(true);

    let pick = {
      event_id: matchup.event_id,
      event_date: matchup.event_date,
      selected_team: event.currentTarget.dataset.team,
      matchup: { ...matchup.schedule, teams: matchup.teams_normalized },
    };
    const res = await fetch("/api/picks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pick),
    });

    setIsUpdating(false);
    if (res.status === 200) {
      const pick = await res.json();
      console.log(pick)
      // PATCH /api/picks returns the updated pick
      setSelectedTeam(pick.selected_team);
      setMsg({ message: `Pick updated to ${pick.selected_team}` });
    } else {
      setMsg({
        message: (await res.text()).toUpperCase(),
        isError: true,
      });
    }
  };

  // console.log(matchup)
  return (
    <div className={Style.matchupContainer}>
      {/* msg received after updating pick to db */}
      {msg.message ? (
        <p
          style={{
            color: "red",
            fontSize: "large",
            fontWeight: "700",
            margin: ".5rem 0 .25rem",
            padding: "0",
          }}
        >
          {msg.message}
        </p>
      ) : null}
      <Segment>
        <Grid key={matchup.schedule.event_name} columns="equal">
          {matchup.teams_normalized.map((team, index) => (
            <>
              <Grid.Column
                color={selectedTeam === team.abbreviation ? "black" : null}
                key={team.abbreviation}
                onClick={handleTeamSelection}
                className={`${Style.teamContainer} team-container ${
                  selectedTeam === team.abbreviation ? "picked" : ""
                }`}
                verticalAlign="middle"
                data-team={team.abbreviation}
                data-event={matchup.event_id}
                id={team.abbreviation}
                // width="6"
                stretched
              >
                <img
                  src={`/images/teamlogos/${team.abbreviation}.png`}
                  alt={`${team.abbreviation}'s team logo`}
                  id="team-logo-img"
                />
                <h3>
                  {matchup.teams ? `${team.name} ${team.mascot}` : "Team Name"}
                </h3>
                <br />
                <p
                  style={{
                    margin: 0,
                    marginTop: "-20px",
                    marginBottom: "20px",
                    fontSize: "2rem",
                    color: "red",
                    fontWeight: "800",
                  }}
                >
                  {
                    // if point spread is negative display
                    // & only if current rendered team is also fav
                    team.is_home &&
                    matchup.lines[2].spread.point_spread_home < 0 ? (
                      matchup.lines[2].spread.point_spread_home
                    ) : (team.is_away &&
                        matchup.lines[2].spread.point_spread_away) < 0 ? (
                      matchup.lines[2].spread.point_spread_away
                    ) : (
                      <span style={{ visibility: "hidden" }}>underdog</span>
                    )
                  }
                </p>
              </Grid.Column>
              {
                // this makes the middle "third column" only on the first iteration of "teams"
                index === 0 ? (
                  <Grid.Column
                    key={"versus"}
                    width="3"
                    textAlign="center"
                    className="matchup-divider"
                    verticalAlign="middle"
                  >
                    <Icon name="at" />
                    <div style={{ fontSize: "1.12rem" }}>
                      {/* separating into multiple lines */}
                      {/* Date */}
                      <p>
                        {new Intl.DateTimeFormat("default", {
                          // year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          // dayPeriod: "short",
                        }).format(new Date(matchup.event_date))}
                      </p>
                      {/* <br /> */}
                      {/* Time */}
                      <p>
                        {new Intl.DateTimeFormat("default", {
                          hour: "numeric",
                          minute: "2-digit",
                          timeZoneName: "short",
                          // dayPeriod: "short",
                        }).format(new Date(matchup.event_date))}
                      </p>
                    </div>
                    <p style={{ marginTop: "1.5rem" }}>
                      {selectedTeam
                        ? selectedTeam === team.abbreviation
                          ? `◀ ${selectedTeam}  `
                          : `  ${selectedTeam} ▶`
                        : "◀ Pick ▶"}
                    </p>
                    <p>{}</p>
                    {/* <p>Weather: </p> */}
                  </Grid.Column>
                ) : (
                  ""
                )
              }
            </>
          ))}
        </Grid>
      </Segment>
    </div>
  );
};

export default MatchupCard;
