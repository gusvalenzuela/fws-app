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
      <Icon name={`${sport === 7 ? "handshake" : "at"}`} />
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
      <p className="divider-pick" style={{ marginTop: "1.5rem" }}>
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
