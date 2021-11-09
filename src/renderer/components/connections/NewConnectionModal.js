import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import { Pause, PlayArrow } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  height: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    marginBottom: theme.spacing(2),
    minWidth: 150,
  },
  titleMargin: {
    marginBottom: theme.spacing(1),
  },
  content: {
    marginTop: theme.spacing(1),
  },
  buttons: {
    margin: theme.spacing(1),
  },
}));

export default function NewConnectionModal({
  open,
  onClose,
  setCurrentConnection,
}) {
  const classes = useStyles();
  const history = useHistory();

  const [connectionName, setConnectionName] = useState('');
  const [brokers, setBrokers] = useState('');

  const handleCreate = (e) => {
    const connection = {
      [connectionName]: {
        brokers: brokers,
      },
    };
    console.log(JSON.stringify(connection));
    window.api.newConnection(connection);
    setCurrentConnection(connectionName);
    onClose();
    history.push('/topics');
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography className={classes.titleMargin} variant="h6" component="h2">
          New Connection
        </Typography>

        <Divider />

        <div className={classes.content}>
          <Grid container direction="column">
            <FormControl className={classes.formControl}>
              <TextField
                id="connectionNameField"
                size="small"
                label="Connection Name"
                onChange={(e) => setConnectionName(e.target.value)}
              ></TextField>
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                id="brokersField"
                size="small"
                helperText="Comma separate multiple brokers"
                label="Brokers"
                onChange={(e) => setBrokers(e.target.value)}
              ></TextField>
            </FormControl>

            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              <Button
                className={classes.buttons}
                variant="contained"
                onClick={onClose}
              >
                Cancel
              </Button>

              <Button
                className={classes.buttons}
                color="primary"
                variant="contained"
                onClick={handleCreate}
              >
                Create
              </Button>
            </Grid>
          </Grid>
        </div>
      </Box>
    </Modal>
  );
}
