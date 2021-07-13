import React from 'react'
import Store from '../../lib/stores/FootballPool'

const PlayerDashboard = ({
  user,
  msg,
  otherUser,
  allPicked,
  lockDate,
  weeklyRecord,
}) => (
  <>
    <style jsx>
      {`
        .player-container {
          max-width: 825px;
          margin: auto;
          height: fit-content;
          padding: 1.5rem;
          background-color: #243ec2;
        }
        .player-container.picked {
          background-color: #ddf5d1;
        }
        .player-container h1 {
          text-align: left;
          color: #fff;
        }
        .player-container p.all-picked {
          text-align: left;
          font-weight: 900;
          color: #135813;
        }
        .player-container p.picks-remaining {
          text-align: left;
          font-weight: 900;
          color: #fff70f;
        }
        .player-container.picked p.picks-record {
          color: #000;
        }
        .player-container p.picks-record {
          color: #fff;
        }
        .player-container.other-user {
          background: #213ab8dd;
        }
        .player-container.other-user::before {
          content: 'YOU ARE VIEWING';
          color: #fff;
          font-weight: 800;
          // text-decoration: underline;
        }
      `}
    </style>
    <div
      className={`player-container ${otherUser ? 'other-user' : ''} ${
        allPicked ? 'picked' : ''
      }`}
    >
      {user && otherUser ? (
        <>
          <h1 style={{ marginBottom: '0' }}>{user.name}&apos;s picks. </h1>
          <button
            type="button"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#fff70f',
              textDecoration: 'underline',
            }}
            onClick={() => Store.setState({ selectedUser: undefined })} //
          >
            see yours
          </button>
        </>
      ) : user ? (
        <h1 style={{ color: `${allPicked && '#000'}` }}>Your picks.</h1>
      ) : (
        <h1>Demo</h1>
      )}
      {!otherUser && (
        <>
          {
            // find count of all selected teams on screen (i.e. picks made)
            allPicked ? (
              <p className="all-picked">
                All this week&apos;s matchups have been selected. Good luck!
              </p>
            ) : (
              Date.now() <= lockDate && (
                <p className="picks-remaining">
                  Picks locked at the scheduled time of the first Sunday Game
                </p>
              )
            )
          }
        </>
      )}
      {Date.now() >= lockDate && (
        <p className="picks-record">
          Record this week: <b>{weeklyRecord}</b>
        </p>
      )}

      {/* msg received on count of picks left to make */}
      {msg && (
        <p
          style={{
            color: 'black',
          }}
        >
          {msg}
        </p>
      )}
    </div>
  </>
)

export default PlayerDashboard
