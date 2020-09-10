import React from "react";
import { Grid, Icon } from "semantic-ui-react";
const MatchupDivider = ({ matchup, selectedTeam, sport }) => {
  return (
    <Grid.Column

      key={"versus"}
      width="3"
      textAlign="center"
      className="matchup-divider"
      verticalAlign="middle"
    >
      {/* separating into multiple lines */}
      <div style={{ fontSize: "1.12rem", marginBottom: "2rem" }}>
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
      {/* versus / at icon */}
      <Icon name={`${sport === 7 ? "handshake" : "at"}`} />
      {/* make a selection / picked  */}
      <p className="divider-pick" style={{ marginTop: ".5rem" }}>
        {selectedTeam
          ? selectedTeam === matchup.teams_normalized[0].abbreviation
            ? `◀ ${selectedTeam}  `
            : `  ${selectedTeam} ▶`
          : "◀ Pick ▶"}
      </p>
      {/* <p>Weather: </p> */}
    </Grid.Column>
  );
};

export default MatchupDivider;
