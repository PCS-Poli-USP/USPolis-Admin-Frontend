// base template from https://chakra-templates.dev/navigation/navbar

import { HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  StackDivider,
  useColorMode,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import { ReactNode, useContext } from 'react';
import Logo from '../../..//assets/uspolis.logo.png';
import { appContext } from '../../../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { PiHandPointingFill } from 'react-icons/pi';
import { FeatureGuideContext } from '../../../context/FeatureGuideContext';
import { UsersValidator } from '../../../utils/users/users.validator';
import UserImage from '../UserImage/user.image';
import { useColorScheme } from '@mui/material';
import { LuMessageCircleMore } from 'react-icons/lu';

const NavLink = ({ children, to }: { children: ReactNode; to: string }) => (
  <Link
    display='flex'
    alignItems='center'
    px={2}
    py={1}
    textColor={'white'}
    rounded='md'
    _hover={{
      bg: 'uspolis.grey',
    }}
    href={to}
  >
    {children}
  </Link>
);

interface DrawerNavBarProps {
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
  open: boolean;
  isMobile: boolean;
  onOpenContactModal: () => void;
  onCloseContactModal: () => void;
}

export function DrawerNavBar({
  handleDrawerOpen,
  handleDrawerClose,
  open,
  onOpenContactModal,
}: DrawerNavBarProps) {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const { isAuthenticated, loggedUser, logout } = useContext(appContext);
  const { state, setState, setPathBeforeGuide } =
    useContext(FeatureGuideContext);
  const location = useLocation();
  const navigate = useNavigate();
  const validator = new UsersValidator(loggedUser);
  const { colorMode, toggleColorMode } = useColorMode();
  const { setMode } = useColorScheme();

  async function handleClickLogout() {
    await logout();
    navigate('/', {
      replace: true,
      state: { from: location },
    });
  }
  return (
    <Box
      bg='uspolis.blue'
      color='uspolis.text'
      px={4}
      w={open && !isMobile ? 'calc(100vw - 300px)' : '100vw'}
    >
      <Flex
        h={'60px'}
        alignItems={'center'}
        justifyContent={'space-between'}
        w={'100%'}
      >
        <HStack spacing={3} alignItems={'center'}>
          {isAuthenticated && (
            <IconButton
              id='navbar-menu-button'
              size={'md'}
              icon={<HamburgerIcon />}
              hidden={open}
              variant={'ghost'}
              textColor={'white'}
              aria-label={'open-menu'}
              onClick={() => handleDrawerOpen()}
            />
          )}

          <NavLink to='/index'>
            <Image
              src={Logo}
              alt='USPolis'
              objectFit='contain'
              boxSize='40px'
              mr={2}
            />
            USPolis
          </NavLink>
        </HStack>
        <Flex alignItems={'center'} gap={'10px'}>
          {isAuthenticated ? (
            <>
              {isMobile ? (
                <IconButton
                  id='contact-us-button'
                  aria-label='contact-us'
                  icon={<LuMessageCircleMore />}
                  onClick={() => {
                    onOpenContactModal();
                  }}
                />
              ) : (
                <Button
                  id='contact-us-button'
                  variant={'ghost'}
                  onClick={() => {
                    onOpenContactModal();
                  }}
                  textColor={'white'}
                  textAlign={'center'}
                  alignContent={'center'}
                  rightIcon={<LuMessageCircleMore />}
                >
                  {`Fale conosco`}
                </Button>
              )}

              {validator.checkUserRestrictedPermission() && (
                <Button
                  variant={'ghost'}
                  mr={'5px'}
                  hidden={isMobile}
                  onClick={() => {
                    setPathBeforeGuide(location.pathname);
                    if (location.pathname !== '/allocation') {
                      navigate('/allocation', {
                        replace: true,
                        state: { from: location },
                      });
                    }
                    if (open) {
                      handleDrawerClose();
                      setTimeout(() => {
                        setState({
                          ...state,
                          run: true,
                        });
                      }, 300);
                    }
                    if (!open) {
                      setState({
                        ...state,
                        run: true,
                      });
                    }
                  }}
                  textColor={'white'}
                  textAlign={'center'}
                  alignContent={'center'}
                  rightIcon={<PiHandPointingFill />}
                >
                  Tutorial
                </Button>
              )}
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                >
                  <Flex
                    id='navbar-user-menu-button'
                    align={'center'}
                    justify={'center'}
                    gap='10px'
                  >
                    <UserImage />
                  </Flex>
                </MenuButton>
                <MenuList bgColor={'uspolis.white'}>
                  <VStack
                    divider={<StackDivider borderColor={'black.500'} />}
                    bgColor={'uspolis.white'}
                  >
                    <MenuItem
                      bgColor={'uspolis.white'}
                      textColor={'uspolis.text'}
                      fontWeight={'bold'}
                      onClick={() => {
                        navigate('/profile', {
                          replace: true,
                          state: { from: location },
                        });
                      }}
                    >
                      Acessar perfil
                    </MenuItem>
                    <MenuItem
                      onClick={handleClickLogout}
                      bgColor={'uspolis.white'}
                      textColor={'uspolis.text'}
                    >
                      Sair
                    </MenuItem>
                  </VStack>
                </MenuList>
              </Menu>
            </>
          ) : (
            <HStack>
              <Button
                variant={'ghost'}
                onClick={() =>
                  navigate('/auth', {
                    replace: true,
                    state: { from: location },
                  })
                }
              >
                Entrar / Registrar
              </Button>
            </HStack>
          )}
          <IconButton
            aria-label='Toggle color mode'
            icon={colorMode == 'dark' ? <SunIcon /> : <MoonIcon />}
            onClick={() => {
              toggleColorMode();
              setMode(colorMode === 'light' ? 'dark' : 'light');
            }}
            variant={'ghost'}
          />
        </Flex>
      </Flex>
    </Box>
  );
}
