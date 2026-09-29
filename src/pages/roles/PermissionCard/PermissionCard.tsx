/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Badge,
  Checkbox,
  Flex,
  IconButton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { PermissionResponse } from '../../../models/http/responses/permissions.response.models';
import { PermissionAction } from '../../../utils/enums/actions.enums';
import { Resource } from '../../../utils/enums/resources.enums';
import { LuPen, LuTrash } from 'react-icons/lu';
import { IPermissionForm } from '../PermissionForm/permission.form.interface';

interface PermissionCardProps {
  permission: PermissionResponse | IPermissionForm;
  create: boolean;
  update?: boolean;
  selectable?: boolean;
  isSelected?: boolean;
  readOnly?: boolean;
  onEdit?: (permission: PermissionResponse | IPermissionForm) => void;
  onRemove?: (permission: PermissionResponse | IPermissionForm) => void;
  onSelectChange?: (checked: boolean) => void;
  maxW?: string;
}

function PermissionCard({
  permission,
  create,
  update = false,
  selectable = false,
  isSelected = false,
  readOnly = false,
  onEdit,
  onRemove,
  onSelectChange,
  maxW = '400px',
}: PermissionCardProps) {
  const roleName = (permission as any).role_name as string | undefined;
  const parentName = (permission as any).parent_name as string | undefined;
  const resourceLabel =
    permission.resource_id === -1
      ? `Todos: ${Resource.translate(permission.resource)}`
      : permission.resource_name || 'Desconhecido';

  return (
    <Flex
      justify={'space-between'}
      align={'center'}
      w={'full'}
      maxW={maxW}
      border={'1px solid'}
      borderColor={'uspolis.border'}
      borderRadius={'9px'}
      p={'9px 12px'}
      gap={'10px'}
      wrap={'wrap'}
    >
      <Flex align={'center'} gap={'8px'} wrap={'wrap'} minW={0}>
        <Badge
          colorScheme={'blue'}
          fontSize={'10px'}
          letterSpacing={'0.03em'}
          textTransform={'uppercase'}
        >
          {Resource.translate(permission.resource)}
        </Badge>
        {create && (
          <Badge colorScheme={'green'} fontSize={'10px'}>
            Nova
          </Badge>
        )}
        <Text fontSize={'13.5px'} fontWeight={'semibold'}>
          {resourceLabel}
          {parentName && parentName !== resourceLabel && (
            <Text as={'span'} color={'uspolis.gray'} fontWeight={'normal'}>
              {` · ${parentName}`}
            </Text>
          )}
        </Text>
        <Flex gap={'4px'} wrap={'wrap'}>
          {permission.actions.map((action, index) => (
            <Tooltip
              key={index}
              label={PermissionAction.describe(action, permission.resource)}
              isDisabled={
                !PermissionAction.describe(action, permission.resource)
              }
            >
              <Badge colorScheme={'gray'} fontSize={'10px'}>
                {PermissionAction.translate(action, permission.resource)}
              </Badge>
            </Tooltip>
          ))}
        </Flex>
        {roleName && (
          <Text fontSize={'12px'} color={'uspolis.gray'}>
            {`via ${roleName}`}
          </Text>
        )}
      </Flex>
      {!readOnly && (
        <Flex gap={'4px'} flexShrink={0}>
          {selectable && (
            <Checkbox
              isChecked={isSelected}
              onChange={(event) => onSelectChange?.(event.target.checked)}
            />
          )}
          {!selectable && (update || create) && (
            <IconButton
              aria-label='edit'
              size={'xs'}
              variant={'outline'}
              icon={<LuPen />}
              colorScheme='yellow'
              onClick={() => onEdit?.(permission)}
            />
          )}
          {!selectable && (
            <IconButton
              aria-label='remove'
              size={'xs'}
              colorScheme='red'
              variant={'outline'}
              icon={<LuTrash />}
              onClick={() => onRemove?.(permission)}
            />
          )}
        </Flex>
      )}
    </Flex>
  );
}

export default PermissionCard;
