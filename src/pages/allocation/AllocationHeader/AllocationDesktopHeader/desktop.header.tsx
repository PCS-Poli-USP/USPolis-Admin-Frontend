import { ChevronDownIcon, LockIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import Select from 'react-select';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ClassesPDF from '../../pdf/ClassesPDF/classesPDF';
import ClassroomsPDF from '../../pdf/ClassroomsPDF/classroomsPDF';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { appContext } from 'context/AppContext';
import { AllocationHeaderProps } from '..';
import { AllocationEnum } from 'utils/enums/allocation.enum';

type OptionType = { value: string; label: string };

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
  // filterEvents,
  events,
}: AllocationHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedUser } = useContext(appContext);

  const buildingOptions = events
    .map((event) => ({
      value:
        event.extendedProps.class_data?.building ||
        AllocationEnum.UNALLOCATED_BUILDING_ID,
      label:
        event.extendedProps.class_data?.building ||
        AllocationEnum.UNALLOCATED_BUILDING_ID,
    }))
    .filter(
      (value, index, self) =>
        self.findIndex((v) => v.value === value.value) === index,
    )
    .sort((a, b) => a.value.localeCompare(b.value));

  const classroomsOptions = events
    .map((event) => ({
      value:
        event.extendedProps.class_data?.classroom ||
        AllocationEnum.UNALLOCATED_CLASSROOM_ID,
      label:
        event.extendedProps.class_data?.classroom ||
        AllocationEnum.UNALLOCATED_CLASSROOM_ID,
    }))
    .filter(
      (value, index, self) =>
        self.findIndex((v) => v.value === value.value) === index,
    )
    .sort((a, b) => a.value.localeCompare(b.value));

  const subjectOptions = events
    .map((event) => ({
      value: event.extendedProps.class_data?.subject_name || event.title,
      label: event.extendedProps.class_data
        ? `${event.extendedProps.class_data?.subject_code} - ${event.extendedProps.class_data?.subject_name}`
        : event.title,
    }))
    .filter(
      (value, index, self) =>
        self.findIndex((v) => v.value === value.value) === index,
    )
    .sort((a, b) => a.value.localeCompare(b.value));

  const classOptions = events
    .filter(
      (event) =>
        event.extendedProps.class_data &&
        event.extendedProps.class_data.subject_name === nameSearchValue,
    )
    .map((event) => ({
      value: event.extendedProps.class_data?.code || '',
      label: event.extendedProps.class_data?.code.slice(-2) || '',
    }))
    .filter(
      (value, index, self) =>
        self.findIndex((v) => v.value === value.value) === index,
    )
    .sort((a, b) => a.value.localeCompare(b.value));

  return (
    <Flex direction={'column'} alignItems={'flex-start'} gap={2} w={'100%'}>
      <Text fontSize={'2xl'}>Mapa de Salas</Text>
      <Flex
        mb={4}
        // divider={<StackDivider />}
        justifyContent='flex-end'
        gap={4}
        direction={'row'}
        w={'full'}
      >
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            colorScheme='blue'
            ml={'0px'}
          >
            Opções
          </MenuButton>
          <MenuList zIndex={99999}>
            <MenuItem>
              <PDFDownloadLink
                document={<ClassesPDF classes={[]} />}
                fileName='disciplinas.pdf'
              >
                Baixar mapa de disciplinas
              </PDFDownloadLink>
            </MenuItem>
            <MenuItem>
              <PDFDownloadLink
                document={<ClassroomsPDF classes={[]} reservations={[]} />}
                fileName='salas.pdf'
              >
                Baixar mapa de salas
              </PDFDownloadLink>
            </MenuItem>
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
          >
            Solicitar Sala
          </Button>
        </Tooltip>

        <Spacer />

        <Box w={'250px'}>
          <Select
            selectedOptionColorScheme={'purple'}
            placeholder='Prédio'
            isClearable={true}
            options={buildingOptions}
            value={
              buildingSearchValue
                ? { value: buildingSearchValue, label: buildingSearchValue }
                : undefined
            }
            onChange={(option: OptionType) => {
              if (option) {
                setBuildingSearchValue(option.value);
                // filterEvents(
                //   option.value,
                //   classroomSearchValue,
                //   nameSearchValue,
                //   classSearchValue,
                // );
              } else {
                setBuildingSearchValue('');
                // filterEvents(
                //   '',
                //   classroomSearchValue,
                //   nameSearchValue,
                //   classSearchValue,
                // );
              }
            }}
          />
        </Box>

        <Box w={'250px'}>
          <Select
            placeholder='Sala'
            isClearable={true}
            options={classroomsOptions}
            value={
              classroomSearchValue
                ? { value: classroomSearchValue, label: classroomSearchValue }
                : undefined
            }
            onChange={(option: OptionType) => {
              if (option) {
                setClassroomSearchValue(option.value);
                // filterEvents(
                //   buildingSearchValue,
                //   option.value,
                //   nameSearchValue,
                //   classSearchValue,
                // );
              } else {
                setClassroomSearchValue('');
                // filterEvents(
                //   buildingSearchValue,
                //   '',
                //   nameSearchValue,
                //   classSearchValue,
                // );
              }
            }}
          />
        </Box>

        <Box w={'250px'}>
          <Select
            placeholder='Disciplina'
            isClearable={true}
            value={
              nameSearchValue
                ? { value: nameSearchValue, label: nameSearchValue }
                : undefined
            }
            options={subjectOptions}
            onChange={(option: OptionType) => {
              if (option) {
                setNameSearchValue(option.value);
                // filterEvents(
                //   buildingSearchValue,
                //   classroomSearchValue,
                //   option.value,
                //   classSearchValue,
                // );
              } else {
                setNameSearchValue('');
                setClassSearchValue('');
                // filterEvents(buildingSearchValue, classroomSearchValue, '', '');
              }
            }}
          />
        </Box>

        <Box w={'250px'}>
          <Select
            isDisabled={!nameSearchValue}
            placeholder='Turma'
            isClearable={true}
            value={
              classSearchValue
                ? { value: classSearchValue, label: classSearchValue }
                : undefined
            }
            options={classOptions}
            onChange={(option: OptionType | null) => {
              if (option) {
                setClassSearchValue(option.value);
                // filterEvents(
                //   buildingSearchValue,
                //   classroomSearchValue,
                //   nameSearchValue,
                //   option.value,
                // );
              } else {
                setClassSearchValue('');
                // filterEvents(
                //   buildingSearchValue,
                //   classroomSearchValue,
                //   nameSearchValue,
                //   '',
                // );
              }
            }}
          />
        </Box>
      </Flex>
    </Flex>
  );
}

export default AllocationDesktopHeader;
