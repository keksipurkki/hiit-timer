import * as React from "react";
import * as ReactDOM from "react-dom";
import Timer from "./Timer";

function info() {
  window.alert("For best results, add this app to your home screen.");
}

const App = () => {
  return (
    <>
      <header className="h3 flex items-center">
        <img className="mh2" width="32" height="32" src="icons/icon-128x128.png" />
        <a href="/"><h3 className="underline">L33t Timer</h3></a>
        <div className="ml-auto">
          <a id="install" onClick={info}></a>
        </div>
      </header>
      <Timer />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
