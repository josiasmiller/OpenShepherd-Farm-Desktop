import {Box, Link, Stack, Typography, useTheme} from "@mui/material";
import React, {useEffect, useState} from 'react';
import transparentLogo from "../assets/images/AnimalTrakker.png";
import {AppAboutInfo} from "@ipc/api";
import log from 'electron-log/renderer';

const AboutScreen = () => {
  const theme = useTheme();
  const [appInfo, setAppInfo] = useState<AppAboutInfo|null>(null);
  useEffect(() => {
    window.applicationSettingsIpc.queryAboutApp()
      .then((aboutApp) => {
        setAppInfo(aboutApp);
      })
      .catch((err) => {
        log.error(err);
      })
  }, []);
  const openWebsite = () => {
    window.applicationSettingsIpc.openAtrkkrWebsite()
      .catch((e: any) => log.error(e));
  }
  const openSupportMail = () => {
    window.applicationSettingsIpc.openAtrkkrSupportMail()
      .catch((e: any) => log.error(e));
  }
  const openBuildCommit = () => {
    window.applicationSettingsIpc.openAtrkkrBuildCommit()
      .catch((e: any) => log.error(e));
  }
  return (
    <div>
      <Stack direction="column" spacing={0}>
        <Stack direction="row" spacing={0} alignItems="center">
          <Box
            component="img"
            src={transparentLogo}
            alt="App Icon"
            draggable={false}
            padding={2}
            sx={{
              display: 'block',
              width: '40%',
              height: 'auto',
              userSelect: 'none',
            }}
          />
          { appInfo &&
            <Typography
              variant='h5'
              display="block"
              textAlign='center'
              alignContent='center'
              sx={{
                width: '100%',
                height: '100%',
              }}
            >
              {appInfo.version}
            </Typography>
          }
        </Stack>
        { appInfo &&
          <Stack direction='row' spacing={0} justifyContent='space-evenly' alignItems="center">
            <Stack direction="column" spacing={0}>
              <Link variant='body1' onClick={openWebsite} sx={{ cursor: 'default', '&:hover': { cursor: 'pointer' } }}>animaltrakker.com</Link>
              <Link variant='body1' onClick={openSupportMail} sx={{ cursor: 'default', '&:hover': { cursor: 'pointer' } }}>support@animaltrakker.com</Link>
            </Stack>
            <Stack direction="column" spacing={0} alignItems='end'>
              <Typography variant='body1' textAlign='end'>
                {appInfo.buildTimeStamp}
              </Typography>
              <Link variant='body1' onClick={openBuildCommit} textAlign='end' sx={{ cursor: 'default', '&:hover': { cursor: 'pointer' } }}>
                {appInfo.commitSHAShort}
              </Link>
            </Stack>
          </Stack>
        }
      </Stack>
    </div>
  );
};

export default AboutScreen;
