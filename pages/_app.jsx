/* 
Global CSS cannot be imported from files other than your Custom <App>. 
Please move all global CSS imports to src\pages\_app.js.
Read more: https://err.sh/next.js/css-global
*/
import "./style.css";
import "semantic-ui-css/semantic.min.css";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
