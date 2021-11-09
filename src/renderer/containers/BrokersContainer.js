import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Breadcrumbs } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import AppBarDrawer from 'renderer/components/AppBarDrawer';
import Brokers from 'renderer/components/brokers/Brokers';

export default function BrokersContainer({
  open,
  handleDrawerOpen,
  handleDrawerClose,
  handleFeedbackClick,
  currentConnection,
  setCurrentConnection,
  readonlyMode,
  setReadonlyMode,
}) {
  const [brokers, setBrokers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [leaderId, setLeaderId] = useState(0);
  const [clusterId, setClusterId] = useState('');

  useEffect(() => {
    console.log('use effect borkers');
    window.api.listBrokers(currentConnection).then((t) => {
      console.log(t.brokers);
      setBrokers(t.brokers);
      setIsLoading(false);
      setClusterId(t.clusterId);
      setLeaderId(t.controller);
    });
  }, []);

  return (
    <AppBarDrawer
      open={open}
      handleDrawerOpen={handleDrawerOpen}
      handleDrawerClose={handleDrawerClose}
      selectedItem="brokers"
      handleFeedbackClick={handleFeedbackClick}
      currentConnection={currentConnection}
      setCurrentConnection={setCurrentConnection}
      readonlyMode={readonlyMode}
      setReadonlyMode={setReadonlyMode}
      children={
        <Brokers
          brokers={brokers}
          leaderId={leaderId}
          clusterId={clusterId}
          setBrokers={setBrokers}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          currentConnection={currentConnection}
        />
      }
    ></AppBarDrawer>
  );
}
