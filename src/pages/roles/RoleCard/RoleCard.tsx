import { Badge, Button, Flex, IconButton, Text } from '@chakra-ui/react';
import { LuPen, LuTrash } from 'react-icons/lu';
import { RoleResponse } from '../../../models/http/responses/role.response.models';
import { Resource } from '../../../utils/enums/resources.enums';
import moment from 'moment';

interface RoleCardProps {
  role: RoleResponse;
  onEdit: (role: RoleResponse) => void;
  onRemove: (role: RoleResponse) => void;
  setPermissionsViewOnly: (viewOnly: boolean, label?: string) => void;
  maxW?: string;
  maxH?: string;
}

function RoleCard({
  role,
  onEdit,
  onRemove,
  setPermissionsViewOnly,
  maxW = '400px',
  maxH = '250px',
}: RoleCardProps) {
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
          <Text fontWeight={'bold'}>{role.name}</Text>
          <Text fontSize={'sm'}>
            {role.description || 'Nenhuma descrição disponível'}
          </Text>
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

      <Flex direction={'column'} gap={'20px'} justify={'space-between'}>
        <Flex direction={'column'} gap={'5px'}>
          <Text fontWeight={'bold'}>Recursos:</Text>
          <Flex gap={'5px'} wrap={'wrap'}>
            {role.resources.map((resource, index) => (
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
          </Flex>
          {role.resources.length === 0 && (
            <Text fontSize={'sm'}>Nenhum recurso associado</Text>
          )}
        </Flex>
        <Flex
          gap={'10px'}
          direction={'row'}
          justify={'space-between'}
          align={'center'}
        >
          <Button
            fontWeight={'bold'}
            w={'fit-content'}
            p={'0.3rem'}
            borderRadius={'0.5rem'}
            fontSize={'xs'}
            hidden={role.permissions.length === 0}
            onClick={() => setPermissionsViewOnly(true, role.name)}
          >
            Ver Permissões ({role.permissions.length})
          </Button>
          {role.permissions.length === 0 && (
            <Badge
              fontSize={'sm'}
              colorScheme='orange'
              borderRadius={'0.5rem'}
              p={'0.3rem'}
              h={'40px'}
              alignContent={'center'}
            >
              Nenhuma permissão associada
            </Badge>
          )}
          <Text fontSize={'sm'}>
            {`Atualizado em: ${moment(role.updated_at).format('DD/MM/YYYY [às] HH:mm')}`}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default RoleCard;
