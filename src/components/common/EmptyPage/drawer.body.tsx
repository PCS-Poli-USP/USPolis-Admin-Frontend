import { Button, Divider, VStack, HStack, Text, Icon } from '@chakra-ui/react';
import { useContext } from 'react';
import { FaList, FaRegCalendarTimes, FaRegUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { appContext } from 'context/AppContext';
import { CalendarIcon, LockIcon, UnlockIcon } from '@chakra-ui/icons';
import { LiaBuilding } from 'react-icons/lia';
import { MdAddChart, MdEvent, MdOutlinePendingActions } from 'react-icons/md';
import { LuCalendarClock, LuCalendarSearch } from 'react-icons/lu';
import { GiBookCover, GiTeacher } from 'react-icons/gi';
import { PiChair } from 'react-icons/pi';
import { BsCalendar3, BsEnvelopeCheck } from 'react-icons/bs';

interface DrawerBodyProps {
  onClose: () => void;
}

export default function DrawerBody({ onClose }: DrawerBodyProps) {
  const navigate = useNavigate();
  const { loggedUser } = useContext(appContext);

  return (
    <VStack divider={<Divider />} align={'start'} ml={4} spacing={2} mt={2}>
      {loggedUser ? (
        <>
          {loggedUser.is_admin ? (
            <VStack w={'full'} alignItems={'flex-start'}>
              <HStack>
                <Icon as={LockIcon} color={'uspolis.blue'} />
                <Text color={'uspolis.blue'} fontWeight={'bold'}>
                  Admin
                </Text>
              </HStack>
              <Button
                leftIcon={<LiaBuilding />}
                variant={'ghost'}
                w={'full'}
                justifyContent={'flex-start'}
                fontWeight={'normal'}
                onClick={() => {
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
                fontWeight={'normal'}
                onClick={() => {
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
                fontWeight={'normal'}
                onClick={() => {
                  navigate('/institutional-events');
                }}
              >
                Eventos
              </Button>
            </VStack>
          ) : undefined}

          <VStack w={'full'} alignItems={'flex-start'}>
            <HStack>
              <Icon as={UnlockIcon} color={'uspolis.blue'} />
              <Text color={'uspolis.blue'} fontWeight={'bold'}>
                Público
              </Text>
            </HStack>
            <Button
              leftIcon={<BsCalendar3 />}
              variant={'ghost'}
              w={'full'}
              fontWeight={'normal'}
              justifyContent={'flex-start'}
              onClick={() => {
                navigate('/allocation');
              }}
            >
              Mapa de Salas
            </Button>
          </VStack>

          <VStack w={'full'} alignItems={'flex-start'}>
            <HStack>
              <Icon as={MdOutlinePendingActions} color={'uspolis.blue'} />
              <Text color={'uspolis.blue'} fontWeight={'bold'}>
                Solicitações e reservas
              </Text>
            </HStack>
            <Button
              leftIcon={<FaList />}
              variant={'ghost'}
              w={'full'}
              justifyContent={'flex-start'}
              fontWeight={'normal'}
              onClick={() => {
                navigate('/my-solicitations');
              }}
            >
              Minhas solicitações
            </Button>
            <Button
              leftIcon={<MdEvent />}
              variant={'ghost'}
              w={'full'}
              fontWeight={'normal'}
              justifyContent={'flex-start'}
              onClick={() => {
                navigate('/reservations');
              }}
            >
              Reservas
            </Button>
            <Button
              leftIcon={<BsEnvelopeCheck />}
              variant={'ghost'}
              w={'full'}
              fontWeight={'normal'}
              justifyContent={'flex-start'}
              onClick={() => {
                navigate('/solicitations');
              }}
            >
              Solicitações
            </Button>
          </VStack>

          <VStack w={'full'} alignItems={'flex-start'}>
            <HStack>
              <Icon as={LuCalendarClock} color={'uspolis.blue'} />
              <Text color={'uspolis.blue'} fontWeight={'bold'}>
                Datas e Feriados
              </Text>
            </HStack>
            <Button
              leftIcon={<CalendarIcon />}
              variant={'ghost'}
              w={'full'}
              fontWeight={'normal'}
              justifyContent={'flex-start'}
              onClick={() => {
                navigate('/calendars');
              }}
            >
              Calendários
            </Button>
          </VStack>

          <VStack w={'full'} alignItems={'flex-start'}>
            <HStack>
              <Icon as={MdAddChart} color={'uspolis.blue'} />
              <Text color={'uspolis.blue'} fontWeight={'bold'}>
                Oferecimentos
              </Text>
            </HStack>
            <Button
              leftIcon={<PiChair />}
              variant={'ghost'}
              w={'full'}
              fontWeight={'normal'}
              justifyContent={'flex-start'}
              onClick={() => {
                navigate('/classrooms');
              }}
            >
              Salas
            </Button>
            <Button
              leftIcon={<GiBookCover />}
              variant={'ghost'}
              w={'full'}
              fontWeight={'normal'}
              justifyContent={'flex-start'}
              onClick={() => {
                navigate('/subjects');
              }}
            >
              Disciplinas
            </Button>
            <Button
              leftIcon={<GiTeacher />}
              variant={'ghost'}
              w={'full'}
              fontWeight={'normal'}
              justifyContent={'flex-start'}
              onClick={() => {
                navigate('/classes');
              }}
            >
              Turmas
            </Button>
            <Button
              leftIcon={<FaRegCalendarTimes />}
              variant={'ghost'}
              w={'full'}
              fontWeight={'normal'}
              justifyContent={'flex-start'}
              onClick={() => {
                navigate('/conflicts');
              }}
            >
              Conflitos
            </Button>
          </VStack>
        </>
      ) : (
        <VStack w={'full'} alignItems={'flex-start'}>
          <HStack>
            <Icon as={UnlockIcon} color={'uspolis.blue'} />
            <Text color={'uspolis.blue'} fontWeight={'bold'}>
              Público
            </Text>
          </HStack>
          <Button
            leftIcon={<BsCalendar3 />}
            variant={'ghost'}
            w={'full'}
            fontWeight={'normal'}
            justifyContent={'flex-start'}
            onClick={() => {
              navigate('/allocation');
            }}
          >
            Mapa de Salas
          </Button>
        </VStack>
      )}
    </VStack>
  );
}
