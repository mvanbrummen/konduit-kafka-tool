import { Box, Link, Modal, Typography } from '@material-ui/core';
import React from 'react';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function SettingsModal({ open, onClose, handleFeedbackClick }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Settings
        </Typography>

        <Typography align="center">v0.0.1-BETA</Typography>

        <Link
          component="button"
          variant="caption"
          onClick={handleFeedbackClick}
        >
          Submit feedback
        </Link>
      </Box>
    </Modal>
  );
}
