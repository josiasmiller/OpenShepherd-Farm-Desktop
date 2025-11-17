import React, {useContext} from 'react';
import transparentLogo from "../assets/images/AnimalTrakker.png";
import {isRegistryDesktop} from '@app/buildVariant';

import {
  Box,
  Button,
  Card,
  Divider,
  styled,
  Typography
} from "@mui/material";

import {
  SessionManagementService,
  SessionManagementServiceContext
} from "../services/session/management/sessionManagementService";

const OpenSessionCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  maxWidth: '450px',
}));

export const LandingScreen = React.forwardRef((props, ref) => {
  const sessionManagementService = useContext<SessionManagementService>(SessionManagementServiceContext)
  const openDatabase = async () => {
    try {
      await sessionManagementService.openSession()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Box {...props} ref={ref} component='div' sx={{ width: '100vw', height: '100vh', display: 'grid', placeContent: 'center' }}>
      <OpenSessionCard elevation={4}>
        <img
          src={transparentLogo}
          alt="App Icon"
          draggable={false}
          style={{
            display: 'block',
            width: "100%",
            height: "auto",
            margin: "0 auto",
            userSelect: "none",
          }}/>
        <Typography variant='h3' textAlign='center' sx={{ userSelect: 'none' }}>
          {isRegistryDesktop() ? 'Registry Desktop' : 'Farm Desktop'}
        </Typography>
        <Divider />
        <Button
          variant="contained"
          size='large'
          onClick={ async () => { await openDatabase() }}
        >
          Open Database
        </Button>
      </OpenSessionCard>
    </Box>
  );
})

export default LandingScreen;
