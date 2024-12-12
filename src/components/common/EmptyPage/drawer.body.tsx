import {
  Button,
  VStack,
  HStack,
  Text,
  Icon,
  useMediaQuery,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { FaList, FaRegCalendarTimes, FaRegUser } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { appContext } from 'context/AppContext';
import { CalendarIcon, LockIcon, Search2Icon, UnlockIcon } from '@chakra-ui/icons';
import { LiaBuilding } from 'react-icons/lia';
import { MdAddChart, MdEvent, MdOutlinePendingActions } from 'react-icons/md';
import { LuCalendarClock } from 'react-icons/lu';
import { GiBookCover, GiTeacher } from 'react-icons/gi';
import { PiChair } from 'react-icons/pi';
import { BsCalendar3, BsEnvelopeCheck } from 'react-icons/bs';
import { IconType } from 'react-icons';

interface DrawerBodyProps {
  onClose: () => void;
}

interface DrawerButtonProps {
  text: string;
  to: string;
  replace_location: boolean;
  icon: React.ReactElement<IconType>;
  onClose: () => void;
}

function DrawerButton({
  text,
  to,
  icon,
  replace_location,
  onClose,
}: DrawerButtonProps) {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Button
      leftIcon={icon}
      variant={'ghost'}
      w={'full'}
      justifyContent={'flex-start'}
      fontWeight={'normal'}
      onClick={() => {
        if (replace_location) {
          navigate(to, { replace: true, state: { from: location } });
        } else navigate(to);

        if (isMobile) onClose();
      }}
    >
      {text}
    </Button>
  );
}

export default function DrawerBody({ onClose }: DrawerBodyProps) {
  const { loggedUser } = useContext(appContext);

  return (
    <VStack align={'start'} p={'10px'} spacing={4} maxH={'900px'}>
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
              <DrawerButton
                icon={<LiaBuilding />}
                to='/buildings'
                text='Prédios'
                replace_location={false}
                onClose={onClose}
              />
              <DrawerButton
                icon={<FaRegUser />}
                to='/users'
                text='Usuários'
                replace_location={false}
                onClose={onClose}
              />
              <DrawerButton
                icon={<MdEvent />}
                to='/institutional-events'
                text='Eventos'
                replace_location={false}
                onClose={onClose}
              />
            </VStack>
          ) : (
            <></>
          )}

          <VStack w={'full'} alignItems={'flex-start'}>
            <HStack>
              <Icon as={UnlockIcon} color={'uspolis.blue'} />
              <Text color={'uspolis.blue'} fontWeight={'bold'}>
                Público
              </Text>
            </HStack>
            <DrawerButton
              icon={<Search2Icon />}
              to='/find-classes'
              text='Encontre suas aulas'
              replace_location={true}
              onClose={onClose}
            />
            <DrawerButton
              icon={<BsCalendar3 />}
              to='/allocation'
              text='Mapa de Salas'
              replace_location={true}
              onClose={onClose}
            />
          </VStack>

          <VStack w={'full'} alignItems={'flex-start'}>
            <HStack>
              <Icon as={MdOutlinePendingActions} color={'uspolis.blue'} />
              <Text color={'uspolis.blue'} fontWeight={'bold'}>
                Solicitações e reservas
              </Text>
            </HStack>
            <DrawerButton
              icon={<FaList />}
              to='/my-solicitations'
              text='Minhas solicitações'
              replace_location={true}
              onClose={onClose}
            />
            {loggedUser.is_admin ||
            (loggedUser.buildings && loggedUser.buildings.length > 0) ? (
              <>
                <DrawerButton
                  icon={<MdEvent />}
                  to='/reservations'
                  text='Reservas'
                  replace_location={true}
                  onClose={onClose}
                />
                <DrawerButton
                  icon={<BsEnvelopeCheck />}
                  to='/solicitations'
                  text='Solicitações'
                  replace_location={true}
                  onClose={onClose}
                />
              </>
            ) : undefined}
          </VStack>

          {loggedUser.is_admin ||
          (loggedUser.buildings && loggedUser.buildings.length > 0) ? (
            <>
              <VStack w={'full'} alignItems={'flex-start'}>
                <HStack>
                  <Icon as={LuCalendarClock} color={'uspolis.blue'} />
                  <Text color={'uspolis.blue'} fontWeight={'bold'}>
                    Datas e Feriados
                  </Text>
                </HStack>
                <DrawerButton
                  icon={<CalendarIcon />}
                  to='/calendars'
                  text='Calendários'
                  replace_location={true}
                  onClose={onClose}
                />
              </VStack>

              <VStack w={'full'} alignItems={'flex-start'}>
                <HStack>
                  <Icon as={MdAddChart} color={'uspolis.blue'} />
                  <Text color={'uspolis.blue'} fontWeight={'bold'}>
                    Oferecimentos
                  </Text>
                </HStack>
                <DrawerButton
                  icon={<PiChair />}
                  to='/classrooms'
                  text='Salas'
                  replace_location={true}
                  onClose={onClose}
                />
                <DrawerButton
                  icon={<GiBookCover />}
                  to='/subjects'
                  text='Disciplinas'
                  replace_location={true}
                  onClose={onClose}
                />
                <DrawerButton
                  icon={<GiTeacher />}
                  to='/classes'
                  text='Turmas'
                  replace_location={true}
                  onClose={onClose}
                />
                <DrawerButton
                  icon={<FaRegCalendarTimes />}
                  to='/conflicts'
                  text='Conflitos'
                  replace_location={true}
                  onClose={onClose}
                />
              </VStack>
            </>
          ) : undefined}
        </>
      ) : (
        <VStack w={'full'} alignItems={'flex-start'}>
          <HStack>
            <Icon as={UnlockIcon} color={'uspolis.blue'} />
            <Text color={'uspolis.blue'} fontWeight={'bold'}>
              Público
            </Text>
          </HStack>
          <DrawerButton
            icon={<BsCalendar3 />}
            to='/allocation'
            text='Mapa de Salas'
            replace_location={true}
            onClose={onClose}
          />
        </VStack>
      )}
    </VStack>
  );
}
