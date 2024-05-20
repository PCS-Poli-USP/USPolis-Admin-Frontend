import { HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { HolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';

interface HolidaysCategoryColumnsProps {
  handleEditButton: (data: HolidayCategoryResponse) => void;
  handleDeleteButton: (data: HolidayCategoryResponse) => void;
}

export const getHolidaysCategoryColumns = (
  props: HolidaysCategoryColumnsProps,
): ColumnDef<HolidayCategoryResponse>[] => [
  {
    header: 'Categoria',
    accessorKey: 'name',
  },
  {
    header: 'Criado por',
    accessorKey: 'created_by',
  },
  {
    id: 'options',
    header: 'Opções',
    cell: ({ row }) => (
      <HStack spacing='0px'>
        <Tooltip label='Editar Categoria'>
          <IconButton
            colorScheme='yellow'
            size='xs'
            variant='ghost'
            aria-label='editar-categoria'
            icon={<BsFillPenFill />}
            onClick={() => props.handleEditButton(row.original)}
          />
        </Tooltip>

        <Tooltip label='Excluir Categoria'>
          <IconButton
            colorScheme='red'
            size='xs'
            variant='ghost'
            aria-label='excluir-categoria'
            icon={<BsFillTrashFill />}
            onClick={() => props.handleDeleteButton(row.original)}
          />
        </Tooltip>
      </HStack>
    ),
  },
];
