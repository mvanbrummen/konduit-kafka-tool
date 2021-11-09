import React, { useEffect, useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ViewListIcon from '@material-ui/icons/ViewList';
import DnsIcon from '@material-ui/icons/Dns';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import { useHistory } from 'react-router-dom';
import { Chip, Divider, Menu, MenuItem, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import NewConnectionModal from './connections/NewConnectionModal';

export const MainListItems = ({
  selectedItem,
  currentConnection,
  setCurrentConnection,
  showItems,
}) => {
  const history = useHistory();

  const [clusterTotals, setClusterTotals] = useState({});

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [newConnectionOpen, setNewConnectionOpen] = useState(false);
  const handleNewConnectionClose = (e) => {
    setNewConnectionOpen(false);
    handleClose();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const f = async () => {
      const totals = await window.api.fetchClusterTotals(currentConnection);

      setClusterTotals(totals);
    };

    f().catch((e) => console.log(e));
  }, []);

  const [connections, setConnections] = useState({});

  useEffect(() => {
    const connections = window.api.getConnections();

    console.log(JSON.stringify(connections));

    setConnections(connections);
  }, []);

  return (
    <div>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <Add />
        </ListItemIcon>
        <ListItemText
          primary="Connections"
          secondary={
            currentConnection !== '' && (
              <Chip label={currentConnection} size="small" color="primary" />
            )
          }
        />
      </ListItem>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.keys(connections).map((conn, idx) => (
          <MenuItem
            disabled={conn === currentConnection}
            onClick={() => {
              setCurrentConnection(conn);
              history.push('/topics');
            }}
          >
            {conn}
          </MenuItem>
        ))}
        <MenuItem
          onClick={(e) => {
            setNewConnectionOpen(true);
          }}
        >
          Add Connection...
        </MenuItem>
      </Menu>
      <NewConnectionModal
        onClose={handleNewConnectionClose}
        open={newConnectionOpen}
        setCurrentConnection={setCurrentConnection}
      />
      <Divider />

      {showItems && (
        <div>
          {' '}
          <ListItem
            button
            selected={selectedItem === 'brokers'}
            onClick={() => {
              history.push('/brokers');
            }}
          >
            <ListItemIcon>
              <DnsIcon />
            </ListItemIcon>
            <ListItemText primary="Brokers" />

            <Typography color="error" variant="caption">
              {clusterTotals.total_brokers}
            </Typography>
          </ListItem>
          <ListItem
            button
            selected={selectedItem === 'topics'}
            onClick={() => {
              history.push('/topics');
            }}
          >
            <ListItemIcon>
              <ViewListIcon />
            </ListItemIcon>
            <ListItemText primary="Topics" />
            <Typography color="error" variant="caption">
              {clusterTotals.total_topics}
            </Typography>
          </ListItem>
          <ListItem
            button
            selected={selectedItem === 'consumers'}
            onClick={() => {
              history.push('/consumers');
            }}
          >
            <ListItemIcon>
              <AcUnitIcon />
            </ListItemIcon>
            <ListItemText primary="Consumers" />
            <Typography color="error" variant="caption">
              {clusterTotals.total_consumers}
            </Typography>
          </ListItem>
        </div>
      )}

      {/* <ListItem button>
        <ListItemIcon>
          <LibraryBooksIcon />
        </ListItemIcon>
        <ListItemText primary="SCHEMAS" />
        </ListItem> */}
    </div>
  );
};
