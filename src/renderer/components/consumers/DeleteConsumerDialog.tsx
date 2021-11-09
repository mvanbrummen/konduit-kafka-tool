import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface AddTopicFormProps {
  consumerName: string;
  open: boolean;
  handleClose: () => void;
  handleDeleteConsumer: (consumerName: string) => void;
}
export default function AddTopicDialog(props: AddTopicFormProps) {
  const { consumerName, open, handleClose, handleDeleteConsumer } = props;

  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    handleDeleteConsumer(consumerName);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete Consumer Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete consumer{' '}
            <strong>{consumerName}</strong>?
            <br />
            <br />
            You may only delete a consumer group with no connected consumers.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
