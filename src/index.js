import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import {
  BrowserRouter as Router,
  useLocation,
  matchPath
} from "react-router-dom";
import Gallery from "./Gallery/Gallery";
import Details from "./Details/Details";
import usePrevious from "./utils/usePrevious";

function NotFound() {
  return <h1>Not found</h1>;
}

function RouteHandler() {
  const location = useLocation();
  const previousLocation = usePrevious(location);

  const { pathname } = location;

  if (
    previousLocation !== undefined &&
    matchPath(previousLocation.pathname, "/") &&
    matchPath(pathname, "/details/:id")
  ) {
    return <Gallery />;
  } else {
    const pathToComponent = {
      "/": Gallery,
      "/details/:itemId": Details
    };
    const result = Object.entries(pathToComponent).find(([path, component]) => {
      const matchResult = matchPath(pathname, {
        path: path,
        isExact: true
      });
      return matchResult !== null && matchResult.isExact === true;
    });

    if (result === undefined) {
      return <NotFound />;
    } else {
      const [matchingPath, MatchingComponent] = result;
      const { params } = matchPath(pathname, {
        path: matchingPath,
        isExact: true
      });
      return <MatchingComponent {...params} />;
    }
  }
}

function App() {
  return (
    <Router>
      <RouteHandler />
    </Router>
  );
}

if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(<App />, document.getElementById("root"));
