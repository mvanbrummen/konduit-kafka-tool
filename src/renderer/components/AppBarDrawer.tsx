import React, { useState } from 'react';
import clsx from 'clsx';

import logo from '../../../assets/icons/logo_k.png';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { MainListItems } from './MainListItems';
import SettingsIcon from '@material-ui/icons/Settings';
import { FormControlLabel, Link, Switch } from '@material-ui/core';
import SettingsModal from './SettingsModal';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appLogo: {
    position: 'absolute',
    top: 10,
    left: 3,
    height: 48,
    width: 48,
    zIndex: theme.zIndex.appBar + 1000,
    cursor: 'pointer',
  },
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    backgroundColor: theme.palette.background.paper,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  version: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: theme.spacing(1),
  },
  feedback: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: theme.spacing(1),
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  fixedHeight: {
    height: 240,
  },
}));

interface NavContainerProps {
  open: boolean;
  selectedItem: 'brokers' | 'topics' | 'consumers';
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
  children: React.ReactChildren | React.ReactChild;
  handleFeedbackClick?: React.MouseEvent;
  currentConnection: string;
  setCurrentConnection: (connectionName: string) => void;
  showItems?: boolean;
  readonlyMode: boolean;
  setReadonlyMode: (readonlyMode: boolean) => void;
}

export default function AppBarDrawer(props: NavContainerProps) {
  const classes = useStyles();

  const {
    open,
    handleDrawerOpen,
    handleDrawerClose,
    children,
    handleFeedbackClick,
    selectedItem,
    currentConnection,
    setCurrentConnection,
    showItems = true,
    readonlyMode = false,
    setReadonlyMode,
  } = props;

  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSettingsOpen = () => setSettingsOpen(true);
  const handleSettingsClose = () => setSettingsOpen(false);

  return (
    <div className={classes.root}>
      <img
        className={classes.appLogo}
        src={logo}
        alt="logo"
        onClick={handleDrawerOpen}
      ></img>

      <CssBaseline />

      <SettingsModal
        handleFeedbackClick={handleFeedbackClick}
        open={settingsOpen}
        onClose={handleSettingsClose}
      />

      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          ></IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          ></Typography>

          <FormControlLabel
            control={
              <Switch
                checked={readonlyMode}
                onChange={(e) => {
                  setReadonlyMode(e.target.checked);
                }}
                name="readOnlySwitch"
                color="primary"
              />
            }
            label="Read-only"
          />
          <IconButton color="inherit" onClick={handleSettingsOpen}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <MainListItems
            currentConnection={currentConnection}
            selectedItem={selectedItem}
            setCurrentConnection={setCurrentConnection}
            showItems={showItems == true}
          />
        </List>
        {open && (
          <>
            <div className={classes.version}>
              <Typography variant="caption">v0.0.1</Typography>
            </div>

            <div className={classes.feedback}>
              <Link
                component="button"
                variant="caption"
                onClick={handleFeedbackClick}
              >
                Have feedback?
              </Link>
            </div>
          </>
        )}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Recent Orders */}
            <Grid item xs={12}>
              {children}
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
