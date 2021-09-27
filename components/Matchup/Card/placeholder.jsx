import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Segment, Icon, Divider } from 'semantic-ui-react'
import DualRingLoader from '../../DualRingLoader'
import Style from './Card.module.css'

const MatchupPlaceholder = ({
  amount,
  darkMode,
  // compactCards,
  // timeZone,
}) => {
  // const sport = 2

  const buildTeamCard = (team) => (
    <Grid.Column
      className={`${Style.teamContainer} team-container`}
      verticalAlign="middle"
      stretched
      // width="6"
    >
      <section className={Style.compactCards}>
        {/* team logo / image  */}
        <DualRingLoader />
        <h3>
          {team} Team
          <br />
          {/* team record  */}
          <span style={{ fontSize: '.85rem' }}>0-0</span>
        </h3>
        {/* Line spread */}
        <p
          style={{
            margin: 0,
            alignSelf: 'center',
            transform: 'scale(1.75)',
          }}
        >
          <span style={{ visibility: 'hidden' }}>--</span>
        </p>
      </section>{' '}
    </Grid.Column>
  )

  return (
    <>
      {
        // my quick hack to create an mappable array
        // used to make a dynamic sizeable placeholder
        'k'
          .repeat(amount)
          .split('')
          .map((ltr, inx) => (
            <div key={`${Date.now() + Math.random() * amount}-${ltr}`}>
              {inx > 1 ? (
                <Divider
                  key="divider-placeholder"
                  // content={matchup.schedule?.event_name}
                  className="container-divider"
                />
              ) : (
                <h1 key="header-placeholder" className="matchup-day-header">
                  <DualRingLoader size="tiny" color="white" />
                </h1>
              )}

              <Segment loading attached raised className={Style.matchupSegment}>
                <div
                  className={Style.matchupSegmentOverlay}
                  style={{ background: !darkMode ? '#fff3' : '#000b' }}
                />
                <div
                  className={Style.matchupGrid}
                  style={{
                    backgroundColor: 'grey',
                    background: `linear-gradient(125deg, white 50%, grey 50%)`,
                  }}
                >
                  <Grid columns="equal">
                    {/* 
              buildTeamCard function returns a grid column for any team fed.
              takes in specific team Obj containing abbr, name, mascot, and more  */}
                    {buildTeamCard('Away')}
                    <Grid.Column
                      key="versus"
                      width="3"
                      textAlign="center"
                      className="matchup-divider font8"
                      verticalAlign="middle"
                      id="matchup-divider"
                    >
                      {/* separating into multiple lines */}
                      <div
                        style={{
                          fontSize: '1.12rem',
                          marginBottom: '1.5rem',
                          display: 'none',
                        }}
                      >
                        {/* Date */}
                        <p>
                          {new Intl.DateTimeFormat('default', {
                            // year: "numeric",
                            month: 'numeric',
                            day: 'numeric',
                            timeZone: 'America/Los_Angeles',
                            // dayPeriod: "short",
                          }).format(new Date('2021-01-01T05:00:00Z'))}
                        </p>
                        {/* Time */}
                        <p>
                          {new Intl.DateTimeFormat('default', {
                            hour: 'numeric',
                            minute: '2-digit',
                            timeZone: 'America/Los_Angeles',
                            timeZoneName: 'short',
                            // dayPeriod: "short",
                          }).format(new Date('2021-01-01T05:00:00Z'))}
                        </p>
                      </div>
                      <Icon
                        style={{ marginBottom: '1rem' }}
                        size="huge"
                        name="at"
                      />
                      <br />
                      <Icon name="minus" color="grey" />
                    </Grid.Column>

                    {buildTeamCard('Home')}
                  </Grid>
                </div>
              </Segment>
              <Segment
                color="grey"
                inverted
                attached="bottom"
                textAlign="center"
                size="mini"
              >
                <Grid columns="equal">
                  <Grid.Column>
                    <h4>
                      {new Intl.DateTimeFormat('default', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        timeZoneName: 'short',
                        timeZone: 'America/Los_Angeles',
                        // weekday: "short",
                      }).format(new Date('2021-01-01T05:00:00Z'))}{' '}
                      - BROADCAST
                    </h4>
                  </Grid.Column>
                </Grid>
              </Segment>
            </div>
          ))
      }
    </>
  )
}

export default MatchupPlaceholder

MatchupPlaceholder.propTypes = {
  amount: PropTypes.number,
  darkMode: PropTypes.bool,
}

MatchupPlaceholder.defaultProps = {
  amount: 3,
  darkMode: false,
}
