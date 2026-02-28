import {
  Box,
  Button,
  HStack,
  IconButton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { LuEye, LuPen } from 'react-icons/lu';
import { BugReportResponse } from '../../../models/http/responses/bugReport.response.models';
import {
  BugPriority,
  BugStatus,
  BugType,
} from '../../../utils/enums/bugReport.enum';
import moment from 'moment';

const DEBUG = import.meta.env.VITE_DEBUG === 'true';

interface BugReportsColumnsProps {
  handleViewClick: (data: BugReportResponse) => void;
  handleUpdateClick: (data: BugReportResponse) => void;
  handleDescriptionClick: (data: BugReportResponse) => void;
  darkMode: boolean;
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export const getBugReportsColumns = (
  props: BugReportsColumnsProps,
): ColumnDef<BugReportResponse>[] => {
  const columns: ColumnDef<BugReportResponse>[] = [
    {
      header: 'Usuário',
      accessorKey: 'user_name',
      maxSize: 250,
      cell: ({ row }) => (
        <Box>
          <Tooltip label={<Text>{row.original.user_name}</Text>}>
            <Text maxW={300} overflowX={'hidden'} textOverflow={'ellipsis'}>
              {row.original.user_name}
            </Text>
          </Tooltip>
        </Box>
      ),
    },
    {
      header: 'Email',
      accessorKey: 'user_email',
      maxSize: 250,
      cell: ({ row }) => (
        <Box>
          <Tooltip label={<Text>{row.original.user_email}</Text>}>
            <Text maxW={300} overflowX={'hidden'} textOverflow={'ellipsis'}>
              {row.original.user_email}
            </Text>
          </Tooltip>
        </Box>
      ),
    },
    {
      accessorFn: (row) => BugPriority.translate(row.priority),
      header: 'Prioridade',
      maxSize: 120,
      meta: {
        isSelectable: true,
      },
      cell: ({ row }) => (
        <Box>
          <Text textColor={BugPriority.getColor(row.original.priority)}>
            {BugPriority.translate(row.original.priority)}
          </Text>
        </Box>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Tipo',
      maxSize: 120,
      meta: {
        isSelectable: true,
      },
      cell: ({ row }) => (
        <Box>
          <Text>{BugType.translate(row.original.type)}</Text>
        </Box>
      ),
    },
    {
      accessorKey: 'status',
      accessorFn: (row) => BugStatus.translate(row.status),
      header: 'Situação',
      maxSize: 120,
      meta: {
        isSelectable: true,
      },
      cell: ({ row }) => (
        <Box>
          <Text>{BugStatus.translate(row.original.status)}</Text>
        </Box>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
      maxSize: 150,
      cell: ({ row }) => {
        return (
          <Button onClick={() => props.handleDescriptionClick(row.original)}>
            Ver descrição
          </Button>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Criado em',
      maxSize: 200,
      accessorFn: (row) =>
        moment(row.created_at).format('DD/MM/YYYY [às] HH:mm'),
    },
    {
      accessorKey: 'resolved_at',
      header: 'Resolvido em',
      maxSize: 200,
      accessorFn: (row) =>
        row.resolved_at
          ? moment(row.resolved_at).format('DD/MM/YYYY [às] HH:mm')
          : '',
    },
    {
      id: 'options',
      header: 'Opções',
      maxSize: 100,
      meta: {
        isCenter: true,
      },
      cell: ({ row }) => (
        <HStack spacing='0px'>
          <Tooltip
            label={
              row.original.evidences_ids.length == 0
                ? 'Sem evidências'
                : 'Ver evidências'
            }
          >
            <IconButton
              colorScheme={props.darkMode ? 'gray' : 'blackAlpha'}
              size='sm'
              variant='ghost'
              aria-label='visualizar-evidencias'
              icon={<LuEye />}
              onClick={() => props.handleViewClick(row.original)}
              disabled={row.original.evidences_ids.length == 0}
            />
          </Tooltip>
          <Tooltip label='Atualizar situação'>
            <IconButton
              colorScheme={'yellow'}
              size='sm'
              variant='ghost'
              aria-label='editar-bug-report'
              icon={<LuPen />}
              onClick={() => props.handleUpdateClick(row.original)}
            />
          </Tooltip>
        </HStack>
      ),
    },
  ];
  if (DEBUG) {
    columns.push({
      accessorKey: 'id',
      header: 'ID',
    });
  }
  return columns;
};
