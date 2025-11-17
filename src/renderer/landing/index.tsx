import React from "react";
import ReactDOM from "react-dom/client";
import LandingScreen from "./LandingScreen";
import IsolatedMuiScope from "../theme/IsolatedMuiScope";

import "../styles/styles.css";

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <main className="main-content">
      <IsolatedMuiScope>
        <LandingScreen/>
      </IsolatedMuiScope>
    </main>
  </React.StrictMode>
);
