import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { handleResult } from "packages/core";
import { DefaultSettingsResults } from "packages/api";
import { isRegistryDesktop } from "packages/appBuild";
import {
  Box,
  Button,
  Typography,
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
import HomeIcon from "@mui/icons-material/Home.js";
import SearchIcon from "@mui/icons-material/Search.js";
import EditIcon from "@mui/icons-material/Edit.js";
import InventoryIcon from "@mui/icons-material/Inventory.js";

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
  const [dbFileName, setDbFileName] = useState("No database selected");
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [defaultList, setDefaultList] = useState<DefaultSettingsResults[]>([]);
  const [selectedDefault, setSelectedDefault] = useState<string>("");

  // Check if database is already loaded (on mount and after file selection)
  const checkDbStatus = async () => {
    const loaded: boolean = await window.systemAPI.isDatabaseLoaded();
    setIsDbLoaded(loaded);
  };

  useEffect(() => {
    const loadPreviousDefault = async () => {
      try {
        const saved : DefaultSettingsResults | null = await window.storeAPI.getSelectedDefault();

        if (
          saved &&
          defaultList.some((def) => def.id === saved.id)
        ) {
          setSelectedDefault(saved.name);
        }
      } catch (error) {
        console.error("Failed to load previous default:", error);
      }
    };

    if (isDbLoaded && defaultList.length > 0) {
      loadPreviousDefault();
    }
  }, [isDbLoaded, defaultList]);

  const handleDefaultChange = async (selectedName: string) => {
    const newSelected = defaultList.find((def) => def.name === selectedName);
    if (newSelected) {
      setSelectedDefault(newSelected.name);
      try {
        await window.storeAPI.setSelectedDefault(newSelected);
      } catch (error) {
        console.error("Failed to persist selected default:", error);
      }
    }
  };

  useEffect(() => {
    checkDbStatus();
  }, []);

  const handleSelectDatabase = async () => {
    try {
      const filePath: string | null = await window.systemAPI.selectDatabase();
      if (!filePath) return;

      setDbFileName(filePath);

      // Fetch defaults from DB
      const defaults = await window.defaultsAPI.getExisting();

      handleResult(defaults, {
        success: async (data: DefaultSettingsResults[]) => {
          setDefaultList(data);

          try {
            const saved = await window.storeAPI.getSelectedDefault();

            // If saved default exists in the new DB's defaults
            const match = saved && data.find((def) => def.id === saved.id);
            if (match) {
              setSelectedDefault(match.name);
            } else {
              setSelectedDefault(data[0]?.name || "");
            }
          } catch (error) {
            console.error("Failed to restore saved default: ", error);
            setSelectedDefault(data[0]?.name || "");
          }
        },
        error: (err: any) => {
          console.error("Failed to fetch existing defaults:", err);
        },
      });

      await checkDbStatus(); // Refresh DB status
    } catch (err) {
      console.error("Failed to select database:", err);
    }
  };


  const handleNavClick = (path: string) => {
    if (!isDbLoaded && path !== "/") {
      Swal.fire({
        title: "Please select a valid database file first.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }
    navigate(path);
  };

  const getLinkStyle = (enabled: boolean) => ({
    cursor: enabled ? "pointer" : "not-allowed",
    opacity: enabled ? 1 : 0.5,
  });

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
      <Stack sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
        <Box sx={{
          mx: 1,
          mt: 'auto',
          p: 2,
          textAlign: 'center',
          width: `calc(100% - ${theme.spacing(2)})`
        }}>
          <Button
            variant='contained'
            onClick={handleSelectDatabase}
            sx={{
              p: 1,
              width: '100%'
            }}
          >
            Select Database
          </Button>
          <Typography
            variant='body1'
            sx={{
              padding: '8px 8px',
              wordWrap: 'break-word',
              whiteSpace: 'normal',
              maxWidth: '100%'
            }}
          >
            {dbFileName}
          </Typography>
          {isDbLoaded && (
            <>
              <Divider orientation='horizontal' sx={{ mt: 1, mb: 2 }}/>
              <FormControl fullWidth>
                <InputLabel id='lbl-select-default-settings'>Choose Defaults</InputLabel>
                <Select
                  id='select-default-settings'
                  labelId='lbl-select-default-settings'
                  label='Choose Defaults'
                  value={selectedDefault}
                  onChange={(event) => handleDefaultChange(event.target.value)}
                >
                  {defaultList.map((def) => (
                    <MenuItem key={def.name} value={def.name}>{def.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </Box>
      </Stack>
    </SideDrawer>
  );
};

export default Sidebar;
