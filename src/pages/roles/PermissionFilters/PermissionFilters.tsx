import { Flex, Input, Select } from '@chakra-ui/react';
import { PermissionAction } from '../../../utils/enums/actions.enums';
import { Resource } from '../../../utils/enums/resources.enums';

interface PermissionFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  resourceFilter: Resource | '';
  setResourceFilter: (value: Resource | '') => void;
  actionFilter: PermissionAction | '';
  setActionFilter: (value: PermissionAction | '') => void;
}

function PermissionFilters({
  search,
  setSearch,
  resourceFilter,
  setResourceFilter,
  actionFilter,
  setActionFilter,
}: PermissionFiltersProps) {
  const actionOptions = resourceFilter
    ? PermissionAction.getValues(resourceFilter)
    : [];

  return (
    <Flex gap={'10px'} w={'full'} wrap={'wrap'}>
      <Input
        placeholder='Buscar por recurso ou ação'
        value={search}
        onChange={(event) => setSearch(event.target.value)}
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

export default PermissionFilters;
