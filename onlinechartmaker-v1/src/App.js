import React from "react";
import { Container, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Switch, Route, HashRouter } from "react-router-dom";
import CustomNav from "./components/CustomNav";
import { HelmetProvider } from "react-helmet-async";
import Home from "./components/Home";
import ReactGA from 'react-ga4'
import {useEffect} from 'react';
import Privacy from './components/Privacy';


ReactGA.initialize('G-3C7HVYRD4Z');


//lazy loaded components 
//browser no longer needs to download each chart component
const BarPage = React.lazy(() => {
  return import("./components/charts/Bar");
});
const LinePage = React.lazy(() => {
  return import("./components/charts/Line");
});
const RadarPage = React.lazy(() => {
  return import("./components/charts/Radar");
});
const AboutPage = React.lazy(() => {
  return import("./components/About");
});

function App() {


useEffect(() => {
  ReactGA.send("pageview");

}, [])

  return (
    <HelmetProvider>
      <HashRouter>
        <CustomNav />

        <Container
          style={{
            backgroundColor: "white",
            padding: "50px",
            marginTop: "50px",
            borderRadius: "10px",
            marginBottom: "50px",
          }}
        >
          <React.Suspense
            fallback={<Spinner animation="border" variant="primary" />}
          >
            <Switch>
              <Route path="/bar">
                <BarPage />
              </Route>
              <Route path="/line">
                <LinePage />
              </Route>
              <Route path="/radar">
                <RadarPage />
              </Route>
              <Route path="/about">
                <AboutPage />
              </Route>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/privacy" exact>
                <Privacy />
              </Route>
            </Switch>
          </React.Suspense>
        </Container>
      </HashRouter>
    </HelmetProvider>
  );
}

export default App;
