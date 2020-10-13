import React, { useState, useEffect, useRef } from "react";
import moment from "moment";

const AdminEventSection = ({ event }) => {
  const msgDefault = { message: "", isError: false };
  const [isUpdating, setIsUpdating] = useState(false);
  const [eventId] = useState(event.event_id);
  const [msg, setMsg] = useState(msgDefault);
  const homeTeamScoreRef = useRef();
  const awayTeamScoreRef = useRef();
  const pointSpreadRef = useRef();

  useEffect(() => {
    pointSpreadRef.current.value = -event?.line_?.point_spread;
    homeTeamScoreRef.current.value = event?.scores?.home_team;
    awayTeamScoreRef.current.value = event?.scores?.away_team;
    // console.log(event);
  }, [event]);
  useEffect(() => {
    console.log();
  }, []);

  const handleScoreSubmit = async (event) => {
    event.preventDefault();
    setTimeout(() => {
      setMsg(msgDefault); // clear any displayed messages after 4.2 secs
    }, 4200);

    if (isUpdating) return;
    setIsUpdating(true);
    const formData = {
      event_id: eventId,
      sport_id: 22,
      home_team_score: homeTeamScoreRef.current.value,
      away_team_score: awayTeamScoreRef.current.value,
      final: document.getElementById(`final-${eventId}`).checked,
    };
    const res = await fetch("/api/results", {
      method: "PATCH",
      body: JSON.stringify(formData),
    });
    setIsUpdating(false);
    if (res.status === 200) {
      setMsg({ message: "Event updated" });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
  };
  const handleLineSubmit = async (evt) => {
    evt.preventDefault();
    setTimeout(() => {
      setMsg(msgDefault); // clear any displayed messages after 4.2 secs
    }, 4200);
    if (isUpdating) return;
    var formElements = evt.currentTarget.elements;
    setIsUpdating(true);
    const formData = {
      event_id: eventId,
      sport_id: 2,
      line_: {
        point_spread: Number(-pointSpreadRef.current.value),
        favorite: formElements["favorite-team"].value,
      },
    };

    // console.log(formData);
    const res = await fetch("/api/lines", {
      method: "PATCH",
      body: JSON.stringify(formData),
    });
    setIsUpdating(false);
    if (res.status === 200) {
      setMsg({ message: "Point Spread updated" });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
  };
  const handleDateChangeSubmit = async (evt) => {
    if (isUpdating) return;
    setTimeout(() => {
      setMsg(msgDefault); // clear any displayed messages after 4.2 secs
    }, 4200);
    var formElements = evt.currentTarget.elements;
    evt.preventDefault();
    var dateInput = formElements["event-date"].value;
    var timeInput = formElements["event-time"].value;
    // convert the input Date & Time to UTC for updating event (using moment)
    // format: 2020-10-14T01:00:00Z
    if (dateInput === "") {
      setMsg({ message: `Date cannot be null`, isError: true });
    }
    if (timeInput === "") {
      setMsg({ message: `Time cannot be null`, isError: true });
    }

    if (dateInput !== "" && timeInput !== "") {
      setIsUpdating(true);
      var eventDateTime = moment(
        `${formElements["event-date"].value}T${formElements["event-time"].value}`
      )
        .utc()
        .format();

      const formData = {
        event_id: eventId,
        sport_id: 22,
        event_date: eventDateTime,
      };

      const res = await fetch("/api/dates", {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      setIsUpdating(false);
      if (res.status === 200) {
        console.log(await res.json());
        setMsg({ message: "Event updated" });
      } else {
        setMsg({ message: await res.text(), isError: true });
      }
    }

    // end handleSubmitDateTime
  };

  return (
    <>
      <style jsx>{`
        section {
          padding: 1rem;
          margin-bottom: 2rem;
          border: 1px solid red;
          width: fit-content;
          justify-content: center;
        }
        form {
          display: grid;
          text-align: center;
        }
        form * {
          margin: 4px;
        }
        form button {
          margin: 1rem;
        }
        button {
          width: fit-content;
          margin: auto !;
        }
      `}</style>
      <section>
        <h3>{event.schedule?.event_name || "Event Name"}</h3>
        {msg.message ? (
          <p
            style={{
              color: msg.isError ? "red" : "#0070f3",
              textAlign: "center",
            }}
          >
            {msg.message}
          </p>
        ) : null}

        <form id={`score-form-${event.event_id}`} onSubmit={handleScoreSubmit}>
          <span>
            {(event.teams && event.teams_normalized[0].abbreviation) ||
              "Away Team"}{" "}
            <input
              placeholder="Score"
              required
              id={`score-${event.teams_normalized[0].abbreviation}`}
              min="0"
              name="away-team"
              type="number"
              ref={awayTeamScoreRef}
            />
          </span>
          <span>
            {(event.teams && event.teams_normalized[1].abbreviation) ||
              "Home Team"}{" "}
            <input
              required
              placeholder="Score"
              id={`score-${event.teams_normalized[0].abbreviation}`}
              name="home-team"
              min="0"
              type="number"
              ref={homeTeamScoreRef}
            />
          </span>
          <label htmlFor={`final-${eventId}`}>
            Final Score?
            <input
              id={`final-${eventId}`}
              name={`final-${eventId}`}
              type="checkbox"
              defaultChecked={event.scores?.final}
            />
          </label>

          <button disabled={isUpdating} type="submit">
            Save
          </button>
        </form>
        <form id={`line-form-${event.event_id}`} onSubmit={handleLineSubmit}>
          <p>Set Favorite:</p>
          <span>
            <label htmlFor={`${event.teams_normalized[0].abbreviation}`}>
              {`${event.teams_normalized[0].abbreviation}`}
              <input
                id={`favteam-${event.teams_normalized[0].abbreviation}`}
                value={`${event.teams_normalized[0].abbreviation}`}
                name="favorite-team"
                type="radio"
                defaultChecked={
                  event.line_?.favorite ===
                  event.teams_normalized[0].abbreviation
                }
              />
            </label>
            <label htmlFor={`${event.teams_normalized[1].abbreviation}`}>
              {`${event.teams_normalized[1].abbreviation}`}
              <input
                id={`${event.teams_normalized[1].abbreviation}`}
                value={`${event.teams_normalized[1].abbreviation}`}
                name="favorite-team"
                type="radio"
                defaultChecked={
                  event.line_?.favorite ===
                  event.teams_normalized[1].abbreviation
                }
              />
            </label>
          </span>
          <span>
            <label htmlFor="point-spread">
              Point Spread:
              <input
                placeholder="ex. 0.5"
                // required
                id={`pointspread-${event.teams_normalized[0].abbreviation}`}
                name="point-spread"
                type="number"
                max={999.5}
                min={0.5}
                // step={0.5}
                required
                ref={pointSpreadRef}
              />
            </label>
          </span>

          <button disabled={isUpdating} type="submit">
            Save Line
          </button>
        </form>
        <form
          id={`date-form-${event.event_id}`}
          onSubmit={handleDateChangeSubmit}
        >
          <p>New Event Date:</p>
          <span>
            <input
              id={`date-${event.event_date}`}
              name="event-date"
              type="date"
              defaultValue={`${moment(event.event_date).format("YYYY-MM-DD")}`}
            />
            <input
              id={`time-${event.event_date}`}
              name="event-time"
              type="time"
              defaultValue={`${moment(event.event_date).format("HH:mm")}`}
            />
          </span>

          <button disabled={isUpdating} type="submit">
            Change Date
          </button>
        </form>
      </section>
    </>
  );
};

export default AdminEventSection;
