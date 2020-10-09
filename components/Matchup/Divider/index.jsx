import React from "react";
import { Grid, Icon } from "semantic-ui-react";

const MatchupDivider = ({
  matchup,
  selectedTeam,
  sport,
  isPastEvent,
  pickWinner,
}) => {
  return (
    <Grid.Column
      onClick={() => console.log(matchup)}
      key={"versus"}
      width="3"
      textAlign="center"
      className="matchup-divider"
      verticalAlign="middle"
    >
      {/* separating into multiple lines */}
      <div style={{ fontSize: "1.12rem", marginBottom: "1.5rem" }}>
        {/* Date */}
        {/* <p>
          {new Intl.DateTimeFormat("default", {
            // year: "numeric",
            month: "numeric",
            day: "numeric",
            // dayPeriod: "short",
          }).format(new Date(matchup.event_date))}
        </p> */}
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
      <Icon
        style={{ marginBottom: "1rem" }}
        size="huge"
        name={`${sport === 7 ? "handshake" : "at"}`}
      />
      {!isPastEvent ? (
        <p className="divider-pick" style={{ marginTop: ".5rem" }}>
          {selectedTeam
            ? selectedTeam === matchup.teams_normalized[0].abbreviation
              ? `◀ ${selectedTeam}  `
              : `  ${selectedTeam} ▶`
            : "◀ Pick ▶"}
        </p>
      ) : (
        <br />
      )}

      {
        // determine if pick is a winner or not
        isPastEvent && pickWinner === selectedTeam ? (
          <Icon name="check" color="green" size="huge" />
        ) : isPastEvent && matchup.scores?.final && selectedTeam ? (
          <Icon name="close" color="red" size="huge" />
        ) : null
      }
    </Grid.Column>
  );
};

export default MatchupDivider;
