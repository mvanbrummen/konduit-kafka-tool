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
  FormControl,
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
import {
  Add,
  Pause,
  PlayArrow,
  PlusOne,
  Refresh,
  Search,
} from '@material-ui/icons';
import AddTopicDialog from './AddTopicDialog';
import DeleteTopicDialog from './DeleteTopicDialog';
import SnackBar from '../SnackBar';
import { useHistory } from 'react-router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
  convertMiliseconds,
  formatBytes,
  formatPercentage,
} from 'renderer/utils/formatUtil';

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
  tabs: {
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
  marginButtons: {
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  summaryBlock: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  summaryTitle: {
    color: '#919EAB',
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

function TopicConsumers({ topicConsumers }) {
  const history = useHistory();
  return (
    <Table stickyHeader size="small">
      <TableHead>
        <TableRow>
          <TableCell>Group ID</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {topicConsumers.map((row, idx) => (
          <TableRow hover key={idx}>
            <TableCell>{row.groupId}</TableCell>
            <TableCell>
              <IconButton
                size="small"
                onClick={(e) => {
                  history.push(`/consumers/${row.groupId}?tab=0`);
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function TopicConfiguration({ configProps }) {
  const classes = useStyles();
  console.log(JSON.stringify(configProps));
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
        {/* <Button color="primary" variant="contained">
          Update
        </Button> */}
      </Grid>
    </div>
  );
}

export default function TopicDetails({
  configProperties,
  topicMetadata,
  activeTab,
  topicConsumers,
  topicName,
  consumeModal,
  produceModal,
  handleConsumeModalOpen,
  currentConnection,
  handleProduceModalOpen,
  readonlyMode,
}) {
  const classes = useStyles();
  const history = useHistory();

  const [value, setValue] = React.useState(
    activeTab !== undefined ? activeTab : 0
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getISRColor = (row) => {
    const replicas = row.replicas.length;
    const isr = row.isr.length;
    if (isr < replicas) {
      return 'default';
    } else {
      return 'primary';
    }
  };

  const summaryFields = [
    'cleanup.policy',
    'segment.bytes',
    'segment.ms',
    'min.cleanable.dirty.ratio',
    'delete.retention.ms',
  ];
  const summaryItems = configProperties.filter((c) =>
    summaryFields.includes(c.configName)
  );

  const formatSummaryValue = (name, value) => {
    switch (name) {
      case 'segment.bytes':
        return formatBytes(value);
        break;

      case 'segment.ms':
        return `${convertMiliseconds(value, 'd')} days`;
        break;

      case 'delete.retention.ms':
        return `${convertMiliseconds(value, 'd')} days`;
        break;

      case 'min.cleanable.dirty.ratio':
        return formatPercentage(value);
        break;

      default:
        return value;
        break;
    }
  };

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
        <Link color="inherit">{currentConnection}</Link>
        <Link
          color="inherit"
          onClick={() => {
            history.push('/topics');
          }}
        >
          Topics
        </Link>
        <Typography color="textPrimary">{topicName}</Typography>
      </Breadcrumbs>

      <Paper className={classes.paper}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          {summaryItems.map((summaryItem, idx) => (
            <>
              <div key={idx} className={classes.summaryBlock}>
                <Typography
                  className={classes.summaryTitle}
                  variant="h7"
                  component="h7"
                >
                  {summaryItem.configName}
                </Typography>
                <Typography variant="h5" component="h5">
                  {formatSummaryValue(
                    summaryItem.configName,
                    summaryItem.configValue
                  )}
                </Typography>
              </div>
              <Divider flexItem orientation="vertical" />
            </>
          ))}
        </Grid>
      </Paper>

      {consumeModal}
      {produceModal}

      <Grid container direction="row" justify="flex-end" alignItems="center">
        <Button
          className={classes.marginButtons}
          variant="contained"
          color="primary"
          onClick={handleConsumeModalOpen}
        >
          Consume
        </Button>
        {!readonlyMode && (
          <Button
            className={classes.marginButtons}
            variant="contained"
            color="primary"
            onClick={handleProduceModalOpen}
          >
            Produce
          </Button>
        )}
      </Grid>

      <Paper className={classes.paper}>
        <Tabs
          value={value}
          onChange={handleChange}
          className={classes.tabs}
          aria-label="simple tabs example"
        >
          <Tab label="Partitions" {...a11yProps(0)} />
          <Tab label="Consumers" {...a11yProps(1)} />
          <Tab label="Configuration" {...a11yProps(2)} />
        </Tabs>

        <TabPanel value={value} index={0}>
          <Table stickyHeader size="small" className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Partition ID</TableCell>
                <TableCell>Leader</TableCell>
                <TableCell>Replicas</TableCell>
                <TableCell>ISR</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topicMetadata.topics.length > 0 ? (
                topicMetadata.topics[0].partitions.map((row, idx) => (
                  <TableRow hover key={idx}>
                    <TableCell>
                      <Chip size="small" label={row.partitionId}></Chip>
                    </TableCell>
                    <TableCell>{row.leader}</TableCell>
                    <TableCell>{row.replicas.join(', ')}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row.isr.join(', ')}
                        color={getISRColor(row)}
                      ></Chip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <div>No data</div>
              )}
            </TableBody>
          </Table>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TopicConsumers topicConsumers={topicConsumers} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <TopicConfiguration configProps={configProperties} />
        </TabPanel>
      </Paper>
    </>
  );
}
