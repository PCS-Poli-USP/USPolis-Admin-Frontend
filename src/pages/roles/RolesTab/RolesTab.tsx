import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  IconButton,
  SimpleGrid,
  Skeleton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { RoleResponse } from '../../../models/http/responses/role.response.models';
import { FaUsersGear } from 'react-icons/fa6';
import RoleCard from '../RoleCard/RoleCard';
import RoleFilters from '../RoleFilters/RoleFilters';
import { useMemo, useState } from 'react';
import { Resource } from '../../../utils/enums/resources.enums';
import { PermissionAction } from '../../../utils/enums/actions.enums';
import { normalizeString } from '../../../utils/formatters';
import PaginationTab from '../PaginationTab/PaginationTab';
import { FaSearch } from 'react-icons/fa';
import { PermissionResponse } from '../../../models/http/responses/permissions.response.models';

interface RolesTabProps {
  roles: RoleResponse[];
  loading: boolean;
  handleOpenRoleModal: (role?: RoleResponse) => void;
  handleRemoveRole: (role: RoleResponse) => void;
  setPermissionsViewOnly: (
    viewOnly: boolean,
    permissions: PermissionResponse[],
    label?: string,
  ) => void;
  setViewOnly: (viewOnly: boolean) => void;
  viewOnly: boolean;
  viewOnlyLabel?: string;
  viewOnlyRoles?: RoleResponse[];
}

interface RoleFormated extends RoleResponse {
  resource_names: Set<string>;
  actions: Set<PermissionAction>;
  parent_names: Set<string>;
}

function RolesTab({
  roles,
  loading,
  handleOpenRoleModal,
  handleRemoveRole,
  setPermissionsViewOnly,
  setViewOnly,
  viewOnly = false,
  viewOnlyLabel = 'Papéis',
  viewOnlyRoles = [],
}: RolesTabProps) {
  const [roleName, setRoleName] = useState('');
  const [resourceNameFilter, setResourceNameFilter] = useState('');
  const [parentNameFilter, setParentNameFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState<Resource | ''>('');
  const [actionFilter, setActionFilter] = useState<PermissionAction | ''>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  function handleEditRole(role: RoleResponse) {
    handleOpenRoleModal(role);
  }

  function formateRole(role: RoleResponse): RoleFormated {
    const roleActions = new Set<PermissionAction>();
    const parent_names = new Set<string>();
    const resource_names = new Set<string>();

    role.permissions.forEach((permission) => {
      permission.actions.forEach((action) => roleActions.add(action));
      parent_names.add(permission.parent_name ?? '');
      resource_names.add(permission.resource_name ?? '');
    });

    return {
      ...role,
      resource_names: resource_names,
      actions: roleActions,
      parent_names: parent_names,
    };
  }

  const formattedRoles = useMemo(() => {
    if (viewOnly) {
      return viewOnlyRoles.map(formateRole);
    }
    return roles.map(formateRole);
  }, [roles, viewOnlyRoles, viewOnly]);

  const filteredRoles = useMemo(() => {
    const roleNameValue = normalizeString(roleName);
    const resourceNameValue = normalizeString(resourceNameFilter);

    return formattedRoles.filter((role) => {
      if (roleName && !role.name.includes(roleNameValue)) {
        return false;
      }

      if (resourceFilter && !role.resources.includes(resourceFilter)) {
        return false;
      }
      if (actionFilter && !role.actions.has(actionFilter)) return false;
      if (
        resourceNameFilter &&
        !Array.from(role.resource_names).some((resourceName) =>
          normalizeString(resourceName).includes(resourceNameValue),
        )
      ) {
        return false;
      }

      if (
        parentNameFilter &&
        !Array.from(role.parent_names).some((parentName) =>
          normalizeString(parentName).includes(
            normalizeString(parentNameFilter),
          ),
        )
      ) {
        return false;
      }

      return true;
    });
  }, [
    formattedRoles,
    resourceFilter,
    resourceNameFilter,
    actionFilter,
    roleName,
    parentNameFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRoles.length / itemsPerPage),
  );
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedRoles = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;

    return filteredRoles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRoles, safeCurrentPage]);

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
          <Flex direction={'column'} w={'800px'}>
            <Flex gap={'10px'}>
              <Text fontSize={'xl'} fontWeight={'bold'}>
                {`${viewOnly ? `Visualizando ${viewOnlyLabel}` : 'Permissões'}`}
              </Text>
              {viewOnly && (
                <Tooltip label={`Fechar permissões de ${viewOnlyLabel}`}>
                  <IconButton
                    aria-label='close-view-only'
                    icon={<CloseIcon />}
                    size={'sm '}
                    variant={'ghost'}
                    onClick={() => setViewOnly(false)}
                  />
                </Tooltip>
              )}
            </Flex>
            <Text color={'gray.500'}>Gerencie e filtre permissões</Text>
          </Flex>

          <Flex w={'full'} justify={'flex-end'}>
            <Button
              leftIcon={<AddIcon />}
              hidden={paginatedRoles.length === 0}
              onClick={() => handleOpenRoleModal()}
              disabled={viewOnly}
            >
              Adicionar Papel
            </Button>
          </Flex>
        </Flex>

        <RoleFilters
          roleName={roleName}
          setRoleName={(value) => {
            setCurrentPage(1);
            setRoleName(value);
          }}
          resourceNameFilter={resourceNameFilter}
          setResourceNameFilter={(value) => {
            setCurrentPage(1);
            setResourceNameFilter(value);
          }}
          parentNameFilter={parentNameFilter}
          setParentNameFilter={(value) => {
            setCurrentPage(1);
            setParentNameFilter(value);
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

        <SimpleGrid mt={4} columns={{ base: 1, md: 2, lg: 3 }} spacing={'20px'}>
          {paginatedRoles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onEdit={handleEditRole}
              onRemove={handleRemoveRole}
              setPermissionsViewOnly={(view, label) =>
                setPermissionsViewOnly(view, role.permissions, label)
              }
              maxW='100%'
            />
          ))}
        </SimpleGrid>
        {formattedRoles.length === 0 && !viewOnly && (
          <Flex
            direction={'column'}
            justify={'center'}
            align={'center'}
            maxW={'600px'}
            gap={'10px'}
            border={'1px solid'}
            borderRadius={'1rem'}
            p={'1rem'}
          >
            <FaUsersGear size={'128px'} />
            <Text fontSize={'2xl'} fontWeight={'bold'}>
              Nenhum papel cadastrado
            </Text>
            <Text textAlign={'center'}>
              Parece que não há papeis cadastrados. Cadastre algum papel para
              permissionar usuários e liberar acesso a recursos privados.
            </Text>
            <Button
              leftIcon={<AddIcon />}
              mt={'20px'}
              onClick={() => handleOpenRoleModal()}
            >
              Novo Papel
            </Button>
          </Flex>
        )}

        {paginatedRoles.length === 0 && (
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
              Nenhum papel encontrado
            </Text>
            <Text maxW={'800px'}>
              Nenhum papel corresponde aos filtros aplicados. Tente ajustar os
              filtros para encontrar os papéis desejados.
            </Text>
            <Button
              colorScheme='blue'
              onClick={() => {
                setCurrentPage(1);
                setRoleName('');
                setParentNameFilter('');
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
          filteredItemsLength={filteredRoles.length}
          itemsPerPage={itemsPerPage}
        />
      </Flex>
    </Skeleton>
  );
}

export default RolesTab;
