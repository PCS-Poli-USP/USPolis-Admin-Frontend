import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  StackDivider,
  VStack,
} from '@chakra-ui/react';
import UserImage from '../UserImage/user.image';
import { LuCalendarDays, LuCircleUserRound, LuLogOut } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { appContext } from '../../../context/AppContext';

function ProfileButton() {
  const { logout } = useContext(appContext);
  const navigate = useNavigate();
  const location = useLocation();

  async function handleClickLogout() {
    await logout();
    navigate('/', {
      replace: true,
      state: { from: location.pathname },
    });
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        rounded={'full'}
        variant={'link'}
        cursor={'pointer'}
      >
        <Flex
          id='navbar-user-menu-button'
          align={'center'}
          justify={'center'}
          gap='10px'
        >
          <UserImage />
        </Flex>
      </MenuButton>
      <MenuList bgColor={'uspolis.white'}>
        <VStack
          divider={<StackDivider borderColor={'black.500'} />}
          bgColor={'uspolis.white'}
        >
          <MenuItem
            bgColor={'uspolis.white'}
            textColor={'uspolis.text'}
            fontWeight={'bold'}
            icon={<LuCircleUserRound />}
            onClick={() => {
              navigate('/profile', {
                replace: true,
                state: { from: location.pathname },
              });
            }}
          >
            Acessar perfil
          </MenuItem>
          <MenuItem
            bgColor={'uspolis.white'}
            textColor={'uspolis.text'}
            fontWeight={'bold'}
            icon={<LuCalendarDays />}
            onClick={() => {
              navigate('/timetable', {
                replace: true,
                state: { from: location.pathname },
              });
            }}
          >
            Grade horária
          </MenuItem>
          <MenuItem
            icon={<LuLogOut />}
            onClick={handleClickLogout}
            bgColor={'uspolis.white'}
            textColor={'uspolis.text'}
          >
            Sair
          </MenuItem>
        </VStack>
      </MenuList>
    </Menu>
  );
}

export default ProfileButton;
