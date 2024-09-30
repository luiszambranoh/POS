import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';

import Typography from '@mui/joy/Typography';

import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import { useState } from 'react';
import { Modal, DialogContent, DialogTitle, FormControl, FormLabel, Input, ModalDialog, Stack } from '@mui/joy';
import Header from '../Header';
import Sidebar from '../Sidebar';

export default function Sale() {
  const [openCreateProduct, setProductCreation] = useState(false);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      

      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      <Header/>
      <Sidebar/>
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: 'calc(12px + var(--Header-height))',
              sm: 'calc(12px + var(--Header-height))',
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100dvh',
            gap: 1,
          }}
        >

          <Box
            sx={{
              display: 'flex',
              mb: 1,
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'start', sm: 'center' },
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <Typography level="h2" component="h1">
              Inventario
            </Typography>
            <Button
              color="success"
              startDecorator={<DownloadRoundedIcon />}
              size="sm"
            >
              Descargar En Excel
            </Button>
          </Box>

          <Button onClick={() => setProductCreation(true)}>hola</Button>

          <Modal open={openCreateProduct} onClose={() => setProductCreation(false)}>
        <ModalDialog>
          <DialogTitle>Create new project</DialogTitle>
          <DialogContent>Fill in the information of the project.</DialogContent>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setProductCreation(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input autoFocus required />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input required />
              </FormControl>
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>

        </Box>
      </Box>
    </CssVarsProvider>
  );
}