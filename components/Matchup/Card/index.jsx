import React, { useState, useEffect } from "react";
import { Grid, Segment } from "semantic-ui-react";
import MatchupDivider from "../Divider";
import Style from "./Card.module.css";

const MatchupCard = ({ matchup, userPicks, user, Tiebreaker }) => {
  const [msg, setMsg] = useState({ message: null, isError: false });
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [sport, setSport] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // on mount
  useEffect(() => {
    setSport(matchup.sport_id);
    //  look in the user's picks
    for (let i = 0; i < userPicks?.length; i++) {
      const pick = userPicks[i];
      if (pick.event_id === matchup.event_id) {
        setSelectedTeam(pick.selected_team);
        return;
      }
    }
  }, [userPicks, matchup]);

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
          {/* render for each team  */}
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
                  src={`/images/teamlogos/${
                    sport === 2 ? team.abbreviation : "ufc-fighter"
                  }.png`}
                  alt={`${team.abbreviation}'s team logo`}
                  id="team-logo-img"
                />
                <h3>
                  {matchup.teams ? `${team.name} ${team.mascot}` : "Team Name"}
                </h3>
                <br />
                {sport === 7 ? (
                  <>
                    <p
                      style={{
                        margin: 0,
                        marginTop: "-15px",
                        marginBottom: "15px",
                        fontWeight: "400",
                      }}
                    >
                      {team.record || "0-0-0"}
                    </p>
                    <br />
                  </>
                ) : (
                  <p
                    style={{
                      margin: 0,
                      marginTop: "-15px",
                      marginBottom: "15px",
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
                )}
              </Grid.Column>
              {
                // this makes the middle "third column"
                // by rendering only on the first iteration of "teams"
                index === 0 ? (
                  // this divider has slight changes
                  // varied on the sport type (i.e. american football vs mma)
                  <MatchupDivider
                    selectedTeam={selectedTeam}
                    matchup={matchup}
                    sport={sport}
                  />
                ) : (
                  ""
                )
              }
            </>
          ))}
        </Grid>
      </Segment>
      {Tiebreaker && (
        <Tiebreaker
          event_id={matchup.event_id}
          hometeam={matchup.teams_normalized[0]}
          awayteam={matchup.teams_normalized[1]}
        />
      )}
    </div>
  );
};

export default MatchupCard;
