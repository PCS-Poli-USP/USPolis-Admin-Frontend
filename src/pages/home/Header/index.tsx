import {
  Button,
  Flex,
  HStack,
  Image,
  Text,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import Logo from '../../../assets/uspolis.logo.png';
import { appContext } from '../../../context/AppContext';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserImage from '../../../components/common/EmptyPage/UserImage/user.image';

function Header() {
  const context = useContext(appContext);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Flex
      direction={'row'}
      align={'center'}
      justify={'center'}
      position={'fixed'}
      w={'full'}
      borderWidth={'2px'}
      shadow={'md'}
      gap={4}
      h={'60px'}
      bg={'white'}
      zIndex={100}
    >
      <Link
        href='#section1'
        _hover={{
          textDecoration: 'none',
        }}
      >
        <HStack spacing={0} mr={'60px'}>
          <Image
            src={Logo}
            alt='USPolis'
            objectFit={'contain'}
            boxSize={'50px'}
          />
          <Text fontSize={'2xl'}>USPolis</Text>
        </HStack>
      </Link>
      <Button
        as={'a'}
        href='#section2'
        variant={'link'}
        color={'black'}
        _hover={{
          textDecoration: 'none',
          color: 'teal',
        }}
      >
        Recursos
      </Button>
      <Button
        as={'a'}
        href='#section4'
        variant={'link'}
        color={'black'}
        _hover={{
          textDecoration: 'none',
          color: 'teal',
        }}
      >
        Baixar o App
      </Button>
      <Button
        as={'a'}
        href='#section5'
        variant={'link'}
        color={'black'}
        _hover={{
          textDecoration: 'none',
          color: 'teal',
        }}
      >
        Sobre
      </Button>
      <Flex direction={'row'} justify={'center'} gap={2} align={'center'}>
        <Button
          // as={'a'}
          ml={'100px'}
          variant={'link'}
          color={'teal'}
          _hover={{
            textDecoration: 'none',
            color: 'teal',
            cursor: 'pointer',
          }}
          onClick={() => {
            navigate('/allocation', {
              replace: true,
              state: { from: location },
            });
          }}
        >
          Mapa de Salas
        </Button>
        <Text fontSize={'3xl'}>|</Text>
        {context.loggedUser ? (
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
                <UserImage user={context.loggedUser} />
              </Flex>
            </MenuButton>
            <MenuList>
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
              <MenuItem onClick={() => context.logout()} color='black'>
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Button
            hidden={context.isAuthenticated}
            // as={'a'}
            variant={'solid'}
            colorScheme={'teal'}
            size={'md'}
            onClick={() => {
              navigate('/auth', {
                replace: true,
                state: { from: location },
              });
            }}
          >
            Entrar
          </Button>
        )}
      </Flex>
    </Flex>
  );
}

export default Header;
