// base template from https://chakra-templates.dev/navigation/navbar

import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
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
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ReactNode, useContext } from 'react';
import { FaUser } from 'react-icons/fa';
import Logo from 'assets/uspolis.logo.png';
import { appContext } from 'context/AppContext';

const Links = [
  { text: 'Disciplinas', value: '/subjects', admin: false },
  { text: 'Salas', value: '/classrooms', admin: false },
  { text: 'Turmas', value: '/classes', admin: false },
  { text: 'Feriados', value: '/holidays', admin: false },
  { text: 'Calendários', value: '/calendars', admin: false },
  { text: 'Alocações', value: '/allocation', admin: false },
  { text: 'Conflitos', value: '/conflicts', admin: false },
  { text: 'Eventos', value: '/institutional-events', admin: true },
  { text: 'Prédios', value: '/buildings', admin: true },
  { text: 'Usuários', value: '/users', admin: true },
];

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

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loggedUser, logout } = useContext(appContext);

  function handleClickLogout() {
    logout();
  }

  return (
    <>
      <Box bg='uspolis.blue' color='white' px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
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
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map(
                (link) =>
                  (!link.admin || (link.admin && loggedUser?.is_admin)) && (
                    <NavLink key={link.value} to={link.value}>
                      {link.text}
                    </NavLink>
                  ),
              )}
            </HStack>
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
                {/* <MenuItem>Perfil</MenuItem>
                <MenuDivider /> */}
                <MenuItem onClick={handleClickLogout} color='black'>
                  Sair
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map(
                (link) =>
                  (!link.admin || (link.admin && loggedUser?.is_admin)) && (
                    <NavLink key={link.value} to={link.value}>
                      {link.text}
                    </NavLink>
                  ),
              )}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
