/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge, Checkbox, Flex, IconButton, Text } from '@chakra-ui/react';
import { PermissionResponse } from '../../../models/http/responses/permissions.response.models';
import { PermissionAction } from '../../../utils/enums/actions.enums';
import { Resource } from '../../../utils/enums/resources.enums';
import { LuPen, LuTrash } from 'react-icons/lu';
import { IPermissionForm } from '../PermissionForm/permission.form.interface';

interface PermissionCardProps {
  permission: PermissionResponse | IPermissionForm;
  create: boolean;
  selectable?: boolean;
  isSelected?: boolean;
  onEdit?: (permission: PermissionResponse | IPermissionForm) => void;
  onRemove?: (permission: PermissionResponse | IPermissionForm) => void;
  onSelectChange?: (checked: boolean) => void;
  maxW?: string;
}

function PermissionCard({
  permission,
  create,
  selectable = false,
  isSelected = false,
  onEdit,
  onRemove,
  onSelectChange,
  maxW = '400px',
}: PermissionCardProps) {
  const userName = (permission as any).user_name as string | undefined;
  const userEmail = (permission as any).user_email as string | undefined;
  const roleName = (permission as any).role_name as string | undefined;
  return (
    <Flex
      border={'1px solid'}
      padding={'1rem'}
      borderRadius={'0.5rem'}
      justify={'space-between'}
      alignSelf={'center'}
      w={'full'}
      maxW={maxW}
      boxShadow={'lg'}
      _hover={{
        boxShadow: 'lg',
        transform: 'scale(1.02)',
        transition: 'all 0.2s ease-in-out',
        opacity: 0.7,
      }}
    >
      <Flex direction={'column'} gap={'5px'}>
        <Flex align={'center'} gap={'10px'}>
          <Text fontWeight={'bold'}>
            {Resource.translate(permission.resource)}:{' '}
          </Text>
          {create && <Badge colorScheme='green'>Nova</Badge>}
        </Flex>
        <Flex gap={'5px'} flexWrap={'wrap'}>
          {permission.actions.map((action, index) => (
            <Badge key={index} color={'blue.500'}>
              {PermissionAction.translate(action, permission.resource)}
            </Badge>
          ))}
        </Flex>
        <Text>
          <b>Recurso: </b> {`${permission.resource_name || 'Desconhecido'}`}
        </Text>
        {userName ? (
          <Text
            borderRadius={'1rem'}
            // padding={'0.1rem 0.5rem'}
          >
            <b>Usuário: </b>{' '}
            {`${userName}${userEmail ? ` (${userEmail})` : ''}`}
          </Text>
        ) : null}
        {roleName ? (
          <Text
            borderRadius={'1rem'}
            // padding={'0.1rem 0.5rem'}
          >
            <b>Cargo: </b>
            {`${roleName}`}
          </Text>
        ) : null}
      </Flex>
      <Flex gap={'5px'}>
        {selectable && (
          <Checkbox
            isChecked={isSelected}
            size={'lg'}
            onChange={(event) => onSelectChange?.(event.target.checked)}
          />
        )}
        {!selectable && create && (
          <IconButton
            aria-label='edit'
            variant={'outline'}
            icon={<LuPen />}
            colorScheme='yellow'
            onClick={() => onEdit?.(permission)}
          />
        )}
        {!selectable && (
          <IconButton
            aria-label='remove'
            colorScheme='red'
            variant={'outline'}
            icon={<LuTrash />}
            onClick={() => onRemove?.(permission)}
          />
        )}
      </Flex>
    </Flex>
  );
}

export default PermissionCard;
