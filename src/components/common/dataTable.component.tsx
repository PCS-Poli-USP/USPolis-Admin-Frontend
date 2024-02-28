import {
  CheckIcon,
  CloseIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from '@chakra-ui/icons';
import {
  Box,
  chakra,
  Input,
  Progress,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { appContext } from 'context/AppContext';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Textify } from 'utils/formatters';

export type DataTableProps<Data extends object> = {
  data: Data[];
  columns: ColumnDef<Data, any>[];
};

export default function DataTable<Data extends object>({
  data,
  columns,
}: DataTableProps<Data>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { loading } = useContext(appContext);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
    },
  });

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }]);
      }
    }
    // eslint-disable-next-line
  }, [table.getState().columnFilters[0]?.id]);

  return (
    <TableContainer border='1px' borderRadius='lg' borderColor='uspolis.blue'>
      {loading && <Progress size='xs' isIndeterminate />}
      <Table>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta: any = header.column.columnDef.meta;
                return (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    isNumeric={meta?.isNumeric}
                    pb='2'
                    color='uspolis.blue'
                  >
                    <Box
                      onClick={header.column.getToggleSortingHandler()}
                      cursor={header.column.getCanSort() ? 'pointer' : ''}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}

                      <chakra.span pl='2'>
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === 'desc' ? (
                            <TriangleDownIcon aria-label='sorted descending' />
                          ) : (
                            <TriangleUpIcon aria-label='sorted ascending' />
                          )
                        ) : null}
                      </chakra.span>
                    </Box>

                    {header.column.getCanFilter() ? (
                      <Filter column={header.column} />
                    ) : null}
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta: any = cell.column.columnDef.meta;
                return (
                  <Td key={cell.id} isNumeric={meta?.isNumeric} maxW={400} overflowX={'hidden'} textOverflow={'ellipsis'}>
                    {meta?.isBoolean ? (
                      cell.getValue() ? (
                        <CheckIcon />
                      ) : (
                        <CloseIcon />
                      )
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

function Filter({ column }: { column: Column<any, any> }) {
  const columnFilterValue = column.getFilterValue();
  const meta: any = column.columnDef.meta;
  const sortedUniqueValues = useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort(),
    // eslint-disable-next-line
    [column.getFacetedUniqueValues()],
  );

  return meta?.isSelectable ? (
    <Select
      id={column.id + 'list'}
      placeholder='Selecione...'
      size='sm'
      mt='2'
      value={(columnFilterValue ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
    >
      {sortedUniqueValues.map((value: any) => (
        <option value={value} key={value}>
          {Textify(value)}
        </option>
      ))}
    </Select>
  ) : (
    <Input
      type='text'
      value={(columnFilterValue ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder='Filtrar...'
      size='sm'
      mt='2'
      _placeholder={{ color: 'uspolis.blue' }}
    />
  );
}
