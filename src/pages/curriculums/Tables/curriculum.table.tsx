import { ColumnDef } from '@tanstack/react-table';
import { HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { BsBook, BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { CurriculumResponse } from '../../../models/http/responses/curriculum.response.models';

interface Props {
  handleEditClick: (curriculum: CurriculumResponse) => void;
  handleDeleteClick: (curriculum: CurriculumResponse) => void;
  handleViewSubjects: (curriculum: CurriculumResponse) => void;
}

export function getCurriculumColumns({
  handleEditClick,
  handleDeleteClick,
  handleViewSubjects
}: Props): ColumnDef<CurriculumResponse>[] {
  return [
    {
      accessorKey: 'description',
      header: 'Descrição',
    },
    {
      accessorKey: 'AAC',
      header: 'AAC',
    },
    {
      accessorKey: 'AEX',
      header: 'AEX',
    },
    {
      id: 'options',
      header: 'Opções',
      cell: ({ row }) => {
        const curriculum = row.original;

        return (
          <HStack spacing="0px">
            <Tooltip label="Ver Disciplinas">
            <IconButton
              colorScheme="blue"
              size="xs"
              variant="ghost"
              aria-label="ver-disciplinas"
              icon={<BsBook />}
              onClick={() => handleViewSubjects(curriculum)}
            />
          </Tooltip>
            <Tooltip label="Editar">
              <IconButton
                size="xs"
                variant="ghost"
                colorScheme="yellow"
                aria-label="editar"
                icon={<BsFillPenFill />}
                onClick={() => handleEditClick(curriculum)}
              />
            </Tooltip>

            <Tooltip label="Remover">
              <IconButton
                size="xs"
                variant="ghost"
                colorScheme="red"
                aria-label="remover"
                icon={<BsFillTrashFill />}
                onClick={() => handleDeleteClick(curriculum)}
              />
            </Tooltip>
          </HStack>
        );
      },
    },
  ];
}