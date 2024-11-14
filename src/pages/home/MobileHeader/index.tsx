import {
  Button,
  Flex,
  HStack,
  Image,
  Text,
  Link,
  Spacer,
} from '@chakra-ui/react';
import Logo from 'assets/uspolis.logo.png';
import { useLocation, useNavigate } from 'react-router-dom';

function MobileHeader() {
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
        <HStack spacing={0} ml={'15px'}>
          <Image
            src={Logo}
            alt='USPolis'
            objectFit={'contain'}
            boxSize={'50px'}
          />
          <Text fontSize={'2xl'}>USPolis</Text>
        </HStack>
      </Link>
      <Spacer />
      <Flex
        direction={'row'}
        justify={'center'}
        gap={2}
        align={'center'}
        mr={'15px'}
      >
        <Button
          // as={'a'}
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
      </Flex>
    </Flex>
  );
}
export default MobileHeader;
