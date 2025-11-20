import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

import { DefaultSettingsResults } from '@app/api';
import { isRegistryDesktop } from '@app/buildVariant';
import {
  Box,
  Drawer,
  drawerClasses,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  ListItemButton,
  Select,
  MenuItem,
  useTheme,
  Divider,
  FormControl,
  InputLabel,
} from "@mui/material";

import SidebarHeader from './SidebarHeader'
import {styled} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";
import {DefaultSettingsService, DefaultSettingsServiceContext} from "../../services/defaults/defaultSettingsService";

const drawerWidth = 240

const SideDrawer = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box'
  }
})

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const defaultsService = useContext<DefaultSettingsService>(DefaultSettingsServiceContext)
  const [defaultList, setDefaultList] = useState<DefaultSettingsResults[]>([]);
  const [selectedDefault, setSelectedDefault] = useState<string>("");

  useEffect(() => {
    const defaultsListSubscription = defaultsService.defaultSettings$().subscribe(setDefaultList)
    const activeDefaultsSubscription = defaultsService.activeDefaultSettings$()
      .subscribe((activeDefaults) => {
        setSelectedDefault(activeDefaults?.name ?? '')
      })
    return () => {
      activeDefaultsSubscription.unsubscribe()
      defaultsListSubscription.unsubscribe()
    }
  }, [])

  const handleDefaultChange = async (selectedName: string) => {
    const newSelected = defaultList.find((def) => def.name === selectedName);
    if (newSelected) {
      try {
        await defaultsService.selectActiveDefaultSettings(newSelected);
      } catch (error) {
        console.error("Failed to persist selected default:", error);
      }
    }
  };

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const navigationOptions = [
    { text: 'Home', icon: <HomeIcon/>, navRoute: '/', allowed: true },
    { text: 'Animal Search', icon: <SearchIcon />, navRoute: '/animal-search', allowed: true },
    { text: 'Edit Defaults', icon: <EditIcon/>, navRoute: '/create-default', allowed: true },
    { text: 'Registry', icon: <InventoryIcon />, navRoute: '/registry', allowed: isRegistryDesktop() },
  ]

  const theme = useTheme()

  return (
    <SideDrawer
      anchor='left'
      variant='permanent'
      sx={{
        width: "240px",
        height: "100vh",
      }}
    >
      <SidebarHeader/>
      <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
        <List>
          {navigationOptions.filter((option => option.allowed))
            .map(( option, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <ListItemButton onClick={() => { handleNavClick(option.navRoute) }}>
                <ListItemIcon>{option.icon}</ListItemIcon>
                <ListItemText primary={option.text}/>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Stack>
      <Stack sx={{ flexGrow: 1, justifyContent: 'end' }}>
        <Divider orientation='horizontal'/>
        <FormControl fullWidth>
          <InputLabel id='lbl-select-default-settings' sx={{ m: 2 }}>Default Settings</InputLabel>
          <Select
            id='select-default-settings'
            labelId='lbl-select-default-settings'
            label='Default Settings'
            value={selectedDefault}
            onChange={(event) => handleDefaultChange(event.target.value)}
            sx={{ m: 2 }}
          >
            {defaultList.map((def) => (
              <MenuItem key={def.name} value={def.name}>{def.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </SideDrawer>
  );
};

export default Sidebar;
