import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";

import Gallery from "./Gallery/Gallery";
import checkIsWebAnimationsSupported from "./utils/checkIsWebAnimationsSupported";

if (module.hot) {
  module.hot.accept();
}

const loadApp = () => {
  ReactDOM.render(<Gallery />, document.querySelector("#root"));
};

(async () => {
  const isWebAnimationsSupported = checkIsWebAnimationsSupported();
  if (!isWebAnimationsSupported) {
    await import("web-animations-js");
  }
  loadApp();
})();
