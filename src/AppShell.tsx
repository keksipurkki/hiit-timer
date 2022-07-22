import * as React from "react";

function info() {
  window.alert("For best results, add this app to your home screen.");
}

const AppShell: ReactComponent = ({ children }) => (
  <>
    <header className="h3 flex items-center">
      <img className="mh2" width="32" height="32" src="icons/icon-header.png" />
      <a href="/">
        <h3 className="underline">{document.title}</h3>
      </a>
      <div className="ml-auto">
        <a id="install" onClick={info}></a>
      </div>
    </header>
    <main className="flex flex-column justify-center">
      <div className="flex flex-column center mv5">{children}</div>
    </main>
  </>
);

export default AppShell;
