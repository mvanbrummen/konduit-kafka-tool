import {
  Box,
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
import React, { useState } from 'react';

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
}));

const TopicData = ({ topicName }) => {
  const [consumerRecords, setConsumerRecords] = useState([]);

  const classes = useStyles();

  const eachMessage = (event, { partition, message }) => {
    console.log(JSON.stringify(message));

    const date = new Date(parseInt(message.timestamp));

    const records = [
      {
        timestamp: date.toLocaleTimeString() + ' ' + date.toLocaleDateString(),
        offset: message.offset,
        partition: partition,
        key: message.key ? message.key.toString() : '',
        value: message.value ? message.value.toString() : '',
        headers: JSON.stringify(message.headers),
      },
    ].concat(consumerRecords);

    console.log('records are ' + JSON.stringify(records));

    setConsumerRecords(records);
  };

  window.api.consumeFromTopicReply(eachMessage);

  const onConsumeMessages = (e) => {
    const f = async () => {
      window.api.consumeFromTopic(topicName);
    };

    f().catch((e) => console.log(e));
  };

  const onPauseConsumeMessages = (e) => {
    const f = async () => {
      window.api.pauseConsumeFromTopic(topicName);
    };

    f().catch((e) => console.log(e));
  };

  return (
    <div>
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <FormControl className={classes.formControl}>
          <InputLabel>Max Messages</InputLabel>

          <Select size="small" value={1}>
            <MenuItem value={1}>10</MenuItem>
            <MenuItem>25</MenuItem>
            <MenuItem>50</MenuItem>
          </Select>
        </FormControl>
        <TextField
          placeholder="Search messages..."
          variant="outlined"
          size="small"
        ></TextField>
        <IconButton onClick={onConsumeMessages}>
          <PlayArrow />
        </IconButton>
        <IconButton onClick={onPauseConsumeMessages}>
          <Pause />
        </IconButton>
      </Grid>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Offset</TableCell>
            <TableCell>Partition</TableCell>
            <TableCell>Key</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Headers</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {consumerRecords.map &&
            consumerRecords.map((row, idx) => (
              <TableRow hover key={idx}>
                <TableCell>{row.offset}</TableCell>
                <TableCell>{row.partition}</TableCell>
                <TableCell>{row.key}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>{row.headers}</TableCell>
                <TableCell>{row.timestamp}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default function ConsumeModal({ topicName, open, onClose }) {
  const classes = useStyles();
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography className={classes.titleMargin} variant="h6" component="h2">
          Consuming from <strong>{topicName}</strong>
        </Typography>

        <Divider />

        <div className={classes.content}>
          <TopicData topicName={topicName}></TopicData>
        </div>
      </Box>
    </Modal>
  );
}
