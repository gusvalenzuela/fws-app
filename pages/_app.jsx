/* 
Global CSS cannot be imported from files other than your Custom <App>. 
Please move all global CSS imports to src\pages\_app.js.
Read more: https://err.sh/next.js/css-global
*/
import "./_app.css";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import Menubar from "../components/Menubar";
import Footer from "../components/Footer";
import Moment from "react-moment";
import { ToastContainer } from "react-toastify";
import Store from "../lib/stores/FootballPool";
import { useEffect } from "react";

// This default export is required in a new `pages/_app.js\x` file.
export default function MyApp({ Component, pageProps }) {
  const weekStartDates = [
    "2020-09-16",
    "2020-09-23",
    "2020-09-30",
    "2020-10-07",
    "2020-10-14",
    "2020-10-21",
    "2020-10-28",
    "2020-11-04",
  ];
  // on mount
  useEffect(() => {
    // Start the pooled timer which runs every 1 second(s)
    // (60000 milliseconds) by default.
    Moment.startPooledTimer(1000);

    //startDateIndex finds the first date that is not in the past
    let startDateIndex = weekStartDates.findIndex(
      (startDate) => Date.parse(startDate) > Date.now()
    );
    // use that startDate to mark the week shown whem user logs in
    Store.setState({ week: startDateIndex + 1 });
  }, []);

  return (
    <>
      <Menubar />
      <ToastContainer
        // limit={3}
        newestOnTop
        hideProgressBar
        role="notification"
        position="top-center"
      />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
