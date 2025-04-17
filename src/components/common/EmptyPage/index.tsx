import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { CloseIcon } from '@chakra-ui/icons';
import { IconButton, useMediaQuery } from '@chakra-ui/react';
import DrawerBody from './drawer.body';
import { DrawerNavBar } from './drawer.navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import Joyride, { CallBackProps, EVENTS, STATUS } from 'react-joyride';
import { useFeatureGuideContext } from '../../../context/FeatureGuideContext';
import { FeatureTourGuideStepData } from '../../../context/FeatureGuideContext/steps';
import { FG_STEP_INDEXES } from '../../../context/FeatureGuideContext/utils';

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
  const { state, setState, triggerControl, pathBeforeGuide } =
    useFeatureGuideContext();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleGuidePreviousClick = (
    type: string,
    index: number,
    stepData: FeatureTourGuideStepData,
  ) => {
    if (type === EVENTS.STEP_BEFORE) {
      if (index === FG_STEP_INDEXES.MENU) {
        handleDrawerOpen();
      }
      if (
        index === FG_STEP_INDEXES.RESERVATION_BY_ALLOCATION ||
        index === FG_STEP_INDEXES.ALLOCATION_DRAG_AND_DROP
      ) {
        setTimeout(() => {
          triggerControl('any'); // change calendar view and expand resources
        }, 100);
      }
    }

    if (type === EVENTS.STEP_AFTER) {
      if (stepData.previous) {
        navigate(stepData.previous);
      }
      if (
        index === FG_STEP_INDEXES.MENU ||
        index === FG_STEP_INDEXES.AUTOMATIC_CLASS_CREATION
      ) {
        handleDrawerClose();
        setTimeout(() => {
          setState({ ...state, stepIndex: index - 1 });
        }, 100);
      } else if (index === FG_STEP_INDEXES.ALLOCATION_GRID) {
        handleDrawerOpen();
        setTimeout(() => {
          setState({ ...state, stepIndex: index - 1 });
        }, 300);
      } else setState({ ...state, stepIndex: index - 1 });
    }
  };

  const handleGuideNextClick = (
    type: string,
    index: number,
    stepData: FeatureTourGuideStepData,
  ) => {
    if (type === EVENTS.STEP_BEFORE) {
      if (index === FG_STEP_INDEXES.MENU) {
        handleDrawerOpen();
      }
      if (index === FG_STEP_INDEXES.RESERVATION_BY_ALLOCATION) {
        triggerControl('any'); // change calendar view and expand resources
      }
    }

    if (type === EVENTS.STEP_AFTER) {
      if (index === FG_STEP_INDEXES.CONTACT) {
        handleDrawerClose();
        setTimeout(() => {
          setState({ ...state, stepIndex: index + 1 });
        }, 300);
      } else setState({ ...state, stepIndex: index + 1 });

      if (stepData.next) {
        navigate(stepData.next);
      }
    }
  };

  const handleGuideCloseClick = () => {
    setState({ ...state, run: false, stepIndex: 0 });
    navigate(pathBeforeGuide);
  };

  return (
    <Box sx={{ display: 'flex' }} width={'calc(100vw - 20px)'} height={'100vh'}>
      <AppBar position='fixed' open={open} isMobile={isMobile}>
        <DrawerNavBar
          open={open}
          handleDrawerOpen={handleDrawerOpen}
          handleDrawerClose={handleDrawerClose}
          isMobile={isMobile}
        />
      </AppBar>
      <Drawer
        id='menu-drawer'
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
      <Joyride
        {...state}
        continuous={true}
        showSkipButton={true}
        hideBackButton={false}
        disableScrolling={true}
        showProgress={true}
        locale={{
          back: 'Voltar',
          close: 'Fechar',
          last: 'Último',
          next: 'Próximo',
          nextLabelWithProgress: 'Próximo (Passo {step} / {steps})',
          open: 'Abrir diálogo',
          skip: 'Pular',
        }}
        styles={{
          options: {
            arrowColor: '#408080',
            primaryColor: '#408080',
            textColor: '#fff',
            backgroundColor: '#408080',
            beaconSize: 36,
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
            width: undefined,
            zIndex: 1000000,
          },
        }}
        callback={(data: CallBackProps) => {
          const { action, index, status, type } = data;
          const stepData = data.step.data as FeatureTourGuideStepData;
          const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
          if (finishedStatuses.includes(status) || action === 'close') {
            handleGuideCloseClick();
            return;
          }
          if (action === 'prev') {
            handleGuidePreviousClick(type, index, stepData);
            return;
          }
          handleGuideNextClick(type, index, stepData);
          return;
        }}
      />
      <Box width={isMobile ? '100vw' : `calc(100vw - ${drawerWidth}px)`}>
        <Main open={open} isMobile={isMobile}>
          <Outlet />
        </Main>
      </Box>
    </Box>
  );
}
