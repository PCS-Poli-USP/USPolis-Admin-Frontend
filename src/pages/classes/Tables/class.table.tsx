import {
  Box,
  Checkbox,
  HStack,
  IconButton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { DayTime } from 'models/common/common.models';
import { ClassResponse } from 'models/http/responses/class.response.models';
import {
  BsCalendarDateFill,
  BsCalendarXFill,
  BsClipboardCheck,
  BsFillPenFill,
  BsFillTrashFill,
} from 'react-icons/bs';
import { WeekDay } from 'utils/enums/weekDays.enum';
import {
  FilterArray,
  FilterBoolean,
  FilterBuilding,
  FilterClassroom,
  FilterNumber,
} from 'utils/tanstackTableHelpers/tableFiltersFns';

interface ClassesColumnsProps {
  handleCheckAllClick: (data: Row<ClassResponse>[], value: boolean) => void;
  handleCheckboxClick: (id: number, value: boolean) => void;
  handleEditClick: (data: ClassResponse) => void;
  handleAllocationEditClick: (data: ClassResponse) => void;
  handlePreferencesClick: (data: ClassResponse) => void;
  handleDeleteClassClick: (data: ClassResponse) => void;
  handleDeleteAllocClick: (data: ClassResponse) => void;
  checkMap: boolean[];
}

export const getClassesColumns = (
  props: ClassesColumnsProps,
): ColumnDef<ClassResponse>[] => [
  {
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
    accessorKey: 'subject_code',
    header: 'Disciplina',
    maxSize: 120,
  },
  {
    accessorKey: 'code',
    header: 'Turma',
    maxSize: 120,
    cell: ({ row }) => (
      <Box>
        <Text>{row.original.code.slice(-2)}</Text>
      </Box>
    ),
  },
  {
    accessorKey: 'subject_name',
    header: 'Nome da Disciplina',
    maxSize: 300,
  },
  {
    accessorKey: 'ignore_to_allocate',
    header: 'Ignorar',
    maxSize: 75,
    meta: { isBoolean: true, isSelectable: true },
    filterFn: FilterBoolean,
  },
  {
    accessorFn: (row) => (row.schedules ? row.schedules : ['Não alocada']),
    filterFn: FilterBuilding,
    header: 'Prédio',
    maxSize: 120,
    cell: ({ row }) => (
      <Box>
        {row.original.schedules.map((schedule, index) =>
          schedule.building ? (
            <Text key={index}>{schedule.building}</Text>
          ) : (
            <Text key={index}>Não alocada</Text>
          ),
        )}
      </Box>
    ),
  },
  {
    accessorFn: (row) =>
      row.schedules
        ? row.schedules.map((schedule) =>
            schedule.classroom ? schedule.classroom : 'Não alocaada',
          )
        : ['Não alocada'],
    filterFn: FilterClassroom,
    header: 'Sala',
    maxSize: 120,
    cell: ({ row }) => (
      <Box>
        {row.original.schedules.map((schedule, index) =>
          schedule.classroom ? (
            <Text key={index}>{schedule.classroom}</Text>
          ) : (
            <Text key={index}>Não alocada</Text>
          ),
        )}
      </Box>
    ),
  },
  {
    accessorFn: (row) =>
      row.schedules.map(
        (schedule) =>
          `${WeekDay.translate(schedule.week_day)} ${DayTime.toString(
            schedule.start_time,
          )} - ${DayTime.toString(schedule.end_time)}`,
      ),
    header: 'Horários',
    cell: (info) => (
      <Box>
        {(info.getValue() as string[])?.map((it) => (
          <Text key={it}>{it}</Text>
        ))}
      </Box>
    ),
    filterFn: FilterArray,
  },
  {
    accessorKey: 'subscribers',
    header: 'Nº Alunos',
    maxSize: 100,
    filterFn: FilterNumber,
  },
  {
    accessorKey: 'professors',
    header: 'Professores',
    cell: ({ row }) => (
      <Box>
        {row.original.professors?.map((professor, index) => (
          <Text
            maxW={425}
            overflowX={'hidden'}
            textOverflow={'ellipsis'}
            key={index}
          >
            {professor}
          </Text>
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
        <Tooltip label='Editar Turma'>
          <IconButton
            colorScheme='yellow'
            size='xs'
            variant='ghost'
            aria-label='editar-turma'
            icon={<BsFillPenFill />}
            onClick={() => props.handleEditClick(row.original)}
          />
        </Tooltip>
        <Tooltip label='Editar Alocação'>
          <IconButton
            colorScheme='teal'
            size='xs'
            variant='ghost'
            aria-label='editar-alocacao'
            icon={<BsCalendarDateFill />}
            onClick={() => props.handleAllocationEditClick(row.original)}
          />
        </Tooltip>
        <Tooltip label='Preferências'>
          <IconButton
            size='xs'
            variant='ghost'
            aria-label='preferências-turma'
            icon={<BsClipboardCheck />}
            onClick={() => props.handlePreferencesClick(row.original)}
          />
        </Tooltip>
        <Tooltip label='Excluir Turma'>
          <IconButton
            colorScheme='red'
            size='xs'
            variant='ghost'
            aria-label='excluir-turma'
            icon={<BsFillTrashFill />}
            onClick={() => props.handleDeleteClassClick(row.original)}
          />
        </Tooltip>
        <Tooltip label='Excluir Alocação'>
          <IconButton
            colorScheme='red'
            size='xs'
            variant='ghost'
            aria-label='excluir-alocacao'
            icon={<BsCalendarXFill />}
            onClick={() => props.handleDeleteAllocClick(row.original)}
          />
        </Tooltip>
      </HStack>
    ),
  },
];
