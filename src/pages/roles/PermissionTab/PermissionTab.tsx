import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Flex,
  Skeleton,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useMemo, useState } from 'react';
import { RoleResponse } from '../../../models/http/responses/role.response.models';
import { UserCoreResponse } from '../../../models/http/responses/user.response.models';
import { ClassroomResponse } from '../../../models/http/responses/classroom.response.models';
import { CourseResponse } from '../../../models/http/responses/course.response.models';
import { BuildingResponse } from '../../../models/http/responses/building.response.models';
import { Resource } from '../../../utils/enums/resources.enums';
import { PermissionAction } from '../../../utils/enums/actions.enums';
import { normalizeString } from '../../../utils/formatters';
import Pager, { PAGE_SIZES } from '../Pager/Pager';

interface PermissionTabProps {
  roles: RoleResponse[];
  users: UserCoreResponse[];
  classrooms: ClassroomResponse[];
  courses: CourseResponse[];
  buildings: BuildingResponse[];
  loading: boolean;
  search: string;
  subTabIndex: number;
}

interface ResourceItem {
  id: number;
  name: string;
  subtitle?: string;
}

const SUB_TABS = Resource.getValues();

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function PermissionTab({
  roles,
  users,
  classrooms,
  courses,
  buildings,
  loading,
  search,
  subTabIndex,
}: PermissionTabProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const activeResource = SUB_TABS[subTabIndex];

  const avatarBg = useColorModeValue('uspolis.lightBlue', 'uspolis.darkBlue');
  const avatarColor = useColorModeValue('uspolis.darkBlue', 'uspolis.white');

  const items: ResourceItem[] = useMemo(() => {
    if (activeResource === Resource.CLASSROOM) {
      return classrooms.map((c) => ({
        id: c.id,
        name: c.name,
        subtitle: c.building,
      }));
    }
    if (activeResource === Resource.BUILDING) {
      return buildings.map((b) => ({ id: b.id, name: b.name }));
    }
    return courses.map((c) => ({ id: c.id, name: c.name }));
  }, [activeResource, classrooms, buildings, courses]);

  const filteredItems = useMemo(() => {
    const query = normalizeString(search.trim());
    if (!query) return items;
    return items.filter(
      (item) =>
        normalizeString(item.name).includes(query) ||
        (item.subtitle && normalizeString(item.subtitle).includes(query)),
    );
  }, [items, search]);

  const [prevFilteredItems, setPrevFilteredItems] = useState(filteredItems);
  if (filteredItems !== prevFilteredItems) {
    setPrevFilteredItems(filteredItems);
    setPage(1);
  }
  const [prevSubTab, setPrevSubTab] = useState(subTabIndex);
  if (subTabIndex !== prevSubTab) {
    setPrevSubTab(subTabIndex);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedItems = filteredItems.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  function rolesForItem(item: ResourceItem) {
    return roles
      .map((role) => {
        const actions = new Set<PermissionAction>();
        role.permissions.forEach((permission) => {
          if (
            permission.resource === activeResource &&
            (permission.resource_id === item.id ||
              permission.resource_id === -1)
          ) {
            permission.actions.forEach((action) => actions.add(action));
          }
        });
        return { role, actions };
      })
      .filter((entry) => entry.actions.size > 0);
  }

  function usersForItem(
    matchingRoles: { role: RoleResponse; actions: Set<PermissionAction> }[],
  ) {
    const map = new Map<
      number,
      { name: string; via: Set<string>; actions: Set<PermissionAction> }
    >();
    matchingRoles.forEach(({ role, actions }) => {
      role.user_ids.forEach((userId, index) => {
        const existing = map.get(userId) ?? {
          name:
            role.user_strs[index] ??
            users.find((u) => u.id === userId)?.name ??
            '?',
          via: new Set<string>(),
          actions: new Set<PermissionAction>(),
        };
        existing.via.add(role.name);
        actions.forEach((action) => existing.actions.add(action));
        map.set(userId, existing);
      });
    });
    return Array.from(map.entries()).map(([userId, value]) => ({
      userId,
      ...value,
    }));
  }

  return (
    <Flex direction={'column'} h={'full'} minH={0} gap={'16px'}>
      <Box minH={0} overflow={'auto'}>
        <Skeleton isLoaded={!loading}>
          {pagedItems.length > 0 && (
            <Accordion
              allowToggle
              display={'flex'}
              flexDirection={'column'}
              gap={'10px'}
            >
              {pagedItems.map((item) => {
                const matchingRoles = rolesForItem(item);
                return (
                  <AccordionItem
                    key={item.id}
                    border={'1px solid'}
                    borderColor={'uspolis.border'}
                    borderRadius={'12px'}
                    overflow={'hidden'}
                  >
                    {({ isExpanded }) => {
                      const matchingUsers = isExpanded
                        ? usersForItem(matchingRoles)
                        : [];
                      return (
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
                              justify={'space-between'}
                              align={'center'}
                              ml={'10px'}
                            >
                              <Box textAlign={'left'}>
                                <Text fontWeight={'bold'} fontSize={'14.5px'}>
                                  {item.name}
                                </Text>
                                {item.subtitle && (
                                  <Text
                                    fontSize={'12.5px'}
                                    color={'uspolis.gray'}
                                  >
                                    {item.subtitle}
                                  </Text>
                                )}
                              </Box>
                              <Badge
                                colorScheme={
                                  matchingRoles.length > 0 ? 'blue' : 'gray'
                                }
                              >
                                {`${matchingRoles.length} ${matchingRoles.length === 1 ? 'papel' : 'papéis'}`}
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
                                {activeResource === Resource.BUILDING && (
                                  <Text
                                    fontSize={'12px'}
                                    color={'uspolis.gray'}
                                    pt={'12px'}
                                  >
                                    Acesso de prédio libera as ações
                                    equivalentes em todas as salas do prédio.
                                  </Text>
                                )}
                                <Box pt={'14px'}>
                                  <Text
                                    fontSize={'13px'}
                                    fontWeight={'bold'}
                                    mb={'8px'}
                                  >
                                    Papéis com acesso
                                  </Text>
                                  {matchingRoles.length === 0 ? (
                                    <Text
                                      fontSize={'13px'}
                                      color={'uspolis.gray'}
                                    >
                                      Nenhum papel concede acesso a este
                                      recurso.
                                    </Text>
                                  ) : (
                                    <Flex direction={'column'} gap={'6px'}>
                                      {matchingRoles.map(
                                        ({ role, actions }) => (
                                          <Flex
                                            key={role.id}
                                            justify={'space-between'}
                                            align={'center'}
                                            border={'1px solid'}
                                            borderColor={'uspolis.border'}
                                            borderRadius={'8px'}
                                            p={'8px 12px'}
                                          >
                                            <Text
                                              fontSize={'13.5px'}
                                              fontWeight={'semibold'}
                                            >
                                              {role.name}
                                            </Text>
                                            <Flex
                                              gap={'4px'}
                                              wrap={'wrap'}
                                              justify={'flex-end'}
                                            >
                                              {Array.from(actions).map(
                                                (action) => (
                                                  <Badge
                                                    key={action}
                                                    colorScheme={'blue'}
                                                  >
                                                    {PermissionAction.translate(
                                                      action,
                                                      activeResource,
                                                    )}
                                                  </Badge>
                                                ),
                                              )}
                                            </Flex>
                                          </Flex>
                                        ),
                                      )}
                                    </Flex>
                                  )}
                                </Box>

                                <Box pt={'18px'}>
                                  <Text
                                    fontSize={'13px'}
                                    fontWeight={'bold'}
                                    mb={'8px'}
                                  >
                                    Usuários com acesso
                                  </Text>
                                  {matchingUsers.length === 0 ? (
                                    <Text
                                      fontSize={'13px'}
                                      color={'uspolis.gray'}
                                    >
                                      Nenhum usuário com acesso a este recurso.
                                    </Text>
                                  ) : (
                                    <SimpleGrid
                                      columns={{ base: 1, md: 2, lg: 3 }}
                                      spacing={'10px'}
                                    >
                                      {matchingUsers.map((user) => (
                                        <Flex
                                          key={user.userId}
                                          direction={'column'}
                                          border={'1px solid'}
                                          borderColor={'uspolis.border'}
                                          borderRadius={'10px'}
                                          p={'10px'}
                                          gap={'8px'}
                                        >
                                          <Flex align={'center'} gap={'8px'}>
                                            <Flex
                                              boxSize={'30px'}
                                              borderRadius={'full'}
                                              bg={avatarBg}
                                              color={avatarColor}
                                              align={'center'}
                                              justify={'center'}
                                              fontSize={'11px'}
                                              fontWeight={'bold'}
                                              flexShrink={0}
                                            >
                                              {getInitials(user.name)}
                                            </Flex>
                                            <Box minW={0}>
                                              <Text
                                                fontSize={'13px'}
                                                fontWeight={'semibold'}
                                                noOfLines={1}
                                              >
                                                {user.name}
                                              </Text>
                                              <Text
                                                fontSize={'11.5px'}
                                                color={'uspolis.gray'}
                                                noOfLines={1}
                                              >
                                                {`via ${Array.from(user.via).join(', ')}`}
                                              </Text>
                                            </Box>
                                          </Flex>
                                          <Flex gap={'4px'} wrap={'wrap'}>
                                            {Array.from(user.actions).map(
                                              (action) => (
                                                <Badge
                                                  key={action}
                                                  colorScheme={'blue'}
                                                  fontSize={'10px'}
                                                >
                                                  {PermissionAction.translate(
                                                    action,
                                                    activeResource,
                                                  )}
                                                </Badge>
                                              ),
                                            )}
                                          </Flex>
                                        </Flex>
                                      ))}
                                    </SimpleGrid>
                                  )}
                                </Box>
                              </>
                            )}
                          </AccordionPanel>
                        </>
                      );
                    }}
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}

          {filteredItems.length === 0 && (
            <Flex
              direction={'column'}
              align={'center'}
              justify={'center'}
              p={'40px 20px'}
              gap={'8px'}
            >
              <Text fontWeight={'bold'}>Nenhum recurso encontrado</Text>
              <Text color={'uspolis.gray'} fontSize={'13.5px'}>
                Nenhum recurso corresponde a esse filtro.
              </Text>
            </Flex>
          )}
        </Skeleton>
      </Box>

      <Box flexShrink={0} mb={'8px'}>
        <Pager
          page={safePage}
          totalPages={totalPages}
          totalItems={filteredItems.length}
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

export default PermissionTab;
