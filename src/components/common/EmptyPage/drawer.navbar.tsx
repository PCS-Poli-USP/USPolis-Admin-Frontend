// base template from https://chakra-templates.dev/navigation/navbar

import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { ReactNode, useContext } from 'react';
import { FaUser } from 'react-icons/fa';
import Logo from 'assets/uspolis.logo.png';
import { appContext } from 'context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';

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
  open: boolean;
  isMobile: boolean;
}

export function DrawerNavBar({
  handleDrawerOpen,
  open,
  isMobile,
}: DrawerNavBarProps) {
  const { isAuthenticated, loggedUser, logout } = useContext(appContext);
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
          {isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
                colorScheme='dark'
              >
                <Flex alignItems={'center'} gap='10px'>
                  <Text
                    overflowX={'auto'}
                    textOverflow={'ellipsis'}
                    w={'auto'}
                    hidden={isMobile}
                  >
                    {loggedUser ? loggedUser.name : 'Logando...'}
                  </Text>
                  <Icon as={FaUser} boxSize={'20px'} />
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleClickLogout} color='black'>
                  Sair
                </MenuItem>
              </MenuList>
            </Menu>
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
