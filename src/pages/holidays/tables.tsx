import { HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { HolidayResponse } from 'models/http/responses/holiday.response.models';
import { HolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { datetimeToDate } from 'utils/formatters';
import { holidaysTypeFormatter } from 'utils/holidays/holidays.formatter';

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

interface HolidaysColumnsProps {
  handleEditButton: (data: HolidayResponse) => void;
  handleDeleteButton: (data: HolidayResponse) => void;
}

export const getHolidaysColumns = (
  props: HolidaysColumnsProps,
): ColumnDef<HolidayResponse>[] => [
  {
    header: 'Categoria',
    accessorKey: 'category',
  },
  {
    header: 'Data',
    accessorKey: 'date',
    cell: ({ row }) => datetimeToDate(row.original.date),
  },
  {
    header: 'Tipo',
    accessorKey: 'type',
    cell: ({ row }) => holidaysTypeFormatter(row.original.type),
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
        <Tooltip label='Editar Feriado'>
          <IconButton
            colorScheme='yellow'
            size='xs'
            variant='ghost'
            aria-label='editar-turma'
            icon={<BsFillPenFill />}
            onClick={() => props.handleEditButton(row.original)}
          />
        </Tooltip>

        <Tooltip label='Excluir Feriado'>
          <IconButton
            colorScheme='red'
            size='xs'
            variant='ghost'
            aria-label='excluir-feriado'
            icon={<BsFillTrashFill />}
            onClick={() => props.handleDeleteButton(row.original)}
          />
        </Tooltip>
      </HStack>
    ),
  },
];
