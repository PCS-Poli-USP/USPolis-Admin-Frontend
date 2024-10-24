import { Button, Flex, HStack, Image, Text, Link } from '@chakra-ui/react';
import Logo from 'assets/uspolis.logo.png';

function Header() {
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
      zIndex={10000}
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
    </Flex>
  );
}

export default Header;
