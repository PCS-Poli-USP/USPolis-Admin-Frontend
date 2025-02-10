import { CopyIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { SubjectResponse } from 'models/http/responses/subject.response.models';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import {
  datetimeFormatter,
  subjectTypeFormatter,
} from 'utils/subjects/subjects.formatter';
import { FilterArray } from 'utils/tanstackTableHelpers/tableFiltersFns';

interface SubjectColumnsProps {
  handleEditButton: (data: SubjectResponse) => void;
  handleDeleteButton: (data: SubjectResponse) => void;
  handleDuplicateClick: (data: SubjectResponse) => void;
}

export const getSubjectColumns = (
  props: SubjectColumnsProps,
): ColumnDef<SubjectResponse>[] => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const columns: ColumnDef<SubjectResponse>[] = [
    {
      accessorKey: 'code',
      header: 'Código',
    },
    {
      accessorKey: 'name',
      header: 'Nome',
      maxSize: 300,
      cell: ({ row }) => (
        <Tooltip label={row.original.name}>
          <Text maxW={300} overflowX={'hidden'} textOverflow={'ellipsis'}>
            {row.original.name}
          </Text>
        </Tooltip>
      ),
    },
    {
      accessorKey: 'professors',
      header: 'Professores',
      cell: ({ row }) => (
        <Box>
          {row.original.professors?.map((professor, index) => (
            <Tooltip label={<Text>{professor}</Text>} key={index}>
              <Text
                maxW={425}
                overflowX={'hidden'}
                textOverflow={'ellipsis'}
                key={index}
              >
                {professor}
              </Text>
            </Tooltip>
          ))}
        </Box>
      ),
    },
    {
      accessorFn: (row) =>
        row.buildings
          ? row.buildings.map((building) => building.name)
          : ['Não alocada'],
      filterFn: FilterArray,
      header: 'Prédios',
      cell: ({ row }) => (
        <Box>
          {row.original.buildings ? (
            row.original.buildings.map((building, index) => (
              <Text key={index}>{building.name}</Text>
            ))
          ) : (
            <Text>Não alocada</Text>
          )}
        </Box>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Tipo',
      cell: ({ row }) => subjectTypeFormatter(row.original.type),
    },
    {
      accessorKey: 'class_credit',
      header: 'Créditos Aula',
    },
    {
      accessorKey: 'work_credit',
      header: 'Créditos Trabalho',
    },
    {
      header: 'Ativação / Desativação',
      cell: ({ row }) => datetimeFormatter(row),
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
          <Tooltip label='Editar Disciplina'>
            <IconButton
              colorScheme='yellow'
              size='xs'
              variant='ghost'
              aria-label='editar-disciplina'
              icon={<BsFillPenFill />}
              onClick={() => props.handleEditButton(row.original)}
            />
          </Tooltip>

          <Tooltip label='Excluir Disciplina'>
            <IconButton
              colorScheme='red'
              size='xs'
              variant='ghost'
              aria-label='excluir-disciplina'
              icon={<BsFillTrashFill />}
              onClick={() => props.handleDeleteButton(row.original)}
            />
          </Tooltip>
        </HStack>
      ),
    },
  ];
  return columns;
};
