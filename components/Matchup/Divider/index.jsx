import React from "react";
import { Grid, Icon } from "semantic-ui-react";
const MatchupDivider = ({ matchup, selectedTeam, sport, isPastEvent }) => {
  return (
    <Grid.Column
      key={"versus"}
      width="3"
      textAlign="center"
      className="matchup-divider"
      verticalAlign="middle"
    >
      {/* separating into multiple lines */}
      <div style={{ fontSize: "1.12rem", marginBottom: "1.5rem" }}>
        {/* Date */}
        <p>
          {new Intl.DateTimeFormat("default", {
            // year: "numeric",
            month: "numeric",
            day: "numeric",
            // dayPeriod: "short",
          }).format(new Date(matchup.event_date))}
        </p>
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
      {/* versus / at icon */}
      <Icon name={`${sport === 7 ? "handshake" : "at"}`} />
      {
        // if it's not a past event, display the team picked
        // else display final score
        !isPastEvent ? (
          <p className="divider-pick" style={{ marginTop: ".5rem" }}>
            {selectedTeam
              ? selectedTeam === matchup.teams_normalized[0].abbreviation
                ? `◀ ${selectedTeam}  `
                : `  ${selectedTeam} ▶`
              : "◀ Pick ▶"}
          </p>
        ) : (
          <h2
            className="divider-score"
            style={{ marginTop: ".5rem", color: "#042", fontWeight: "700" }}
          >
            Final
            <br />
            0-0
          </h2>
        )
      }

      {/* <p>Weather: </p> */}
    </Grid.Column>
  );
};

export default MatchupDivider;
