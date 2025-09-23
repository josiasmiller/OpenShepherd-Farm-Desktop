import React, {useMemo} from 'react';
import {createTheme, ThemeProvider} from "@mui/material";
import appThemeOptions from "./appThemeOptions";

interface AtrkkrThemeProps {
  children: React.ReactNode;
}

function AtrkkrTheme(props: AtrkkrThemeProps) {
  const theme = useMemo(() => {
    return createTheme(appThemeOptions)
  }, [])
  return (
    <ThemeProvider theme={theme}>
      {props.children}
    </ThemeProvider>
  );
}

export default AtrkkrTheme;
