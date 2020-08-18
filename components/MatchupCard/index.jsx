import React, { useState } from "react";
import { Grid, Segment, Icon } from "semantic-ui-react";

const MatchupCard = ({ matchup }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [msg, setMsg] = useState({ message: "", isError: false });
  const handleTeamSelection = async (event) => {
    event.preventDefault();
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
      setMsg({ message: "Picks updated" });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
  };

  // useEffect(() => {
  // }, []);

  return (
    <div className="matchup-container">
      {/* away team */}
      <Segment style={{ position: "relative", minHeight: "100%" }} placeholder>
        <Grid columns={3} stackable>
          <>
            {matchup.teams_normalized.map((team, index) => (
              <>
                <Grid.Column
                  // key={team.abbreviation}
                  onClick={handleTeamSelection}
                  className="team-container"
                  verticalAlign="middle"
                  data-team={team.abbreviation}
                  data-event={matchup.event_id}
                  id={team.abbreviation}
                  width="7"
                >
                  <img
                    src={`/images/teamlogos/${team.abbreviation}.png`}
                    alt={`${team.abbreviation}'s team logo`}
                    id="team-logo-img"
                  />
                  <h2 style={{ margin: 0, marginTop: "-10px" }}>
                    {matchup.teams
                      ? `${team.name} ${team.mascot}`
                      : "Team Name"}
                  </h2>
                  <br />
                  {
                    // if point spread is negative display
                    // & only if current rendered team is also fav
                    team.is_home &&
                    matchup.lines[2].spread.point_spread_home < 0 ? (
                      <p
                        style={{
                          margin: 0,
                          marginTop: "-20px",
                          fontSize: "2rem",
                          color: "red",
                          fontWeight: "800",
                        }}
                      >
                        {matchup.lines[2].spread.point_spread_home}
                      </p>
                    ) : (team.is_away &&
                        matchup.lines[2].spread.point_spread_away) < 0 ? (
                      <p
                        style={{
                          margin: 0,
                          marginTop: "-20px",
                          fontSize: "2rem",
                          color: "red",
                          fontWeight: "800",
                        }}
                      >
                        {matchup.lines[2].spread.point_spread_away}
                      </p>
                    ) : (
                      <p style={{ visibility: "hidden" }}>underdog</p>
                    )
                  }
                </Grid.Column>
                {
                  // this makes the middle "third column" only on the first iteration of "teams"
                  index === 0 ? (
                    <Grid.Column
                      width="2"
                      textAlign="center"
                      className="matchup-divider"
                      verticalAlign="middle"
                    >
                      <Icon size="huge" name="at" />
                      <p style={{ marginTop: ".5rem", fontSize: "1.2rem" }}>
                        {new Date(matchup.event_date).toLocaleTimeString()}
                      </p>
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
