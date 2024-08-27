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
}

export function DrawerNavBar({ handleDrawerOpen, open }: DrawerNavBarProps) {
  const { loggedUser, logout } = useContext(appContext);

  function handleClickLogout() {
    logout();
  }
  return (
    <Box bg='uspolis.blue' color='white' px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <HStack spacing={3} alignItems={'center'}>
          <IconButton
            size={'md'}
            icon={<HamburgerIcon />}
            hidden={open}
            variant={'ghost'}
            textColor={'white'}
            aria-label={'open-menu'}
            onClick={() => handleDrawerOpen()}
          />
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
          <Menu>
            <MenuButton
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}
              colorScheme='dark'
            >
              <Flex alignItems={'center'} gap='1'>
                <Text>{loggedUser?.name}</Text>
                <Icon as={FaUser} />
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleClickLogout} color='black'>
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}
