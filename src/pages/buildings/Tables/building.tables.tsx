import { HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { BuildingResponse } from 'models/http/responses/building.response.models';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';

interface BuildingsColumnsProps {
  handleEditButton: (data: BuildingResponse) => void;
  handleDeleteButton: (data: BuildingResponse) => void;
}

export const getBuildingsColumns = (
  props: BuildingsColumnsProps,
): ColumnDef<BuildingResponse>[] => [
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'updated_at',
    header: 'Atualizado em',
  },
  {
    id: 'options',
    header: 'Opções',
    cell: ({ row }) => (
      <HStack spacing='0px' width='fit-content'>
        <Tooltip label='Editar'>
          <IconButton
            colorScheme='yellow'
            size='xs'
            variant='ghost'
            aria-label='editar-predio'
            icon={<BsFillPenFill />}
            onClick={() => props.handleEditButton(row.original)}
          />
        </Tooltip>

        <Tooltip label='Deletar'>
          <IconButton
            colorScheme='red'
            size='xs'
            variant='ghost'
            aria-label='deletar-predio'
            icon={<BsFillTrashFill />}
            onClick={() => props.handleDeleteButton(row.original)}
          />
        </Tooltip>
      </HStack>
    ),
  },
];
