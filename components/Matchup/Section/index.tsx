import React from 'react'
import { Divider } from 'semantic-ui-react'
import type { SportsMatchup, UserPick } from '../../../additional'
import MatchupCard from '../Card'

const MatchupCardSection = ({
  schedule = [],
  compactCards,
  lockDate,
  userPicks,
  currentUser,
  modernLayout,
  tiebreakMatch,
}) => (
  <section key="allMatchupCards">
    {
      /* 
        for each game of the week, make a header or divider and a matchup card component 
        Caveat: -- only displays other user's if Date now is after the lockdate (i.e. after first Sunday Game)
      */
      schedule.length &&
        schedule.map((matchup: SportsMatchup, inx: number) => {
          // before rendering any event, it checks to see if
          // it is the 1st time printing the event day (Mo, Tu, etc..)
          const currentMatchupEventDate = new Date(
            matchup.event_date || '1971-01-01T00:00:00Z'
          )
          const previousMatchupEventDate = new Date(
            schedule[inx - 1]?.event_date
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
                  // content={matchup.schedule?.event_name}
                  className="container-divider"
                />
              ) : (
                <h1
                  className="matchup-day-header"
                  key={`header-${matchup.event_date}`}
                >
                  {currentMatchupEventDate.toDateString()}
                </h1>
              )}

              {/* A Matchup Card stack for each matchup */}
              <MatchupCard
                key={`${matchup.event_date}`}
                version="at"
                compactCards={compactCards}
                lockDate={lockDate}
                matchup={matchup}
                userPick={userPicks?.find(
                  (p: UserPick) => p.matchupId === matchup.event_id
                )}
                user={{
                  ...currentUser,
                  prefersModernLayout: modernLayout,
                }}
                tiebreak={
                  tiebreakMatch && tiebreakMatch?.event_id === matchup.event_id
                }
              />
            </>
          )
        })
    }
  </section>
)

export default MatchupCardSection
