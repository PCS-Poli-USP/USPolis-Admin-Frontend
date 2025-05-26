import {
  Button,
  Flex,
  HStack,
  Image,
  Text,
  Link,
  Spacer,
  Menu,
  MenuButton,
  Icon,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import Logo from '../../../assets/uspolis.logo.png';
import { appContext } from '../../../context/AppContext';
import { useContext } from 'react';
import { FaUser } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

function MobileHeader() {
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
          ml={'50px'}
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
                <Text
                  textColor={'uspolis.blue'}
                  overflow={'hidden'}
                  textOverflow={'ellipsis'}
                  maxW={'100px'}
                >
                  {context.loggedUser.name.split(' ')[0]}
                </Text>
                <Icon as={FaUser} />
              </Flex>
            </MenuButton>
            <MenuList>
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
export default MobileHeader;
