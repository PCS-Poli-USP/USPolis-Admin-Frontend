import { useContext, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Flex,
  Input,
  Progress,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { LuSlidersHorizontal } from 'react-icons/lu';
import { appContext } from '../../context/AppContext';
import PageContent from '../../components/common/PageContent';
import TooltipSelect from '../../components/common/TooltipSelect';
import StatCard from './StatCard/stat.card';
import UserTable from './Tables/user.table';
import UserDrawer from './UserDrawer/user.drawer';
import useUsers from '../../hooks/users/useUsers';
import useGroups from '../../hooks/groups/useGroups';
import useBuildings from '../../hooks/useBuildings';
import { UserCoreResponse } from '../../models/http/responses/user.response.models';
import { normalizeString } from '../../utils/formatters';

const Users = () => {
  const { isMobile } = useContext(appContext);
  const { isOpen: filtersOpen, onToggle: onToggleFilters } = useDisclosure();
  const { users, loading, getUsers, updateUser } = useUsers();
  const { groups, loading: loadingGroups, getAllGroups } = useGroups(false);
  const {
    buildings,
    loading: loadingBuildings,
    getAllBuildings,
  } = useBuildings(false);

  useEffect(() => {
    getAllGroups();
    getAllBuildings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  const [adminOnly, setAdminOnly] = useState(false);
  const [hasGroupOnly, setHasGroupOnly] = useState(false);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [editingUser, setEditingUser] = useState<
    UserCoreResponse | undefined
  >();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const roleOptions = useMemo(
    () => Array.from(new Set(groups.map((g) => g.name))).sort(),
    [groups],
  );
  const buildingOptions = useMemo(
    () => Array.from(new Set(buildings.map((b) => b.name))).sort(),
    [buildings],
  );

  const filteredUsers = useMemo(() => {
    const query = normalizeString(q.trim());
    return users.filter((user) => {
      if (
        query &&
        !normalizeString(user.name).includes(query) &&
        !normalizeString(user.email).includes(query)
      )
        return false;
      if (roleFilter && !user.group_names.includes(roleFilter)) return false;
      if (buildingFilter && !user.building_names.includes(buildingFilter))
        return false;
      if (adminOnly && !user.is_admin) return false;
      if (hasGroupOnly && user.group_ids.length === 0) return false;
      return true;
    });
  }, [users, q, roleFilter, buildingFilter, adminOnly, hasGroupOnly]);

  const selectedIds = useMemo(
    () =>
      Object.keys(selected)
        .filter((id) => selected[Number(id)])
        .map(Number),
    [selected],
  );

  function clearFilters() {
    setQ('');
    setRoleFilter('');
    setBuildingFilter('');
    setAdminOnly(false);
    setHasGroupOnly(false);
  }

  function openDrawer(user: UserCoreResponse) {
    setEditingUser(user);
    setDrawerOpen(true);
  }

  function toggleSelect(id: number) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleSelectAll() {
    const allOn =
      filteredUsers.length > 0 && filteredUsers.every((u) => selected[u.id]);
    setSelected((prev) => {
      const next = { ...prev };
      filteredUsers.forEach((u) => {
        next[u.id] = !allOn;
      });
      return next;
    });
  }

  async function bulkSetNotifications(value: boolean) {
    const targets = users.filter((u) => selectedIds.includes(u.id));
    for (const user of targets) {
      await updateUser(user.id, {
        is_admin: user.is_admin,
        group_ids: user.group_ids,
        receive_emails: value,
      });
    }
    setSelected({});
  }

  const allSelected =
    filteredUsers.length > 0 && filteredUsers.every((u) => selected[u.id]);

  const stats = [
    {
      key: 'total',
      label: 'Total de usuários',
      value: users.length,
      colorScheme: 'blue',
      active: false,
      onClick: clearFilters,
    },
    {
      key: 'admin',
      label: 'Administradores',
      value: users.filter((u) => u.is_admin).length,
      colorScheme: 'orange',
      active: adminOnly,
      onClick: () => setAdminOnly((v) => !v),
    },
    {
      key: 'hasGroup',
      label: 'Com papel associado',
      value: users.filter((u) => u.group_ids.length > 0).length,
      colorScheme: 'yellow',
      active: hasGroupOnly,
      onClick: () => setHasGroupOnly((v) => !v),
    },
  ];

  const chips = [
    {
      label: 'Somente admins',
      active: adminOnly,
      toggle: () => setAdminOnly((v) => !v),
    },
    {
      label: 'Com papel',
      active: hasGroupOnly,
      toggle: () => setHasGroupOnly((v) => !v),
    },
  ];

  const activeFilterCount = [
    roleFilter,
    buildingFilter,
    adminOnly,
    hasGroupOnly,
  ].filter(Boolean).length;

  const roleSelect = (
    <TooltipSelect
      isClearable
      menuPortalTarget={document.body}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 1000 }) }}
      placeholder={'Todos os papéis'}
      value={roleFilter ? { label: roleFilter, value: roleFilter } : null}
      options={roleOptions.map((name) => ({ label: name, value: name }))}
      onChange={(option) => setRoleFilter(option ? String(option.value) : '')}
    />
  );
  const buildingSelect = (
    <TooltipSelect
      isClearable
      menuPortalTarget={document.body}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 1000 }) }}
      placeholder={'Todos os prédios'}
      value={
        buildingFilter ? { label: buildingFilter, value: buildingFilter } : null
      }
      options={buildingOptions.map((name) => ({ label: name, value: name }))}
      onChange={(option) =>
        setBuildingFilter(option ? String(option.value) : '')
      }
    />
  );

  return (
    <PageContent>
      <Flex
        direction={'column'}
        // Desktop: the column fills the screen and the table scrolls inside
        // it. Phones: the card list is taller than the screen, so the column
        // follows its content and the page scrolls; at a fixed height its
        // children (the filters panel first) were squeezed and cut.
        h={isMobile ? 'auto' : 'full'}
        minH={0}
        minW={0}
        // The layout above (EmptyPage) grows to the widest content it holds;
        // without this the 8-column table widened the whole page (720px on a
        // 360px phone, 1180px on a tablet) instead of scrolling inside its
        // container.
        sx={{ contain: 'inline-size' }}
      >
        {isMobile ? (
          <>
            <SimpleGrid columns={3} spacing={'8px'}>
              {stats.map((stat) => (
                <StatCard
                  key={stat.key}
                  label={stat.label}
                  value={stat.value}
                  colorScheme={stat.colorScheme}
                  active={stat.active}
                  onClick={stat.onClick}
                  compact
                />
              ))}
            </SimpleGrid>

            <Flex gap={'8px'} mt={'12px'}>
              <Input
                flex={1}
                minW={0}
                h={'40px'}
                type={'search'}
                placeholder={'Buscar por nome ou email'}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Button
                h={'40px'}
                flexShrink={0}
                variant={filtersOpen || activeFilterCount ? 'solid' : 'outline'}
                colorScheme={'blue'}
                leftIcon={<LuSlidersHorizontal />}
                aria-expanded={filtersOpen}
                onClick={onToggleFilters}
              >
                {activeFilterCount
                  ? `Filtros (${activeFilterCount})`
                  : 'Filtros'}
              </Button>
            </Flex>

            <Collapse in={filtersOpen} animateOpacity>
              <Flex
                direction={'column'}
                gap={'10px'}
                mt={'10px'}
                p={'12px'}
                border={'1px solid'}
                borderColor={'uspolis.border'}
                borderRadius={'10px'}
              >
                {roleSelect}
                {buildingSelect}
                <Flex gap={'8px'}>
                  {chips.map((chip) => (
                    <Button
                      key={chip.label}
                      flex={1}
                      h={'40px'}
                      size={'sm'}
                      variant={chip.active ? 'solid' : 'outline'}
                      colorScheme={'blue'}
                      aria-pressed={chip.active}
                      onClick={chip.toggle}
                    >
                      {chip.label}
                    </Button>
                  ))}
                </Flex>
                <Button
                  h={'36px'}
                  size={'sm'}
                  variant={'ghost'}
                  colorScheme={'gray'}
                  onClick={clearFilters}
                  isDisabled={!activeFilterCount && !q}
                >
                  Limpar filtros
                </Button>
              </Flex>
            </Collapse>
          </>
        ) : (
          // Wraps on tablets: stats and filters side by side only when both
          // fit.
          <Flex align={'center'} wrap={'wrap'} gap={'12px'}>
            <SimpleGrid columns={3} spacing={'12px'} flexShrink={0}>
              {stats.map((stat) => (
                <StatCard
                  key={stat.key}
                  label={stat.label}
                  value={stat.value}
                  colorScheme={stat.colorScheme}
                  active={stat.active}
                  onClick={stat.onClick}
                />
              ))}
            </SimpleGrid>

            <Flex
              wrap={'wrap'}
              align={'center'}
              gap={'10px'}
              p={'14px 16px'}
              border={'1px solid'}
              borderColor={'uspolis.border'}
              borderRadius={'10px'}
              flex={'1 1 480px'}
              minW={0}
            >
              <Input
                flex={'1'}
                minW={'220px'}
                placeholder={'Buscar por nome ou email'}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Box w={'220px'}>{roleSelect}</Box>
              <Box w={'220px'}>{buildingSelect}</Box>
              <Flex gap={'6px'} wrap={'wrap'}>
                {chips.map((chip) => (
                  <Button
                    key={chip.label}
                    size={'sm'}
                    variant={chip.active ? 'solid' : 'outline'}
                    colorScheme={'blue'}
                    aria-pressed={chip.active}
                    onClick={chip.toggle}
                  >
                    {chip.label}
                  </Button>
                ))}
              </Flex>
              <Button
                variant={'link'}
                colorScheme={'gray'}
                size={'sm'}
                onClick={clearFilters}
              >
                Limpar filtros
              </Button>
            </Flex>
          </Flex>
        )}

        {selectedIds.length > 0 && (
          <Flex
            align={'center'}
            gap={'14px'}
            wrap={'wrap'}
            mt={'14px'}
            p={'10px 16px'}
            borderRadius={'10px'}
            bg={'uspolis.lightBlue'}
            flexShrink={0}
          >
            <Text
              fontSize={'13.5px'}
              fontWeight={'bold'}
              color={'uspolis.darkBlue'}
            >
              {`${selectedIds.length} selecionado${selectedIds.length === 1 ? '' : 's'}`}
            </Text>
            {/* Phones: count and "Limpar seleção" on the first row, the two
                actions sharing the second (stacked, they doubled the bar). */}
            <Flex
              gap={'8px'}
              wrap={'wrap'}
              order={isMobile ? 1 : undefined}
              w={isMobile ? 'full' : undefined}
            >
              <Button
                size={'sm'}
                variant={'outline'}
                colorScheme={'blue'}
                flex={isMobile ? 1 : undefined}
                minH={isMobile ? '40px' : undefined}
                whiteSpace={isMobile ? 'normal' : undefined}
                onClick={() => bulkSetNotifications(true)}
              >
                Ativar notificações
              </Button>
              <Button
                size={'sm'}
                variant={'outline'}
                colorScheme={'blue'}
                flex={isMobile ? 1 : undefined}
                minH={isMobile ? '40px' : undefined}
                whiteSpace={isMobile ? 'normal' : undefined}
                onClick={() => bulkSetNotifications(false)}
              >
                Desativar notificações
              </Button>
            </Flex>
            <Button
              variant={'link'}
              size={'sm'}
              colorScheme={'blue'}
              ml={'auto'}
              minH={isMobile ? '36px' : undefined}
              onClick={() => setSelected({})}
            >
              Limpar seleção
            </Button>
          </Flex>
        )}

        {(loading || loadingGroups || loadingBuildings) && (
          <Progress
            size={'xs'}
            isIndeterminate
            mt={'10px'}
            colorScheme={'blue'}
            flexShrink={0}
          />
        )}

        <UserTable
          users={filteredUsers}
          selected={selected}
          allSelected={allSelected}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelect={toggleSelect}
          onRowClick={openDrawer}
        />
      </Flex>

      <UserDrawer
        isOpen={drawerOpen}
        groups={groups}
        user={editingUser}
        refetch={getUsers}
        onClose={() => {
          setDrawerOpen(false);
          setEditingUser(undefined);
        }}
      />
    </PageContent>
  );
};

export default Users;
