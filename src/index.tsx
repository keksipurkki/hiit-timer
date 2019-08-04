import * as React from "react";
import * as ReactDOM from "react-dom";
import Timer from "./Timer";

const App = () => {
  return (
    <>
      <header className="h3 flex items-center">
        <img className="mh2" width="32" height="32" src="icons/icon-128x128.png" />
        <h3 className="underline">L33t Timer</h3>
      </header>
      <Timer />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
