import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";

import Gallery from "./Gallery/Gallery";

function App() {
  return <Gallery />;
}

ReactDOM.render(<App />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept();
}
