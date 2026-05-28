import { Badge, Flex, IconButton, Text } from '@chakra-ui/react';
import { PermissionAction } from '../../../utils/enums/actions.enums';
import { LuPen, LuTrash } from 'react-icons/lu';
import { RoleResponse } from '../../../models/http/responses/role.response.models';
import { Resource } from '../../../utils/enums/resources.enums';
import moment from 'moment';

interface RoleCardProps {
  role: RoleResponse;
  onEdit: (role: RoleResponse) => void;
  onRemove: (role: RoleResponse) => void;
  maxW?: string;
}

function RoleCard({ role, onEdit, onRemove, maxW = '400px' }: RoleCardProps) {
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
        <Text fontWeight={'bold'}>{role.name}</Text>
        <Text fontSize={'sm'}>{role.description}</Text>
        <Flex direction={'column'} gap={'5px'}>
          <Text fontWeight={'bold'}>Recursos:</Text>
          {role.resources.map((resource, index) => (
            <Badge
              key={index}
              color={'green.500'}
              w={'fit-content'}
              borderRadius={'0.2rem'}
            >
              {Resource.translate(resource)}
            </Badge>
          ))}
          {role.resources.length === 0 && (
            <Text fontSize={'sm'}>Nenhum recurso associado</Text>
          )}
        </Flex>
        <Text fontWeight={'bold'}>Permissões ({role.permissions.length}):</Text>
        <Flex gap={'10px'} direction={'column'}>
          {role.permissions.map((permission, index) => {
            return (
              <Flex
                direction={'column'}
                key={`permission-${permission.id}-index-${index}`}
              >
                <Text>
                  {Resource.translate(permission.resource)}:
                  <b>{` ${permission.resource_name}`}</b>
                </Text>
                <Flex flexWrap={'wrap'} gap={'5px'}>
                  {permission.actions.map((action, index) => (
                    <Badge
                      key={index}
                      color={'blue.500'}
                      w={'fit-content'}
                      borderRadius={'0.2rem'}
                    >
                      {PermissionAction.translate(action, permission.resource)}
                    </Badge>
                  ))}
                </Flex>
              </Flex>
            );
          })}
          {role.permissions.length === 0 && (
            <Text fontSize={'sm'}>Nenhuma permissão associada</Text>
          )}
          <Flex gap={'10px'}>
            <Text
              fontSize={'sm'}
            >{`Atualizado em: ${moment(role.updated_at).format('DD/MM/YYYY [às] HH:mm')}`}</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex gap={'5px'}>
        <IconButton
          aria-label='edit'
          variant={'outline'}
          icon={<LuPen />}
          colorScheme='yellow'
          onClick={() => onEdit(role)}
        />
        <IconButton
          aria-label='remove'
          colorScheme='red'
          variant={'outline'}
          icon={<LuTrash />}
          onClick={() => onRemove(role)}
        />
      </Flex>
    </Flex>
  );
}

export default RoleCard;
