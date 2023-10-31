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
import { Auth } from 'aws-amplify';
import { appContext } from 'context/AppContext';
import { ReactNode, useContext, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import Logo from 'assets/uspolis.logo.png';

const Links = [
  { text: 'Salas', value: 'classrooms' },
  { text: 'Turmas', value: 'classes' },
  { text: 'Alocações', value: 'allocation' },
  { text: 'Prédios', value: 'buildings' },
  { text: 'Usuários', value: 'users' },
];

const NavLink = ({ children, to }: { children: ReactNode; to: string }) => (
  <Link
    display='flex'
    alignItems='center'
    px={2}
    py={1}
    rounded='md'
    _hover={{
      // textDecoration: 'none',
      bg: 'uspolis.grey',
    }}
    href={to}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { username } = useContext(appContext);

  function handleClickLogout() {
    Auth.signOut();
  }

  useEffect(() => {}, [username]);

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
              <Image src={Logo} alt='USPolis' objectFit='contain' boxSize='40px' mr={2} />
              USPolis
            </NavLink>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link.value} to={link.value}>
                  {link.text}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0} colorScheme='dark'>
                <Flex alignItems={'center'} gap='1'>
                  <Text>{username}</Text>
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
              {Links.map((link) => (
                <NavLink key={link.value} to={link.value}>
                  {link.text}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
