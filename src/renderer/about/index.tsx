import React from "react";
import ReactDOM from "react-dom/client";
import AboutScreen from "./AboutScreen";
import AtrkkrTheme from "../theme/AtrkkrTheme";

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <main className="main-content">
      <AtrkkrTheme>
        <AboutScreen/>
      </AtrkkrTheme>
    </main>
  </React.StrictMode>
);
