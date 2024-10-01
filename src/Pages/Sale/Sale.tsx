import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';

import Typography from '@mui/joy/Typography';


import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import Sidebar from '../Sidebar';
import Header from '../Header';
import { useState } from 'react';
import { Modal, DialogTitle, FormLabel, Input, ModalDialog, Stack, Select, Option, Table, Sheet} from '@mui/joy';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { CategoryObject, ProductsMethods, ProductsObject } from '../../Database/Products';
import { Autocomplete } from '@mui/material';
import { formatInput, formatToTwoDecimals } from '../../Database/Utils';

type selectedProduct = {
  id: number,
  productCopy: ProductsObject,
  amount: number,
}

let categories: CategoryObject[], products: ProductsObject[] = null, dolar: number;

export default function Sale() {
  const [re, setRe] = useState(false);
  const [selectedProducts, addProduct] = useState<selectedProduct[]>([]);

  React.useEffect(() => {
    async function getData(){
      const data = await ProductsMethods.getProductsAndCategories();
      products = data.products;
      categories = data.categories;
      dolar = data.dolar;
      setRe(true);
    }
    getData();
  }, [])
  


  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Header />
        <Sidebar />
        
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

          </Box>
          <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
        }}
      >

        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          borderAxis="bothBetween"
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--Tableproducts-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
          size="lg"
        >
          <thead>
            <tr>
              <th style={{ width: '20%', padding: '12px 6px' }}>Codigo</th>
              <th style={{ width: '20%', padding: '12px 6px' }}>Nombre</th>
              <th style={{ width: '20%', padding: '12px 6px' }}>Precio Bs.D</th>
              <th style={{ width: '20%', padding: '12px 6px' }}>Precio Dolares</th>
              <th style={{ width: "20%", padding: '12px 6px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>xd</td>
              <td>xd</td>
              <td>xd</td>
              <td>xd</td>
              <td>xd</td>

            </tr>
          </tbody>
        </Table>
      </Sheet>

        </Box>
      </Box>
    </CssVarsProvider>
  );
}