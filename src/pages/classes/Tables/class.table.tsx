import { Box, Checkbox, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef, Row } from '@tanstack/react-table';
import Class, { SClass } from 'models/common/class.model';
import { BsCalendarDateFill, BsCalendarXFill, BsClipboardCheck, BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { Capitalize } from 'utils/formatters';
import {
  FilterArray,
  FilterBoolean,
  FilterBuilding,
  FilterClassroom,
  FilterNumber,
} from 'utils/tanstackTableHelpers/tableFiltersFns';

interface ClassesColumnsProps {
  handleCheckAllClick: (data: Row<SClass>[], value: boolean) => void;
  handleCheckboxClick: (
    subject_code: string,
    class_code: string,
    checkbox_value: boolean,
  ) => void;
  handleEditClick: (data: Class) => void;
  handleAllocationEditClick: (data: Class) => void;
  handlePreferencesClick: (data: Class) => void;
  handleDeleteClassClick: (data: Class) => void;
  handleDeleteAllocClick: (data: Class) => void;
}

export const getClassesColumns = (
  props: ClassesColumnsProps,
): ColumnDef<SClass>[] => [
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
          isChecked={row.original.selected}
          ml={5}
          onChange={(event) =>
            props.handleCheckboxClick(
              row.original.subject_code,
              row.original.class_code,
              event.target.checked,
            )
          }
        />
      </Box>
    ),
  },
  {
    accessorKey: 'subject_code',
    header: 'Código',
    maxSize: 120,
  },
  {
    accessorKey: 'class_code',
    header: 'Turma',
    maxSize: 120,
  },
  {
    accessorKey: 'subject_name',
    header: 'Disciplina',
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
    accessorFn: (row) => (row.buildings ? row.buildings : ['Não alocada']),
    filterFn: FilterBuilding,
    header: 'Prédio',
    maxSize: 120,
    cell: ({ row }) => (
      <Box>
        {row.original.buildings ? (
          row.original.buildings.map((build, index) => (
            <Text key={index}>{build}</Text>
          ))
        ) : (
          <Text>Não alocada</Text>
        )}
      </Box>
    ),
  },
  {
    accessorFn: (row) => (row.classrooms ? row.classrooms : ['Não alocada']),
    filterFn: FilterClassroom,
    header: 'Sala',
    maxSize: 120,
    cell: ({ row }) => (
      <Box>
        {row.original.classrooms ? (
          row.original.classrooms.map((classroom, index) => (
            <Text key={index}>{classroom}</Text>
          ))
        ) : (
          <Text>Não alocada</Text>
        )}
      </Box>
    ),
  },
  {
    accessorFn: (row) => (row.buildings ? row.buildings : ['Não alocada']),
    header: 'Prédio',
    cell: ({ row }) => (
      <Box>
        {row.original.buildings ? (
          row.original.buildings.map((building, index) => (
            <Text key={index}>{building}</Text>
          ))
        ) : (
          <Text>Não alocada</Text>
        )}
      </Box>
    ),
  },
  {
    accessorFn: (row) =>
      row.week_days?.map(
        (day, index) =>
          `${Capitalize(day)} ${row.start_time[index]} - ${
            row.end_time[index]
          }`,
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
