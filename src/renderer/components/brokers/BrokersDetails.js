import React, { useEffect, useState } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from '../Title';
import {
  Breadcrumbs,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  TablePagination,
  TextField,
  Typography,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Add, PlusOne, Refresh, Search } from '@material-ui/icons';
import SnackBar from '../SnackBar';
import { useHistory } from 'react-router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  loadingCentred: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  table: {
    overflowY: 'hidden',
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  tableBar: {
    marginBottom: theme.spacing(2),
  },
  padding: {
    paddingRight: theme.spacing(1),
  },
  buttonBar: {
    padding: theme.spacing(2),
  },
  textField: {
    fontSize: '0.825rem',
  },
  tabs: {
    marginBottom: theme.spacing(2),
  },
  breadcrumbs: {
    marginBottom: theme.spacing(1),
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function BrokerConfiguration({ configProps }) {
  const classes = useStyles();
  return (
    <div>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Property Name</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {configProps.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.configName}</TableCell>
              <TableCell>
                <TextField
                  InputProps={{
                    classes: {
                      input: classes.textField,
                    },
                  }}
                  variant="outlined"
                  fullWidth={true}
                  size="small"
                  value={row.configValue}
                  disabled={row.readOnly}
                ></TextField>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Grid
        className={classes.buttonBar}
        container
        direction="row"
        justify="flex-end"
        alignItems="center"
      >
        <Button color="primary" variant="contained">
          Update
        </Button>
      </Grid>
    </div>
  );
}

export default function BrokersDetails({
  configProperties,
  activeTab,
  currentConnection,
  brokerId,
}) {
  const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = React.useState(
    activeTab !== undefined ? activeTab : 0
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
        <Link color="inherit">{currentConnection}</Link>
        <Link
          color="inherit"
          onClick={() => {
            history.push('/brokers');
          }}
        >
          Brokers
        </Link>
        <Typography color="textPrimary">{brokerId}</Typography>
      </Breadcrumbs>
      <Paper className={classes.paper}>
        <Tabs
          className={classes.tabs}
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Configuration" {...a11yProps(0)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <BrokerConfiguration configProps={configProperties} />
        </TabPanel>
      </Paper>
    </>
  );
}
