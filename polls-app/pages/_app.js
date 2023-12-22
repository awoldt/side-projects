import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomNav from "../components/CustomNav";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <CustomNav />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
