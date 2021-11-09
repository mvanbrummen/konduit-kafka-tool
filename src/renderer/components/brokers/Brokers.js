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
  Tooltip,
  Typography,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { useHistory } from 'react-router';
import { Star } from '@material-ui/icons';

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

  summaryBlock: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  summaryTitle: {
    color: '#919EAB',
  },
  breadcrumbs: {
    marginBottom: theme.spacing(1),
  }
}));

export default function Brokers({
  brokers,
  setBrokers,
  isLoading,
  setIsLoading,
  leaderId,
  clusterId,
  currentConnection,
}) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <React.Fragment>
      <div className={classes.loadingCentred}>
        {isLoading && <CircularProgress />}
      </div>
      <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
        <Link color="inherit">{currentConnection}</Link>
        <Typography color="textPrimary">Brokers</Typography>
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
              Brokers
            </Typography>
            <Typography variant="h5" component="h5">
              {brokers.length}
            </Typography>
          </div>
          <Divider flexItem orientation="vertical" />
          <div className={classes.summaryBlock}>
            <Typography
              className={classes.summaryTitle}
              variant="h7"
              component="h7"
            >
              Controller
            </Typography>
            <Typography variant="h5" component="h5">
              {leaderId}
            </Typography>
          </div>
          <Divider flexItem orientation="vertical" />
        </Grid>
      </Paper>

      <Paper className={classes.paper}>
        <Table stickyHeader size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Host</TableCell>
              <TableCell>Port</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brokers.map((row, idx) => (
              <TableRow hover key={idx}>
                <TableCell>
                  {row.nodeId === leaderId && (
                    <Tooltip title="Node is the leader">
                      <Star size="small" />
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>
                  <Chip size="small" label={row.nodeId}></Chip>
                </TableCell>
                <TableCell>{row.host}</TableCell>
                <TableCell>{row.port}</TableCell>
                <TableCell>
                  <ButtonGroup
                    variant="text"
                    size="small"
                    aria-label="text primary button group"
                  >
                    <IconButton
                      onClick={() => history.push(`/brokers/${row.nodeId}`)}
                    >
                      <SettingsIcon />
                    </IconButton>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={brokers.length}
          page={0}
          rowsPerPage={100}
          onPageChange={() => {}}
        />
      </Paper>
    </React.Fragment>
  );
}
