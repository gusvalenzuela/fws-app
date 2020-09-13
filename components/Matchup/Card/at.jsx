import React, { useState, useEffect } from "react";
import { Grid, Segment } from "semantic-ui-react";
import MatchupDivider from "../Divider";
import Tiebreaker from "../../Tiebreaker";
import Style from "./Card.module.css";
import { toast } from "react-toastify";
import { Image, Transformation, CloudinaryContext } from "cloudinary-react";

const MatchupCardAt = ({ matchup, userPicks, user, tiebreak }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [sport, setSport] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [tiebreaker, setTiebreaker] = useState(null);
  const initToast = React.useRef(null);
  const loginToPickToast = React.useRef(null);
  useEffect(() => {
    setSport(matchup.sport_id);
    setSelectedTeam(null); // clear selected team for refresh
    if (!user || !userPicks) return;
    //  look in the user's picks
    for (let i = 0; i < userPicks.length; i++) {
      const pick = userPicks[i];
      if (pick.event_id === matchup.event_id) {
        setSelectedTeam(pick.selected_team);
        // if it is also the tiebreak match, set the tiebreaker value used in Tiebreaker component
        if (tiebreak) {
          setTiebreaker(pick.tiebreaker);
        }
        return;
      }
    }
  }, [userPicks, matchup, user]);

  const buildTeamCard = (team) => {
    return (
      <Grid.Column
        color={selectedTeam === team.abbreviation ? "black" : null}
        onClick={handleTeamSelection}
        className={`${Style.teamContainer} team-container ${
          selectedTeam === team.abbreviation ? "picked" : ""
        }`}
        verticalAlign="middle"
        data-team={team.abbreviation}
        data-event={matchup.event_id}
        id={team.abbreviation}
        // width="6"
        stretched
      >
        <CloudinaryContext cloudName="fwscloud">
          {/* hosting the images on cloudinary */}
          <Image
            publicId={`NFL-Team_logos/${
              sport === 2 ? team.abbreviation : "nfl"
            }.png`}
            alt={`${team.abbreviation}'s team logo`}
            id="team-logo-img"
          >
            <Transformation width="250" crop="scale" />
          </Image>
        </CloudinaryContext>
        {/* <img
          src={`/images/teamlogos/${
            sport === 2 ? team.abbreviation : "ufc-fighter"
          }.png`}
          alt={`${team.abbreviation}'s team logo`}
          id="team-logo-img"
        /> */}
        <h3>{`${team.name} ${team.mascot}`}</h3>
        <br />
        {sport === 7 ? (
          <>
            <p
              style={{
                margin: 0,
                marginTop: "-10px",
                marginBottom: "10px",
                fontWeight: "400",
              }}
            >
              {team.record || "0-0-0"}
            </p>
            <br />
          </>
        ) : (
          <p
            style={{
              margin: 0,
              marginTop: "-5px",
              marginBottom: "5px",
              fontSize: "2rem",
              color: "red",
              fontWeight: "800",
            }}
          >
            {
              // if point spread is negative display
              // & only if current rendered team is also fav
              team.is_home && matchup.lines.spread.point_spread_home < 0 ? (
                matchup.lines.spread.point_spread_home
              ) : (team.is_away && matchup.lines.spread.point_spread_away) <
                0 ? (
                matchup.lines.spread.point_spread_away
              ) : (
                <span style={{ visibility: "hidden" }}>underdog</span> // display and hide an equivalent element to keep balance layout
              )
            }
          </p>
        )}
      </Grid.Column>
    );
  };

  const handleTeamSelection = async (event) => {
    if (isUpdating) return toast.info("Still updating, please wait");
    // if no signed in user, display message about logging in
    if (!user) {
      // check to see to no similar toast is active (prevent dupes)
      if (!toast.isActive(loginToPickToast.current)) {
        loginToPickToast.current = toast("Log in to lock your pick!", {
          toastId: "toast-not-loggedin",
        });
      }
      return;
    }
    // initializing the toast
    initToast.current = toast.info(
      `Updating pick to ${event.currentTarget.dataset.team}, please wait...`,
      {
        // toastId: "toast-update-pick",
        autoClose: false,
        closeButton: false,
      }
    );
    setIsUpdating(true);

    let pick = {
      event_id: matchup.event_id,
      event_date: matchup.event_date,
      selected_team: event.currentTarget.dataset.team,
      matchup: { ...matchup.schedule, teams: matchup.teams_normalized },
    };
    const res = await fetch("/api/picks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pick),
    });
    setIsUpdating(false);

    if (res.status === 200) {
      const pick = await res.json();
      // updating the toast alert and setting the autoclose

      toast.update(initToast.current, {
        render: (
          <>
            Week {pick.matchup.week} pick updated to {pick.selected_team}.
            <br />
            <b style={{ fontSize: "small" }}>Good luck! 🎉</b>
          </>
        ),
        type: toast.TYPE.SUCCESS,
        autoClose: 3000,
        closeButton: null,
      });
      // PATCH /api/picks returns the updated pick
      setSelectedTeam(pick.selected_team);
    } else {
      let errMsg = (await res.text()).toUpperCase();
      // updating the toast alert with error and setting the autoclose
      toast.update(initToast.current, {
        render: errMsg,
        type: toast.TYPE.ERROR,
        autoClose: 6000,
        hideProgressBar: false,
        closeButton: null,
      });
    }
  };

  return (
    <>
      <div className={Style.matchupContainer}>
        <Segment>
          {/* render for each team  */}
          <Grid columns="equal">
            {/* buildTeamCard function returns a grid column for any team fed
          takes in specific team Obj containing abbr, name, mascot, and more  */}
            {
              // away team
              buildTeamCard(matchup.teams_normalized[0])
            }
            {/* // this divider has slight changes // varied on the sport type
          (i.e.american football vs mma) */}
            <MatchupDivider
              selectedTeam={selectedTeam}
              matchup={matchup}
              sport={sport}
            />
            {
              // home team
              buildTeamCard(matchup.teams_normalized[1])
            }
          </Grid>
        </Segment>

        {/* This displays only on the last matchup or what is the tiebreaker  */}
        {tiebreak && (
          <Tiebreaker
            tiebreaker={tiebreaker}
            setTiebreaker={setTiebreaker}
            user={user}
            event_id={matchup.event_id}
            hometeam={matchup.teams_normalized[0]}
            awayteam={matchup.teams_normalized[1]}
          />
        )}
      </div>
    </>
  );
};

export default MatchupCardAt;
