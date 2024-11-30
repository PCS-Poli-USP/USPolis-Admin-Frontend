import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { CloseIcon } from '@chakra-ui/icons';
import { IconButton, useMediaQuery } from '@chakra-ui/react';
import DrawerBody from './drawer.body';
import { DrawerNavBar } from './drawer.navbar';
import { Outlet } from 'react-router-dom';

const drawerWidth = 300;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
  isMobile: boolean;
}>(({ theme, open, isMobile }) => ({
  flexGrow: 1,
  padding: theme.spacing(0),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: isMobile ? '-100vw' : `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: isMobile ? '-100vw' : '0px',
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  isMobile: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open, isMobile }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: isMobile ? '100vw' : `calc(100vw - ${drawerWidth}px)`,
    marginLeft: isMobile ? '0px' : `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  background: '#408080',
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function EmptyPage() {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position='fixed' open={open} isMobile={isMobile}>
        <DrawerNavBar
          open={open}
          handleDrawerOpen={handleDrawerOpen}
          isMobile={isMobile}
        />
      </AppBar>
      <Drawer
        sx={{
          width: isMobile ? '100vw' : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isMobile ? '100vw' : drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <DrawerHeader>
          <IconButton
            size={'md'}
            icon={<CloseIcon />}
            variant={'ghost'}
            textColor={'black'}
            aria-label={'open-menu'}
            onClick={() => handleDrawerClose()}
          />
        </DrawerHeader>
        <DrawerBody onClose={handleDrawerClose} />
      </Drawer>
      <Main open={open} isMobile={isMobile}>
        <Outlet />
      </Main>
    </Box>
  );
}
