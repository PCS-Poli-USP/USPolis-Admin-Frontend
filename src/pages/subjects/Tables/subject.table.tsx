import { Box, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { SubjectResponse } from 'models/http/responses/subject.response.models';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { datetimeFormatter, subjectTypeFormatter } from 'utils/subjects/subjects.formatter';

interface SubjectColumnsProps {
  handleEditButton: (data: SubjectResponse) => void;
  handleDeleteButton: (data: SubjectResponse) => void;
}

export const getSubjectColumns = (props: SubjectColumnsProps): ColumnDef<SubjectResponse>[] => [
  {
    accessorKey: 'code',
    header: 'Código',
  },
  {
    accessorKey: 'name',
    header: 'Nome',
    maxSize: 300,
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
  },
  {
    accessorFn: (row) => (row.buildings ? row.buildings : ['Não alocada']),
    header: 'Prédios',
    cell: ({ row }) => (
      <Box>
        {row.original.buildings ? (
          row.original.buildings.map((ref, index) => (
            <Text key={index}>{ref.id}</Text>
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

