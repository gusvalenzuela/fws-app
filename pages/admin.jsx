import React, { useState, useEffect } from "react";
import AdminEventSection from "../components/AdminEventSection";
import { useCurrentUser } from "../lib/hooks";
import Store from "../lib/stores/FootballPool";
import { generateNumbersArray } from "../lib/utils";
import { Dropdown } from "semantic-ui-react";

const AdminPage = () => {
  const currentWeek = Store((s) => s.currentWeek);
  const dbSchedule = Store((s) => s.schedule);
  const [user] = useCurrentUser();
  const [events, setEvents] = useState([]);
  const [week, setWeek] = useState(currentWeek || 1);
  // on week, dbschedule set
  useEffect(() => {
    // sort by event date
    dbSchedule?.events.sort(
      (a, b) => new Date(a.event_date) - new Date(b.event_date)
    );

    // filter out the desired week
    let filteredEvents = dbSchedule?.events.filter(
      (event) => event.schedule?.week === week
    );

    if (filteredEvents && filteredEvents.length > 0) {
      setEvents(filteredEvents);
    }
  }, [week, dbSchedule]);


  if (!user || !user?.isAdmin) {
    return (
      <>
        <p>Please sign in as an Administrator.</p>
      </>
    );
  } else {
    return (
      <>
        <main id="index" className="index">
          <div className="main-content">
            <header className="page-header">
              <h1>Game scores:</h1>
            </header>
            <div className="page-content">
              <Dropdown
                className="week-dropdown"
                onChange={(e, { value }) => setWeek(value)}
                options={generateNumbersArray(1, 17).map(
                  (num) => (num = { key: num, value: num, text: `Week ${num}` })
                )}
                value={week}
                text={`Week ${week.toString()}`}
                inline
              />
              {events.length > 0 &&
                events.map((event) => {
                  return (
                    <AdminEventSection key={event?.event_id} event={event} />
                  );
                })}
            </div>

            <div className="page-footer">🎉</div>
          </div>
        </main>
      </>
    );
  }
};

export default AdminPage;
