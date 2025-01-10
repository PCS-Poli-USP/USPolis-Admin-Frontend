import { Box, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import Select, { SelectInstance, StylesConfig } from 'react-select';
import { AllocationHeaderProps } from '..';
import { AllocationEnum } from 'utils/enums/allocation.enum';
import { useRef } from 'react';

type OptionType = { value: string; label: string };

const customStyles: StylesConfig<OptionType, false> = {
  menu: (provided) => ({
    ...provided,
    maxHeight: '200px', // Altura máxima do menu
    overflowY: 'auto', // Permite o scroll vertical
    zIndex: 99999,
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '200px', // Altura máxima da lista
    overflowY: 'auto', // Ativa o scroll
    zIndex: 99999,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 99999, // Dinamicamente ajusta o z-index
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
  events,
  resources,
}: AllocationHeaderProps) {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const selectRef = useRef<SelectInstance<OptionType>>(null);

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

  console.log(isMobile)
  return (
    <>
      {isMobile ? (
        <Flex direction={'column'} gap={2}>
          <Text fontWeight={'bold'}>Filtros: </Text>
          <Flex direction={'row'} gap={2} w={'full'}>
            <Box w={'50%'}>
              <Select
                styles={customStyles}
                menuPortalTarget={document.body} // Renderiza o menu no body para ficar acima do fullcalendar
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
                  } else {
                    setBuildingSearchValue('');
                  }
                }}
              />
            </Box>
            <Box w={'50%'}>
              <Select
                styles={customStyles}
                menuPortalTarget={document.body} // Renderiza o menu no body para ficar acima do fullcalendar
                placeholder='Sala'
                isClearable={true}
                options={classroomsOptions}
                value={
                  classroomSearchValue
                    ? {
                        value: classroomSearchValue,
                        label: classroomSearchValue,
                      }
                    : undefined
                }
                onChange={(option: OptionType) => {
                  if (option) {
                    setClassroomSearchValue(option.value);
                  } else {
                    setClassroomSearchValue('');
                  }
                }}
              />
            </Box>
          </Flex>
          <Flex direction={'column'} gap={2} w={'full'}>
            <Box w={'100%'}>
              <Select
                styles={customStyles}
                menuPortalTarget={document.body} // Renderiza o menu no body para ficar acima do fullcalendar
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
                  } else {
                    setNameSearchValue('');
                    setClassSearchValue('');
                    if (selectRef.current) selectRef.current.clearValue();
                  }
                }}
              />
            </Box>
            <Box w={'100%'} h={'fit-content'}>
              <Select
                ref={selectRef}
                styles={customStyles}
                menuPortalTarget={document.body} // Renderiza o menu no body para ficar acima do fullcalendar
                isDisabled={!nameSearchValue}
                placeholder='Turma'
                isClearable={true}
                value={
                  classSearchValue
                    ? {
                        value: classSearchValue,
                        label: classSearchValue.slice(-2),
                      }
                    : undefined
                }
                options={classOptions}
                onChange={(option: OptionType | null) => {
                  if (option) {
                    setClassSearchValue(option.value);
                  } else {
                    setClassSearchValue('');
                  }
                }}
              />
            </Box>
          </Flex>
        </Flex>
      ) : (
        <Flex direction={'row'} gap={'10px'}>
          <Box w={'250px'}>
            <Select
              styles={customStyles}
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
                } else {
                  setBuildingSearchValue('');
                }
              }}
            />
          </Box>

          <Box w={'250px'}>
            <Select
              styles={customStyles}
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
                } else {
                  setClassroomSearchValue('');
                }
              }}
            />
          </Box>

          <Box w={'250px'}>
            <Select
              styles={customStyles}
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
                } else {
                  setNameSearchValue('');
                  setClassSearchValue('');
                  if (selectRef.current) selectRef.current.clearValue();
                }
              }}
            />
          </Box>

          <Box w={'250px'}>
            <Select
              styles={customStyles}
              ref={selectRef}
              isDisabled={!nameSearchValue}
              placeholder='Turma'
              isClearable={true}
              value={
                classSearchValue
                  ? { value: classSearchValue, label: classSearchValue.slice(-2) }
                  : undefined
              }
              options={classOptions}
              onChange={(option: OptionType | null) => {
                if (option) {
                  setClassSearchValue(option.value);
                } else {
                  setClassSearchValue('');
                }
              }}
            />
          </Box>
        </Flex>
      )}
    </>
  );
}

export default HeaderFilter;
