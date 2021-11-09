import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface AddTopicFormProps {
  open: boolean;
  handleClose: () => void;
  handleAddTopic: (topicName: string) => void;
}

export default function AddTopicDialog(props: AddTopicFormProps) {
  const { open, handleClose, handleAddTopic } = props;

  const [topicName, setTopicName] = React.useState('');

  const handleCreate = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    handleAddTopic(topicName);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add New Topic</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create new Kafka topic with default configuration.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="newTopicName"
            label="Topic Name"
            fullWidth
            onChange={(e) => setTopicName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
