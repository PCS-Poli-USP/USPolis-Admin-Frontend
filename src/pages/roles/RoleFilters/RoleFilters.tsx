import { Flex, Input, Select } from '@chakra-ui/react';
import { PermissionAction } from '../../../utils/enums/actions.enums';
import { Resource } from '../../../utils/enums/resources.enums';

interface RoleFiltersProps {
  roleName: string;
  setRoleName: (value: string) => void;
  resourceNameFilter: string;
  setResourceNameFilter: (value: string) => void;
  parentNameFilter: string;
  setParentNameFilter: (value: string) => void;
  resourceFilter: Resource | '';
  setResourceFilter: (value: Resource | '') => void;
  actionFilter: PermissionAction | '';
  setActionFilter: (value: PermissionAction | '') => void;
}

function RoleFilters({
  roleName,
  setRoleName,
  resourceNameFilter,
  setResourceNameFilter,
  parentNameFilter,
  setParentNameFilter,
  resourceFilter,
  setResourceFilter,
  actionFilter,
  setActionFilter,
}: RoleFiltersProps) {
  const actionOptions = resourceFilter
    ? PermissionAction.getValues(resourceFilter)
    : [];

  return (
    <Flex gap={'10px'} w={'full'} wrap={'wrap'}>
      <Input
        placeholder='Buscar por nome do papel'
        value={roleName}
        onChange={(event) => setRoleName(event.target.value)}
        maxW={{ base: 'full', md: '220px' }}
      />
      <Input
        placeholder='Nome do recurso'
        value={resourceNameFilter}
        onChange={(event) => setResourceNameFilter(event.target.value)}
        maxW={{ base: 'full', md: '220px' }}
      />
      <Input
        placeholder='Recurso Relacionado'
        value={parentNameFilter}
        onChange={(event) => setParentNameFilter(event.target.value)}
        maxW={{ base: 'full', md: '220px' }}
      />
      <Select
        placeholder='Todos os recursos'
        value={resourceFilter}
        onChange={(event) => {
          const value = event.target.value as Resource | '';
          setResourceFilter(value);
          setActionFilter('');
        }}
        maxW={{ base: 'full', md: '220px' }}
      >
        {Resource.getValues().map((resource) => (
          <option key={resource} value={resource}>
            {Resource.translate(resource)}
          </option>
        ))}
      </Select>
      <Select
        placeholder='Todas as ações'
        value={actionFilter}
        onChange={(event) =>
          setActionFilter(event.target.value as PermissionAction | '')
        }
        maxW={{ base: 'full', md: '220px' }}
        disabled={!resourceFilter}
      >
        {actionOptions.map((action) => (
          <option key={action} value={action}>
            {PermissionAction.translate(action, resourceFilter as Resource)}
          </option>
        ))}
      </Select>
    </Flex>
  );
}

export default RoleFilters;
