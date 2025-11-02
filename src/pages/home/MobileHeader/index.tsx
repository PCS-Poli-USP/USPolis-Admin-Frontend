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
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import Logo from '../../../assets/uspolis.logo.png';
import { appContext } from '../../../context/AppContext';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserImage from '../../../components/common/UserImage/user.image';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

function MobileHeader() {
  const { colorMode, setColorMode } = useColorMode();
  const isDark = colorMode === 'dark';
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
      bg={'uspolis.white'}
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
                <UserImage />
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
            bg={'uspolis.blue'}
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
        <IconButton
          aria-label='Toggle dark mode'
          variant={'ghost'}
          ml={'5px'}
          icon={isDark ? <SunIcon /> : <MoonIcon />}
          onClick={() => setColorMode(isDark ? 'light' : 'dark')}
        />
      </Flex>
    </Flex>
  );
}
export default MobileHeader;
