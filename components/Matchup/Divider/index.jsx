import React from 'react'
import { Grid, Icon } from 'semantic-ui-react'

const MatchupDivider = ({
  matchup,
  selectedTeam,
  sport,
  isPastEvent,
  compactCards,
  prefersModernLayout,
}) => (
  <Grid.Column
    // onClick={() => console.log(matchup)}
    key="versus"
    width="3"
    textAlign="center"
    className={`matchup-divider ${compactCards && 'font8'}`}
    verticalAlign="middle"
    id={compactCards ? 'matchup-divider' : undefined}
  >
    {/* separating into multiple lines */}
    <div
      style={{ fontSize: '1.12rem', marginBottom: '1.5rem', display: 'none' }}
    >
      {/* Date */}
      <p>
        {new Intl.DateTimeFormat('default', {
          // year: "numeric",
          month: 'numeric',
          day: 'numeric',
          // dayPeriod: "short",
        }).format(new Date(matchup.event_date))}
      </p>
      {/* Time */}
      <p>
        {new Intl.DateTimeFormat('default', {
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short',
          // dayPeriod: "short",
        }).format(new Date(matchup.event_date))}
      </p>
    </div>
    {
      /* versus / at icon */
      !prefersModernLayout ? (
        <p style={{ fontSize: '2.5rem', color: 'red', marginBottom: '.6rem' }}>
          {matchup.line_?.point_spread}
        </p>
      ) : (
        <Icon
          style={{ marginBottom: '1rem' }}
          size="huge"
          name={`${sport === 7 ? 'handshake' : 'at'}`}
        />
      )
    }

    {!isPastEvent ? (
      <p
        className="divider-pick"
        style={{ marginTop: '.5rem', fontSize: '1.12rem' }}
      >
        {!prefersModernLayout && selectedTeam ? (
          Number(selectedTeam.team_id) === matchup.line_?.favorite ? (
            <>
              You&apos;ve Picked
              <br />◀ {selectedTeam.abbreviation}
            </>
          ) : (
            <>
              You&apos;ve Picked
              <br /> {selectedTeam.abbreviation} ▶
            </>
          )
        ) : selectedTeam ? (
          Number(selectedTeam.team_id) === matchup.away_team_id ? (
            <>
              You&apos;ve Picked
              <br />◀ {selectedTeam.abbreviation}
            </>
          ) : (
            <>
              You&apos;ve Picked
              <br /> {selectedTeam.abbreviation} ▶
            </>
          )
        ) : (
          '◀ Pick ▶'
        )}
      </p>
    ) : (
      <br />
    )}

    {
      // determine if user's pick is a winner
      // eslint-disable-next-line no-underscore-dangle
      isPastEvent && matchup.winner === Number(selectedTeam?.team_id) ? (
        <Icon name="checkmark" color="green" />
      ) : isPastEvent &&
        matchup.event_status === 'STATUS_FINAL' &&
        selectedTeam ? (
        <Icon name="close" color="red" />
      ) : (
        isPastEvent && <Icon name="minus" color="grey" />
      )
    }
  </Grid.Column>
)

export default MatchupDivider
