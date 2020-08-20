import React, { useState, useEffect } from "react";
import { Grid, Segment, Icon } from "semantic-ui-react";
import Style from "./MatchupCard.module.css";

const MatchupCard = ({ matchup, userPicks, getUserPicks }) => {
  const [msg, setMsg] = useState({ message: "", isError: false });
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleTeamSelection = async (event) => {
    // event.preventDefault();
    if (isUpdating) return;
    setIsUpdating(true);

    let pick = {
      event_id: matchup.event_id,
      team_selected: event.currentTarget.dataset.team,
    };
    const res = await fetch("/api/picks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pick),
    });

    setIsUpdating(false);
    if (res.status === 200) {
      await res.json();
      getUserPicks();
      setMsg({ message: "Picks updated" });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
  };

  useEffect(() => {
    userPicks.filter(
      (p) => p.event_id === matchup.event_id && setSelectedTeam(p.team_selected)
    );
  }, [userPicks]);

  useEffect(() => {
    getUserPicks();
  }, []);

  return (
    <div className={Style.matchupContainer}>
      {/* away team */}
      <Segment>
        <Grid columns={3}>
          <>
            {matchup.teams_normalized.map((team, index) => (
              <>
                <Grid.Column
                  key={team.abbreviation}
                  onClick={handleTeamSelection}
                  className={`${Style.teamContainer} team-container ${
                    selectedTeam === team.abbreviation ? "picked" : ""
                  }`}
                  verticalAlign="middle"
                  data-team={team.abbreviation}
                  data-event={matchup.event_id}
                  id={team.abbreviation}
                  width="6"
                  stretched
                >
                  <img
                    src={`/images/teamlogos/${team.abbreviation}.png`}
                    alt={`${team.abbreviation}'s team logo`}
                    id="team-logo-img"
                  />
                  <h3>
                    {matchup.teams
                      ? `${team.name} ${team.mascot}`
                      : "Team Name"}
                  </h3>
                  <br />
                  <p
                    style={{
                      margin: 0,
                      marginTop: "-20px",
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
                      width="4"
                      textAlign="center"
                      className="matchup-divider"
                      verticalAlign="middle"
                    >
                      <Icon size="huge" name="at" />
                      <p style={{ marginTop: ".5rem", fontSize: "1.12rem" }}>
                        {new Intl.DateTimeFormat("default", {
                          month: "numeric",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          timeZoneName: "short",
                          // dayPeriod: "short",
                        }).format(new Date(matchup.event_date))}
                      </p>
                      <p style={{ marginTop: "1.5rem" }}>{selectedTeam ? selectedTeam === team.abbreviation ? `◀ ${selectedTeam}` : `${selectedTeam} ▶` : "You haven't picked yet!"}</p>
                      <p>{}</p>
                      {/* <p>Weather: </p> */}
                    </Grid.Column>
                  ) : (
                    ""
                  )
                }
              </>
            ))}
          </>
        </Grid>
      </Segment>
    </div>
  );
};

export default MatchupCard;
