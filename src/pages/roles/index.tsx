import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
} from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import RolesTab from './RolesTab/RolesTab';
import UsersTab from './UsersTab/UsersTab';
import PermissionTab from './PermissionTab/PermissionTab';
import RoleModal from './RoleModal/RoleModal';
import usePermissions from '../../hooks/permissions/usePermissions';
import useUsers from '../../hooks/users/useUsers';
import useRoles from '../../hooks/roles/useRoles';
import { useEffect, useState } from 'react';
import { RoleResponse } from '../../models/http/responses/role.response.models';
import Dialog from '../../components/common/Dialog/dialog.component';
import { UserPermissionResponse } from '../../models/http/responses/user.response.models';
import { PermissionResponse } from '../../models/http/responses/permissions.response.models';

function Roles() {
  const {
    permissions,
    loading: permissionsLoading,
    getAllPermissions,
  } = usePermissions(true);
  const { loading: loadingUsers, getUsersWithPermissions } = useUsers(false);
  const {
    roles,
    getAllRoles,
    loading: rolesLoading,
    deleteRole,
  } = useRoles(true);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isDialogOpen,
    onOpen: onDialogOpen,
    onClose: onDialogClose,
  } = useDisclosure();

  const [tabIndex, setTabIndex] = useState(0);
  const [usersWithPermissions, setUsersWithPermissions] = useState<
    UserPermissionResponse[]
  >([]);
  const [selectedRole, setSelectedRole] = useState<RoleResponse | undefined>(
    undefined,
  );
  const [permissionsViewOnlyActive, setPermissionsViewOnlyActive] =
    useState(false);
  const [permissionsViewOnlyLabel, setPermissionsViewOnlyLabel] =
    useState('Permissões');
  const [permissionsViewOnlyPermissions, setPermissionsViewOnlyPermissions] =
    useState<PermissionResponse[]>([]);

  const [rolesViewOnlyActive, setRolesViewOnlyActive] = useState(false);
  const [rolesViewOnlyLabel, setRolesViewOnlyLabel] = useState('Papéis');
  const [rolesViewOnlyRoles, setRolesViewOnlyRoles] = useState<RoleResponse[]>(
    [],
  );

  function handleRemoveRole(role: RoleResponse) {
    setSelectedRole(role);
    onDialogOpen();
  }

  const fetchUsersWithPermissions = async () => {
    const users = await getUsersWithPermissions();
    setUsersWithPermissions(users);
  };

  async function fetchData() {
    await Promise.all([
      getAllPermissions(),
      getAllRoles(),
      fetchUsersWithPermissions(),
    ]);
  }

  useEffect(() => {
    fetchUsersWithPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadingData = permissionsLoading || rolesLoading || loadingUsers;

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
          if (selectedRole) {
            deleteRole(selectedRole.id);
          }

          setSelectedRole(undefined);
          onDialogClose();
        }}
      />
      <RoleModal
        isOpen={isOpen}
        onClose={onClose}
        isUpdate={!!selectedRole}
        handleClose={() => {
          onClose();
        }}
        handleSave={() => {}}
        loading={loadingData}
        refetch={getAllRoles}
        selectedRole={selectedRole}
      />
      <Tabs
        size={'md'}
        index={tabIndex}
        onChange={(index) => setTabIndex(index)}
      >
        <TabList>
          <Tab>Gerenciar Papeis</Tab>
          <Tab>Gerenciar Permissões</Tab>
          <Tab>Gerenciar Usuários</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <RolesTab
              roles={roles}
              loading={rolesLoading}
              handleOpenRoleModal={(role) => {
                setSelectedRole(role);
                onOpen();
              }}
              handleRemoveRole={handleRemoveRole}
              viewOnly={rolesViewOnlyActive}
              setViewOnly={setRolesViewOnlyActive}
              viewOnlyLabel={rolesViewOnlyLabel}
              viewOnlyRoles={rolesViewOnlyRoles}
              setPermissionsViewOnly={(viewOnly, permissions, label) => {
                setPermissionsViewOnlyActive(viewOnly);
                setPermissionsViewOnlyLabel(label || '');
                setPermissionsViewOnlyPermissions(permissions);
                setTabIndex(1);
              }}
            />
          </TabPanel>
          <TabPanel>
            <PermissionTab
              roles={roles}
              permissions={permissions}
              resetPermissions={fetchData}
              viewOnly={permissionsViewOnlyActive}
              setViewOnly={setPermissionsViewOnlyActive}
              viewOnlyLabel={permissionsViewOnlyLabel}
              viewOnlyPermissions={permissionsViewOnlyPermissions}
            />
          </TabPanel>
          <TabPanel>
            <UsersTab
              users={usersWithPermissions}
              loading={loadingData}
              setPermissionsViewOnly={(viewOnly, permissions, label) => {
                setPermissionsViewOnlyActive(viewOnly);
                setPermissionsViewOnlyLabel(label || '');
                setPermissionsViewOnlyPermissions(permissions);
                setTabIndex(1);
              }}
              setRolesViewOnly={(viewOnly, roles, label) => {
                setRolesViewOnlyActive(viewOnly);
                setRolesViewOnlyLabel(label || '');
                setRolesViewOnlyRoles(roles);
                setTabIndex(0);
              }}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PageContent>
  );
}

export default Roles;
