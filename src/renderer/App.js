import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Consumers from './components/consumers/Consumers';
import TopicsContainer from './containers/TopicsContainer';
import BrokersContainer from './containers/BrokersContainer';
import ConsumersContainer from './containers/ConsumersContainer';
import TopicsDetailsContainer from './containers/TopicsDetailsContainer';
import BrokersDetailsContainer from './containers/BrokersDetailsContainer';
import ConsumersDetailsContainer from './containers/ConsumersDetailsContainer';
import DashboardContainer from './containers/DashboardContainer';

export default function App() {
  const [open, setOpen] = useState(true);
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // const theme = React.useMemo(
  //   () =>
  //     createTheme({
  //       palette: {
  //         type: prefersDarkMode ? 'dark' : 'light',
  //       },
  //     }),
  //   [prefersDarkMode]
  // );

  const darkTheme = createTheme({
    palette: {
      type: 'dark',
      primary: {
        main: '#6b8bfb',
      },
      secondary: {
        main: '#6b8bfb',
      },
      background: {
        default: '#171c24',
        paper: '#232b36',
      },
    },
  });
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [readonlyMode, setReadonlyMode] = useState(false);

  const handleFeedbackClick = (e) => {
    window.api.navigateTo('https://duck.com'); // TODO feedback page
  };

  const [currentConnection, setCurrentConnection] = useState('');

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route
            path="/"
            exact
            component={() => (
              <DashboardContainer
                open={open}
                handleDrawerClose={handleDrawerClose}
                handleDrawerOpen={handleDrawerOpen}
                handleFeedbackClick={handleFeedbackClick}
                currentConnection={currentConnection}
                setCurrentConnection={setCurrentConnection}
                readonlyMode={readonlyMode}
                setReadonlyMode={setReadonlyMode}
              />
            )}
          />
          <Route
            path="/topics/:topicName"
            component={() => (
              <TopicsDetailsContainer
                open={open}
                handleDrawerClose={handleDrawerClose}
                handleDrawerOpen={handleDrawerOpen}
                handleFeedbackClick={handleFeedbackClick}
                currentConnection={currentConnection}
                setCurrentConnection={setCurrentConnection}
                readonlyMode={readonlyMode}
                setReadonlyMode={setReadonlyMode}
              />
            )}
          />
          <Route
            path="/topics"
            component={() => (
              <TopicsContainer
                open={open}
                handleDrawerClose={handleDrawerClose}
                handleDrawerOpen={handleDrawerOpen}
                handleFeedbackClick={handleFeedbackClick}
                currentConnection={currentConnection}
                setCurrentConnection={setCurrentConnection}
                readonlyMode={readonlyMode}
                setReadonlyMode={setReadonlyMode}
              />
            )}
          />
          <Route
            path="/brokers/:brokerId"
            component={() => (
              <BrokersDetailsContainer
                open={open}
                handleDrawerClose={handleDrawerClose}
                handleDrawerOpen={handleDrawerOpen}
                handleFeedbackClick={handleFeedbackClick}
                currentConnection={currentConnection}
                setCurrentConnection={setCurrentConnection}
                readonlyMode={readonlyMode}
                setReadonlyMode={setReadonlyMode}
              />
            )}
          />
          <Route
            path="/brokers"
            component={() => (
              <BrokersContainer
                open={open}
                handleDrawerClose={handleDrawerClose}
                handleDrawerOpen={handleDrawerOpen}
                handleFeedbackClick={handleFeedbackClick}
                currentConnection={currentConnection}
                setCurrentConnection={setCurrentConnection}
                readonlyMode={readonlyMode}
                setReadonlyMode={setReadonlyMode}
              />
            )}
          />
          <Route
            path="/consumers/:consumerName"
            component={() => (
              <ConsumersDetailsContainer
                open={open}
                handleDrawerClose={handleDrawerClose}
                handleDrawerOpen={handleDrawerOpen}
                handleFeedbackClick={handleFeedbackClick}
                currentConnection={currentConnection}
                setCurrentConnection={setCurrentConnection}
                readonlyMode={readonlyMode}
                setReadonlyMode={setReadonlyMode}
              />
            )}
          />
          <Route
            path="/consumers"
            component={() => (
              <ConsumersContainer
                open={open}
                handleDrawerClose={handleDrawerClose}
                handleDrawerOpen={handleDrawerOpen}
                handleFeedbackClick={handleFeedbackClick}
                currentConnection={currentConnection}
                setCurrentConnection={setCurrentConnection}
                readonlyMode={readonlyMode}
                setReadonlyMode={setReadonlyMode}
              />
            )}
          />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}
