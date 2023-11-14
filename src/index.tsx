import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(<App />);
