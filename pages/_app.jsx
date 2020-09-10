/* 
Global CSS cannot be imported from files other than your Custom <App>. 
Please move all global CSS imports to src\pages\_app.js.
Read more: https://err.sh/next.js/css-global
*/
import "./_app.css";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import SimpleMenu from "../components/SimpleMenu";
import Menubar from "../components/Menubar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Menubar />
      <ToastContainer
        limit={5}
        newestOnTop
        progressStyle={{ color: "Highlight" }}
        // autoClose={5000}
        role="Notify successful pick update"
        position="top-center"
      />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
