/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CheckIcon,
  CloseIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Center,
  chakra,
  Flex,
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Progress,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
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
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaFastBackward,
  FaFastForward,
  FaStepBackward,
  FaStepForward,
} from 'react-icons/fa';
import { Textify } from '../../../utils/formatters';

type ColumnPinning = {
  left: string[];
  right: string[];
};

export type DataTableProps<Data extends object> = {
  loading?: boolean;
  data: Data[];
  columns: ColumnDef<Data, any>[];
  columnPinning?: ColumnPinning;
  filteredData?: (filteredData: Data[]) => void;
  hidden?: boolean;
};

export default function DataTable<Data extends object>({
  data,
  columns,
  hidden,
  loading = false,
  columnPinning = { left: [], right: [] },
}: DataTableProps<Data>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const pageRef = useRef(pagination);
  const pageSizes = [10, 20, 30, 40, 50];

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: () => setPagination(pageRef.current),
    state: {
      sorting,
      columnFilters,
      pagination,
      columnPinning,
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
    <Flex
      direction={'column'}
      w={'full'}
      maxW={'calc(100vw - 40px)'}
      maxH={'calc(100vh - 170px)'}
      gap={'5px'}
    >
      <TableContainer
        border='1px'
        borderRadius='lg'
        borderColor='uspolis.blue'
        hidden={hidden}
        overflow={'auto'}
        overflowY={'auto'}
        maxW={'calc(100vw - 40px)'}
        maxH={'calc(100vh - 160px)'}
      >
        {loading && <Progress size='xs' isIndeterminate />}
        <Table>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                  const meta: any = header.column.columnDef.meta;
                  const isPinned = header.column.getIsPinned();
                  const isLastLeftPinnedColumn =
                    isPinned === 'left' &&
                    header.column.getIsLastColumn('left');
                  const isFirstRightPinnedColumn =
                    isPinned === 'right' &&
                    header.column.getIsFirstColumn('right');

                  return (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      isNumeric={meta?.isNumeric}
                      pb='2'
                      color='uspolis.blue'
                      maxW={
                        header.column.columnDef.maxSize
                          ? `${header.column.columnDef.maxSize}px`
                          : undefined
                      }
                      background={isPinned ? 'uspolis.white' : 'transparent'}
                      style={{
                        boxShadow: isLastLeftPinnedColumn
                          ? '-4px 0 4px -4px gray inset'
                          : isFirstRightPinnedColumn
                            ? '4px 0 4px -4px gray inset'
                            : undefined,
                        left:
                          isPinned === 'left'
                            ? `${header.column.getStart('left')}px`
                            : undefined,
                        right:
                          isPinned === 'right'
                            ? `${header.column.getAfter('right')}px`
                            : undefined,
                        opacity: isPinned ? 0.95 : 1,
                        position: isPinned ? 'sticky' : 'relative',
                        width: header.column.getSize(),
                        zIndex: isPinned ? 1 : 0,
                      }}
                    >
                      <Box
                        onClick={header.column.getToggleSortingHandler()}
                        cursor={header.column.getCanSort() ? 'pointer' : ''}
                        display={'flex'}
                        justifyContent={
                          meta?.isCenter
                            ? 'center'
                            : meta?.isNumeric
                              ? 'flex-end'
                              : 'flex-start'
                        }
                        alignContent={
                          meta?.isCenter
                            ? 'center'
                            : meta?.isNumeric
                              ? 'flex-end'
                              : 'flex-start'
                        }
                      >
                        <Tooltip
                          label={header.column.columnDef.header as string}
                        >
                          <Text
                            textOverflow={'ellipsis'}
                            maxW={
                              header.column.columnDef.maxSize
                                ? `${header.column.columnDef.maxSize}px`
                                : 'auto'
                            }
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </Text>
                        </Tooltip>

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

                      {meta?.isCheckBox ? (
                        <Box mt={3}>
                          <Tooltip label='Marcar tudo'>
                            <IconButton
                              colorScheme='green'
                              size='xs'
                              variant='ghost'
                              aria-label='marcar-tudo'
                              icon={<CheckIcon />}
                              onClick={() => {
                                meta.markAllClickFn(
                                  table.getPaginationRowModel().rows,
                                  true,
                                );
                              }}
                            />
                          </Tooltip>
                          <Tooltip label='Desmarcar tudo'>
                            <IconButton
                              colorScheme='red'
                              size='xs'
                              variant='ghost'
                              aria-label='desmarcar-tduo'
                              icon={<CloseIcon />}
                              onClick={() => {
                                meta.dismarkAllClickFn(
                                  table.getPaginationRowModel().rows,
                                  false,
                                );
                              }}
                            />
                          </Tooltip>
                        </Box>
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
                  const isPinned = cell.column.getIsPinned();
                  const isLastLeftPinnedColumn =
                    isPinned === 'left' && cell.column.getIsLastColumn('left');
                  const isFirstRightPinnedColumn =
                    isPinned === 'right' &&
                    cell.column.getIsFirstColumn('right');

                  return (
                    <Td
                      key={cell.id}
                      isNumeric={meta?.isNumeric}
                      maxW={
                        cell.column.columnDef.maxSize
                          ? `${cell.column.columnDef.maxSize}px`
                          : 'auto'
                      }
                      background={isPinned ? 'uspolis.white' : 'transparent'}
                      style={{
                        boxShadow: isLastLeftPinnedColumn
                          ? '-4px 0 4px -4px gray inset'
                          : isFirstRightPinnedColumn
                            ? '4px 0 4px -4px gray inset'
                            : undefined,
                        left:
                          isPinned === 'left'
                            ? `${cell.column.getStart('left')}px`
                            : undefined,
                        right:
                          isPinned === 'right'
                            ? `${cell.column.getAfter('right')}px`
                            : undefined,
                        opacity: isPinned ? 0.95 : 1,
                        position: isPinned ? 'sticky' : 'relative',
                        width: cell.column.getSize(),
                        zIndex: isPinned ? 1 : 0,
                      }}
                      overflowX={'hidden'}
                      textOverflow={'ellipsis'}
                    >
                      {meta?.isCenter ? (
                        <Center>
                          {meta?.isBoolean ? (
                            cell.getValue() ? (
                              <Center>
                                <CheckIcon />
                              </Center>
                            ) : (
                              <Center>
                                <CloseIcon />
                              </Center>
                            )
                          ) : (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )
                          )}
                        </Center>
                      ) : (
                        <>
                          {meta?.isBoolean ? (
                            cell.getValue() ? (
                              <Center>
                                <CheckIcon />
                              </Center>
                            ) : (
                              <Center>
                                <CloseIcon />
                              </Center>
                            )
                          ) : (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )
                          )}
                        </>
                      )}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex
        direction={'row'}
        w={'full'}
        gap={'5px'}
        align={'center'}
        h={'40px'}
      >
        <IconButton
          aria-label='fast-step-back'
          icon={<FaFastBackward />}
          onClick={() => {
            pageRef.current = { ...pageRef.current, pageIndex: 0 };
            table.firstPage();
          }}
          disabled={!table.getCanPreviousPage()}
        />
        <IconButton
          aria-label='step-back'
          icon={<FaStepBackward />}
          onClick={() => {
            pageRef.current = {
              ...pageRef.current,
              pageIndex: pageRef.current.pageIndex - 1,
            };
            table.previousPage();
          }}
          disabled={!table.getCanPreviousPage()}
        />
        <IconButton
          aria-label='step-forward'
          icon={<FaStepForward />}
          onClick={() => {
            pageRef.current = {
              ...pageRef.current,
              pageIndex: pageRef.current.pageIndex + 1,
            };
            table.nextPage();
          }}
          disabled={!table.getCanNextPage()}
        />
        <IconButton
          aria-label='fast-step-forward'
          icon={<FaFastForward />}
          onClick={() => {
            pageRef.current = {
              ...pageRef.current,
              pageIndex: table.getPageCount() - 1,
            };
            table.lastPage();
          }}
          disabled={!table.getCanNextPage()}
        />
        <Text>
          Página{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
          , ir para página:
        </Text>
        <NumberInput
          w={'fit-content'}
          maxW={'150px'}
          value={pageRef.current.pageIndex + 1}
          max={table.getPageCount()}
          min={1}
          onChange={(value) => {
            const pageIndex = value ? Number(value) - 1 : 0;
            pageRef.current = {
              ...pageRef.current,
              pageIndex,
            };
            table.setPageIndex(pageIndex);
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Select
          w={'fit-content'}
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            pageRef.current = {
              pageIndex: 0,
              pageSize: Number(e.target.value),
            };
            table.setPageSize(Number(e.target.value));
          }}
        >
          {pageSizes.map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize} por página
            </option>
          ))}
        </Select>
        <Text>
          Mostrando {table.getRowModel().rows.length.toLocaleString()} de{' '}
          {table.getRowCount().toLocaleString()} linhas
        </Text>
      </Flex>
    </Flex>
  );
}

function Filter({ column }: { column: Column<any, any> }) {
  const columnFilterValue = column.getFilterValue();
  const meta: any = column.columnDef.meta;

  const sortedUniqueValues: string[] = useMemo<string[]>(
    () => {
      const keys = Array.from(column.getFacetedUniqueValues().keys());
      const unique = new Set(
        keys.reduce<string[]>((acc, key) => {
          if (Array.isArray(key)) return acc.concat(key);
          acc.push(key);
          return acc;
        }, []),
      );
      return Array.from(unique).sort();
    },
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
      w={'fit-content'}
      maxW={
        column.columnDef.maxSize ? `${column.columnDef.maxSize}px` : undefined
      }
      alignSelf={'flex-end'}
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
