import {
  Badge,
  Box,
  Checkbox,
  Flex,
  IconButton,
  Select,
  Text,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import moment from 'moment';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { UserCoreResponse } from '../../../models/http/responses/user.response.models';
import UserImage from '../../../components/common/UserImage/user.image';
import {
  getUserCoreRole,
  getUserCoreRoleBadgeColor,
} from '../../../utils/users/users.formatter';

export type UserSortKey =
  | 'name'
  | 'role'
  | 'groups'
  | 'buildings'
  | 'notif'
  | 'lastVisited';

export const USER_SORT_LABELS: Record<UserSortKey, string> = {
  name: 'Nome',
  role: 'Vínculo',
  groups: 'Nº de papéis',
  buildings: 'Nº de prédios',
  notif: 'Notificações',
  lastVisited: 'Último acesso',
};

const MAX_VISIBLE_GROUPS = 2;

interface UserCardListProps {
  users: UserCoreResponse[];
  totalCount: number;
  selected: Record<number, boolean>;
  allSelected: boolean;
  onToggleSelectAll: () => void;
  onToggleSelect: (id: number) => void;
  onOpen: (user: UserCoreResponse) => void;
  sortKey: UserSortKey | null;
  sortDir: 'asc' | 'desc';
  onSortKeyChange: (key: UserSortKey | null) => void;
  onToggleSortDir: () => void;
}

// The users table on phones: eight columns don't fit 360px, so each user is a
// card with the same information. The checkbox has its own tap area; the rest
// of the card opens the edit drawer. With no column headers to click, sorting
// moves to a select above the list.
function UserCardList({
  users,
  totalCount,
  selected,
  allSelected,
  onToggleSelectAll,
  onToggleSelect,
  onOpen,
  sortKey,
  sortDir,
  onSortKeyChange,
  onToggleSortDir,
}: UserCardListProps) {
  return (
    <Flex direction={'column'} gap={'8px'} mt={'14px'}>
      <Flex align={'center'} gap={'8px'}>
        <Checkbox
          isChecked={allSelected}
          onChange={onToggleSelectAll}
          isDisabled={totalCount === 0}
          flexShrink={0}
          minH={'40px'}
        >
          <Text fontSize={'13px'}>{`Todos (${totalCount})`}</Text>
        </Checkbox>
        <Select
          ml={'auto'}
          size={'sm'}
          h={'40px'}
          w={'auto'}
          minW={0}
          flex={'0 1 170px'}
          borderRadius={'md'}
          aria-label={'Ordenar por'}
          value={sortKey ?? ''}
          onChange={(e) =>
            onSortKeyChange((e.target.value as UserSortKey) || null)
          }
        >
          <option value={''}>Ordenar por…</option>
          {(Object.keys(USER_SORT_LABELS) as UserSortKey[]).map((key) => (
            <option key={key} value={key}>
              {USER_SORT_LABELS[key]}
            </option>
          ))}
        </Select>
        <IconButton
          aria-label={
            sortDir === 'asc' ? 'Ordem crescente' : 'Ordem decrescente'
          }
          title={sortDir === 'asc' ? 'Crescente' : 'Decrescente'}
          icon={sortDir === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
          onClick={onToggleSortDir}
          isDisabled={!sortKey}
          variant={'outline'}
          minW={'40px'}
          h={'40px'}
          flexShrink={0}
        />
      </Flex>

      {users.map((user) => {
        const visibleGroups = user.group_names.slice(0, MAX_VISIBLE_GROUPS);
        const extraGroups = user.group_names.length - visibleGroups.length;
        const isSelected = !!selected[user.id];
        return (
          <Flex
            key={user.id}
            align={'stretch'}
            border={'1px solid'}
            borderColor={isSelected ? 'uspolis.blue' : 'uspolis.border'}
            borderRadius={'10px'}
            bg={isSelected ? 'uspolis.hover' : 'uspolis.white'}
            overflow={'hidden'}
          >
            <Flex
              as={'label'}
              align={'flex-start'}
              justify={'center'}
              pt={'16px'}
              w={'44px'}
              flexShrink={0}
              cursor={'pointer'}
            >
              <Checkbox
                isChecked={isSelected}
                onChange={() => onToggleSelect(user.id)}
                aria-label={`Selecionar ${user.name}`}
              />
            </Flex>
            <Flex
              as={'button'}
              type={'button'}
              onClick={() => onOpen(user)}
              aria-label={`Editar ${user.name}`}
              flex={1}
              minW={0}
              align={'center'}
              gap={'10px'}
              py={'12px'}
              pr={'8px'}
              textAlign={'left'}
              _hover={{ bg: 'uspolis.hover' }}
              _focusVisible={{
                outline: '2px solid',
                outlineColor: 'uspolis.blue',
                outlineOffset: '-2px',
              }}
            >
              <Box minW={0} flex={1}>
                <Flex align={'center'} gap={'10px'}>
                  <UserImage
                    boxSize={'36px'}
                    url={user.picture_url ?? user.user_info?.picture ?? null}
                  />
                  <Box minW={0}>
                    <Text fontSize={'14px'} fontWeight={'bold'} noOfLines={1}>
                      {user.name}
                    </Text>
                    <Text
                      fontSize={'12px'}
                      color={'uspolis.textMuted'}
                      noOfLines={1}
                      wordBreak={'break-all'}
                    >
                      {user.email}
                    </Text>
                  </Box>
                </Flex>

                <Flex wrap={'wrap'} gap={'5px'} align={'center'} mt={'8px'}>
                  <Badge colorScheme={getUserCoreRoleBadgeColor(user)}>
                    {getUserCoreRole(user)}
                  </Badge>
                  {visibleGroups.map((name, i) => (
                    <Badge
                      key={i}
                      colorScheme={'green'}
                      variant={'outline'}
                      maxW={'100%'}
                      whiteSpace={'normal'}
                    >
                      {name}
                    </Badge>
                  ))}
                  {extraGroups > 0 && (
                    <Text fontSize={'11.5px'} color={'uspolis.textMuted'}>
                      {`+${extraGroups}`}
                    </Text>
                  )}
                </Flex>

                {user.building_names.length > 0 && (
                  <Text fontSize={'12.5px'} mt={'6px'} noOfLines={2}>
                    {user.building_names.join(', ')}
                  </Text>
                )}

                <Flex
                  wrap={'wrap'}
                  gap={'4px 12px'}
                  mt={'6px'}
                  fontSize={'12px'}
                  color={'uspolis.textMuted'}
                >
                  <Text>
                    {'Notificações: '}
                    <Text
                      as={'span'}
                      fontWeight={'bold'}
                      color={user.receive_emails ? 'green.500' : 'red.400'}
                    >
                      {user.receive_emails ? 'sim' : 'não'}
                    </Text>
                  </Text>
                  <Text>
                    {`Último acesso: ${
                      user.last_visited
                        ? moment(user.last_visited).format('DD/MM/YY HH:mm')
                        : '—'
                    }`}
                  </Text>
                </Flex>
              </Box>
              <ChevronRightIcon
                boxSize={'20px'}
                color={'uspolis.textMuted'}
                flexShrink={0}
                aria-hidden
              />
            </Flex>
          </Flex>
        );
      })}

      {totalCount === 0 && (
        <Flex
          p={'32px 16px'}
          justify={'center'}
          border={'1px dashed'}
          borderColor={'uspolis.border'}
          borderRadius={'10px'}
        >
          <Text
            color={'uspolis.textMuted'}
            fontSize={'13.5px'}
            textAlign={'center'}
          >
            Nenhum usuário encontrado com os filtros atuais.
          </Text>
        </Flex>
      )}
    </Flex>
  );
}

export default UserCardList;
