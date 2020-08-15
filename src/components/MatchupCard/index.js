import React from "react";

const MatchupCard = ({ handleTeamSelection, matchup }) => {
  const teams = matchup.teams_normalized;

  return (
    <div className="matchup-container">
      {/* away team */}
      {teams.map((team) => {
        return (
          <div
            key={team.abbreviation}
            onClick={handleTeamSelection}
            data-team-initials={team.abbreviation}
            style={{
              backgroundImage: `url("/images/teamlogos/${team.abbreviation}.png")`,
            }}
            className="team-container"
          >
            <div>
              {team.is_home ? `@` : ""}
              {matchup.teams ? `${team.name} ${team.mascot}` : "Team Name"}
              <br />
              {team.is_home ? matchup.lines[2].spread.point_spread_home : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchupCard;
