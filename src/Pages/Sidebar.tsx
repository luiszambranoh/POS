import * as React from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import LinearProgress from '@mui/joy/LinearProgress';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import BrightnessAutoRoundedIcon from '@mui/icons-material/BrightnessAutoRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { closeSidebar } from './utils';
import { useNavigate } from 'react-router-dom';
import { AttachMoney, Money, ShoppingCart, ShoppingCartOutlined } from '@mui/icons-material';
import { DialogTitle, FormLabel, Modal, ModalDialog } from '@mui/joy';
import { CurrencyMethods } from '../Database/Currency';
import { formatInput, formatToTwoDecimals } from '../Database/Utils';
import { useForm } from 'react-hook-form';

function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={[
          {
            display: 'grid',
            transition: '0.2s ease',
            '& > *': {
              overflow: 'hidden',
            },
          },
          open ? { gridTemplateRows: '1fr' } : { gridTemplateRows: '0fr' },
        ]}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}


export default function Sidebar() {
  const navigate = useNavigate();
  const [dolarPrice, setDolarPrice] = React.useState(null); 
  const [dolarValue, setDolarValue] = React.useState('1.00');
  const [bolivarValue, setBolivarValue] = React.useState('1.00');

  const [newCurrency, setNewCurrency] = React.useState('0.00');
  const [openCreateProduct, setProductCreation] = React.useState(false);

  React.useEffect(() => {
    async function getDolar(){
      let dolar = await CurrencyMethods.getDolar();
      setDolarPrice(dolar);
      setBolivarValue(dolar.toFixed(2));
    }
    getDolar();
  },[])

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '220px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      
      <Input size="sm" startDecorator={<SearchRoundedIcon />} placeholder="Search" />
      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >

        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <ListItemButton onClick={() => {navigate('/')}}>
              <HomeRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Principal</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton onClick={() => {navigate('/inventory')}}>
              <DashboardRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Inventario</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton onClick={() => {navigate('/sale')}}>
            <ShoppingCart/>
              <ListItemContent>
                <Typography level="title-sm">Venta</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <Card sx={{
            marginTop: 10
          }}>
              <div>
                <FormLabel>Dólares</FormLabel>
                <Input
                  value={dolarValue}
                  startDecorator={<AttachMoney/>}
                  onChange={(e) => {
                    let input = formatInput(e.target.value)
                    setDolarValue(`${input}`);
                    let newBolivar = formatToTwoDecimals(input) * formatToTwoDecimals(dolarPrice);
                    setBolivarValue((newBolivar).toFixed(2))
                  }}
                  placeholder="Placeholder"
                />
              </div>
              <div>
                <FormLabel>Bolivares Digitales</FormLabel>
                <Input
                  value={bolivarValue}
                  startDecorator={'Bs.D'}
                  onChange={(e) => {
                    let input = formatInput(e.target.value)
                    setBolivarValue(`${input}`);
                    let newDolar = formatToTwoDecimals(input) / formatToTwoDecimals(dolarPrice);
                    console.log(newDolar)
                    setDolarValue((newDolar).toFixed(2))
                  }}
                />
              </div>

              
              <Button color='success' onClick={() => setProductCreation(true)}>
                Cambiar Tasa de Cambio
              </Button>
          </Card>

          
        </List>
        
      </Box>
      <Modal open={openCreateProduct} onClose={() => setProductCreation(false)}>
        <ModalDialog>
          <DialogTitle>Cambiar Tasa</DialogTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              CurrencyMethods.changeDolar(formatToTwoDecimals(newCurrency))
              location.reload();
            }}
          >
            <Stack spacing={2}>
              <div>
                <FormLabel>Tasa</FormLabel>
                <Input
                  value={newCurrency}
                  startDecorator={'Bs.D'}
                  onChange={(e) => {
                    console.log(e.target.value)
                    let input = formatInput(e.target.value)
                    console.log(input)
                    setNewCurrency(`${input}`);
                  }}
                />
              </div>
              <Button color='success' type='submit'>Cambiar Tasa</Button>
            </Stack>
          </form>
        </ModalDialog>
    </Modal>
    </Sheet>
    
  );
}
