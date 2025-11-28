import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { CloseIcon } from '@chakra-ui/icons';
import { IconButton, useColorMode, useDisclosure } from '@chakra-ui/react';
import DrawerBody from './drawer.body';
import { DrawerNavBar } from './drawer.navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import Joyride, { CallBackProps, EVENTS, STATUS } from 'react-joyride';
import { useFeatureGuideContext } from '../../../context/FeatureGuideContext';
import { FeatureTourGuideStepData } from '../../../context/FeatureGuideContext/steps';
import { FG_STEP_INDEXES } from '../../../context/FeatureGuideContext/utils';
import { menuContext } from '../../../context/MenuContext';
import ContactUsModal from '../ContactUsModal';
import ContactUsNews from '../NewsJoyride/ContactUsNews';
import { appContext } from '../../../context/AppContext';

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
  colorMode: string;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open, isMobile, colorMode }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: isMobile ? '100vw' : `calc(100vw - ${drawerWidth}px)`,
    marginLeft: isMobile ? '0px' : `${drawerWidth}px`,
    backgroundColor: colorMode === 'dark' ? '#262626' : '#FFFFFF',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')<{ colorMode?: string }>(
  ({ theme, colorMode }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    background: colorMode === 'dark' ? '#1a535c' : '#408080',
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }),
);

export default function EmptyPage() {
  const { colorMode } = useColorMode();
  const { state, setState, triggerControl, pathBeforeGuide } =
    useFeatureGuideContext();
  const { isMobile, isAuthenticated } = React.useContext(appContext);
  const { isOpen, onOpen, onClose } = React.useContext(menuContext);
  const {
    isOpen: isOpenContactModal,
    onClose: onCloseContactModal,
    onOpen: onOpenContactModal,
  } = useDisclosure();

  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    onOpen();
  };

  const handleDrawerClose = () => {
    onClose();
  };

  const handleGuidePreviousClick = (
    type: string,
    index: number,
    stepData: FeatureTourGuideStepData,
  ) => {
    if (type === EVENTS.STEP_BEFORE) {
      if (index === FG_STEP_INDEXES.PAGE_MENU) {
        handleDrawerOpen();
      }
      if (
        index === FG_STEP_INDEXES.RESERVATION_BY_ALLOCATION ||
        index === FG_STEP_INDEXES.ALLOCATION_DRAG_AND_DROP
      ) {
        setTimeout(() => {
          triggerControl('any'); // change calendar view and expand resources
        }, 200);
      }
    }

    if (type === EVENTS.STEP_AFTER) {
      if (stepData.previous) {
        navigate(stepData.previous);
      }
      if (index == FG_STEP_INDEXES.AUTOMATIC_CLASS_CREATION) {
        setTimeout(() => {
          setState({ ...state, stepIndex: index - 1 });
        }, 250);
        return;
      }
      if (index === FG_STEP_INDEXES.PAGE_MENU) {
        handleDrawerClose();
        setTimeout(() => {
          setState({ ...state, stepIndex: index - 1 });
        }, 100);
        return;
      }
      if (index === FG_STEP_INDEXES.ALLOCATION_GRID) {
        handleDrawerOpen();
        setTimeout(() => {
          setState({ ...state, stepIndex: index - 1 });
        }, 300);
        return;
      }
      setState({ ...state, stepIndex: index - 1 });
    }
  };

  const handleGuideNextClick = (
    type: string,
    index: number,
    stepData: FeatureTourGuideStepData,
  ) => {
    if (type === EVENTS.STEP_BEFORE) {
      if (index === FG_STEP_INDEXES.PAGE_MENU) {
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
      if (index == FG_STEP_INDEXES.CONTACT) {
        handleDrawerClose();
      }
      if (index === FG_STEP_INDEXES.USER_MENU) {
        setTimeout(() => {
          setState({ ...state, stepIndex: index + 1 });
        }, 600);
      }
      if (index === FG_STEP_INDEXES.CONTACT) {
        setTimeout(() => {
          setState({ ...state, stepIndex: index + 1 });
        }, 300);
      }

      if (
        index !== FG_STEP_INDEXES.CONTACT &&
        index !== FG_STEP_INDEXES.USER_MENU
      ) {
        setState({ ...state, stepIndex: index + 1 });
      }

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
    <Box
      sx={{ display: 'flex' }}
      width={'calc(100vw - 20px)'}
      height={'100vh'}
      bgcolor={colorMode === 'dark' ? '#262626' : '#FFFFFF'}
    >
      <AppBar
        position='fixed'
        open={isOpen}
        isMobile={isMobile}
        colorMode={colorMode}
      >
        <DrawerNavBar
          open={isOpen}
          handleDrawerOpen={handleDrawerOpen}
          handleDrawerClose={handleDrawerClose}
          isMobile={isMobile}
          onOpenContactModal={onOpenContactModal}
          onCloseContactModal={onCloseContactModal}
        />
      </AppBar>
      <Drawer
        id='menu-drawer'
        sx={{
          width: isMobile ? '100vw' : drawerWidth,
          flexShrink: 0,
          bgcolor: colorMode === 'dark' ? '#262626' : '#FFFFFF',
          '& .MuiDrawer-paper': {
            width: isMobile ? '100vw' : drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: colorMode === 'dark' ? '#262626' : '#FFFFFF',
          },
        }}
        variant='persistent'
        anchor='left'
        open={isOpen}
      >
        <DrawerHeader colorMode={colorMode}>
          <IconButton
            size={'md'}
            icon={<CloseIcon />}
            variant={'ghost'}
            textColor={'uspolis.black'}
            aria-label={'open-menu'}
            onClick={() => handleDrawerClose()}
          />
        </DrawerHeader>
        <DrawerBody onClose={handleDrawerClose} />
      </Drawer>
      {isAuthenticated && (
        <ContactUsNews
          isMobile={isMobile}
          onOpen={onOpenContactModal}
          onClose={onCloseContactModal}
          isOpen={isOpenContactModal}
        />
      )}
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
            arrowColor: 'uspolis.blue',
            primaryColor: 'uspolis.blue',
            textColor: 'uspolis.text',
            backgroundColor: 'uspolis.blue',
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
          if (action === 'next') {
            handleGuideNextClick(type, index, stepData);
            return;
          }
          return;
        }}
      />
      <ContactUsModal
        isOpen={isOpenContactModal}
        onClose={onCloseContactModal}
      />

      <Box
        width={isMobile ? '100vw' : `calc(100vw - ${drawerWidth}px)`}
        bgcolor={colorMode === 'dark' ? '#262626' : '#FFFFFF'}
      >
        <Main open={isOpen} isMobile={isMobile}>
          <Outlet />
        </Main>
      </Box>
    </Box>
  );
}
