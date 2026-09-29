import { AddIcon } from '@chakra-ui/icons';
import { Accordion, Box, Button, Flex, Skeleton, Text } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { RoleResponse } from '../../../models/http/responses/role.response.models';
import { UserCoreResponse } from '../../../models/http/responses/user.response.models';
import { ClassroomResponse } from '../../../models/http/responses/classroom.response.models';
import { CourseResponse } from '../../../models/http/responses/course.response.models';
import { BuildingResponse } from '../../../models/http/responses/building.response.models';
import { normalizeString } from '../../../utils/formatters';
import { FaUsersGear } from 'react-icons/fa6';
import RoleCard from '../RoleCard/RoleCard';
import Pager, { PAGE_SIZES } from '../Pager/Pager';

interface RolesTabProps {
  roles: RoleResponse[];
  users: UserCoreResponse[];
  classrooms: ClassroomResponse[];
  courses: CourseResponse[];
  buildings: BuildingResponse[];
  loading: boolean;
  search: string;
  refetchRoles: () => Promise<void>;
  addUserToRole: (role_id: number, user_id: number) => Promise<void>;
  removeUserFromRole: (role_id: number, user_id: number) => Promise<void>;
  onCreateRole: () => void;
  onEditRole: (role: RoleResponse) => void;
  onDeleteRole: (role: RoleResponse) => void;
}

function RolesTab({
  roles,
  users,
  classrooms,
  courses,
  buildings,
  loading,
  search,
  refetchRoles,
  addUserToRole,
  removeUserFromRole,
  onCreateRole,
  onEditRole,
  onDeleteRole,
}: RolesTabProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

  const filteredRoles = useMemo(() => {
    const query = normalizeString(search.trim());
    if (!query) return roles;
    return roles.filter((role) => normalizeString(role.name).includes(query));
  }, [roles, search]);

  const [prevFilteredRoles, setPrevFilteredRoles] = useState(filteredRoles);
  if (filteredRoles !== prevFilteredRoles) {
    setPrevFilteredRoles(filteredRoles);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedRoles = filteredRoles.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  return (
    <Flex direction={'column'} h={'full'} minH={0} gap={'16px'}>
      <Box minH={0} overflow={'auto'}>
        <Skeleton isLoaded={!loading}>
          {pagedRoles.length > 0 && (
            <Accordion
              allowToggle
              display={'flex'}
              flexDirection={'column'}
              gap={'12px'}
            >
              {pagedRoles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  users={users}
                  classrooms={classrooms}
                  courses={courses}
                  buildings={buildings}
                  loading={loading}
                  refetchRoles={refetchRoles}
                  addUserToRole={addUserToRole}
                  removeUserFromRole={removeUserFromRole}
                  onEdit={() => onEditRole(role)}
                  onRemove={() => onDeleteRole(role)}
                />
              ))}
            </Accordion>
          )}

          {roles.length === 0 && (
            <Flex
              direction={'column'}
              justify={'center'}
              align={'center'}
              maxW={'600px'}
              gap={'10px'}
              border={'1px solid'}
              borderColor={'uspolis.border'}
              borderRadius={'12px'}
              p={'40px 20px'}
            >
              <FaUsersGear size={'64px'} />
              <Text fontSize={'xl'} fontWeight={'bold'}>
                Nenhum papel cadastrado
              </Text>
              <Text textAlign={'center'} color={'uspolis.gray'}>
                Cadastre um papel para atribuir permissões e liberar acesso a
                recursos privados.
              </Text>
              <Button
                leftIcon={<AddIcon />}
                colorScheme={'blue'}
                onClick={onCreateRole}
              >
                Novo papel
              </Button>
            </Flex>
          )}

          {roles.length > 0 && filteredRoles.length === 0 && (
            <Flex
              direction={'column'}
              align={'center'}
              justify={'center'}
              p={'40px 20px'}
              gap={'8px'}
            >
              <Text fontWeight={'bold'}>Nenhum papel encontrado</Text>
              <Text color={'uspolis.gray'} fontSize={'13.5px'}>
                Nenhum papel corresponde a esse filtro.
              </Text>
            </Flex>
          )}
        </Skeleton>
      </Box>

      <Box flexShrink={0}>
        <Pager
          page={safePage}
          totalPages={totalPages}
          totalItems={filteredRoles.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </Box>
    </Flex>
  );
}

export default RolesTab;
