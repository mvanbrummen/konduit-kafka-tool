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
import Consumers from 'renderer/components/consumers/Consumers';

export default function ConsumersContainer({
  open,
  handleDrawerClose,
  handleDrawerOpen,
  handleFeedbackClick,
  currentConnection,
  setCurrentConnection,
  readonlyMode,
  setReadonlyMode,
}) {
  const [consumers, setConsumers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [page, setPage] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const [totalConsumers, setTotalConsumers] = useState(0);

  const [deleteConsumerName, setDeleteConsumerName] = useState('');
  const [deleteConsumerOpen, setDeleteConsumerOpen] = useState(false);

  const handleDeleteConsumerClose = () => {
    setDeleteConsumerOpen(false);
  };

  const handleDeleteConsumer = () => {
    const f = async () => {
      await window.api.deleteConsumer(currentConnection, deleteConsumerName);
    };

    f().catch((e) => console.log(e));

    handleDeleteConsumerClose();

    // set to first page otherwise could delete and be on an empty page
    setPage(0);
    setTotalConsumers(totalConsumers - 1);
  };

  useEffect(() => {
    console.log('use effect');
    window.api.listConsumers(currentConnection).then((c) => {
      setConsumers(c);
      setIsLoading(false);
    });
  }, [totalConsumers, refresh]);

  const searchConsumers = (searchValue) => {
    if (searchValue.length > 0) {
      setPage(0);
    }
    setSearchFilter(searchValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const rowsPerPage = 20;

  return (
    <AppBarDrawer
      open={open}
      handleDrawerOpen={handleDrawerOpen}
      handleDrawerClose={handleDrawerClose}
      selectedItem="consumers"
      handleFeedbackClick={handleFeedbackClick}
      currentConnection={currentConnection}
      setCurrentConnection={setCurrentConnection}
      readonlyMode={readonlyMode}
      setReadonlyMode={setReadonlyMode}
      children={
        <Consumers
          readonlyMode={readonlyMode}
          currentConnection={currentConnection}
          consumers={consumers}
          setConsumers={setConsumers}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          page={page}
          setPage={setPage}
          refresh={refresh}
          setRefresh={setRefresh}
          totalConsumers={totalConsumers}
          setTotalConsumers={setTotalConsumers}
          rowsPerPage={rowsPerPage}
          handleRefresh={handleRefresh}
          handleChangePage={handleChangePage}
          searchConsumers={searchConsumers}
          setDeleteConsumerName={setDeleteConsumerName}
          handleDeleteConsumer={handleDeleteConsumer}
          handleDeleteConsumerClose={handleDeleteConsumerClose}
          setDeleteCosumerOpen={setDeleteConsumerOpen}
          deleteConsumerName={deleteConsumerName}
          deleteConsumerOpen={deleteConsumerOpen}
        />
      }
    />
  );
}
