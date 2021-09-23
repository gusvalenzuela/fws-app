import React from 'react'
import { Divider } from 'semantic-ui-react'
import type { SportsMatchup, UserPick } from '../../../additional'
import MatchupCard from '../Card'
import DualRingLoader from '../../DualRingLoader'

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
        position: relative;
        display: flex;
        box-shadoe: 0px 10px 10px #aaa;
        background: linear-gradient(
          123deg,
          var(--light-mode, #fff),
          var(--dark-mode, #000)
        );
        color: #000;
        min-height: 200px;
        width: 100%;
        margin: auto;
      }
    `}</style>
    {
      /* 
        for each game of the week, make a header or divider and a matchup card component 
        Caveat: -- only displays other user's if Date now is after the lockdate (i.e. after first Sunday Game)
      */
      !schedule || !schedule?.length ? (
        <section className="placeholderSection">
          <DualRingLoader text="Loading matchups, one moment please." />
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
