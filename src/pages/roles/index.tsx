import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  Input,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, QuestionIcon } from '@chakra-ui/icons';
import PageContent from '../../components/common/PageContent';
import RolesTab from './RolesTab/RolesTab';
import UsersTab from './UsersTab/UsersTab';
import PermissionTab from './PermissionTab/PermissionTab';
import RoleModal from './RoleModal/RoleModal';
import HelperModal from './HelperModal/HelperModal';
import useRoles from '../../hooks/roles/useRoles';
import useUsers from '../../hooks/users/useUsers';
import useClassrooms from '../../hooks/classrooms/useClassrooms';
import useCourses from '../../hooks/courses/useCourses';
import useBuildings from '../../hooks/useBuildings';
import { RoleResponse } from '../../models/http/responses/role.response.models';
import Dialog from '../../components/common/Dialog/dialog.component';
import { Resource } from '../../utils/enums/resources.enums';

function Roles() {
  const {
    roles,
    loading: loadingRoles,
    getAllRoles,
    deleteRole,
    addUserToRole,
    removeUserFromRole,
  } = useRoles(true);
  const { users, loading: loadingUsers } = useUsers(true);
  const {
    classrooms,
    getAllClassrooms,
    loading: loadingClassrooms,
  } = useClassrooms(false);
  const { courses, getCourses, loading: loadingCourses } = useCourses(false);
  const {
    buildings,
    getAllBuildings,
    loading: loadingBuildings,
  } = useBuildings(false);

  useEffect(() => {
    getAllClassrooms();
    getCourses();
    getAllBuildings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [topTab, setTopTab] = useState(0);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isDialogOpen,
    onOpen: onDialogOpen,
    onClose: onDialogClose,
  } = useDisclosure();
  const {
    isOpen: isHelpOpen,
    onOpen: onHelpOpen,
    onClose: onHelpClose,
  } = useDisclosure();

  const [selectedRole, setSelectedRole] = useState<RoleResponse | undefined>(
    undefined,
  );

  const [roleSearch, setRoleSearch] = useState('');
  const [permSearch, setPermSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const loading =
    loadingRoles ||
    loadingUsers ||
    loadingClassrooms ||
    loadingCourses ||
    loadingBuildings;

  const stats = useMemo(() => {
    const permissionCount = roles.reduce(
      (sum, role) => sum + role.permissions.length,
      0,
    );
    const userWithRoleCount = users.filter((user) =>
      roles.some((role) => role.user_ids.includes(user.id)),
    ).length;
    return { roleCount: roles.length, permissionCount, userWithRoleCount };
  }, [roles, users]);

  function handleRemoveRole(role: RoleResponse) {
    setSelectedRole(role);
    onDialogOpen();
  }

  // PermissionsTab
  const SUB_TABS = Resource.getValues();
  const [subTabIndex, setSubTabIndex] = useState(0);

  return (
    <PageContent>
      <Dialog
        title={
          'Remover Papel' + (selectedRole ? ` '${selectedRole.name}'` : '')
        }
        warningText={
          'Tem certeza que deseja remover este papel? Esta ação não pode ser desfeita.'
        }
        isOpen={isDialogOpen}
        onClose={() => {
          setSelectedRole(undefined);
          onDialogClose();
        }}
        onConfirm={() => {
          if (selectedRole) deleteRole(selectedRole.id);
          setSelectedRole(undefined);
          onDialogClose();
        }}
      />
      <RoleModal
        isOpen={isOpen}
        onClose={onClose}
        isUpdate={!!selectedRole}
        handleClose={() => onClose()}
        handleSave={() => {}}
        loading={loading}
        refetch={getAllRoles}
        selectedRole={selectedRole}
        classrooms={classrooms}
        courses={courses}
        buildings={buildings}
      />

      <HelperModal isOpen={isHelpOpen} onClose={onHelpClose} />

      <Flex
        direction={'column'}
        h={'full'}
        minH={0}
        maxW={'1100px'}
        w={'100%'}
        mx={'auto'}
      >
        <Flex
          justify={'space-between'}
          align={'flex-start'}
          gap={'24px'}
          wrap={'wrap'}
          flexShrink={0}
        >
          <Box>
            <Text
              fontSize={'12px'}
              fontWeight={'medium'}
              letterSpacing={'0.06em'}
              textTransform={'uppercase'}
              color={'uspolis.blue'}
              opacity={0.75}
              mb={'4px'}
            >
              Administração
            </Text>
            <Flex align={'center'} gap={'8px'}>
              <Text
                fontSize={'26px'}
                fontWeight={'bold'}
                color={'uspolis.black'}
              >
                Papéis e permissões
              </Text>
              <Tooltip label={'O que significa cada permissão?'}>
                <IconButton
                  aria-label='ajuda'
                  icon={<QuestionIcon />}
                  size={'xs'}
                  borderRadius={'full'}
                  variant={'outline'}
                  onClick={onHelpOpen}
                />
              </Tooltip>
            </Flex>
            <Text
              fontSize={'14px'}
              color={'uspolis.gray'}
              mt={'6px'}
              maxW={'560px'}
            >
              Papéis agrupam permissões sobre salas, prédios e cursos. Atribua
              papéis a usuários para conceder acesso.
            </Text>
          </Box>

          <SimpleGrid columns={3} spacing={'20px'} pt={'4px'}>
            <Box textAlign={'right'}>
              <Text fontSize={'22px'} fontWeight={'bold'}>
                {stats.roleCount}
              </Text>
              <Text fontSize={'11.5px'} color={'uspolis.gray'}>
                papéis
              </Text>
            </Box>
            <Box textAlign={'right'}>
              <Text fontSize={'22px'} fontWeight={'bold'}>
                {stats.permissionCount}
              </Text>
              <Text fontSize={'11.5px'} color={'uspolis.gray'}>
                permissões
              </Text>
            </Box>
            <Box textAlign={'right'}>
              <Text fontSize={'22px'} fontWeight={'bold'}>
                {stats.userWithRoleCount}
              </Text>
              <Text fontSize={'11.5px'} color={'uspolis.gray'}>
                usuários com papel
              </Text>
            </Box>
          </SimpleGrid>
        </Flex>

        <Divider my={'20px'} flexShrink={0} />

        <Tabs
          index={topTab}
          onChange={setTopTab}
          variant={'unstyled'}
          display={'flex'}
          flexDirection={'column'}
          minH={0}
          flex={'1'}
          isLazy
        >
          <Flex
            justify={'space-between'}
            align={'center'}
            wrap={'wrap'}
            gap={'12px'}
            flexShrink={0}
          >
            <TabList
              bg={'uspolis.hover'}
              borderRadius={'12px'}
              p={'4px'}
              gap={'4px'}
              w={'fit-content'}
            >
              {['Papéis', 'Permissões', 'Usuários'].map((label) => (
                <Tab
                  key={label}
                  borderRadius={'9px'}
                  px={'22px'}
                  py={'9px'}
                  fontSize={'13.5px'}
                  fontWeight={'semibold'}
                  color={'uspolis.gray'}
                  _selected={{
                    bg: 'uspolis.white',
                    color: 'uspolis.text',
                    boxShadow: 'sm',
                  }}
                >
                  {label}
                </Tab>
              ))}
            </TabList>

            <Flex align={'center'} gap={'10px'} wrap={'wrap'}>
              {topTab === 0 && (
                <>
                  <Input
                    w={'240px'}
                    placeholder={'Filtrar por papel'}
                    value={roleSearch}
                    onChange={(e) => setRoleSearch(e.target.value)}
                  />
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme={'blue'}
                    onClick={() => {
                      setSelectedRole(undefined);
                      onOpen();
                    }}
                  >
                    Novo papel
                  </Button>
                </>
              )}
              {topTab === 1 && (
                <Box flexShrink={0}>
                  <Tabs
                    index={subTabIndex}
                    onChange={setSubTabIndex}
                    variant={'unstyled'}
                  >
                    <Flex
                      justify={'space-between'}
                      align={'center'}
                      wrap={'wrap'}
                      gap={'12px'}
                    >
                      <TabList
                        bg={'uspolis.hover'}
                        borderRadius={'12px'}
                        p={'4px'}
                        gap={'4px'}
                        w={'fit-content'}
                      >
                        {SUB_TABS.map((resource) => (
                          <Tab
                            key={resource}
                            borderRadius={'9px'}
                            px={'20px'}
                            py={'8px'}
                            fontSize={'13.5px'}
                            fontWeight={'semibold'}
                            color={'uspolis.gray'}
                            _selected={{
                              bg: 'uspolis.white',
                              color: 'uspolis.text',
                              boxShadow: 'sm',
                            }}
                          >
                            {Resource.translate(resource)}
                          </Tab>
                        ))}
                      </TabList>

                      <Input
                        w={'240px'}
                        placeholder={'Filtrar recurso'}
                        value={permSearch}
                        onChange={(e) => setPermSearch(e.target.value)}
                      />
                    </Flex>
                  </Tabs>

                  <Text hidden fontSize={'13px'} color={'uspolis.gray'} mt={'12px'}>
                    {'Acesso é concedido via papéis. '}
                    <Text
                      as={'span'}
                      color={'uspolis.text'}
                      textDecoration={'underline'}
                      cursor={'pointer'}
                      onClick={() => setTopTab(0)}
                    >
                      Editar em Papéis →
                    </Text>
                  </Text>
                </Box>
              )}
              {topTab === 2 && (
                <Input
                  w={'240px'}
                  placeholder={'Filtrar por nome ou email'}
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              )}
            </Flex>
          </Flex>

          <TabPanels mt={'20px'} minH={0} flex={'1'}>
            <TabPanel
              p={0}
              h={'full'}
              display={'flex'}
              flexDirection={'column'}
              minH={0}
            >
              <RolesTab
                roles={roles}
                users={users}
                classrooms={classrooms}
                courses={courses}
                buildings={buildings}
                loading={loading}
                search={roleSearch}
                refetchRoles={getAllRoles}
                addUserToRole={addUserToRole}
                removeUserFromRole={removeUserFromRole}
                onCreateRole={() => {
                  setSelectedRole(undefined);
                  onOpen();
                }}
                onEditRole={(role) => {
                  setSelectedRole(role);
                  onOpen();
                }}
                onDeleteRole={handleRemoveRole}
              />
            </TabPanel>
            <TabPanel
              p={0}
              h={'full'}
              display={'flex'}
              flexDirection={'column'}
              minH={0}
            >
              <PermissionTab
                roles={roles}
                users={users}
                classrooms={classrooms}
                courses={courses}
                buildings={buildings}
                loading={loading}
                search={permSearch}
                subTabIndex={subTabIndex}
              />
            </TabPanel>
            <TabPanel
              p={0}
              h={'full'}
              display={'flex'}
              flexDirection={'column'}
              minH={0}
            >
              <UsersTab
                roles={roles}
                users={users}
                loading={loading}
                search={userSearch}
                addUserToRole={addUserToRole}
                removeUserFromRole={removeUserFromRole}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </PageContent>
  );
}

export default Roles;
