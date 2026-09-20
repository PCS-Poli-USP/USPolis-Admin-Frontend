import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Flex,
  Skeleton,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon, CloseIcon } from '@chakra-ui/icons';
import { useMemo, useState } from 'react';
import { RoleResponse } from '../../../models/http/responses/role.response.models';
import { UserCoreResponse } from '../../../models/http/responses/user.response.models';
import { Resource } from '../../../utils/enums/resources.enums';
import { PermissionAction } from '../../../utils/enums/actions.enums';
import { normalizeString } from '../../../utils/formatters';
import TooltipSelect from '../../../components/common/TooltipSelect';
import Pager, { PAGE_SIZES } from '../Pager/Pager';

interface UsersTabProps {
  roles: RoleResponse[];
  users: UserCoreResponse[];
  loading: boolean;
  search: string;
  addUserToRole: (role_id: number, user_id: number) => Promise<void>;
  removeUserFromRole: (role_id: number, user_id: number) => Promise<void>;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

const selectMenuProps = {
  menuPortalTarget: document.body,
  styles: {
    menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 1500 }),
  },
};

function UsersTab({
  roles,
  users,
  loading,
  search,
  addUserToRole,
  removeUserFromRole,
}: UsersTabProps) {
  const [pendingRoleId, setPendingRoleId] = useState<Record<number, string>>(
    {},
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

  const avatarBg = useColorModeValue('uspolis.lightBlue', 'uspolis.darkBlue');
  const avatarColor = useColorModeValue('uspolis.darkBlue', 'uspolis.white');

  const filteredUsers = useMemo(() => {
    const query = normalizeString(search.trim());
    if (!query) return users;
    return users.filter(
      (user) =>
        normalizeString(user.name).includes(query) ||
        normalizeString(user.email).includes(query),
    );
  }, [users, search]);

  const [prevFilteredUsers, setPrevFilteredUsers] = useState(filteredUsers);
  if (filteredUsers !== prevFilteredUsers) {
    setPrevFilteredUsers(filteredUsers);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedUsers = filteredUsers.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  function rolesOf(userId: number) {
    return roles.filter((role) => role.user_ids.includes(userId));
  }

  async function handleRemoveRole(userId: number, role: RoleResponse) {
    await removeUserFromRole(role.id, userId);
  }

  async function handleAddRole(userId: number) {
    const roleId = Number(pendingRoleId[userId]);
    if (!roleId) return;
    await addUserToRole(roleId, userId);
    setPendingRoleId((prev) => ({ ...prev, [userId]: '' }));
  }

  return (
    <Flex direction={'column'} h={'full'} minH={0} gap={'16px'}>
      <Box minH={0} overflow={'auto'}>
        <Skeleton isLoaded={!loading}>
          {pagedUsers.length > 0 && (
            <Accordion
              allowToggle
              display={'flex'}
              flexDirection={'column'}
              gap={'10px'}
            >
              {pagedUsers.map((user) => {
                const assignedRoles = rolesOf(user.id);
                const availableRoles = roles.filter(
                  (role) => !role.user_ids.includes(user.id),
                );
                const effectiveRows = assignedRoles.flatMap((role) =>
                  role.permissions.map((permission) => ({
                    key: `${role.id}-${permission.id}`,
                    resource: permission.resource,
                    resourceName:
                      permission.resource_id === -1
                        ? `Todos: ${Resource.translate(permission.resource)}`
                        : permission.resource_name || 'Desconhecido',
                    actions: permission.actions,
                    viaRole: role.name,
                  })),
                );

                return (
                  <AccordionItem
                    key={user.id}
                    border={'1px solid'}
                    borderColor={'uspolis.border'}
                    borderRadius={'12px'}
                    overflow={'hidden'}
                  >
                    {({ isExpanded }) => (
                      <>
                        <AccordionButton
                          py={'12px'}
                          px={'16px'}
                          _hover={{ bg: 'uspolis.hover' }}
                        >
                          {isExpanded ? (
                            <ChevronDownIcon />
                          ) : (
                            <ChevronRightIcon />
                          )}
                          <Flex
                            flex={'1'}
                            align={'center'}
                            gap={'12px'}
                            ml={'10px'}
                          >
                            <Flex
                              boxSize={'34px'}
                              borderRadius={'full'}
                              bg={avatarBg}
                              color={avatarColor}
                              align={'center'}
                              justify={'center'}
                              fontSize={'12px'}
                              fontWeight={'bold'}
                              flexShrink={0}
                            >
                              {getInitials(user.name)}
                            </Flex>
                            <Box textAlign={'left'} minW={0} flex={'1'}>
                              <Text
                                fontWeight={'bold'}
                                fontSize={'14.5px'}
                                noOfLines={1}
                              >
                                {user.name}
                              </Text>
                              <Text
                                fontSize={'12.5px'}
                                color={'uspolis.gray'}
                                noOfLines={1}
                              >
                                {user.email}
                              </Text>
                            </Box>
                            <Badge
                              colorScheme={
                                assignedRoles.length > 0 ? 'blue' : 'gray'
                              }
                            >
                              {`${assignedRoles.length} ${assignedRoles.length === 1 ? 'papel' : 'papéis'}`}
                            </Badge>
                          </Flex>
                        </AccordionButton>
                        <AccordionPanel
                          px={'16px'}
                          pb={'18px'}
                          borderTop={'1px solid'}
                          borderColor={'uspolis.border'}
                        >
                          {isExpanded && (
                            <>
                              <Box pt={'14px'}>
                                <Text
                                  fontSize={'13px'}
                                  fontWeight={'bold'}
                                  mb={'8px'}
                                >
                                  Papéis atribuídos
                                </Text>
                                <Wrap mb={'10px'}>
                                  {assignedRoles.map((role) => (
                                    <WrapItem key={role.id}>
                                      <Badge
                                        display={'flex'}
                                        alignItems={'center'}
                                        gap={'6px'}
                                        colorScheme={'blue'}
                                        borderRadius={'full'}
                                        px={'10px'}
                                        py={'4px'}
                                      >
                                        {role.name}
                                        <CloseIcon
                                          boxSize={'8px'}
                                          cursor={'pointer'}
                                          onClick={() =>
                                            handleRemoveRole(user.id, role)
                                          }
                                        />
                                      </Badge>
                                    </WrapItem>
                                  ))}
                                  {assignedRoles.length === 0 && (
                                    <Text
                                      fontSize={'13px'}
                                      color={'uspolis.gray'}
                                    >
                                      Nenhum papel atribuído.
                                    </Text>
                                  )}
                                </Wrap>
                                <Flex gap={'8px'} align={'center'}>
                                  <Box w={'320px'}>
                                    <TooltipSelect
                                      {...selectMenuProps}
                                      isClearable
                                      placeholder={'+ Adicionar papel...'}
                                      value={
                                        pendingRoleId[user.id]
                                          ? {
                                              value: Number(
                                                pendingRoleId[user.id],
                                              ),
                                              label:
                                                availableRoles.find(
                                                  (r) =>
                                                    r.id ===
                                                    Number(
                                                      pendingRoleId[user.id],
                                                    ),
                                                )?.name ?? '',
                                            }
                                          : null
                                      }
                                      options={availableRoles.map((role) => ({
                                        value: role.id,
                                        label: role.name,
                                      }))}
                                      onChange={(option) =>
                                        setPendingRoleId((prev) => ({
                                          ...prev,
                                          [user.id]: option
                                            ? String(option.value)
                                            : '',
                                        }))
                                      }
                                    />
                                  </Box>
                                  <Button
                                    size={'sm'}
                                    colorScheme={'blue'}
                                    isDisabled={!pendingRoleId[user.id]}
                                    isLoading={loading}
                                    onClick={() => handleAddRole(user.id)}
                                  >
                                    Adicionar
                                  </Button>
                                </Flex>
                              </Box>

                              <Box pt={'20px'}>
                                <Text
                                  fontSize={'13px'}
                                  fontWeight={'bold'}
                                  mb={'8px'}
                                >
                                  Acesso efetivo
                                </Text>
                                {effectiveRows.length === 0 ? (
                                  <Text
                                    fontSize={'13px'}
                                    color={'uspolis.gray'}
                                  >
                                    Este usuário não possui acesso a nenhum
                                    recurso.
                                  </Text>
                                ) : (
                                  <Flex direction={'column'} gap={'6px'}>
                                    {effectiveRows.map((row) => (
                                      <Flex
                                        key={row.key}
                                        justify={'space-between'}
                                        align={'center'}
                                        border={'1px solid'}
                                        borderColor={'uspolis.border'}
                                        borderRadius={'8px'}
                                        p={'8px 12px'}
                                        wrap={'wrap'}
                                        gap={'6px'}
                                      >
                                        <Flex
                                          align={'center'}
                                          gap={'8px'}
                                          wrap={'wrap'}
                                        >
                                          <Badge colorScheme={'purple'}>
                                            {Resource.translate(row.resource)}
                                          </Badge>
                                          <Text
                                            fontSize={'13.5px'}
                                            fontWeight={'semibold'}
                                          >
                                            {row.resourceName}
                                          </Text>
                                          <Flex gap={'4px'} wrap={'wrap'}>
                                            {row.actions.map((action) => (
                                              <Badge
                                                key={action}
                                                colorScheme={'blue'}
                                              >
                                                {PermissionAction.translate(
                                                  action,
                                                  row.resource,
                                                )}
                                              </Badge>
                                            ))}
                                          </Flex>
                                        </Flex>
                                        <Text
                                          fontSize={'12px'}
                                          color={'uspolis.gray'}
                                        >
                                          {`via ${row.viaRole}`}
                                        </Text>
                                      </Flex>
                                    ))}
                                  </Flex>
                                )}
                              </Box>
                            </>
                          )}
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}

          {filteredUsers.length === 0 && (
            <Flex
              direction={'column'}
              align={'center'}
              justify={'center'}
              p={'40px 20px'}
              gap={'8px'}
            >
              <Text fontWeight={'bold'}>Nenhum usuário encontrado</Text>
              <Text color={'uspolis.gray'} fontSize={'13.5px'}>
                Nenhum usuário corresponde a esse filtro.
              </Text>
            </Flex>
          )}
        </Skeleton>
      </Box>

      <Box flexShrink={0} mb={'8px'}>
        <Pager
          page={safePage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </Box>
    </Flex>
  );
}

export default UsersTab;
