import React, {useContext, useEffect, useState} from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Typography
} from "@mui/material";

import {FolderOpenIcon, XIcon} from "lucide-react";
import { SystemService, SystemServiceContext } from '../../services/system/systemService';
import {DatabaseSessionInfo} from "packages/api/lib/dtos";

const SessionInfoBar = () => {

  const systemService = useContext<SystemService>(SystemServiceContext)
  const [sessionInfo, setSessionInfo] = useState<DatabaseSessionInfo | null>(null)
  const [confirmCloseDatabase, setConfirmCloseDatabase] = useState<boolean>(false)

  useEffect(() => {
    const subscription = systemService.databaseSessionInfo$()
      .subscribe((current) => {
        setSessionInfo(current)
      })
    return () => { subscription.unsubscribe() }
  }, [])

  const openDatabaseHandler = async () => {
    try {
      await systemService.openDatabase()
    } catch (error) {
      console.log(error)
    }
  }

  const confirmCloseDatabaseHandler = () => {
    setConfirmCloseDatabase(true)
  }

  const closeDatabaseHandler = async () => {
    setConfirmCloseDatabase(false)
    try {
      await systemService.closeDatabase()
    } catch (error) {
      console.log(error)
    }
  }

  const cancelCloseDatabaseHandler = () => {
    setConfirmCloseDatabase(false)
  }

  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
        alignItems: 'center',
        padding: 1,
      }}>
        <Typography variant='caption' sx={{ mr: 2 }}>{sessionInfo?.path ?? 'No Open Databases'}</Typography>
        <IconButton aria-label='Open Database' onClick={openDatabaseHandler}>
          <FolderOpenIcon size={20}/>
        </IconButton>
        <IconButton aria-label='Close Database' onClick={confirmCloseDatabaseHandler} disabled={sessionInfo == null}>
          <XIcon size={20}/>
        </IconButton>
      </Box>
      <Dialog
        open={confirmCloseDatabase}
        onClose={cancelCloseDatabaseHandler}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to close the database?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelCloseDatabaseHandler}>Cancel</Button>
          <Button onClick={closeDatabaseHandler} autoFocus>Continue</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SessionInfoBar;
