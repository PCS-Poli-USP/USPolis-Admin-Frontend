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
          {/* The implied actions count as granted (the backend applies
              them), so older roles show them too, outlined. */}
          {PermissionAction.withImplied(permission.actions).map((action) => {
            const impliedBy = permission.actions.includes(action)
              ? undefined
              : PermissionAction.impliedBy(action, permission.actions);
            const label = impliedBy
              ? `Incluída por "${PermissionAction.translate(impliedBy, permission.resource)}"`
              : PermissionAction.describe(action, permission.resource);
            return (
              <Tooltip key={action} label={label} isDisabled={!label}>
                <Badge
                  colorScheme={'gray'}
                  variant={impliedBy ? 'outline' : 'subtle'}
                  fontSize={'10px'}
                >
                  {PermissionAction.translate(action, permission.resource)}
                </Badge>
              </Tooltip>
            );
          })}
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
              aria-label='Editar permissão'
              size={{ base: 'sm', md: 'xs' }}
              variant={'outline'}
              icon={<LuPen />}
              colorScheme='yellow'
              onClick={() => onEdit?.(permission)}
            />
          )}
          {!selectable && (
            <IconButton
              aria-label='Remover permissão'
              size={{ base: 'sm', md: 'xs' }}
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
