

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';


import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';

import Input from '@mui/joy/Input';

import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';

import Typography from '@mui/joy/Typography';

import SearchIcon from '@mui/icons-material/Search';


import Autocomplete from '@mui/joy/Autocomplete';
import { CategoryObject, ProductsMethods, ProductsObject } from '../../Database/Products';
import React, { useState } from 'react';
import { Modal, ModalDialog, Stack } from '@mui/joy';
import { CurrencyMethods } from '../../Database/Currency';
import { AttachMoney } from '@mui/icons-material';
import { Icon } from '@mui/material';
import { units } from '../../Database/Utils';

type Props = {
  products: ProductsObject[],
  categories: CategoryObject[],
  dolar: number
}



export default function InventoryTable({products, dolar}: Props) {
  const [openCreateProduct, setProductCreation] = useState(false);

  return (
    <React.Fragment>
      
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 'sm',
          py: 2,
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          '& > *': {
            minWidth: { xs: '120px', md: '160px' },
          },
        }}
      >

        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Buscar Producto</FormLabel>
          <Input size="lg" placeholder="Buscar producto" startDecorator={<SearchIcon />} />
        </FormControl>
      </Box>
      {/* TABLE */}

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
              <th style={{ width: '20%', padding: '12px 6px' }}>Existencia</th>
              <th style={{ width: '20%', padding: '12px 6px' }}>Nombre</th>
              <th style={{ width: '20%', padding: '12px 6px' }}>Precio Base</th>
              <th style={{ width: '20%', padding: '12px 6px' }}>Precio Al Cambio</th>
              <th style={{ width: "20%", padding: '12px 6px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products ? products.map((products) => (
              <tr key={products.id}>
                <td>
                  <Typography level="body-lg">{products.id}</Typography>
                </td>
                <td>
                  <Typography level="body-lg">{products.quantity} {units[products.unit]}</Typography>
                </td>
                <td>
                  <Typography level="body-lg">{products.name}</Typography>
                </td>
                <td>
                {products.currency.name} {products.price} 
                </td>
                <td >
                  {CurrencyMethods.convertCurrency(products.currency.id, dolar, products.price).convertionId == 1 ? <div><AttachMoney/> {CurrencyMethods.convertCurrency(products.currency.id, dolar, products.price).convertion} </div> : <div> Bs.D {CurrencyMethods.convertCurrency(products.currency.id, dolar, products.price).convertion} </div>
                  } 
                </td>

                <td>
                  <Stack direction={'row'} sx={{ display: 'flex', gap: 1 }}>
                    <Button size="md"  onClick={() => {
                        setProductCreation(true)
                      }
                    }>
                      Modificar
                    </Button>
                  </Stack>
                </td>
              </tr>
            )) : null}
          </tbody>
        </Table>
      </Sheet>

      

      

    </React.Fragment>
  );
}