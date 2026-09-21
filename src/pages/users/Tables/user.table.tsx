import {
  Badge,
  Box,
  Checkbox,
  Flex,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
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
import moment from 'moment';
import { useMemo, useState } from 'react';
import {
  FaFastBackward,
  FaFastForward,
  FaSort,
  FaSortDown,
  FaSortUp,
  FaStepBackward,
  FaStepForward,
} from 'react-icons/fa';
import { BsFillPenFill } from 'react-icons/bs';
import { UserCoreResponse } from '../../../models/http/responses/user.response.models';
import UserImage from '../../../components/common/UserImage/user.image';
import {
  getUserCoreRole,
  getUserCoreRoleBadgeColor,
} from '../../../utils/users/users.formatter';

interface UserTableProps {
  users: UserCoreResponse[];
  selected: Record<number, boolean>;
  allSelected: boolean;
  onToggleSelectAll: () => void;
  onToggleSelect: (id: number) => void;
  onRowClick: (user: UserCoreResponse) => void;
}

const MAX_VISIBLE_GROUPS = 2;
const PAGE_SIZES = [10, 20, 30, 40, 50];

type SortKey =
  | 'name'
  | 'role'
  | 'groups'
  | 'buildings'
  | 'notif'
  | 'lastVisited';

function UserTable({
  users,
  selected,
  allSelected,
  onToggleSelectAll,
  onToggleSelect,
  onRowClick,
}: UserTableProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [prevUsers, setPrevUsers] = useState(users);
  if (users !== prevUsers) {
    setPrevUsers(users);
    setPageIndex(0);
  }

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  function toggleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortKey(null);
      setSortDir('asc');
    }
  }

  function sortIcon(key: SortKey) {
    if (sortKey !== key) return <FaSort opacity={0.4} size={10} />;
    return sortDir === 'asc' ? (
      <FaSortUp size={10} />
    ) : (
      <FaSortDown size={10} />
    );
  }

  const sortedUsers = useMemo(() => {
    if (!sortKey) return users;
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...users].sort((a, b) => {
      switch (sortKey) {
        case 'name':
          return dir * a.name.localeCompare(b.name);
        case 'role':
          return dir * getUserCoreRole(a).localeCompare(getUserCoreRole(b));
        case 'groups':
          return dir * (a.group_names.length - b.group_names.length);
        case 'buildings':
          return dir * (a.building_names.length - b.building_names.length);
        case 'notif':
          return dir * (Number(a.receive_emails) - Number(b.receive_emails));
        case 'lastVisited':
          return (
            dir *
            ((a.last_visited ? new Date(a.last_visited).getTime() : 0) -
              (b.last_visited ? new Date(b.last_visited).getTime() : 0))
          );
        default:
          return 0;
      }
    });
  }, [users, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sortedUsers.length / pageSize));
  const safePageIndex = Math.min(pageIndex, pageCount - 1);
  const pagedUsers = sortedUsers.slice(
    safePageIndex * pageSize,
    safePageIndex * pageSize + pageSize,
  );

  return (
    <Flex direction={'column'} gap={'5px'} mt={'18px'} minH={0}>
      <TableContainer
        border={'2px solid'}
        borderColor={'uspolis.blue'}
        borderRadius={'10px'}
        overflowX={'auto'}
        overflowY={'auto'}
        minH={0}
      >
        <Table size={'sm'}>
          <Thead position={'sticky'} top={0} zIndex={1}>
            <Tr bg={'uspolis.blue'}>
              <Th w={'36px'} borderColor={'uspolis.blue'}>
                <Checkbox
                  isChecked={allSelected}
                  onChange={onToggleSelectAll}
                  colorScheme={'blackAlpha'}
                  sx={{
                    '& .chakra-checkbox__control': { borderColor: 'white' },
                  }}
                />
              </Th>
              <Th
                color={'uspolis.white'}
                borderColor={'uspolis.blue'}
                cursor={'pointer'}
                userSelect={'none'}
                onClick={() => toggleSort('name')}
              >
                <Flex align={'center'} gap={'6px'}>
                  Usuário
                  {sortIcon('name')}
                </Flex>
              </Th>
              <Th
                color={'uspolis.white'}
                borderColor={'uspolis.blue'}
                cursor={'pointer'}
                userSelect={'none'}
                onClick={() => toggleSort('role')}
              >
                <Flex align={'center'} gap={'6px'}>
                  Vínculo
                  {sortIcon('role')}
                </Flex>
              </Th>
              <Th
                color={'uspolis.white'}
                borderColor={'uspolis.blue'}
                cursor={'pointer'}
                userSelect={'none'}
                onClick={() => toggleSort('groups')}
              >
                <Flex align={'center'} gap={'6px'}>
                  Papéis
                  {sortIcon('groups')}
                </Flex>
              </Th>
              <Th
                color={'uspolis.white'}
                borderColor={'uspolis.blue'}
                cursor={'pointer'}
                userSelect={'none'}
                onClick={() => toggleSort('buildings')}
              >
                <Flex align={'center'} gap={'6px'}>
                  Prédios
                  {sortIcon('buildings')}
                </Flex>
              </Th>
              <Th
                color={'uspolis.white'}
                borderColor={'uspolis.blue'}
                cursor={'pointer'}
                userSelect={'none'}
                onClick={() => toggleSort('notif')}
              >
                <Flex align={'center'} gap={'6px'}>
                  Notif.
                  {sortIcon('notif')}
                </Flex>
              </Th>
              <Th
                color={'uspolis.white'}
                borderColor={'uspolis.blue'}
                cursor={'pointer'}
                userSelect={'none'}
                onClick={() => toggleSort('lastVisited')}
              >
                <Flex align={'center'} gap={'6px'}>
                  Último acesso
                  {sortIcon('lastVisited')}
                </Flex>
              </Th>
              <Th color={'uspolis.white'} borderColor={'uspolis.blue'}>
                Ações
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {pagedUsers.map((user, index) => {
              const visibleGroups = user.group_names.slice(
                0,
                MAX_VISIBLE_GROUPS,
              );
              const extraGroups =
                user.group_names.length - visibleGroups.length;
              const isSelected = !!selected[user.id];
              return (
                <Tr
                  key={user.id}
                  onClick={() => onRowClick(user)}
                  cursor={'pointer'}
                  bg={
                    isSelected
                      ? 'uspolis.hover'
                      : index % 2
                        ? 'uspolis.surfaceSubtle'
                        : 'uspolis.white'
                  }
                  _hover={{ bg: 'uspolis.hover' }}
                >
                  <Td onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      isChecked={isSelected}
                      onChange={() => onToggleSelect(user.id)}
                    />
                  </Td>
                  <Td>
                    <Flex align={'center'} gap={'10px'} minW={0}>
                      <UserImage
                        boxSize={'34px'}
                        url={user.user_info?.picture}
                      />
                      <Box minW={0}>
                        <Text
                          fontSize={'13.5px'}
                          fontWeight={'bold'}
                          noOfLines={1}
                        >
                          {user.name}
                        </Text>
                        <Text
                          fontSize={'12px'}
                          color={'uspolis.textMuted'}
                          noOfLines={1}
                        >
                          {user.email}
                        </Text>
                      </Box>
                    </Flex>
                  </Td>
                  <Td>
                    <Badge colorScheme={getUserCoreRoleBadgeColor(user)}>
                      {getUserCoreRole(user)}
                    </Badge>
                  </Td>
                  <Td>
                    <Flex wrap={'wrap'} gap={'5px'} align={'center'}>
                      {visibleGroups.map((name, i) => (
                        <Badge key={i} colorScheme={'green'}>
                          {name}
                        </Badge>
                      ))}
                      {extraGroups > 0 && (
                        <Text fontSize={'11.5px'} color={'uspolis.textMuted'}>
                          {`+${extraGroups}`}
                        </Text>
                      )}
                      {user.group_names.length === 0 && (
                        <Text fontSize={'12px'} color={'uspolis.textMuted'}>
                          —
                        </Text>
                      )}
                    </Flex>
                  </Td>
                  <Td>
                    <Text fontSize={'12.5px'}>
                      {user.building_names.length > 0
                        ? user.building_names.join(', ')
                        : '—'}
                    </Text>
                  </Td>
                  <Td>
                    <Badge colorScheme={user.receive_emails ? 'green' : 'red'}>
                      {user.receive_emails ? 'SIM' : 'NÃO'}
                    </Badge>
                  </Td>
                  <Td>
                    <Text fontSize={'12px'} color={'uspolis.textMuted'}>
                      {user.last_visited
                        ? moment(user.last_visited).format('DD/MM/YYYY HH:mm')
                        : '—'}
                    </Text>
                  </Td>
                  <Td onClick={(e) => e.stopPropagation()}>
                    <Tooltip label='Editar'>
                      <IconButton
                        colorScheme='blue'
                        size='xs'
                        variant='outline'
                        aria-label='editar-usuario'
                        icon={<BsFillPenFill />}
                        onClick={() => onRowClick(user)}
                      />
                    </Tooltip>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        {users.length === 0 && (
          <Flex p={'40px 16px'} justify={'center'}>
            <Text color={'uspolis.textMuted'} fontSize={'13.5px'}>
              Nenhum usuário encontrado com os filtros atuais.
            </Text>
          </Flex>
        )}
      </TableContainer>

      {users.length > 0 && (
        <Flex
          direction={'row'}
          w={'full'}
          gap={'5px'}
          align={'center'}
          h={'40px'}
          flexShrink={0}
        >
          <IconButton
            aria-label='fast-step-back'
            icon={<FaFastBackward />}
            size={'sm'}
            onClick={() => setPageIndex(0)}
            disabled={safePageIndex === 0}
          />
          <IconButton
            aria-label='step-back'
            icon={<FaStepBackward />}
            size={'sm'}
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={safePageIndex === 0}
          />
          <IconButton
            aria-label='step-forward'
            icon={<FaStepForward />}
            size={'sm'}
            onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
            disabled={safePageIndex >= pageCount - 1}
          />
          <IconButton
            aria-label='fast-step-forward'
            icon={<FaFastForward />}
            size={'sm'}
            onClick={() => setPageIndex(pageCount - 1)}
            disabled={safePageIndex >= pageCount - 1}
          />
          <Text fontSize={'13px'}>
            Página{' '}
            <strong>
              {safePageIndex + 1} de {pageCount}
            </strong>
            , ir para página:
          </Text>
          <NumberInput
            w={'fit-content'}
            maxW={'100px'}
            size={'sm'}
            value={safePageIndex + 1}
            max={pageCount}
            min={1}
            onChange={(value) => {
              const nextIndex = value ? Number(value) - 1 : 0;
              setPageIndex(Math.min(Math.max(nextIndex, 0), pageCount - 1));
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
            size={'sm'}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageIndex(0);
            }}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {`${size} por página`}
              </option>
            ))}
          </Select>
          <Text fontSize={'13px'}>
            {`Mostrando ${pagedUsers.length} de ${users.length} usuários`}
          </Text>
        </Flex>
      )}
    </Flex>
  );
}

export default UserTable;
