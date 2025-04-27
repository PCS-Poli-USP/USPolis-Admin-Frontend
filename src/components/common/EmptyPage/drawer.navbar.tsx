// base template from https://chakra-templates.dev/navigation/navbar

import { HamburgerIcon } from '@chakra-ui/icons';
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

const NavLink = ({ children, to }: { children: ReactNode; to: string }) => (
  <Link
    display='flex'
    alignItems='center'
    px={2}
    py={1}
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
}

export function DrawerNavBar({
  handleDrawerOpen,
  handleDrawerClose,
  open,
}: DrawerNavBarProps) {
  const { isAuthenticated, loggedUser, logout } = useContext(appContext);
  const { state, setState, setPathBeforeGuide } =
    useContext(FeatureGuideContext);
  const location = useLocation();
  const navigate = useNavigate();

  async function handleClickLogout() {
    await logout();
    navigate('/', {
      replace: true,
      state: { from: location },
    });
  }
  return (
    <Box bg='uspolis.blue' color='white' px={4}>
      <Flex h={'60px'} alignItems={'center'} justifyContent={'space-between'}>
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
        <Flex alignItems={'center'}>
          {loggedUser &&
          UsersValidator.checkUserRestrictedPermission(loggedUser) ? (
            <>
              <Button
                variant={'ghost'}
                mr={'5px'}
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
                    }, 300); // ajuste conforme sua animação
                  } else {
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
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={'50px'}
                  colorScheme='dark'
                >
                  <Flex
                    id='navbar-user-menu-button'
                    alignItems={'center'}
                    justifyItems={'center'}
                  >
                    <UserImage user={loggedUser} />
                  </Flex>
                </MenuButton>
                <MenuList>
                  <VStack divider={<StackDivider borderColor={'black.500'} />}>
                    <MenuItem
                      color='black'
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
                    <MenuItem onClick={handleClickLogout} color='black'>
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
        </Flex>
      </Flex>
    </Box>
  );
}
