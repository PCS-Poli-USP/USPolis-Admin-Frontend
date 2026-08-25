import { Button, Flex, SimpleGrid, Skeleton, Text } from '@chakra-ui/react';
import { UserPermissionResponse } from '../../../models/http/responses/user.response.models';
import UserCard from '../UserCard/UserCard';
import UsersFilters from '../UsersFilters/UsersFilters';
import { useMemo, useState } from 'react';
import { Resource } from '../../../utils/enums/resources.enums';
import { PermissionAction } from '../../../utils/enums/actions.enums';
import { normalizeString } from '../../../utils/formatters';
import PaginationTab from '../PaginationTab/PaginationTab';
import { FaSearch } from 'react-icons/fa';
import { PermissionResponse } from '../../../models/http/responses/permissions.response.models';
import { RoleResponse } from '../../../models/http/responses/role.response.models';

interface UsersTabProps {
  users: UserPermissionResponse[];
  loading: boolean;
  setPermissionsViewOnly: (
    viewOnly: boolean,
    permissions: PermissionResponse[],
    label?: string,
  ) => void;
  setRolesViewOnly: (
    viewOnly: boolean,
    roles: RoleResponse[],
    label?: string,
  ) => void;
}

interface UserPermissionFormated extends UserPermissionResponse {
  resource_names: Set<string>;
  role_names: Set<string>;
  actions: Set<PermissionAction>;
}

function UsersTab({
  users,
  loading,
  setPermissionsViewOnly,
  setRolesViewOnly,
}: UsersTabProps) {
  const [roleName, setRoleName] = useState('');
  const [userDataFilter, setUserDataFilter] = useState('');
  const [resourceNameFilter, setResourceNameFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState<Resource | ''>('');
  const [actionFilter, setActionFilter] = useState<PermissionAction | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  function handleEditUser() {}

  function formatUserPermissions(
    user: UserPermissionResponse,
  ): UserPermissionFormated {
    const resources = new Set<Resource>();
    const resource_names = new Set<string>();
    const actions = new Set<PermissionAction>();

    user.permissions.forEach((permission) => {
      resources.add(permission.resource);
      if (permission.resource_name) {
        resource_names.add(permission.resource_name);
      }
      permission.actions.forEach((action) => actions.add(action));
    });

    const role_names = new Set<string>();
    user.roles.forEach((role) => {
      role_names.add(role.name);
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      resources: user.resources,
      roles: user.roles,
      permissions: user.permissions,
      resource_names,
      role_names,
      actions,
    };
  }

  const usersFormatted = useMemo(() => {
    return users.map(formatUserPermissions);
  }, [users]);

  const filteredUsers = useMemo(() => {
    const roleNameValue = normalizeString(roleName);
    const userDataValue = normalizeString(userDataFilter);
    const resourceNameValue = normalizeString(resourceNameFilter);

    return usersFormatted.filter((user) => {
      if (roleName && !user.role_names.has(roleNameValue)) {
        return false;
      }

      if (
        userDataFilter &&
        !user.name.includes(userDataValue) &&
        !user.email.includes(userDataValue)
      )
        return false;

      if (resourceFilter && !user.resources.includes(resourceFilter)) {
        return false;
      }
      if (actionFilter && !user.actions.has(actionFilter)) return false;
      if (
        resourceNameFilter &&
        !Array.from(user.resource_names).some((resourceName) =>
          normalizeString(resourceName).includes(resourceNameValue),
        )
      ) {
        return false;
      }

      return true;
    });
  }, [
    usersFormatted,
    userDataFilter,
    resourceFilter,
    resourceNameFilter,
    actionFilter,
    roleName,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / itemsPerPage),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedUsers = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;

    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, safeCurrentPage]);

  return (
    <Skeleton isLoaded={!loading} w={'full'} h={'full'}>
      <Flex
        w={'100%'}
        direction={'column'}
        justify={'center'}
        align={'center'}
        gap={'10px'}
      >
        <Flex
          w={'full'}
          justify={'space-between'}
          align={'center'}
          gap={'12px'}
        >
          <Flex direction={'column'} w={'400px'}>
            <Text fontSize={'xl'} fontWeight={'bold'}>
              Permissões dos Usuários
            </Text>
            <Text color={'gray.500'}>
              Gerencie e filtre permissões dos usuários
            </Text>
          </Flex>

          <UsersFilters
            roleName={roleName}
            setRoleName={(value) => {
              setCurrentPage(1);
              setRoleName(value);
            }}
            userData={userDataFilter}
            setUserDataFilter={(value) => {
              setCurrentPage(1);
              setUserDataFilter(value);
            }}
            resourceNameFilter={resourceNameFilter}
            setResourceNameFilter={(value) => {
              setCurrentPage(1);
              setResourceNameFilter(value);
            }}
            resourceFilter={resourceFilter}
            setResourceFilter={(value) => {
              setCurrentPage(1);
              setResourceFilter(value);
            }}
            actionFilter={actionFilter}
            setActionFilter={(value) => {
              setCurrentPage(1);
              setActionFilter(value);
            }}
          />
        </Flex>

        <SimpleGrid mt={4} columns={{ base: 1, md: 2, lg: 4 }} spacing={'20px'}>
          {paginatedUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEditUser}
              setPermissionsViewOnly={() =>
                setPermissionsViewOnly(true, user.permissions, user.name)
              }
              setRolesViewOnly={() =>
                setRolesViewOnly(true, user.roles, user.name)
              }
            />
          ))}
        </SimpleGrid>

        {paginatedUsers.length === 0 && (
          <Flex
            direction={'column'}
            align={'center'}
            justify={'center'}
            w={'full'}
            h={'full'}
            p={4}
            gap={'10px'}
          >
            <FaSearch size={'128px'} />
            <Text fontWeight={'bold'} fontSize={'xl'}>
              Nenhum usuário encontrado
            </Text>
            <Text maxW={'800px'}>
              Nenhum usuário corresponde aos filtros aplicados. Tente ajustar os
              filtros para encontrar os usuários desejados.
            </Text>
            <Button
              colorScheme='blue'
              onClick={() => {
                setCurrentPage(1);
                setRoleName('');
                setUserDataFilter('');
                setResourceNameFilter('');
                setResourceFilter('');
                setActionFilter('');
              }}
            >
              Limpar Filtros
            </Button>
          </Flex>
        )}

        <PaginationTab
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={(page) => setCurrentPage(page)}
          filteredItemsLength={filteredUsers.length}
          itemsPerPage={itemsPerPage}
        />
      </Flex>
    </Skeleton>
  );
}

export default UsersTab;
