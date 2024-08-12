import {
  Button,
  Drawer,
  Divider,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  VStack,
  Link as ChakraLink,
  Image,
  HStack,
  Text,
  Icon,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { FaRegCalendarTimes, FaRegUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Logo from 'assets/uspolis.logo.png';
import { appContext } from 'context/AppContext';
import { CalendarIcon, LockIcon } from '@chakra-ui/icons';
import { LiaBuilding } from 'react-icons/lia';
import { MdAddChart, MdEvent } from 'react-icons/md';
import { LuCalendarClock, LuCalendarSearch } from 'react-icons/lu';
import { GiBookCover, GiTeacher } from 'react-icons/gi';
import { PiChair } from 'react-icons/pi';
import { BsCalendar3 } from 'react-icons/bs';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  btnRef: React.RefObject<HTMLButtonElement>;
  placement?: 'right' | 'left' | 'top' | 'bottom';
}

export function MenuDrawer({
  isOpen,
  onClose,
  btnRef,
  placement = 'left',
}: DrawerProps) {
  const navigate = useNavigate();
  const { loggedUser } = useContext(appContext);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={btnRef}
      placement={placement}
    >
      <DrawerOverlay />
      <DrawerContent borderRadius={'0px 20px 20px 0px'}>
        <DrawerCloseButton />
        <DrawerHeader borderRadius={'0 20px 0 0'}>
          <HStack>
            <Image
              src={Logo}
              alt='USPolis'
              objectFit='contain'
              boxSize='40px'
              mr={2}
              onClick={() => navigate('/index')}
            />
            <ChakraLink as={Link} to='/index'>
              USPolis
            </ChakraLink>
          </HStack>
        </DrawerHeader>

        <DrawerBody>
          <VStack divider={<Divider />} align={'start'}>
            {loggedUser?.is_admin ? (
              <VStack w={'full'} alignItems={'flex-start'}>
                <HStack>
                  <Icon as={LockIcon} />
                  <Text>Admin</Text>
                </HStack>
                <Button
                  leftIcon={<LiaBuilding />}
                  variant={'ghost'}
                  w={'full'}
                  justifyContent={'flex-start'}
                  onClick={() => {
                    onClose();
                    navigate('/buildings');
                  }}
                >
                  Prédios
                </Button>
                <Button
                  leftIcon={<FaRegUser />}
                  variant={'ghost'}
                  w={'full'}
                  justifyContent={'flex-start'}
                  onClick={() => {
                    onClose();
                    navigate('/users');
                  }}
                >
                  Usuários
                </Button>
                <Button
                  leftIcon={<MdEvent />}
                  variant={'ghost'}
                  w={'full'}
                  justifyContent={'flex-start'}
                  onClick={() => {
                    onClose();
                    navigate('/institutional-events');
                  }}
                >
                  Eventos
                </Button>
              </VStack>
            ) : undefined}

            <VStack w={'full'} alignItems={'flex-start'}>
              <HStack>
                <Icon as={LuCalendarClock} />
                <Text>Datas e Feriados</Text>
              </HStack>
              <Button
                leftIcon={<CalendarIcon />}
                variant={'ghost'}
                w={'full'}
                justifyContent={'flex-start'}
                onClick={() => {
                  onClose();
                  navigate('/calendars');
                }}
              >
                Calendários
              </Button>
            </VStack>
            <VStack w={'full'} alignItems={'flex-start'}>
              <HStack>
                <Icon as={MdAddChart} />
                <Text>Oferecimentos</Text>
              </HStack>
              <Button
                leftIcon={<PiChair />}
                variant={'ghost'}
                w={'full'}
                justifyContent={'flex-start'}
                onClick={() => {
                  onClose();
                  navigate('/classrooms');
                }}
              >
                Salas
              </Button>
              <Button
                leftIcon={<GiBookCover />}
                variant={'ghost'}
                w={'full'}
                justifyContent={'flex-start'}
                onClick={() => {
                  onClose();
                  navigate('/subjects');
                }}
              >
                Disciplinas
              </Button>
              <Button
                leftIcon={<GiTeacher />}
                variant={'ghost'}
                w={'full'}
                justifyContent={'flex-start'}
                onClick={() => {
                  onClose();
                  navigate('/classes');
                }}
              >
                Turmas
              </Button>
              <Button
                leftIcon={<MdEvent />}
                variant={'ghost'}
                w={'full'}
                justifyContent={'flex-start'}
                onClick={() => {
                  onClose();
                  navigate('/reservations');
                }}
              >
                Reservas
              </Button>
            </VStack>
            <VStack w={'full'} alignItems={'flex-start'}>
              <HStack>
                <Icon as={LuCalendarSearch} />
                <Text>Mapa de Salas e Conflitos</Text>
              </HStack>
              <Button
                leftIcon={<BsCalendar3 />}
                variant={'ghost'}
                w={'full'}
                justifyContent={'flex-start'}
                onClick={() => {
                  onClose();
                  navigate('/allocation');
                }}
              >
                Mapa de Salas
              </Button>
              <Button
                leftIcon={<FaRegCalendarTimes />}
                variant={'ghost'}
                w={'full'}
                justifyContent={'flex-start'}
                onClick={() => {
                  onClose();
                  navigate('/conflicts');
                }}
              >
                Conflitos
              </Button>
            </VStack>
          </VStack>
        </DrawerBody>

        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
