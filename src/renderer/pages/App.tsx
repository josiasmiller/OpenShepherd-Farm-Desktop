import React, {useContext, useEffect, useState} from "react";
import "../styles/styles.css";
import SessionPage from "./session/SessionPage";
import {SystemService, SystemServiceContext} from "../services/system/systemService";
import LandingPage from "./landing/LandingPage";
import {map} from "rxjs";
import IsolatedMuiScope from "../theme/IsolatedMuiScope";
import {Fade} from "@mui/material";

const App: React.FC = () => {

  const systemService = useContext<SystemService>(SystemServiceContext)
  //Is initializing prevents display of landing page while app page is reloading
  //with an open session in place since show session defaults to false.
  const [isInitializing, setIsInitializing] = useState<boolean>(true)
  const [showSession, setShowSession] = useState<boolean>(false)

  useEffect(() => {
    systemService.databaseSessionInfo$().pipe(
      map((item) => {
        const databasePath = item?.path
        const hasSession = databasePath != null
        console.log(
          (hasSession)
            ? `Showing session page for db @: ${databasePath}`
            : 'Showing landing page'
        )
        return hasSession
      })
    ).subscribe((hasSession) => {
      setIsInitializing(false)
      setShowSession(hasSession)
    })
  }, []);

  return (
    <>
      <main>
      {
        !isInitializing && (
          showSession ? (
            <SessionPage/>
          ) : (
            <IsolatedMuiScope>
              <LandingPage/>
            </IsolatedMuiScope>
          )
        )
      }
      </main>
    </>
  );
};

export default App;
