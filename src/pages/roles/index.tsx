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
import { useState } from 'react';
import { RoleResponse } from '../../models/http/responses/role.response.models';

function Roles() {
  const {
    permissions,
    loading: permissionsLoading,
    getAllPermissions,
  } = usePermissions(true);
  const { users } = useUsers(true);
  const { roles, getAllRoles, loading: rolesLoading } = useRoles(true);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [selectedRole, setSelectedRole] = useState<RoleResponse | undefined>(
    undefined,
  );

  return (
    <PageContent>
      <RoleModal
        isOpen={isOpen}
        onClose={onClose}
        isUpdate={!!selectedRole}
        handleClose={() => {
          onClose();
        }}
        handleSave={() => {}}
        permissions={permissions}
        loading={permissionsLoading || rolesLoading}
        refetch={getAllRoles}
        selectedRole={selectedRole}
      />
      <Tabs size={'md'}>
        <TabList>
          <Tab>Gerenciar Papeis</Tab>
          <Tab>Gerenciar Permissões</Tab>
          <Tab>Gerenciar Usuários</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <RolesTab
              roles={roles}
              handleOpenRoleModal={(role) => {
                setSelectedRole(role);
                onOpen();
              }}
            />
          </TabPanel>
          <TabPanel>
            <PermissionTab
              roles={roles}
              users={users}
              permissions={permissions}
              resetPermissions={getAllPermissions}
            />
          </TabPanel>
          <TabPanel>
            <UsersTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PageContent>
  );
}

export default Roles;
