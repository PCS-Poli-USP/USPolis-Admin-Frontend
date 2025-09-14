import { Box, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { SelectInstance, StylesConfig } from 'react-select';
import { AllocationHeaderProps } from '..';
import { useRef } from 'react';
import { classNumberFromClassCode } from '../../../../utils/classes/classes.formatter';
import TooltipSelect, {
  Option,
} from '../../../../components/common/TooltipSelect';
import { AllocationEventType } from '../../../../utils/enums/allocation.event.type.enum';
import { ReservationType } from '../../../../utils/enums/reservations.enum';

const customStyles: StylesConfig<Option, false> = {
  menu: (provided) => ({
    ...provided,
    maxHeight: '200px', // Altura máxima do menu
    overflowY: 'auto', // Permite o scroll vertical
    zIndex: 1000,
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '200px', // Altura máxima da lista
    overflowY: 'auto', // Ativa o scroll
    zIndex: 1000,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 1000, // Dinamicamente ajusta o z-index
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
  buildingResources,
  classroomResources,
}: AllocationHeaderProps) {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const classroomSelectRef = useRef<SelectInstance<Option>>(null);
  const subjectSelectRef = useRef<SelectInstance<Option>>(null);
  const classSelectRef = useRef<SelectInstance<Option>>(null);

  const buildingOptions = buildingResources
    .map((resource) => ({
      value: resource.title,

      label: resource.title,
    }))
    .sort((a, b) => a.value.localeCompare(b.value));

  const classroomsOptions = classroomResources
    .filter(
      (resource) =>
        !buildingSearchValue ||
        (resource.parentId && resource.parentId.includes(buildingSearchValue)),
    )
    .map((resource) => ({
      value: resource.title,
      label: resource.title,
    }))
    .sort((a, b) => a.value.localeCompare(b.value));

  const subjectOptions = events
    .filter(
      (event) =>
        event.type === AllocationEventType.SUBJECT ||
        (event.extendedProps.reservation_data &&
          event.extendedProps.reservation_data?.type === ReservationType.EXAM &&
          event.extendedProps.reservation_data?.subject_code),
    )
    .flatMap((event) => {
      const classData = event.extendedProps.class_data;
      if (classData) {
        return [
          {
            value: classData.subject_code,
            label: `${classData.subject_code} - ${classData.subject_name}`,
          },
        ];
      }
      const reservationData = event.extendedProps.reservation_data;
      if (
        reservationData &&
        reservationData.subject_code &&
        reservationData.subject_name
      ) {
        return [
          {
            value: reservationData.subject_code,
            label: `${reservationData.subject_code} - ${reservationData.subject_name}`,
          },
        ];
      }
      return [];
    })
    .filter(
      (value, index, self) =>
        self.findIndex((v) => v.value === value.value) === index,
    )
    .sort((a, b) => a.value.localeCompare(b.value));

  const classOptions = events
    .filter((event) => {
      const reservationData = event.extendedProps.reservation_data;
      const isEnable =
        reservationData &&
        reservationData.type === ReservationType.EXAM &&
        reservationData.class_codes;

      return (
        (event.extendedProps.class_data &&
          event.extendedProps.class_data.subject_code.includes(
            nameSearchValue,
          )) ||
        isEnable
      );
    })
    .flatMap((event) => {
      const classData = event.extendedProps.class_data;
      if (classData)
        return {
          value: classData.code,
          label: classNumberFromClassCode(classData.code),
        };
      const reservationData = event.extendedProps.reservation_data;
      if (reservationData && reservationData.class_codes) {
        return reservationData.class_codes.map((classCode) => ({
          value: classCode,
          label: classNumberFromClassCode(classCode),
        }));
      }
      return [];
    })
    .filter(
      (value, index, self) =>
        self.findIndex((v) => v.value === value.value) === index,
    )
    .sort((a, b) => a.value.localeCompare(b.value));

  return (
    <>
      {isMobile ? (
        <Flex direction={'column'} gap={2}>
          <Text fontWeight={'bold'}>Filtros: </Text>
          <Flex direction={'row'} gap={2} w={'full'}>
            <Box w={'50%'}>
              <TooltipSelect
                styles={customStyles}
                menuPortalTarget={document.body} // Renderiza o menu no body para ficar acima do fullcalendar
                placeholder='Prédio'
                isClearable={true}
                options={buildingOptions}
                value={
                  buildingSearchValue
                    ? { value: buildingSearchValue, label: buildingSearchValue }
                    : undefined
                }
                onChange={(option) => {
                  if (option) {
                    setBuildingSearchValue(option.value as string);
                  } else {
                    setBuildingSearchValue('');
                  }
                  setClassroomSearchValue('');
                  setNameSearchValue('');
                  setClassSearchValue('');
                  if (classroomSelectRef.current)
                    classroomSelectRef.current.clearValue();
                  if (subjectSelectRef.current)
                    subjectSelectRef.current.clearValue();
                  if (classSelectRef.current)
                    classSelectRef.current.clearValue();
                }}
              />
            </Box>
            <Box w={'50%'}>
              <TooltipSelect
                ref={classroomSelectRef}
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
                onChange={(option) => {
                  if (option) {
                    setClassroomSearchValue(option.value as string);
                  } else {
                    setClassroomSearchValue('');
                  }
                  setNameSearchValue('');
                  setClassSearchValue('');
                  if (subjectSelectRef.current)
                    subjectSelectRef.current.clearValue();
                  if (classSelectRef.current)
                    classSelectRef.current.clearValue();
                }}
              />
            </Box>
          </Flex>
          <Flex direction={'column'} gap={2} w={'full'}>
            <Box w={'100%'}>
              <TooltipSelect
                ref={subjectSelectRef}
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
                onChange={(option) => {
                  if (option) {
                    setNameSearchValue(option.value as string);
                  } else {
                    setNameSearchValue('');
                    setClassSearchValue('');
                    if (classSelectRef.current)
                      classSelectRef.current.clearValue();
                  }
                }}
              />
            </Box>
            <Box w={'100%'} h={'fit-content'}>
              <TooltipSelect
                ref={classSelectRef}
                styles={customStyles}
                menuPortalTarget={document.body} // Renderiza o menu no body para ficar acima do fullcalendar
                isDisabled={!nameSearchValue}
                placeholder='Turma'
                isClearable={true}
                value={
                  classSearchValue
                    ? {
                        value: classSearchValue,
                        label: classNumberFromClassCode(classSearchValue),
                      }
                    : undefined
                }
                options={classOptions}
                onChange={(option) => {
                  if (option) {
                    setClassSearchValue(option.value as string);
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
            <TooltipSelect
              styles={customStyles}
              placeholder='Prédio'
              isClearable={true}
              options={buildingOptions}
              value={
                buildingSearchValue
                  ? { value: buildingSearchValue, label: buildingSearchValue }
                  : undefined
              }
              onChange={(option) => {
                if (option) {
                  setBuildingSearchValue(option.value as string);
                } else {
                  setBuildingSearchValue('');
                }
                setClassroomSearchValue('');
                setNameSearchValue('');
                setClassSearchValue('');
                if (classroomSelectRef.current)
                  classroomSelectRef.current.clearValue();
                if (subjectSelectRef.current)
                  subjectSelectRef.current.clearValue();
                if (classSelectRef.current) classSelectRef.current.clearValue();
              }}
            />
          </Box>

          <Box w={'250px'}>
            <TooltipSelect
              ref={classroomSelectRef}
              styles={customStyles}
              placeholder='Sala'
              isDisabled={!buildingSearchValue}
              isClearable={true}
              options={classroomsOptions}
              value={
                classroomSearchValue
                  ? { value: classroomSearchValue, label: classroomSearchValue }
                  : undefined
              }
              onChange={(option) => {
                if (option) {
                  setClassroomSearchValue(option.value as string);
                } else {
                  setClassroomSearchValue('');
                }
                setNameSearchValue('');
                setClassSearchValue('');
                if (subjectSelectRef.current)
                  subjectSelectRef.current.clearValue();
                if (classSelectRef.current) classSelectRef.current.clearValue();
              }}
            />
          </Box>

          <Box w={'250px'}>
            <TooltipSelect
              ref={subjectSelectRef}
              styles={customStyles}
              placeholder='Disciplina'
              isClearable={true}
              value={
                nameSearchValue
                  ? { value: nameSearchValue, label: nameSearchValue }
                  : undefined
              }
              options={subjectOptions}
              onChange={(option) => {
                if (option) {
                  setNameSearchValue(option.value as string);
                } else {
                  setNameSearchValue('');
                  setClassSearchValue('');
                  if (classSelectRef.current)
                    classSelectRef.current.clearValue();
                }
              }}
            />
          </Box>

          <Box w={'250px'}>
            <TooltipSelect
              ref={classSelectRef}
              styles={customStyles}
              isDisabled={!nameSearchValue}
              placeholder='Turma'
              isClearable={true}
              value={
                classSearchValue
                  ? {
                      value: classSearchValue,
                      label: classNumberFromClassCode(classSearchValue),
                    }
                  : undefined
              }
              options={classOptions}
              onChange={(option) => {
                if (option) {
                  setClassSearchValue(option.value as string);
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
