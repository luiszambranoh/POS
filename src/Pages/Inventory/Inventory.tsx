import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';

import Typography from '@mui/joy/Typography';


import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import Sidebar from '../Sidebar';
import OrderTable from './TableInventory';
import Header from '../Header';
import { useState } from 'react';
import { Modal, DialogTitle, FormLabel, Input, ModalDialog, Stack, Select, Option} from '@mui/joy';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { CategoryObject, ProductsMethods, ProductsObject } from '../../Database/Products';
import { Autocomplete } from '@mui/material';
import { formatInput, formatToTwoDecimals } from '../../Database/Utils';

type productsInput = {
  id: number,
  name: string,
  price: string,
  currency: number,
  category: number
}

let categories: CategoryObject[], products: ProductsObject[] = null, dolar: number;

export default function Inventory() {
  const [openCreateProduct, setProductCreation] = useState(false);
  const [productPrice, setProductPrice] = useState<string>('0.00');
  const [re, setRe] = useState(false);


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
  
  const {
    register,
    handleSubmit,
    control
  } = useForm<productsInput>();

  const onSubmitProduct: SubmitHandler<productsInput> = (data) => {
    
    ProductsMethods.addProduct(data.id, data.name.toLocaleLowerCase(), formatToTwoDecimals(data.price), data.currency, 1)
    location.reload();
  }
  


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
            <Button
              color="success"
              startDecorator={<DownloadRoundedIcon />}
              size="sm"
            >
              Descargar En Excel
            </Button>
          </Box>
          <Stack gap={5} direction={'row'}>
            <Button color='success' size='lg'  onClick={() => setProductCreation(true)}>Agregar Producto</Button>
            <Button color='success' size='lg'  onClick={() => setProductCreation(true)}>Agregar Categoria</Button>
            <Button color='success' size='lg'  onClick={() => setProductCreation(true)}>Agregar Existencia</Button>
          </Stack>

          <OrderTable products={products} categories={categories} dolar={dolar} />
        </Box>

        <Modal open={openCreateProduct} onClose={() => setProductCreation(false)}>
        <ModalDialog>
          <DialogTitle>Agregar producto</DialogTitle>
          <form
            onSubmit={handleSubmit(onSubmitProduct)}
          >
            <Stack spacing={2}>
              <div>
                <FormLabel>Código</FormLabel>
                <Input {...register("id")}/>
              </div>
              <div>
                <FormLabel>Nombre</FormLabel>
                <Input {...register("name")}/>
              </div>
              <div>
                <FormLabel>Precio</FormLabel>
                <Stack direction={'row'} gap={3}>
                <Controller
          name="price"
          control={control}
          defaultValue={'0.00'}
          render={({ field }) => (
            <Input
              {...field}
              value={productPrice} // Set the value to your productPrice state
              onChange={(value) => {
                let input = formatInput(value.target.value)
                setProductPrice(input); // Update the local state
                field.onChange(input); // Notify React Hook Form about the change
              }}
            />
          )}
        />
                  <Select {...register("currency")} placeholder="Moneda">
                    <Option value={1}>$ - Dolar Americano</Option>
                    <Option value={0}>Bs.D - Bolivar Digital</Option>
                  </Select>
                </Stack>
              </div>
              { categories ? (
                <div>
                <FormLabel>Categoria</FormLabel>
                  <Select {...register("category")} placeholder="Categoria">
                    {categories.map(e => (
                      <Option value={e.id}>{e.name}</Option>
                    ))}
                  </Select>
              </div>) : <div>si</div>
              }
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
    </Modal>

      </Box>
    </CssVarsProvider>
  );
}