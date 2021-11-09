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
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  TablePagination,
  TextField,
  Typography,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Refresh } from '@material-ui/icons';
import DeleteConsumerDialog from './DeleteConsumerDialog';
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
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
  },
  table: {
    overflowY: 'hidden',
  },
  tableBar: {
    marginBottom: theme.spacing(2),
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

export default function Consumers({
  currentConnection,
  consumers,
  setConsumers,
  isLoading,
  setIsLoading,
  searchFilter,
  setSearchFilter,
  page,
  setPage,
  refresh,
  setRefresh,
  totalConsumers,
  setTotalConsumers,
  rowsPerPage,
  handleRefresh,
  handleChangePage,
  searchConsumers,
  setDeleteConsumerName,
  handleDeleteConsumer,
  setDeleteCosumerOpen,
  deleteConsumerName,
  deleteConsumerOpen,
  handleDeleteConsumerClose,
  readonlyMode,
}) {
  const classes = useStyles();
  const history = useHistory();

  const getStateColor = (state) => {
    switch (state) {
      case 'Stable':
        return 'primary';
        break;
      case 'Dead':
        return 'error';
        break;

      default:
        break;
    }
  };

  const tableRow = (row, idx) => (
    <TableRow hover key={idx}>
      <TableCell>{row.groupId}</TableCell>
      <TableCell>{row.members.length}</TableCell>
      <TableCell>
        <Chip label={row.state} color={getStateColor(row.state)}></Chip>
      </TableCell>

      <TableCell>
        <ButtonGroup
          variant="text"
          size="small"
          aria-label="text primary button group"
        >
          <IconButton
            onClick={(e) => {
              history.push(`/consumers/${row.groupId}?tab=0`);
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
          {!readonlyMode && (
            <IconButton
              onClick={(e) => {
                setDeleteConsumerName(row.groupId);
                setDeleteCosumerOpen(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </ButtonGroup>
      </TableCell>
    </TableRow>
  );

  const consumersFilteredBySearch =
    searchFilter.length > 1
      ? consumers.filter((c) => c.groupId.includes(searchFilter))
      : consumers;

  const consumersToRender = consumersFilteredBySearch
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map(tableRow);

  return (
    <React.Fragment>
      <div className={classes.loadingCentred}>
        {isLoading && <CircularProgress />}
      </div>

      <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
        <Link color="inherit">{currentConnection}</Link>
        <Typography color="textPrimary">Consumers</Typography>
      </Breadcrumbs>

      <DeleteConsumerDialog
        consumerName={deleteConsumerName}
        open={deleteConsumerOpen}
        handleClose={handleDeleteConsumerClose}
        handleDeleteConsumer={handleDeleteConsumer}
      />

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
              Consumers
            </Typography>
            <Typography variant="h5" component="h5">
              {consumers.length}
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
          <TextField
            label="Filter consumer groups"
            variant="outlined"
            size="small"
            onChange={(e) => {
              searchConsumers(e.target.value);
            }}
            className={classes.padding}
          ></TextField>
        </Grid>
        <Table stickyHeader size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Members</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{consumersToRender}</TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={consumersFilteredBySearch.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </React.Fragment>
  );
}
