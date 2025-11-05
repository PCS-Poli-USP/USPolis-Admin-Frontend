import { AddIcon, LockIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { appContext } from '../../../../context/AppContext';
import { AllocationHeaderProps } from '..';
import HeaderFilter from '../HeaderFilter/header.filter';
import { TbReportAnalytics } from 'react-icons/tb';
import { MdCalendarToday } from 'react-icons/md';
import { FaHandPointer } from 'react-icons/fa';
import { BsCalendar3 } from 'react-icons/bs';
import SubjectReportModal from '../SubjectReportModal';
import ClassesPDFModal from '../ClassesPDFModal';
import ClassroomPDFModal from '../ClassroomCalendarPDF';
import EmptyClassroomsReportModal from '../EmptyClassroomsrReportModal';

function AllocationDesktopHeader({
  isOpen,
  onOpen,
  onClose,
  buildingSearchValue,
  setBuildingSearchValue,
  classroomSearchValue,
  setClassroomSearchValue,
  nameSearchValue,
  setNameSearchValue,
  classSearchValue,
  setClassSearchValue,
  events,
  buildingResources,
  classroomResources,
  subjects,
  loadingSubjects,
  buildings,
  loadingBuildings,
  loadingSolicitation,
}: AllocationHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedUser } = useContext(appContext);

  const {
    isOpen: isOpenClassesPDF,
    onClose: onCloseClassesPDF,
    onOpen: onOpenClassesPDF,
  } = useDisclosure();
  const {
    isOpen: isOpenClassroomsPDF,
    onClose: onCloseClassroomsPDF,
    onOpen: onOpenClassroomsPDF,
  } = useDisclosure();
  const {
    isOpen: isOpenSubjectReport,
    onClose: onCloseSubjectReport,
    onOpen: onOpenSubjectReport,
  } = useDisclosure();
  const {
    isOpen: isOpenEmptyClassroomsReport,
    onClose: onCloseEmptyClassroomsReport,
    onOpen: onOpenEmptyClassroomsReport,
  } = useDisclosure();

  return (
    <Flex direction={'column'} alignItems={'flex-start'} gap={2} w={'100%'}>
      <Text fontSize={'4xl'}>Mapa de Salas</Text>
      <Flex
        mb={4}
        justifyContent='flex-end'
        gap={4}
        direction={'row'}
        w={'full'}
      >
        <Menu>
          <MenuButton
            as={Button}
            colorScheme='blue'
            leftIcon={<AddIcon />}
            borderRadius={'10px'}
          >
            Baixar
          </MenuButton>
          <MenuList w={'300px'} border={'1px'} bgColor={'uspolis.white'}>
            <MenuGroup title='Alocações gerais' fontSize={'lg'} gap={'5px'}>
              <MenuDivider />
              <MenuItem
                as={Button}
                bgColor={'uspolis.white'}
                justifyContent={'flex-start'}
                onClick={onOpenClassesPDF}
                leftIcon={<TbReportAnalytics />}
              >
                Alocação das disciplinas
              </MenuItem>
              <MenuDivider />
              <MenuItem
                as={Button}
                bgColor={'uspolis.white'}
                justifyContent={'flex-start'}
                onClick={onOpenClassroomsPDF}
                leftIcon={<BsCalendar3 />}
              >
                Mapa de Salas
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup
              title='Alocações específicas'
              fontSize={'lg'}
              gap={'5px'}
            >
              <MenuDivider />
              <MenuItem
                as={Button}
                justifyContent={'flex-start'}
                bgColor={'uspolis.white'}
                onClick={onOpenSubjectReport}
                leftIcon={<FaHandPointer />}
              >
                Disciplinas escolhidas
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title='Relatórios' fontSize={'lg'} gap={'5px'}>
              <MenuDivider />
              <MenuItem
                as={Button}
                justifyContent={'flex-start'}
                bgColor={'uspolis.white'}
                onClick={onOpenEmptyClassroomsReport}
                leftIcon={<MdCalendarToday />}
              >
                Disponibilidade de salas
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
        <Tooltip label={loggedUser ? '' : 'Entre para poder fazer essa ação.'}>
          <Button
            colorScheme='blue'
            onClick={() => {
              if (!loggedUser) {
                navigate('/auth', {
                  replace: true,
                  state: { from: location },
                });
              }
              onOpen();
            }}
            leftIcon={loggedUser ? undefined : <LockIcon />}
            isLoading={loadingSolicitation}
          >
            Solicitar Sala
          </Button>
        </Tooltip>

        <Spacer />

        <HeaderFilter
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          buildingSearchValue={buildingSearchValue}
          setBuildingSearchValue={setBuildingSearchValue}
          classroomSearchValue={classroomSearchValue}
          setClassroomSearchValue={setClassroomSearchValue}
          nameSearchValue={nameSearchValue}
          setNameSearchValue={setNameSearchValue}
          classSearchValue={classSearchValue}
          setClassSearchValue={setClassSearchValue}
          events={events}
          buildingResources={buildingResources}
          classroomResources={classroomResources}
          subjects={subjects}
          loadingSubjects={loadingSubjects}
          buildings={buildings}
          loadingBuildings={loadingBuildings}
          loadingSolicitation={loadingSolicitation}
        />

        <ClassesPDFModal
          isOpen={isOpenClassesPDF}
          onClose={onCloseClassesPDF}
          buildings={buildings}
        />
        <ClassroomPDFModal
          isOpen={isOpenClassroomsPDF}
          onClose={onCloseClassroomsPDF}
          buildings={buildings}
        />

        <SubjectReportModal
          // disabled={loadingC || loadingR || !start || !end}
          isOpen={isOpenSubjectReport}
          onClose={onCloseSubjectReport}
          loading={loadingSubjects || loadingBuildings}
          subjects={subjects}
          buildings={buildings}
        />
        <EmptyClassroomsReportModal
          isOpen={isOpenEmptyClassroomsReport}
          onClose={onCloseEmptyClassroomsReport}
          buildings={buildings}
        />
      </Flex>
    </Flex>
  );
}

export default AllocationDesktopHeader;
