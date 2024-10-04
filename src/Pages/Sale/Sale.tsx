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
import { Modal, DialogTitle, Input, ModalDialog, Stack, Select, Option, Table, Sheet, InputProps, Divider, FormLabel, Autocomplete} from '@mui/joy';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { CategoryObject, ProductsMethods, ProductsObject } from '../../Database/Products';
import { formatInput, formatToTwoDecimals, getDate, paymentMethods, units } from '../../Database/Utils';
import { Delete, Done, SearchOutlined } from '@mui/icons-material';
import useSnackbar from '../hook/Error';
import { CurrencyMethods } from '../../Database/Currency';
import { SaleMethods, selectedProduct } from '../../Database/Sales';



let categories: CategoryObject[], products: ProductsObject[] = [], dolar: number;

let amountPayed = {
  // 1: "Efectivo",
  // 2: "Punto de venta",
  // 3: "Transferencia"
  1: 0.0,
  2: 0.0,
  3: 0.0
}

export default function Sale() {
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const [re, setRe] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<selectedProduct[]>([]);
  const [currentSelectedProduct, setCurrentSelectedProduct ] = useState<ProductsObject>(null);

  // FIND PRODUCT BY ID
  const [productIdInput, setProductIdInput] = useState('');
  const [finishSale, setFinishSale] = useState(false);
  const [totalAmountPayed, setTotalAmountPayed] = useState<number>(0);

  const {register: rPayment, handleSubmit: hPayment, control: cPayment} = useForm<{paymentAmount: number, currency: number, paymentMethod: number}>();
  const [paymentInputValue, setPaymentInputValue] = useState('');
  const [drawback, setDrawback] = useState(0);


  React.useEffect(() => {
    async function getData(){
      const data = await ProductsMethods.getProductsAndCategories();
      products = data.products;
      dolar = data.dolar;
      setRe(true);
    }
    getData();
  }, [])

  function addProduct(id: number) {
    let product = ProductsMethods.findProductById(products, id);

    if (product == undefined){
      showSnackbar("Producto no encontrado", "Verifica el código del producto")
      return
    }
    
    setSelectedProducts(prevProducts => {
      const existingProduct = prevProducts.find(p => p.id === id);
      
      if (existingProduct) {
        return prevProducts.map(p => 
          p.id === id ? { ...p, amount: p.amount + 1 } : p
        );
      } else {
        return [...prevProducts, { id, amount: 1, product }];
      }
    });
  }

  function updateProductAmount(id: number, newAmount: number) {
    setSelectedProducts(prevProducts =>
      prevProducts
        .map(p => p.id === id ? { ...p, amount: newAmount } : p)
        .filter(p => newAmount > 0) // Remove if amount is 0
    );
  }

  function calculateTotalBs() {
    return selectedProducts.reduce((acc, product) => {
      const productTotal = product.product.currency.id === 0 
        ? product.amount * product.product.price
        : product.amount * product.product.price * dolar;
      return formatToTwoDecimals(acc + productTotal);
    }, 0);
  }

  function calculateTotalDollars() {
    return selectedProducts.reduce((acc, product) => {
      const productTotal = product.product.currency.id === 1 
        ? product.amount * product.product.price
        : product.amount * (product.product.price / dolar);
      return formatToTwoDecimals(acc + productTotal);
    }, 0);
  }

  function performSale(){
    if (selectedProducts.length <= 0){
      showSnackbar("No hay products", "Seleciona productos para poder completar la venta");
    }
    else if (calculateTotalDollars() != totalAmountPayed){
      showSnackbar("Falta Dinero", "Revisa el abono hecho por el cliente o el vuelto.")
    }

    SaleMethods.addSale(selectedProducts, dolar, calculateTotalDollars(), amountPayed);
    location.reload();
  }

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
            gap: 1,
            alignItems: 'center'
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
              alignContent: 'center'
            }}
          >
            <Typography level="h2" component="h1">
              Venta
            </Typography>
          </Box>
          <Stack direction={'row'} gap={5}>
              <div>
                <FormLabel>Buscar Producto Por Codigo</FormLabel>
                <Input
                value={productIdInput}
                onChange={(e) => {
                  setProductIdInput(e.target.value);
                }}
                onBlur={(e) => {
                  let findProduct = ProductsMethods.findProductById(products, formatToTwoDecimals(e.target.value))
                  if (findProduct == undefined){
                    showSnackbar("Producto no encontrado", "Verifica el código del producto")
                  }
                  setCurrentSelectedProduct(findProduct)
                }} startDecorator={<SearchOutlined />} />
              </div>
              <div>
                <FormLabel>Nombre del Producto</FormLabel>
                <Input startDecorator={<SearchOutlined />}></Input>
              </div>
                <Table
                  aria-labelledby="tableTitle"
                  borderAxis="bothBetween"
                >
                  <tbody>
                    <thead>
                      <th>Precio Base</th>
                      <th>Precio Al Cambio</th>
                      <th>Existencia</th>
                    </thead>
                    <tbody>
                      { currentSelectedProduct ?
                        <tr>
                          <td>{currentSelectedProduct.price} {currentSelectedProduct.currency.name}</td>
                          <td>{
                      currentSelectedProduct.currency.id === 1
                      ? formatToTwoDecimals((currentSelectedProduct.price * dolar)) + ' Bs'
                      : formatToTwoDecimals(currentSelectedProduct.price) + ' $'
                    }</td>
                          <td>{currentSelectedProduct.quantity}</td>
                        </tr> : null
                      }
                    </tbody>
                  </tbody>
                </Table>
                <Button onClick={() => {
                  addProduct(formatToTwoDecimals(productIdInput))
                }}>
                  Agregar Producto
                </Button>
          </Stack>
          <Divider></Divider>
          
          <Button  color='success' sx={{width: 250}} onClick={performSale}><Done/>    Completar Venta</Button>

          <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
          marginTop: 5
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
              <th style={{ width: '8%', padding: '12px 6px' }}>Eliminar</th>
              <th style={{ width: '10%', padding: '12px 6px' }}>Cantidad</th>
              <th style={{ width: '20%', padding: '12px 6px' }}>Nombre</th>
              <th style={{ width: '10%', padding: '12px 6px' }}>P.U. Base</th>
              <th style={{ width: "10%", padding: '12px 6px' }}>P.U. Al Cambio</th>
              <th style={{ width: "10%", padding: '12px 6px' }}>Total Bs.</th>
              <th style={{ width: "10%", padding: '12px 6px' }}>Total $</th>
            </tr>
          </thead>
          <tbody>
            {
              selectedProducts ? selectedProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <Button color="danger" onClick={() => updateProductAmount(product.id, 0)}>Remover</Button>
                  </td>
                  <td>
                    <Input 
                      defaultValue={product.amount}
                      onBlur={(e) => updateProductAmount(product.id, parseInt(e.target.value) || 0)}
                      type="number"
                      endDecorator={units[product.product.unit]}
                    />
                  </td>
                  <td>
                  {product.product.name}
                  </td>
                  <td>{product.product.price} {product.product.currency.name}</td>
                  <td>
                    {product.product.currency.id === 1 
                      ? formatToTwoDecimals(product.product.price * dolar) + ' Bs'
                      : product.product.price + ' Bs'}
                  </td>

                  <td>
                    {product.product.currency.id === 1 
                      ? formatToTwoDecimals(product.amount * product.product.price * dolar) + ' Bs'
                      : formatToTwoDecimals(product.amount * product.product.price) + ' Bs'}
                  </td>
                  <td>
                    {
                      product.product.currency.id === 2
                      ? formatToTwoDecimals(product.amount * (product.product.price * dolar)) + ' Bs'
                      : formatToTwoDecimals(product.amount * product.product.price) + ' $'
                    }
                  </td>
                </tr>
              )) : null
            }
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={1}></td>
              <td>
                Total: {selectedProducts.reduce((acc, product) => acc + product.amount, 0)}
              </td>
              <td colSpan={2}></td>
              <td>Total:</td>
              {/* BOLIVAR */}
              <td>
                {calculateTotalBs()} Bs
              </td>
              {/* DOLAR */}
              <td>
                {calculateTotalDollars()} $
              </td>
            </tr>
          </tfoot>
        </Table>
          </Sheet>
      
          {/* FINISH SALE */}

          <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          borderRadius: 'sm',
          flexShrink: 1,
          minHeight: 0,
          marginTop: 5
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
            <th style={{ width: '5%', padding: '12px 6px' }}></th>
              <th style={{ width: '20%', padding: '12px 6px' }}> Abono</th>
              <th style={{ width: '15%', padding: '12px 6px' }}>Efectivo </th>
              <th style={{ width: '15%', padding: '12px 6px' }}>Punto de venta</th>
              <th style={{ width: '15%', padding: '12px 6px' }}>Transferencia</th>
              <th style={{ width: '15%', padding: '12px 6px' }}>Falta por pagar</th>
              <th style={{ width: '15%', padding: '12px 6px' }}>Vuelto</th>
            </tr> 
          </thead>
          <tbody>
            <tr>
              <td>$</td>
              
              <td>
                {amountPayed ? 
                totalAmountPayed + " $"
              : null} 
              </td>

              <td>{amountPayed[1]} $ </td>
              <td>{amountPayed[2]} $ </td>
              <td>{amountPayed[3]} $ </td>

              
              <td>
                {totalAmountPayed < calculateTotalDollars() ? 
                (formatToTwoDecimals(calculateTotalDollars() - totalAmountPayed)) + " $"
              : null} 
              </td>
              <td>
                {totalAmountPayed > calculateTotalDollars() ? 
                (formatToTwoDecimals(totalAmountPayed - calculateTotalDollars())) + " $"
              : null} 
              </td>
            </tr>
            <tr>
              <td>Bs.</td>
              <td>
                {amountPayed ? 
                CurrencyMethods.convertCurrency(1, dolar, totalAmountPayed).convertion + " Bs."
              : null} 
              </td>

              <td>{CurrencyMethods.convertCurrency(1, dolar, amountPayed[1]).convertion} Bs. </td>
              <td>{CurrencyMethods.convertCurrency(1, dolar, amountPayed[2]).convertion} Bs. </td>
              <td>{CurrencyMethods.convertCurrency(1, dolar, amountPayed[3]).convertion} Bs. </td>

              <td>
                {CurrencyMethods.convertCurrency(1, dolar, totalAmountPayed).convertion < calculateTotalBs() ? 
                  (formatToTwoDecimals(calculateTotalBs() - CurrencyMethods.convertCurrency(1, dolar, totalAmountPayed).convertion)) + " Bs."
                : null}
              </td>
              <td>
                {CurrencyMethods.convertCurrency(1, dolar, totalAmountPayed).convertion > calculateTotalBs() ? 
                (formatToTwoDecimals(CurrencyMethods.convertCurrency(1, dolar, totalAmountPayed).convertion - calculateTotalBs())) + " Bs."
              : null} 
              </td>

              

            </tr>
            <tr>
              <td colSpan={2}></td>
              <td><Button sx={{marginLeft: 2}} color='danger'  size='sm' onClick={() => {amountPayed[1] = 0; setTotalAmountPayed(amountPayed[1] + amountPayed[2] + amountPayed[3]);}}><Delete/></Button></td>
              <td><Button sx={{marginLeft: 2}} color='danger'  size='sm' onClick={() => {amountPayed[2] = 0; setTotalAmountPayed(amountPayed[1] + amountPayed[2] + amountPayed[3]);}}><Delete/></Button></td>
              <td><Button sx={{marginLeft: 2}} color='danger'  size='sm' onClick={() => {amountPayed[3] = 0; setTotalAmountPayed(amountPayed[1] + amountPayed[2] + amountPayed[3]);}}><Delete/></Button></td>
              <td colSpan={2}></td>
            </tr>
          </tbody>
        </Table>
        

          </Sheet>

          <Box
          sx={{
            marginTop: 3
          }}
          >
          <form onSubmit={hPayment((data, e) => {
            e.preventDefault();
            let money: number;
            if (data.currency == 0){
              money = CurrencyMethods.convertCurrency(0, dolar, data.paymentAmount).convertion;
            }
            else {
              money = data.paymentAmount
            }
            amountPayed[data.paymentMethod] += formatToTwoDecimals(money);
            console.log(amountPayed)
            console.log(amountPayed[1] + amountPayed[2] + amountPayed[3])
            setTotalAmountPayed(amountPayed[1] + amountPayed[2] + amountPayed[3]);
          })}>
          <Stack direction={'row'} gap={5}>
              <Controller
                name="paymentAmount"
                control={cPayment}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={paymentInputValue} // Set the value to your productPrice state
                    onChange={(value) => {
                      let input = formatInput(value.target.value)
                      setPaymentInputValue(input); // Update the local state
                      field.onChange(input); // Notify React Hook Form about the change
                    }}
                  />
                )}
              />
              <div>
              <FormLabel>Moneda</FormLabel>
                <Select {...rPayment("currency")} required>
                  <Option value={1}>$ - Dolar Americano</Option>
                  <Option value={0}>Bs.D - Bolivar Digital</Option>
                </Select>
              </div>
              <Box>
                <FormLabel>Método de pago</FormLabel>
                <Select {...rPayment("paymentMethod")} required>
                  <Option value={1}>{paymentMethods[1]}</Option>
                  <Option value={2}>{paymentMethods[2]}</Option>
                  <Option value={3}>{paymentMethods[3]}</Option>
                </Select>
              </Box>
              <Button type='submit'>Abonar</Button>
          </Stack>
          </form>
          

          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}