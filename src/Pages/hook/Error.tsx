import React, { useState } from 'react';
import Snackbar from '@mui/joy/Snackbar';
import { Box, Typography } from '@mui/joy';

const useSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [header, setHeader] = useState('');
  const [description, setDescription] = useState('');

  const showSnackbar = (header: string, description: string) => {
    setHeader(header);
    setDescription(description);
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const SnackbarComponent = () => (
    <Snackbar
      color='danger'
      open={open}
      autoHideDuration={5000} 
      onClose={handleClose}
    >
      <Box>
        <Typography level="h1">{header}</Typography>
        <Typography level="body-md">{description}</Typography>
      </Box>
    </Snackbar>
  );

  return {
    showSnackbar,
    SnackbarComponent,
  };
};

export default useSnackbar;
