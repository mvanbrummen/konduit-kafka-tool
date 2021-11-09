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
  TextareaAutosize,
  TextField,
  Typography,
} from '@material-ui/core';
import { Add, Delete, Pause, PlayArrow } from '@material-ui/icons';
import React, { useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1200,
  height: 650,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(2),
    minWidth: 242,
  },
  titleMargin: {
    marginBottom: theme.spacing(1),
  },
  content: {
    marginTop: theme.spacing(1),
  },
  buttons: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
  },
  responseTextArea: {},
  leftPanel: {
    height: 570,
    position: 'relative',
    overflow: 'scroll',
  },
}));

export default function ProduceModal({
  topicName,
  open,
  onClose,
  currentConnection,
}) {
  const classes = useStyles();

  const [messageKey, setMessageKey] = useState('');
  const [messageValue, setMessageValue] = useState('');
  const [metaResponse, setMetaResponse] = useState('');

  const emptyMessageHeader = () => ({
    headerKey: '',
    headerValue: '',
  });
  const [messageHeaders, setMessageHeaders] = useState([emptyMessageHeader()]);

  const handleSendMessage = (e) => {
    console.log(`sending message: ${messageKey} ${messageValue}`);
    const f = async () => {
      const meta = await window.api.produceToTopic(
        currentConnection,
        topicName,
        {
          key: messageKey,
          value: messageValue,
          header: messageHeaders
            .filter((m) => m.messageKey && m.messageValue)
            .map((m) => ({ [m.messageKey]: messageValue })),
        }
      );
      console.log('>>>> produce meta: ' + JSON.stringify(meta));

      setMetaResponse(JSON.stringify(meta, null, 2));
    };

    f().catch((e) => console.log(e));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography className={classes.titleMargin} variant="h6" component="h2">
          Producing to <strong>{topicName}</strong>
        </Typography>

        <Divider />

        <div className={classes.content}>
          <Grid className={classes.root} container direction="row" spacing={2}>
            <Grid className={classes.leftPanel} item direction="column" xs={6}>
              <FormControl fullWidth>
                <TextField
                  onChange={(e) => setMessageKey(e.target.value)}
                  label="Message Key"
                ></TextField>
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  onChange={(e) => setMessageValue(e.target.value)}
                  multiline
                  rows={8}
                  label="Message Value"
                ></TextField>
              </FormControl>

              {messageHeaders.map((header, idx) => (
                <Grid container direction="row">
                  <FormControl className={classes.formControl}>
                    <TextField
                      onChange={(e) => {
                        const cloneMessageHeaders = [...messageHeaders];

                        cloneMessageHeaders[idx].messageKey = e.target.value;

                        return setMessageHeaders(cloneMessageHeaders);
                      }}
                      label={idx === 0 && 'Header Key'}
                    ></TextField>
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <TextField
                      onChange={(e) => {
                        const cloneMessageHeaders = [...messageHeaders];

                        cloneMessageHeaders[idx].messageValue = e.target.value;

                        return setMessageHeaders(cloneMessageHeaders);
                      }}
                      label={idx === 0 && 'Header Value'}
                    ></TextField>
                  </FormControl>

                  {idx !== 0 && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        const cloneMessageHeaders = [...messageHeaders];
                        cloneMessageHeaders.splice(idx, 1);

                        setMessageHeaders(cloneMessageHeaders);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  )}

                  {idx === messageHeaders.length - 1 && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        const cloneMessageHeaders = [...messageHeaders];
                        cloneMessageHeaders.push(emptyMessageHeader());
                        setMessageHeaders(cloneMessageHeaders);
                      }}
                    >
                      <Add />
                    </IconButton>
                  )}
                </Grid>
              ))}
            </Grid>

            <Grid item direction="column" xs={6}>
              <FormControl className={classes.responseTextArea} fullWidth>
                <TextField
                  value={metaResponse}
                  multiline
                  variant="outlined"
                  rows={25}
                />
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
                  onClick={handleSendMessage}
                >
                  Send Message
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Box>
    </Modal>
  );
}
