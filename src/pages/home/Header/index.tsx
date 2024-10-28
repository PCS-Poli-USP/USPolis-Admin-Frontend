import { Button, Flex, HStack, Image, Text, Link } from '@chakra-ui/react';
import Logo from 'assets/uspolis.logo.png';
import { useLocation, useNavigate } from 'react-router-dom';

function Header() {
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
        href='#section3'
        variant={'link'}
        color={'black'}
        _hover={{
          textDecoration: 'none',
          color: 'teal',
        }}
      >
        Funcionalidades
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
          ml={'100px'}
          // as={'a'}
          variant={'solid'}
          colorScheme={'teal'}
          size={'md'}
          onClick={() => {
            navigate('/allocation', {
              replace: true,
              state: { from: location },
            });
          }}
        >
          Entrar
        </Button>
        <Text fontSize={'3xl'}>|</Text>
        <Button
          as={'a'}
          variant={'link'}
          color={'teal'}
          _hover={{
            textDecoration: 'none',
            color: 'teal',
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
      </Flex>
    </Flex>
  );
}

export default Header;
