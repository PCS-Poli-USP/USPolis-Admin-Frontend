import { ColumnDef } from '@tanstack/react-table';
import { IconButton, HStack, Tooltip } from '@chakra-ui/react';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { CurriculumSubjectResponse } from '../../../models/http/responses/curriculumSubject.response.models';

interface Props {
  handleEditClick: (item: CurriculumSubjectResponse) => void;
  handleDeleteClick: (item: CurriculumSubjectResponse) => void;
  subjectMap: Record<number, string>;
}

export function getCurriculumSubjectColumns({
  handleEditClick,
  handleDeleteClick,
  subjectMap,
}: Props): ColumnDef<CurriculumSubjectResponse>[] {
  return [
    {
      id: 'subject',
      header: 'Disciplina',
      cell: ({ row }) => subjectMap[row.original.subject_id] ?? '-',
    },
    {
      id: 'type',
      header: 'Tipo',
      cell: ({ row }) => {
        const type = row.original.type;

        const typeMap: Record<string, string> = {
          semestral: 'Semestral',
          quadrimester: 'Quadrimestral',
        };

        return typeMap[type] ?? type;
      },
    },
    {
      id: "category",
      header: "Categoria",
      cell: ({ row }) => {
        const category = row.original.category;

        const map: Record<string, string> = {
          mandatory: "Obrigatória",
          free_elective: "Optativa Livre",
          track_elective: "Optativa Eletiva",
        };

        return map[category] ?? category;
      },
    },
    {
      id: 'options',
      header: 'Opções',
      cell: ({ row }) => {
        const item = row.original;

        return (
          <HStack spacing="0px">
            <Tooltip label="Editar">
              <IconButton
                colorScheme="yellow"
                size="xs"
                variant="ghost"
                aria-label="editar"
                icon={<BsFillPenFill />}
                onClick={() => handleEditClick(item)}
              />
            </Tooltip>

            <Tooltip label="Remover">
              <IconButton
                colorScheme="red"
                size="xs"
                variant="ghost"
                aria-label="remover"
                icon={<BsFillTrashFill />}
                onClick={() => handleDeleteClick(item)}
              />
            </Tooltip>
          </HStack>
        );
      },
    },
  ];
}