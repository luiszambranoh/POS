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
import { formatInput, formatToTwoDecimals, units } from '../../Database/Utils';
import useSnackbar from '../hook/Error';

type productsInput = {
  id: number,
  quantity: number,
  name: string,
  price: string,
  currency: number,
  category: number,
  unit: number
}

type categoryInput = {
  name: string
}

let categories: CategoryObject[], products: ProductsObject[] = null, dolar: number;

export default function Inventory() {
  const {SnackbarComponent, showSnackbar} = useSnackbar();
  const [re, setRe] = useState(false);

  const [openCreateProduct, setProductCreation] = useState(false);
  const [openCreateCategory, setCategoryCreation] = useState(false);
  const {register,handleSubmit,control} = useForm<productsInput>();
  const categoryNameRef = React.useRef<HTMLInputElement>();

  const [productPrice, setProductPrice] = useState<string>('0.00');
  


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
      {SnackbarComponent()}
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
            <Button color='success' size='lg'  onClick={() => setCategoryCreation(true)}>Agregar Categoria</Button>
            
          </Stack>
          <Stack gap={5} direction={'row'}>
            <Button size='lg'  onClick={() => setProductCreation(true)}>Nuevo Importe</Button>
            <Button size='lg'  onClick={() => setCategoryCreation(true)}>Agregar proveedor</Button>
          </Stack>

          <OrderTable products={products} categories={categories} dolar={dolar} />
        </Box>

        <Modal open={openCreateProduct} onClose={() => setProductCreation(false)}>
        <ModalDialog>
          <DialogTitle>Agregar producto</DialogTitle>
          <form
            onSubmit={handleSubmit((data) => {
              try {
                ProductsMethods.addProduct(data.id, data.quantity,data.name, formatToTwoDecimals(data.price), data.currency, data.category, data.unit)
                location.reload();
              }
              catch(e){
                showSnackbar("Error", "xd")
              }
            })}
          >
            <Stack spacing={2}>
              <div>
                <FormLabel>Código</FormLabel>
                <Input {...register("id")} required/>
              </div>
              <div>
                <FormLabel>Cantidad</FormLabel>
                <Input {...register("quantity")} type='number' required/>
              </div>
              <div>
                <FormLabel>Nombre</FormLabel>
                <Input {...register("name")} required/>
              </div>
              <div>
                <FormLabel>Precio</FormLabel>
                <Stack direction={'row'} gap={3}>
                <Controller
          name="price"
          control={control}
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
                  <Select {...register("currency")} required defaultListboxOpen>
                    <Option value={1}>$ - Dolar Americano</Option>
                    <Option value={0}>Bs.D - Bolivar Digital</Option>
                  </Select>
                </Stack>
              </div>
              { categories ? (
                <div>
                <FormLabel>Categoria</FormLabel>
                  <Select {...register("category")} placeholder="Categoria" required>
                    {categories.map(e => (
                      <Option key={e.id} value={e.id}>{e.name}</Option>
                    ))}
                  </Select>
              </div>) : <div>si</div>
              }
              { units ? (
                <div>
                <FormLabel>Unidad</FormLabel>
                  <Select {...register("unit")} placeholder="Unidad" required>
                    <Option value={1}>{units[1]}</Option>
                    <Option value={2}>{units[2]}</Option>
                    <Option value={3}>{units[3]}</Option>
                  </Select>
              </div>) : <div>si</div>
              }
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
        </Modal>

        <Modal open={openCreateCategory} onClose={() => setCategoryCreation(false)}>
        <ModalDialog>
          <DialogTitle>Agregar Categoria</DialogTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              let input: string = categoryNameRef.current.value;
              ProductsMethods.addCategory("sisa")
              location.reload()
            }}
          >
            <Stack spacing={2}>
              <div>
                <FormLabel>Nombre</FormLabel>
                <Input ref={categoryNameRef} required/>
              </div>
              <Button type='submit' color='success'>Agregar Categoria</Button>
            </Stack>
          </form>
        </ModalDialog>
        </Modal>

      </Box>
    </CssVarsProvider>
  );
}