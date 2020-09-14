import React, { useState, useEffect } from "react";
import { Dropdown } from "semantic-ui-react";
import { toast } from "react-toastify";
const Tiebreaker = ({
  event_id,
  hometeam,
  awayteam,
  tiebreaker,
  setTiebreaker,
  user,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const tiebreakToast = React.useRef(null);
  const loginToPickToast = React.useRef(null);

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
    if (isUpdating) return;

    // if no signed in user, display message about logging in
    if (!user) {
      // check to see to no similar toast is active (prevent dupes)
      if (!toast.isActive(loginToPickToast.current)) {
        loginToPickToast.current = toast(
          "LOG IN TO START SETTING TIEBREAKERS!",
          {
            toastId: "toast-not-loggedin",
          }
        );
      }
      return;
    }

    // initializing the toast
    tiebreakToast.current = toast.info(
      `Updating tiebreaker to ${input}, please wait...`,
      {
        autoClose: false,
        closeButton: false,
      }
    );
    setIsUpdating(true);

    // append this tiebreaker (input param) to
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
    if (res.status === 200) {
      const pick = await res.json();
      setTiebreaker(pick.tiebreaker);
      // updating the toast alert and setting the autoclose
      toast.update(tiebreakToast.current, {
        render: (
          <>
            🎉 Tiebreaker updated to {pick.tiebreaker}!<br />
            <i style={{ fontSize: "small" }}>
              Total points scored in {pick.matchup.event_name}
            </i>
          </>
        ),
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
        closeButton: null,
      });
    } else {
      // check to see to no similar toast is active (prevent dupes)
      let errText = await res.text();
      toast.update(tiebreakToast.current, {
        render: errText,
        type: toast.TYPE.ERROR,
        autoClose: 5000,
        closeButton: null,
      });
      return;
    }
  };

  return (
    <>
      {/* <p>(D) = Divisional matchup</p> */}
      <div
        style={{
          border: "none",
          padding: ".25rem 1rem 1rem",
          textAlign: "center",
        }}
      >
        <b>Your Tiebreaker: </b>
        <Dropdown
          closeOnChange
          closeOnBlur
          closeOnEscape
          className="tiebreaker-dropdown"
          // placeholder="Select a week"
          selection
          options={tiebreakerOptions()}
          onChange={(e, { value }) => {
            setTiebreaker(value);
            return handleTiebreakerSubmit(value);
          }}
          text={`${!tiebreaker ? 1 : tiebreaker}`}
          value={tiebreaker}
          compact
          labeled
        />{" "}
        (
        {`Total points scored in ${awayteam.abbreviation} vs. ${hometeam.abbreviation} game`}
        )
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
