import React, { useState, useEffect } from "react";
import { Dropdown } from "semantic-ui-react";

const Tiebreaker = ({
  event_id,
  hometeam,
  awayteam,
  tiebreaker,
  setTiebreaker,
}) => {
  const [msg, setMsg] = useState({ message: null, isError: false });
  const [isUpdating, setIsUpdating] = useState(false);

  const tiebreakerOptions = () => {
    // function that creates the dropdown options needed for tiebreaker
    // min 1 (declared in i), max 192 (declared in max)
    var max = 192;
    var optionsArray = [];

    for (let i = 1; i < max + 1; i++) {
      optionsArray.push({
        key: i,
        text: i,
        value: i,
        // image: { avatar: true, src: "/images/avatar/small/matt.jpg" },
      });
    }
    return optionsArray;
  };

  const handleTiebreakerSubmit = async (input) => {
    clearTimeout(displayTimeoout);
    // if any message is used whilst team picking, clear it after 2 secs
    const displayTimeoout = setTimeout(() => {
      setMsg({ ...msg, message: null });
    }, 3000);
    if (isUpdating) return;

    // if no signed in user, display message about logging in
    // if (!user) return setMsg({ ...msg, message: "Login to make your pick!" });
    setIsUpdating(true);

    // append this tiebreaker to
    // event_id of matchup (i.e. MNF)
    let tiePick = {
      event_id: event_id,
      tiebreaker: input,
    };
    const res = await fetch("/api/picks/" + tiePick.event_id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tiePick),
    });

    setIsUpdating(false);
    const pick = await res.json();
    setTiebreaker(pick.tiebreaker);
    if (res.status === 200) {
      setMsg({
        message: `Tiebreaker successfully updated to ${pick.tiebreaker}`,
      });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
  };

  // console.log(matchup)
  return (
    <>
      {/* <p>(D) = Divisional matchup</p> */}
      <div style={{ border: "none", paddingBottom: "1rem" }}>
        <b>Your Tiebreaker: </b>
        <Dropdown
          // placeholder="Select a week"
          selection
          options={tiebreakerOptions()}
          onChange={(e, { value }) => {
            setTiebreaker(value);
            return handleTiebreakerSubmit(value);
          }}
          text={`${!tiebreaker ? 1 : tiebreaker}`}
          compact
          labeled
        />{" "}
        (
        {`Total points scored in ${awayteam.abbreviation} vs. ${hometeam.abbreviation} game`}
        ){/* msg received after updating pick to db */}
        {msg.message ? (
          <p
            style={{
              color: "blue",
              fontSize: "large",
              fontWeight: "700",
              margin: ".5rem 0 .25rem",
              padding: "0",
            }}
          >
            {msg.message}
          </p>
        ) : null}
        <span
          style={{
            display: `${
              "check if MNF || tiebreaker game is finished" ? "none" : "none"
            }`,
          }}
        >
          Actual Tiebreaker{`tiebreakerscore`}
        </span>
        <br />
      </div>
    </>
  );
};

export default Tiebreaker;
