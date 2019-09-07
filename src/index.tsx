import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

ReactDOM.render(<App />, document.getElementById("app"));
