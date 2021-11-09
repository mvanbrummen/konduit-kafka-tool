import React, { useEffect, useState } from 'react';
import Topics from '../components/topics/Topics';
import AppBarDrawer from '../components/AppBarDrawer';
import { Typography } from '@material-ui/core';

export default function DashboardContainer({
  open,
  handleDrawerOpen,
  handleDrawerClose,
  handleFeedbackClick,
  currentConnection,
  setCurrentConnection,
  readonlyMode,
  setReadonlyMode,
}) {
  const [showSnack, setShowSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const handleOpenSnack = (message) => {
    setSnackMessage(message);
    setShowSnack(true);
  };
  const handleCloseSnack = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSnack(false);
  };

  return (
    <AppBarDrawer
      open={open}
      handleDrawerOpen={handleDrawerOpen}
      handleDrawerClose={handleDrawerClose}
      showItems={false}
      selectedItem=""
      handleFeedbackClick={handleFeedbackClick}
      currentConnection={currentConnection}
      setCurrentConnection={setCurrentConnection}
      readonlyMode={readonlyMode}
      setReadonlyMode={setReadonlyMode}
    >
      <Typography>Add / Select a connection to get started</Typography>
    </AppBarDrawer>
  );
}
