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
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  TablePagination,
  Typography,
  TextField,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {
  Add,
  Pause,
  PlayArrow,
  PlusOne,
  Refresh,
  Search,
} from '@material-ui/icons';
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
  tabs: {
    marginBottom: theme.spacing(2),
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

const getMemberAssignments = (memberAssignments) => {
  const assignments = Object.keys(memberAssignments.assignment);

  return assignments.map((a) => {
    return (
      <Chip label={a + ' ' + JSON.stringify(memberAssignments.assignment[a])} />
    );
  });
};
const ConsumerMembers = ({ members }) => {
  console.log('members ' + JSON.stringify(members));
  return (
    <>
      <Table stickyHeader size="small">
        <TableHead>
          <TableCell>Client ID</TableCell>
          <TableCell>Member ID</TableCell>
          <TableCell>Host</TableCell>
          <TableCell>Member Assignments</TableCell>
        </TableHead>

        <TableBody>
          {members.map((member, idx) => {
            return (
              <TableRow key={idx} hover>
                <TableCell>{member.clientId}</TableCell>
                <TableCell>{member.memberId}</TableCell>
                <TableCell>{member.clientHost}</TableCell>
                <TableCell>
                  {getMemberAssignments(member.memberAssignments)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

const ConsumerTopics = ({ topics }) => {
  const history = useHistory();

  return (
    <>
      <Table stickyHeader size="small">
        <TableHead>
          <TableCell>Topic</TableCell>
          <TableCell>Partition</TableCell>
          <TableCell>Client Host</TableCell>
          <TableCell>Actions</TableCell>
        </TableHead>

        <TableBody>
          {topics.map((topic, idx) => {
            return (
              <TableRow key={idx} hover>
                <TableCell>{topic.topic}</TableCell>
                <TableCell>{topic.partition}</TableCell>
                <TableCell>{topic.clientHost}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      history.push(`/topics/${topic.topic}?tab=1`);
                    }}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default function ConsumerDetails({
  activeTab,
  consumerName,
  members,
  topics,
  currentConnection,
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
            history.push('/consumers');
          }}
        >
          Consumers
        </Link>
        <Typography color="textPrimary">{consumerName}</Typography>
      </Breadcrumbs>

      <Paper className={classes.paper}>
        <Tabs
          value={value}
          onChange={handleChange}
          className={classes.tabs}
          aria-label="simple tabs example"
        >
          <Tab label="Members" {...a11yProps(0)} />
          <Tab label="Topics" {...a11yProps(0)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <ConsumerMembers members={members} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ConsumerTopics topics={topics} />
        </TabPanel>
      </Paper>
    </>
  );
}
