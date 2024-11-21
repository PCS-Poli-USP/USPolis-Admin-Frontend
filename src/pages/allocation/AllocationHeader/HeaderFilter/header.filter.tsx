import { Box, Flex, Text } from '@chakra-ui/react';
import Select, { StylesConfig } from 'react-select';
import { AllocationHeaderProps } from '..';
import { AllocationEnum } from 'utils/enums/allocation.enum';

type OptionType = { value: string; label: string };

const customStyles: StylesConfig<OptionType, false> = {
  menu: (provided) => ({
    ...provided,
    maxHeight: '200px', // Altura máxima do menu
    overflowY: 'auto', // Permite o scroll vertical
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '200px', // Altura máxima da lista
    overflowY: 'auto', // Ativa o scroll
    zIndex: 7,
  }),
};

function HeaderFilter({
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
  resources,
}: AllocationHeaderProps) {
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
    <Flex direction={'column'} gap={2}>
      <Text fontWeight={'bold'}>Filtros: </Text>
      <Flex direction={'row'} gap={2} w={'full'}>
        <Box w={'50%'}>
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
        <Box w={'50%'}>
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
      </Flex>
      <Flex direction={'column'} gap={2} w={'full'}>
        <Box w={'100%'}>
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
        <Box w={'100%'} h={'fit-content'}>
          <Select
            styles={customStyles}
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

export default HeaderFilter;
