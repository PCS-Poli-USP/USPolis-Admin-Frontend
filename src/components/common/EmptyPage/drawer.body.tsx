import {
  Button,
  VStack,
  HStack,
  Text,
  Icon,
  Link,
  useColorMode,
  ScaleFade,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useContext } from 'react';
import { useDrawerState } from '../../../hooks/useDrawerState';
import {
  FaGithub,
  FaList,
  FaRegCalendarTimes,
  FaRegUser,
  FaBook,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaUserCircle,
} from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { appContext } from '../../../context/AppContext';
import {
  CalendarIcon,
  EmailIcon,
  LockIcon,
  Search2Icon,
  UnlockIcon,
} from '@chakra-ui/icons';
import { LiaBuilding } from 'react-icons/lia';
import {
  MdAddChart,
  MdDevices,
  MdEvent,
  MdOutlinePendingActions,
} from 'react-icons/md';
import { LuCalendarDays } from 'react-icons/lu';
import { GiBookCover, GiTeacher, GiGraduateCap } from 'react-icons/gi';
import { PiChair, PiExamLight } from 'react-icons/pi';
import { BsCalendar3, BsEnvelopeCheck } from 'react-icons/bs';
import { HiUserGroup } from 'react-icons/hi';
import { IconType } from 'react-icons';
import { VscFeedback, VscReport } from 'react-icons/vsc';
import { GrDocumentText } from 'react-icons/gr';
import moment from 'moment';

const DOCS_URL = import.meta.env.VITE_USPOLIS_DOCS_URL;

interface DrawerBodyProps {
  onClose: () => void;
}

interface DrawerButtonProps {
  text: string;
  to: string;
  replace_location: boolean;
  icon: React.ReactElement<IconType>;
  onClose: () => void;
  highlighted?: boolean;
}

interface DrawerSectionButtonProps extends DrawerButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  rightIcon?: React.ReactElement<IconType>;
}

function DrawerButton({
  text,
  to,
  icon,
  replace_location,
  onClose,
  highlighted,
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
      backgroundColor={highlighted ? 'uspolis.blue' : 'uspolis.white'}
      textColor={highlighted ? 'uspolis.white' : 'uspolis.black'}
      fontWeight={'normal'}
      onClick={() => {
        if (isMobile) onClose();
      }}
      opacity={highlighted ? '0.9' : undefined}
      _hover={highlighted ? { opacity: '0.7' } : undefined}
    >
      {text}
    </Button>
  );
}

function DrawerSectionButton({
  text,
  to,
  icon,
  replace_location,
  onClose,
  onClick,
  rightIcon,
  highlighted,
}: DrawerSectionButtonProps) {
  const { isMobile } = useContext(appContext);
  const location = useLocation();

  return (
    <Button
      as={RouterLink}
      to={to}
      replace={replace_location}
      state={replace_location ? { from: location } : undefined}
      variant={'ghost'}
      w={'full'}
      display={'flex'}
      justifyContent={'flex-start'}
      alignItems={'center'}
      gap={2}
      marginLeft={'-15px'}
      backgroundColor={highlighted ? 'uspolis.blue' : 'uspolis.white'}
      color={highlighted ? 'uspolis.white' : 'uspolis.blue'}
      fontWeight={'bold'}
      onClick={(e) => {
        if (onClick) onClick(e);
        if (isMobile) onClose();
      }}
      opacity={highlighted ? '0.9' : undefined}
      _hover={highlighted ? { opacity: '0.7' } : undefined}
    >
      {icon}
      <span style={{ flex: 1 }}>{text}</span>
      {rightIcon && <div style={{ marginLeft: 'auto' }}>{rightIcon}</div>}
    </Button>
  );
}

export default function DrawerBody({ onClose }: DrawerBodyProps) {
  const { loggedUser } = useContext(appContext);
  const { colorMode } = useColorMode();

  const [isOpenProfileSection, setIsOpenProfileSection] = useDrawerState(
    'profileSection',
    false,
  );
  const [isOpenAdminSection, setIsOpenAdminSection] = useDrawerState(
    'adminSection',
    false,
  );
  const [isOpenPublicSection, setIsOpenPublicSection] = useDrawerState(
    'publicSection',
    true,
  );
  const [isOpenSchedulingSection, setIsOpenSchedulingSection] = useDrawerState(
    'schedulingSection',
    false,
  );
  // const [isOpenDateSection, setIsOpenDateSection] = useDrawerState('dateSection', false);
  const [isOpenOfferingsSection, setIsOpenOfferingsSection] = useDrawerState(
    'offeringsSection',
    false,
  );

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <VStack
      align={'start'}
      p={'10px'}
      spacing={2}
      h={'full'}
      backgroundColor={'uspolis.white'}
    >
      {loggedUser ? (
        <>
          {loggedUser && (
            <VStack
              w={'full'}
              alignItems={'flex-start'}
              background={'uspolis.white'}
            >
              <DrawerSectionButton
                icon={<FaUser />}
                to='/profile'
                text='Perfil'
                replace_location={false}
                onClose={onClose}
                onClick={() => setIsOpenProfileSection((prev) => !prev)}
                rightIcon={
                  isOpenProfileSection ? <FaChevronUp /> : <FaChevronDown />
                }
                highlighted={
                  currentPath.startsWith('/profile') && !isOpenProfileSection
                }
              />
              <ScaleFade
                initialScale={0.9}
                in={isOpenProfileSection}
                hidden={!isOpenProfileSection}
              >
                <DrawerButton
                  icon={<FaUserCircle />}
                  to='/profile'
                  text='Meu Perfil'
                  replace_location={false}
                  onClose={onClose}
                  highlighted={currentPath === '/profile'}
                />
                <DrawerButton
                  icon={<LuCalendarDays />}
                  to='/profile/timetable'
                  text='Grade Horária'
                  replace_location={false}
                  onClose={onClose}
                  highlighted={currentPath === '/profile/timetable'}
                />
                <DrawerButton
                  icon={<FaList />}
                  to='/profile/solicitations'
                  text='Minhas solicitações'
                  replace_location={false}
                  onClose={onClose}
                  highlighted={currentPath === '/profile/solicitations'}
                />
              </ScaleFade>
            </VStack>
          )}

          {loggedUser.is_admin ? (
            <VStack
              w={'full'}
              alignItems={'flex-start'}
              background={'uspolis.white'}
            >
              <DrawerSectionButton
                icon={<LockIcon />}
                to='/admin'
                text='Admin'
                replace_location={false}
                onClose={onClose}
                onClick={() => setIsOpenAdminSection((prev) => !prev)}
                rightIcon={
                  isOpenAdminSection ? <FaChevronUp /> : <FaChevronDown />
                }
                highlighted={
                  currentPath.startsWith('/admin') && !isOpenAdminSection
                }
              />
              <ScaleFade
                initialScale={0.9}
                in={isOpenAdminSection}
                hidden={!isOpenAdminSection}
              >
                <DrawerButton
                  icon={<LiaBuilding />}
                  to='/admin/buildings'
                  text='Prédios'
                  replace_location={false}
                  onClose={onClose}
                  highlighted={currentPath === '/admin/buildings'}
                />
                <DrawerButton
                  icon={<FaRegUser />}
                  to='/admin/users'
                  text='Usuários'
                  replace_location={false}
                  onClose={onClose}
                  highlighted={currentPath === '/admin/users'}
                />
                <DrawerButton
                  icon={<MdDevices />}
                  to='/admin/sessions'
                  text='Sessões de Usuários'
                  replace_location={false}
                  onClose={onClose}
                  highlighted={currentPath === '/admin/sessions'}
                />
                <DrawerButton
                  icon={<HiUserGroup />}
                  to='/admin/groups'
                  text='Grupos'
                  replace_location={false}
                  onClose={onClose}
                  highlighted={currentPath === '/admin/groups'}
                />
                <DrawerButton
                  icon={<MdEvent />}
                  to='/admin/institutional-events'
                  text='Eventos'
                  replace_location={false}
                  onClose={onClose}
                  highlighted={currentPath === '/admin/institutional-events'}
                />
                <DrawerButton
                  icon={<GiGraduateCap />}
                  to='/admin/courses'
                  text='Cursos'
                  replace_location={false}
                  onClose={onClose}
                  highlighted={currentPath === '/admin/courses'}
                />
                <DrawerButton
                  icon={<VscReport />}
                  to='/admin/bug-reports'
                  text='Reportes'
                  replace_location={false}
                  onClose={onClose}
                  highlighted={currentPath === '/admin/bug-reports'}
                />
                <DrawerButton
                  icon={<VscFeedback />}
                  to='/admin/feedbacks'
                  text='Feedbacks'
                  replace_location={false}
                  onClose={onClose}
                  highlighted={currentPath === '/admin/feedbacks'}
                />
              </ScaleFade>
            </VStack>
          ) : (
            <></>
          )}

          <VStack
            w={'full'}
            alignItems={'flex-start'}
            background={'uspolis.white'}
            gap={2}
          >
            <DrawerSectionButton
              icon={<UnlockIcon />}
              to='/public'
              text='Público'
              replace_location={false}
              onClose={onClose}
              onClick={() => setIsOpenPublicSection((prev) => !prev)}
              rightIcon={
                isOpenPublicSection ? <FaChevronUp /> : <FaChevronDown />
              }
              highlighted={
                currentPath.startsWith('/public') && !isOpenPublicSection
              }
            />
            <ScaleFade
              initialScale={0.9}
              in={isOpenPublicSection}
              hidden={!isOpenPublicSection}
            >
              <DrawerButton
                icon={<PiExamLight />}
                to='/public/find-exams'
                text='Encontre suas provas'
                replace_location={false}
                onClose={onClose}
                highlighted={currentPath === '/public/find-exams'}
              />
              <DrawerButton
                icon={<Search2Icon />}
                to='/public/find-classes'
                text='Encontre suas aulas'
                replace_location={false}
                onClose={onClose}
                highlighted={currentPath === '/public/find-classes'}
              />
              <DrawerButton
                icon={<BsCalendar3 />}
                to='/public/allocations'
                text='Mapa de Salas'
                replace_location={false}
                onClose={onClose}
                highlighted={currentPath === '/public/allocations'}
              />
            </ScaleFade>
          </VStack>

          {loggedUser.is_admin ||
          (loggedUser.buildings && loggedUser.buildings.length > 0) ? (
            <>
              <VStack
                w={'full'}
                alignItems={'flex-start'}
                background={'uspolis.white'}
              >
                <DrawerSectionButton
                  icon={<MdOutlinePendingActions />}
                  to='/scheduling'
                  text='Agendamento'
                  replace_location={false}
                  onClose={onClose}
                  onClick={() => setIsOpenSchedulingSection((prev) => !prev)}
                  rightIcon={
                    isOpenSchedulingSection ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )
                  }
                  highlighted={
                    currentPath.startsWith('/scheduling') &&
                    !isOpenSchedulingSection
                  }
                />
                <ScaleFade
                  initialScale={0.9}
                  in={isOpenSchedulingSection}
                  hidden={!isOpenSchedulingSection}
                >
                  <DrawerButton
                    icon={<MdEvent />}
                    to='/scheduling/reservations'
                    text='Reservas'
                    replace_location={false}
                    onClose={onClose}
                    highlighted={currentPath === '/scheduling/reservations'}
                  />
                  <DrawerButton
                    icon={<BsEnvelopeCheck />}
                    to='/scheduling/solicitations'
                    text='Solicitações'
                    replace_location={false}
                    onClose={onClose}
                    highlighted={currentPath === '/scheduling/solicitations'}
                  />
                </ScaleFade>
              </VStack>

              <VStack
                w={'full'}
                alignItems={'flex-start'}
                backgroundColor={'uspolis.white'}
                gap={2}
              >
                <DrawerSectionButton
                  icon={<MdAddChart />}
                  to='/oferings'
                  text='Oferecimentos'
                  replace_location={false}
                  onClose={onClose}
                  onClick={() => {
                    // if (currentPath.includes('/oferings')) e.preventDefault();
                    setIsOpenOfferingsSection((prev) => !prev);
                  }}
                  rightIcon={
                    isOpenOfferingsSection ? <FaChevronUp /> : <FaChevronDown />
                  }
                  highlighted={
                    currentPath.startsWith('/oferings') &&
                    !isOpenOfferingsSection
                  }
                />
                <ScaleFade
                  initialScale={0.9}
                  in={isOpenOfferingsSection}
                  hidden={!isOpenOfferingsSection}
                >
                  <DrawerButton
                    icon={<PiChair />}
                    to='/oferings/classrooms'
                    text='Salas'
                    replace_location={false}
                    onClose={onClose}
                    highlighted={currentPath === '/oferings/classrooms'}
                  />
                  <DrawerButton
                    icon={<GiBookCover />}
                    to='/oferings/subjects'
                    text='Disciplinas'
                    replace_location={false}
                    onClose={onClose}
                    highlighted={currentPath === '/oferings/subjects'}
                  />
                  <DrawerButton
                    icon={<GiTeacher />}
                    to='/oferings/classes'
                    text='Turmas'
                    replace_location={false}
                    onClose={onClose}
                    highlighted={currentPath === '/oferings/classes'}
                  />
                  <DrawerButton
                    icon={<CalendarIcon />}
                    to='/oferings/calendars'
                    text='Calendários'
                    replace_location={false}
                    onClose={onClose}
                    highlighted={currentPath === '/oferings/calendars'}
                  />
                  <DrawerButton
                    icon={<FaRegCalendarTimes />}
                    to='/oferings/conflicts'
                    text='Conflitos'
                    replace_location={false}
                    onClose={onClose}
                    highlighted={currentPath === '/oferings/conflicts'}
                  />
                  <DrawerButton
                    icon={<FaBook />}
                    to='/oferings/reports'
                    text='Relatórios'
                    replace_location={false}
                    onClose={onClose}
                    highlighted={currentPath === '/oferings/reports'}
                  />
                </ScaleFade>
              </VStack>
            </>
          ) : undefined}
        </>
      ) : (
        <VStack
          w={'full'}
          alignItems={'flex-start'}
          backgroundColor={'uspolis.white'}
        >
          <HStack>
            <Icon as={UnlockIcon} color={'uspolis.blue'} />
            <Text color={'uspolis.blue'} fontWeight={'bold'}>
              Público
            </Text>
          </HStack>
          <DrawerButton
            icon={<BsCalendar3 />}
            to='/public/allocations'
            text='Mapa de Salas'
            replace_location={false}
            onClose={onClose}
          />
        </VStack>
      )}

      <VStack
        w={'full'}
        height={'full'}
        alignItems={'flex-start'}
        justifyContent={'flex-end'}
        gap={'0px'}
        id='menu-drawer-contact'
        background={'uspolis.white'}
        p={'10px'}
        pb={'30px'}
      >
        <HStack align={'center'} justify={'center'} gap={'5px'}>
          <EmailIcon color={colorMode === 'dark' ? 'white' : 'black'} />
          <Link
            fontSize={'15px'}
            textColor={'uspolis.black'}
            href={
              'https://mail.google.com/mail/?view=cm&fs=1&to=uspolis@usp.br'
            }
            rel='noopener noreferrer'
            target='_blank'
          >
            uspolis@usp.br
          </Link>
        </HStack>
        <HStack
          align={'center'}
          justify={'center'}
          gap={'5px'}
          background={'uspolis.white'}
        >
          <FaGithub color={colorMode === 'dark' ? 'white' : 'black'} />
          <Link
            fontSize={'15px'}
            textColor={'uspolis.black'}
            href={'https://github.com/PCS-Poli-USP/USPolis-Admin'}
            rel='noopener noreferrer'
            target='_blank'
          >
            Github
          </Link>
        </HStack>
        <HStack
          align={'center'}
          justify={'center'}
          gap={'5px'}
          background={'uspolis.white'}
        >
          <GrDocumentText color={colorMode === 'dark' ? 'white' : 'black'} />
          <Link
            fontSize={'15px'}
            textColor={'uspolis.black'}
            href={DOCS_URL + '/'}
            rel='noopener noreferrer'
            target='_blank'
          >
            Documentação
          </Link>
        </HStack>
        <Text fontSize={'15px'} textColor={'uspolis.black'} fontWeight={'bold'}>
          © {moment().year()} USPolis
        </Text>
      </VStack>
    </VStack>
  );
}
