import { Button, VStack, HStack, Text, Icon, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useContext } from 'react';
import { FaList, FaRegCalendarTimes, FaRegUser, FaBook } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { appContext } from '../../../context/AppContext';
import {
  CalendarIcon,
  LockIcon,
  Search2Icon,
  UnlockIcon,
} from '@chakra-ui/icons';
import { LiaBuilding } from 'react-icons/lia';
import { MdAddChart, MdEvent, MdOutlinePendingActions } from 'react-icons/md';
import { LuCalendarClock } from 'react-icons/lu';
import { GiBookCover, GiTeacher } from 'react-icons/gi';
import { PiChair, PiExamLight } from 'react-icons/pi';
import { BsCalendar3, BsEnvelopeCheck } from 'react-icons/bs';
import { HiUserGroup } from 'react-icons/hi';
import { IconType } from 'react-icons';
import { VscFeedback, VscReport } from 'react-icons/vsc';
import moment from 'moment';

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
  const { isMobile } = useContext(appContext);
  const location = useLocation();

  return (
    <Button
      as={RouterLink}
      to={to}
      replace={replace_location}
      state={replace_location ? { from: location } : undefined}
      leftIcon={icon}
      variant={'ghost'}
      w={'full'}
      justifyContent={'flex-start'}
      fontWeight={'normal'}
      onClick={() => {
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
    <VStack
      align={'start'}
      p={'10px'}
      spacing={4}
      h={'full'}
      background={'uspolis.white'}
    >
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
                icon={<HiUserGroup />}
                to='/groups'
                text='Grupos'
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
              <DrawerButton
                icon={<VscReport />}
                to='/bug-reports'
                text='Reportes'
                replace_location={false}
                onClose={onClose}
              />
              <DrawerButton
                icon={<VscFeedback />}
                to='/feedbacks'
                text='Feedbacks'
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
              icon={<PiExamLight />}
              to='/find-exams'
              text='Encontre suas provas'
              replace_location={false}
              onClose={onClose}
            />
            <DrawerButton
              icon={<Search2Icon />}
              to='/find-classes'
              text='Encontre suas aulas'
              replace_location={false}
              onClose={onClose}
            />
            <DrawerButton
              icon={<BsCalendar3 />}
              to='/allocation'
              text='Mapa de Salas'
              replace_location={false}
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
              replace_location={false}
              onClose={onClose}
            />
            {loggedUser.is_admin ||
            (loggedUser.buildings && loggedUser.buildings.length > 0) ? (
              <>
                <DrawerButton
                  icon={<MdEvent />}
                  to='/reservations'
                  text='Reservas'
                  replace_location={false}
                  onClose={onClose}
                />
                <DrawerButton
                  icon={<BsEnvelopeCheck />}
                  to='/solicitations'
                  text='Solicitações'
                  replace_location={false}
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
                  replace_location={false}
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
                  replace_location={false}
                  onClose={onClose}
                />
                <DrawerButton
                  icon={<GiBookCover />}
                  to='/subjects'
                  text='Disciplinas'
                  replace_location={false}
                  onClose={onClose}
                />
                <DrawerButton
                  icon={<GiTeacher />}
                  to='/classes'
                  text='Turmas'
                  replace_location={false}
                  onClose={onClose}
                />
                <DrawerButton
                  icon={<FaRegCalendarTimes />}
                  to='/conflicts'
                  text='Conflitos'
                  replace_location={false}
                  onClose={onClose}
                />
                <DrawerButton
                  icon={<FaBook />}
                  to='/reports'
                  text='Relatórios'
                  replace_location={false}
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
            replace_location={false}
            onClose={onClose}
          />
        </VStack>
      )}
      <VStack
        w={'full'}
        alignItems={'flex-start'}
        gap={'0px'}
        id='menu-drawer-contact'
        background={'uspolis.white'}
      >
        <Text fontSize={'15px'}>© {moment().year()} USPolis</Text>
        <HStack align={'center'} justify={'center'} gap={'5px'}>
          <Text fontSize={'15px'}>Contato:</Text>
          <Link
            fontSize={'15px'}
            color={'uspolis.blue'}
            href={
              'https://mail.google.com/mail/?view=cm&fs=1&to=uspolis@usp.br'
            }
            rel='noopener noreferrer'
            target='_blank'
          >
            uspolis@usp.br
          </Link>
        </HStack>
      </VStack>
    </VStack>
  );
}
