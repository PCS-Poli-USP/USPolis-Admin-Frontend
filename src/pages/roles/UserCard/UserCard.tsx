import { Badge, Button, Flex, IconButton, Text } from '@chakra-ui/react';
import { UserPermissionResponse } from '../../../models/http/responses/user.response.models';
import { LuPen } from 'react-icons/lu';
import { Resource } from '../../../utils/enums/resources.enums';

interface UserCardProps {
  user: UserPermissionResponse;
  onEdit: (user: UserPermissionResponse) => void;
  maxW?: string;
  maxH?: string;
  setPermissionsViewOnly: (viewOnly: boolean, label?: string) => void;
  setRolesViewOnly: (viewOnly: boolean, label?: string) => void;
}

function UserCard({
  user,
  onEdit,
  maxW = '400px',
  maxH = '250px',
  setPermissionsViewOnly,
  setRolesViewOnly,
}: UserCardProps) {
  return (
    <Flex
      direction={'column'}
      border={'1px solid'}
      padding={'1rem'}
      borderRadius={'0.5rem'}
      justify={'space-between'}
      alignSelf={'center'}
      w={'full'}
      h={'full'}
      maxW={maxW}
      maxH={maxH}
      boxShadow={'lg'}
      gap={'10px'}
      _hover={
        {
          // transform: 'scale(1.02)',
          // transition: 'all 0.2s ease-in-out',
          // opacity: 0.7,
        }
      }
    >
      <Flex
        justify={'space-between'}
        alignSelf={'center'}
        gap={'20px'}
        w={'full'}
      >
        <Flex direction={'column'} gap={'5px'}>
          <Text fontWeight={'bold'}>{user.name}</Text>
          <Text fontSize={'sm'}>{user.email}</Text>
        </Flex>

        <Flex gap={'5px'}>
          <IconButton
            aria-label='edit'
            variant={'outline'}
            icon={<LuPen />}
            colorScheme='yellow'
            onClick={() => onEdit(user)}
          />
        </Flex>
      </Flex>

      <Flex direction={'column'} gap={'20px'} justify={'space-between'}>
        <Flex direction={'column'} gap={'5px'}>
          <Text fontWeight={'bold'}>Recursos:</Text>
          {user.resources.map((resource, index) => (
            <Badge
              key={index}
              fontSize={'x-small'}
              color={'green.500'}
              w={'fit-content'}
              p={'0.3rem'}
              borderRadius={'0.5rem'}
            >
              {Resource.translate(resource)}
            </Badge>
          ))}
          {user.resources.length === 0 && (
            <Text fontSize={'sm'}>Nenhum recurso associado</Text>
          )}
        </Flex>
        <Flex
          gap={'10px'}
          direction={'row'}
          justify={'flex-start'}
          align={'center'}
        >
          <Button
            fontWeight={'bold'}
            w={'fit-content'}
            p={'0.3rem'}
            borderRadius={'0.5rem'}
            fontSize={'xs'}
            hidden={user.roles.length === 0 && user.permissions.length === 0}
            onClick={() => {
              setRolesViewOnly(true, user.name);
            }}
          >
            Ver Papeis ({user.roles.length})
          </Button>
          <Button
            fontWeight={'bold'}
            w={'fit-content'}
            p={'0.3rem'}
            borderRadius={'0.5rem'}
            fontSize={'xs'}
            hidden={user.permissions.length === 0 && user.roles.length === 0}
            onClick={() => {
              setPermissionsViewOnly(true, user.name);
            }}
          >
            Ver Permissões ({user.permissions.length})
          </Button>
          {user.permissions.length === 0 && (
            <Badge
              fontSize={'sm'}
              colorScheme='gray'
              borderRadius={'0.5rem'}
              p={'0.3rem'}
              h={'40px'}
              alignContent={'center'}
            >
              Nenhuma permissão ou papel associado
            </Badge>
          )}
          {/* <Text fontSize={'sm'}>
            {`Atualizado em: ${moment(user.updated_at).format('DD/MM/YYYY [às] HH:mm')}`}
          </Text> */}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default UserCard;
