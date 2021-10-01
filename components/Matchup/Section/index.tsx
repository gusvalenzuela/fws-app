import React from 'react'
import PropTypes from 'prop-types'
import { Divider } from 'semantic-ui-react'
import type { SportsMatchup, UserPick } from '../../../additional'
import { MatchupShape } from '../../../lib/proptypes'
import MatchupCard from '../Card'
import MatchupPlaceholder from '../Card/placeholder'

const MatchupCardSection = ({
  schedule,
  compactCards,
  lockDate,
  userPicks,
  currentUser,
  isCurrentUser,
  // modernLayout,
  tiebreakMatch,
  darkMode,
  timeZone,
}) => (
  <>
    <style jsx>{`
      section.placeholderSection {
        margin: auto;
        margin-top: 2rem;
      }
    `}</style>
    {
      /* 
        for each game of the week, make a header or divider and a matchup card component 
        Caveat: -- only displays other user's if Date now is after the lockdate (i.e. after first Sunday Game)
      */
      !schedule || !schedule?.length ? (
        <section className="placeholderSection">
          <MatchupPlaceholder darkMode={darkMode} amount={6} />
        </section>
      ) : !isCurrentUser && Date.now() < lockDate ? (
        <section>
          <p
            style={{
              textAlign: 'justify',
              padding: '.5rem',
              marginTop: '2rem',
            }}
          >
            <b>Note:</b> Other users&apos; picks are not viewable until after
            the start of the first Sunday game.
          </p>
        </section>
      ) : (
        schedule.map((matchup: SportsMatchup, inx: number) => {
          // before rendering any event, it checks to see if
          // it is the 1st time printing the event day (Mo, Tu, etc..)
          const currentMatchupEventDate = new Date(
            matchup.event_date || '1970-01-01T05:00:00Z'
          )
          const previousMatchupEventDate = new Date(
            schedule[inx - 1]?.event_date || '1970-01-01T05:00:00Z'
          )

          let print = true
          // this is for the header of each "matchup day" subsection.
          // we print the first date in the week every time (i.e. index 0)
          if (inx > 0) {
            // check if the previous day of the week in the mapping is the same as current
            if (
              previousMatchupEventDate.getDay() ===
              currentMatchupEventDate.getDay()
            ) {
              // if it is the same day as the previous
              // do not print, by setting print to false
              print = false
            }
          }

          return (
            <>
              {/* A blank or date divider */}
              {!print ? (
                <Divider
                  key={`divider-${matchup.event_id || `${inx}`}`}
                  // content={matchup.schedule?.event_name}
                  className="container-divider"
                />
              ) : (
                <h1
                  key={`header-${matchup.event_id || `${inx}`}`}
                  className="matchup-day-header"
                >
                  {new Intl.DateTimeFormat('default', {
                    weekday: 'long',
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                    // timeZoneName: 'short',
                    timeZone: timeZone || 'America/Los_Angeles',
                    // weekday: "short",
                  }).format(currentMatchupEventDate)}
                </h1>
              )}

              {/* A Matchup Card stack for each matchup */}
              <MatchupCard
                timeZone={timeZone}
                darkMode={darkMode}
                key={matchup.event_id || `${inx}`}
                version="at"
                compactCards={compactCards}
                lockDate={lockDate}
                matchup={matchup}
                userPick={userPicks?.find(
                  (p: UserPick) => p.matchupId === matchup.event_id
                )}
                user={currentUser}
                tiebreak={
                  tiebreakMatch && tiebreakMatch?.event_id === matchup.event_id
                }
              />
            </>
          )
        })
      )
    }
  </>
)

export default MatchupCardSection

MatchupCardSection.propTypes = {
  schedule: PropTypes.arrayOf(PropTypes.shape(MatchupShape)),
  lockDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userPicks: PropTypes.arrayOf(
    PropTypes.shape({ matchupId: PropTypes.string })
  ),
  compactCards: PropTypes.bool,
  darkMode: PropTypes.bool,
  currentUser: PropTypes.shape({ _id: PropTypes.string }),
  isCurrentUser: PropTypes.bool.isRequired,
  // modernLayout,
  tiebreakMatch: PropTypes.shape(MatchupShape),
  timeZone: PropTypes.string,
}

MatchupCardSection.defaultProps = {
  darkMode: false,
  compactCards: true,
  timeZone: 'America/Los_Angeles',
  userPicks: null,
  currentUser: null,
  schedule: null,
  lockDate: null,
  tiebreakMatch: null,
}
