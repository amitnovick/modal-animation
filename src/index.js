import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Gallery from "./Gallery/Gallery";
import Details from "./Details/Details";

function NotFound() {
  return <h1>Not found</h1>;
}

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Gallery} />
        <Route
          exact
          path="/details/:itemId"
          render={({ match }) => <Details itemId={match.params.itemId} />}
        />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(<App />, document.getElementById("root"));
