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
  TextField,
  Typography,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Add, PlusOne, Refresh, Search } from '@material-ui/icons';
import AddTopicDialog from './AddTopicDialog';
import DeleteTopicDialog from './DeleteTopicDialog';
import SnackBar from '../SnackBar';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
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
  tableBar: {
    marginBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
  },
  padding: {
    paddingRight: theme.spacing(1),
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

export default function Topics({
  searchFilter,
  topics,
  isShowInternal,
  page,
  rowsPerPage,
  isLoading,
  showSnack,
  snackMessage,
  handleCloseSnack,
  handleRefresh,
  handleShowInternalChange,
  handleAddTopicOpen,
  addTopicOpen,
  handleAddTopicClose,
  handleAddTopicCreate,
  deleteTopicName,
  deleteTopicOpen,
  handleDeleteTopicClose,
  handleDeleteTopic,
  handleChangePage,
  searchTopics,
  setDeleteTopicName,
  setDeleteTopicOpen,
  currentConnection,
  readonlyMode,
}) {
  const classes = useStyles();
  const history = useHistory();

  const getReplicas = (partitions) => {
    const reps = partitions.map((p) => p.replicas.length);
    return Math.min(...reps);
  };
  const getISR = (partitions) => {
    const isr = partitions.map((p) => p.isr.length);
    return Math.min(...isr);
  };

  const tableRow = (row, idx) => {
    const replicas = getReplicas(row.partitions);
    const isr = getISR(row.partitions);

    return (
      <TableRow hover key={idx}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.partitions.length}</TableCell>
        <TableCell>{replicas}</TableCell>
        <TableCell>
          <Chip
            size="small"
            label={isr}
            color={isr < replicas ? 'default' : 'primary'}
          ></Chip>
        </TableCell>
        <TableCell>
          <ButtonGroup
            variant="text"
            size="small"
            aria-label="text primary button group"
          >
            <IconButton
              onClick={() => history.push(`/topics/${row.name}?tab=0`)}
            >
              <ArrowForwardIcon />
            </IconButton>
            <IconButton
              onClick={() => history.push(`/topics/${row.name}?tab=2`)}
            >
              <SettingsIcon />
            </IconButton>
            {!readonlyMode && (
              <IconButton
                onClick={() => {
                  setDeleteTopicName(row.name);
                  setDeleteTopicOpen(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </ButtonGroup>
        </TableCell>
      </TableRow>
    );
  };

  const topicsFilteredBySearch =
    searchFilter.length > 1
      ? topics.filter((t) => t.name.includes(searchFilter))
      : topics;

  const topicsFilteredByInternal = isShowInternal
    ? topicsFilteredBySearch
    : topicsFilteredBySearch.filter((t) => !t.name.startsWith('_')); // TODO need actual isInternal boolean

  const topicsToRender = topicsFilteredByInternal
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map(tableRow);

  const summaryTotalTopics = topics.length;
  const summaryTotalPartitions = topics.reduce(
    (acc, item) => acc + item.partitions.length,
    0
  );
  console.log(JSON.stringify(topics));
  const summaryLessThanISR = topics.reduce(
    (acc, item) =>
      item.partitions.reduce((acc, i) => {
        if (i.replicas.length != i.isr.length) {
          return acc + 1;
        } else {
          return acc;
        }
      }, 0),
    0
  );

  return (
    <React.Fragment>
      <div className={classes.loadingCentred}>
        {isLoading && <CircularProgress />}
      </div>

      <SnackBar
        open={showSnack}
        message={snackMessage}
        handleClose={handleCloseSnack}
      />

      <AddTopicDialog
        open={addTopicOpen}
        handleClose={handleAddTopicClose}
        handleAddTopic={handleAddTopicCreate}
      />

      <DeleteTopicDialog
        topicName={deleteTopicName}
        open={deleteTopicOpen}
        handleClose={handleDeleteTopicClose}
        handleDeleteTopic={handleDeleteTopic}
      />

      <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
        <Link color="inherit">{currentConnection}</Link>
        <Typography color="textPrimary">Topics</Typography>
      </Breadcrumbs>

      <Paper className={classes.paper}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <div className={classes.summaryBlock}>
            <Typography
              className={classes.summaryTitle}
              variant="h7"
              component="h7"
            >
              Topics
            </Typography>
            <Typography variant="h5" component="h5">
              {summaryTotalTopics}
            </Typography>
          </div>
          <Divider flexItem orientation="vertical" />
          <div className={classes.summaryBlock}>
            <Typography
              className={classes.summaryTitle}
              variant="h7"
              component="h7"
            >
              Partitions
            </Typography>
            <Typography variant="h5" component="h5">
              {summaryTotalPartitions}
            </Typography>
          </div>
          <Divider flexItem orientation="vertical" />
          <div className={classes.summaryBlock}>
            <Typography
              className={classes.summaryTitle}
              variant="h7"
              component="h7"
            >
              {'< ISR'}
            </Typography>
            <Typography variant="h5" component="h5">
              {summaryLessThanISR}
            </Typography>
          </div>
          <Divider flexItem orientation="vertical" />
        </Grid>
      </Paper>

      <Paper className={classes.paper}>
        <Grid
          className={classes.tableBar}
          container
          direction="row"
          justify="flex-end"
          alignItems="center"
        >
          <IconButton color="inherit" onClick={handleRefresh}>
            <Refresh />
          </IconButton>
          {/* <FormControlLabel
          control={
            <Switch
              checked={isShowInternal}
              onChange={handleShowInternalChange}
              name="checkedB"
              color="primary"
            />
          }
          label="Show internal topics"
        /> */}
          <TextField
            label="Filter topic name"
            variant="outlined"
            size="small"
            onChange={(e) => {
              searchTopics(e.target.value);
            }}
            className={classes.padding}
          ></TextField>
          {!readonlyMode && (
            <Button
              color="primary"
              variant="contained"
              startIcon={<Add />}
              className={classes.padding}
              onClick={handleAddTopicOpen}
            >
              Add Topic
            </Button>
          )}
        </Grid>
        <Table stickyHeader size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Partitions</TableCell>
              <TableCell>Replicas</TableCell>
              <TableCell>In Sync</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{topicsToRender}</TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={topicsFilteredByInternal.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </React.Fragment>
  );
}
