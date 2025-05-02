import { CopyIcon } from '@chakra-ui/icons';
import {
  Box,
  Checkbox,
  HStack,
  IconButton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { ClassResponse } from '../../../models/http/responses/class.response.models';
import {
  BsCalendarDateFill,
  BsFillPenFill,
  BsFillTrashFill,
} from 'react-icons/bs';
import { BiSolidCalendarEdit } from 'react-icons/bi';
import { getScheduleString } from '../../../utils/schedules/schedule.formatter';
import {
  FilterArray,
  FilterClassCode,
  FilterNumber,
  FilterString,
} from '../../../utils/tanstackTableHelpers/tableFiltersFns';
import { classNumberFromClassCode } from '../../../utils/classes/classes.formatter';

interface ClassesColumnsProps {
  handleCheckAllClick: (data: Row<ClassResponse>[], value: boolean) => void;
  handleCheckboxClick: (id: number, value: boolean) => void;
  handleDuplicateClick: (data: ClassResponse) => void;
  handleEditClick: (data: ClassResponse) => void;
  handleAllocationEditClick: (data: ClassResponse) => void;
  handleDeleteClassClick: (data: ClassResponse) => void;
  handleEditOccurrencesClick: (data: ClassResponse) => void;
  checkMap: boolean[];
  disableMap: boolean[];
}

export const getClassesColumns = (
  props: ClassesColumnsProps,
): ColumnDef<ClassResponse>[] => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const columns: ColumnDef<ClassResponse>[] = [
    {
      id: 'mark',
      header: 'Marcar',
      maxSize: 70,
      meta: {
        isCheckBox: true,
        markAllClickFn: props.handleCheckAllClick,
        dismarkAllClickFn: props.handleCheckAllClick,
      },
      cell: ({ row }) => (
        <Box>
          <Checkbox
            isChecked={props.checkMap[row.index]}
            ml={5}
            onChange={(event) =>
              props.handleCheckboxClick(row.original.id, event.target.checked)
            }
          />
        </Box>
      ),
    },
    {
      id: 'subject_code',
      accessorKey: 'subject_code',
      header: 'Disciplina',
      maxSize: 120,
    },
    {
      id: 'code',
      accessorKey: 'code',
      header: 'Turma',
      maxSize: 120,
      accessorFn: (row) => classNumberFromClassCode(row.code),
      filterFn: FilterClassCode,
      cell: ({ row }) => (
        <Box>
          <Text>{classNumberFromClassCode(row.original.code)}</Text>
        </Box>
      ),
    },
    {
      accessorKey: 'subject_name',
      header: 'Nome da Disciplina',
      maxSize: 250,
      filterFn: FilterString,
      cell: ({ row }) => (
        <Box maxW={300}>
          <Tooltip label={<Text>{row.original.subject_name}</Text>}>
            <Text overflowX={'hidden'} textOverflow={'ellipsis'}>
              {row.original.subject_name}
            </Text>
          </Tooltip>
        </Box>
      ),
    },
    {
      accessorFn: (row) =>
        row.schedules
          ? row.schedules.map((schedule) =>
              schedule.building ? schedule.building : 'Não alocada',
            )
          : ['Não alocada'],
      filterFn: FilterArray,
      header: 'Prédios',
      maxSize: 120,
      meta: {
        isSelectable: true,
        isCenter: true,
      },
      cell: ({ row }) => (
        <Box>
          {row.original.schedules.map((schedule, index) => (
            <Tooltip label={<Text>{schedule.building}</Text>} key={index}>
              <Text maxW={120} overflowX={'hidden'} textOverflow={'ellipsis'}>
                {schedule.building ? schedule.building : 'Não alocada'}
              </Text>
            </Tooltip>
          ))}
        </Box>
      ),
    },
    {
      accessorFn: (row) =>
        row.schedules
          ? row.schedules.map((schedule) =>
              schedule.classroom ? schedule.classroom : 'Não alocada',
            )
          : ['Não alocada'],
      filterFn: FilterArray,
      header: 'Sala',
      meta: {
        isCenter: true,
      },
      maxSize: 120,
      cell: ({ row }) => (
        <Box>
          {row.original.schedules.map((schedule, index) => (
            <Tooltip label={<Text>{schedule.classroom}</Text>} key={index}>
              <Text maxW={120} overflowX={'hidden'} textOverflow={'ellipsis'}>
                {schedule.classroom ? schedule.classroom : 'Não alocada'}
              </Text>
            </Tooltip>
          ))}
        </Box>
      ),
    },
    {
      filterFn: FilterArray,
      accessorFn: (row) =>
        row.schedules.map(
          (schedule) =>
            `${getScheduleString(schedule)} ${schedule.start_time.substring(
              0,
              5,
            )} ~ ${schedule.end_time.substring(0, 5)}`,
        ),
      header: 'Horários',
      cell: ({ row }) => (
        <Box>
          {row.original.schedules.map((schedule, index) => (
            <Text key={index}>{`${getScheduleString(
              schedule,
            )} (${schedule.start_time.substring(
              0,
              5,
            )} ~ ${schedule.end_time.substring(0, 5)})`}</Text>
          ))}
        </Box>
      ),
    },
    {
      accessorFn: (row) =>
        row.calendar_names.length > 0
          ? row.calendar_names.map((calendar) =>
              calendar.replace('Calendário', ''),
            )
          : ['Sem calendários'],
      filterFn: FilterArray,
      header: 'Calendários',
      maxSize: 150,
      meta: {
        isSelectable: true,
        isCenter: true,
      },
      cell: ({ row }) => (
        <Box>
          {row.original.calendar_names.length > 0 ? (
            row.original.calendar_names.map((calendar, index) => (
              <Tooltip
                label={<Text>{calendar.replace('Calendário', '')}</Text>}
                key={index}
              >
                <Text maxW={140} overflowX={'hidden'} textOverflow={'ellipsis'}>
                  {calendar.replace('Calendário', '')}
                </Text>
              </Tooltip>
            ))
          ) : (
            <Text>Sem calendários</Text>
          )}
        </Box>
      ),
    },
    {
      accessorKey: 'vacancies',
      header: 'Vagas',
      maxSize: 100,
      filterFn: FilterNumber,
      meta: {
        isNumeric: true,
      },
    },
    {
      accessorKey: 'professors',
      header: 'Professores',
      maxSize: 250,
      cell: ({ row }) => (
        <Box>
          {row.original.professors?.map((professor, index) => (
            <Tooltip label={<Text>{professor}</Text>} key={index}>
              <Text maxW={300} overflowX={'hidden'} textOverflow={'ellipsis'}>
                {professor}
              </Text>
            </Tooltip>
          ))}
        </Box>
      ),
      filterFn: FilterArray,
    },
    {
      id: 'options',
      header: 'Opções',
      cell: ({ row }) => (
        <HStack spacing='0px'>
          <Tooltip label='Duplicar Turma'>
            <IconButton
              colorScheme='cyan'
              size='sm'
              variant='ghost'
              aria-label='duplicar-turma'
              icon={<CopyIcon />}
              onClick={() => props.handleDuplicateClick(row.original)}
            />
          </Tooltip>
          <Tooltip label='Editar Turma'>
            <IconButton
              disabled={props.disableMap[row.index]}
              colorScheme='yellow'
              size='sm'
              variant='ghost'
              aria-label='editar-turma'
              icon={<BsFillPenFill />}
              onClick={() => props.handleEditClick(row.original)}
            />
          </Tooltip>
          <Tooltip label='Editar Alocação'>
            <IconButton
              disabled={props.disableMap[row.index]}
              colorScheme='teal'
              size='sm'
              variant='ghost'
              aria-label='editar-alocacao'
              icon={<BsCalendarDateFill />}
              onClick={() => props.handleAllocationEditClick(row.original)}
            />
          </Tooltip>
          <Tooltip label='Editar Ocorrências'>
            <IconButton
              disabled={props.disableMap[row.index]}
              colorScheme='yellow'
              size='sm'
              variant='ghost'
              aria-label='editar-ocorrencias'
              icon={<BiSolidCalendarEdit />}
              onClick={() => props.handleEditOccurrencesClick(row.original)}
            />
          </Tooltip>
          <Tooltip label='Excluir Turma'>
            <IconButton
              disabled={props.disableMap[row.index]}
              colorScheme='red'
              size='sm'
              variant='ghost'
              aria-label='excluir-turma'
              icon={<BsFillTrashFill />}
              onClick={() => props.handleDeleteClassClick(row.original)}
            />
          </Tooltip>
        </HStack>
      ),
    },
  ];
  return columns;
};
