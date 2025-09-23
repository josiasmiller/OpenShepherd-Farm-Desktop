import React from 'react';
import {ScopedCssBaseline} from "@mui/material";
import AtrkkrTheme from "./AtrkkrTheme";

interface IsolatedMuiScopeProps {
  children: React.ReactNode;
}

function IsolatedMuiScope(props: IsolatedMuiScopeProps) {
  return (
    <ScopedCssBaseline>
      <AtrkkrTheme>
        {props.children}
      </AtrkkrTheme>
    </ScopedCssBaseline>
  );
}

export default IsolatedMuiScope;
