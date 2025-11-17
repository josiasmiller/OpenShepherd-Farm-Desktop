import React from 'react';
import {Card, CardContent, Typography, useTheme} from "@mui/material";
import transparentLogo from "../../assets/images/AnimalTrakker.png";
import {isRegistryDesktop} from '@app/buildVariant';

const SidebarHeader = () => {
  const theme = useTheme()
  return (
    <Card
      elevation={4}
      sx={{
        margin: 2,
        width: `calc(100% - ${theme.spacing(2)}`,
      }}
    >
      <CardContent>
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
        <Typography variant='h5' textAlign='center' sx={{ userSelect: 'none' }}>
          {isRegistryDesktop() ? 'Registry Desktop' : 'Farm Desktop'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SidebarHeader;
