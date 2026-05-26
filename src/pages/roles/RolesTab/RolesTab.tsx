import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { RoleResponse } from '../../../models/http/responses/role.response.models';
import RoleCard from './RoleCard/RoleCard';
import { FaUsersGear } from 'react-icons/fa6';

interface RolesTabProps {
  roles: RoleResponse[];
  handleOpenRoleModal: (role?: RoleResponse) => void;
}

function RolesTab({ roles, handleOpenRoleModal }: RolesTabProps) {
  return (
    <Flex w={'100%'} direction={'column'} justify={'center'} align={'center'}>
      <Flex w={'full'} justify={'flex-end'}>
        <Button
          leftIcon={<AddIcon />}
          hidden={roles.length === 0}
          onClick={() => handleOpenRoleModal()}
        >
          Novo Cargo
        </Button>
      </Flex>
      <SimpleGrid mt={4} columns={{ base: 1, md: 2, lg: 3 }} spacing={'20px'}>
        {roles.map((role) => (
          <RoleCard key={role.id} role={role} />
        ))}
      </SimpleGrid>
      {roles.length === 0 && (
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
            Nenhum cargo cadastrado
          </Text>
          <Text textAlign={'center'}>
            Parece que não há cargos cadastrados. Cadastre algum cargo para
            permissionar usuários e liberar acesso a recursos privados.
          </Text>
          <Button
            leftIcon={<AddIcon />}
            mt={'20px'}
            onClick={() => handleOpenRoleModal()}
          >
            Novo Cargo
          </Button>
        </Flex>
      )}
    </Flex>
  );
}

export default RolesTab;
