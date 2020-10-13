/* 
Global CSS cannot be imported from files other than your Custom <App>. 
Please move all global CSS imports to src\pages\_app.js.
Read more: https://err.sh/next.js/css-global
*/
import { useEffect, useState } from "react";
import Moment from "react-moment";
import moment from "moment";
import { ToastContainer } from "react-toastify";
import Store from "../lib/stores/FootballPool";
import Menubar from "../components/Menubar";
import Footer from "../components/Footer";
import { useSchedule } from "../lib/hooks";
import "./_app.css";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";

const generateWeekStartDatesFrom = (sDate = Date.now(), dL = 17) => {
  const datesArray = [];
  const startDate = sDate;
  const desiredLength = dL;
  for (let i = 0; i < desiredLength; i++) {
    var week = i * 7;
    var dateToPush = moment(startDate).add(week, "days").format("YYYY-MM-DD");
    datesArray.push(dateToPush);
  }
  return datesArray;
};

// This default export is required in a new `pages/_app.js\x` file.
export default function MyApp({ Component, pageProps }) {
  const [dbSchedule] = useSchedule(22, 2020); // args = (sport_id, season_year)
  const [schedule, setSchedule] = useState(undefined);

  // on mount
  useEffect(() => {
    // Start the pooled timer which runs every 1 second(s)
    // (60000 milliseconds) by default.
    Moment.startPooledTimer(1000);
    const weekStartDates = generateWeekStartDatesFrom("2020-09-16");

    //startDateIndex finds the first date that is not in the past
    let startDateIndex = weekStartDates.findIndex(
      (date) => Date.parse(date) > Date.now()
    );
    // use that startDate to mark the week shown whem user logs in
    Store.setState({ currentWeek: startDateIndex + 1 });
    Store.setState({ Moment: Moment });

    fetchData();
    async function fetchData() {
      try {
        const resp = await fetch(
          "https://rqrdtx8vy3.execute-api.us-west-2.amazonaws.com/default/fwsGetSchedule?TableName=fws-schedule"
        );
        const { Items } = await resp.json();
        setSchedule(Items[0]);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  // load schedule into global store when received from db
  useEffect(() => {
    // console.log(dbSchedule.events);
    Store.setState({ schedule: dbSchedule });
  }, [dbSchedule]);

  useEffect(() => {
    schedule?.events.map((evt) => {
      evt.event_date = evt.date_event;
    });
    Store.setState({ schedule_alt: schedule });
    // console.log(schedule);
  }, [schedule]);

  return (
    <>
      <Menubar />
      <ToastContainer
        // limit={3}
        newestOnTop
        // hideProgressBar
        role="notification"
        position="top-center"
      />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
