import { Flex, Heading, Image, Link, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import Logo from '../../assets/uspolis.logo.png';

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
interface RedirectErrorProps {
  error: string;
}

function RedirectError({ error }: RedirectErrorProps) {
  return (
    <Flex
      w={'100vw'}
      h={'100vh'}
      justify={'center'}
      align={'center'}
      direction={'column'}
      gap={'20px'}
    >
      <NavLink to='/index'>
        <Image
          src={Logo}
          alt='USPolis'
          objectFit='contain'
          boxSize='100px'
          mr={2}
        />
        <Heading>USPolis</Heading>
      </NavLink>
      <Heading>Erro ao redirecionar</Heading>
      <Text>{error}</Text>
    </Flex>
  );
}

export default RedirectError;
