import { useState } from 'react';

import DataTable from '../../components/common/DataTable/dataTable.component';
import EditUserModal from './UserEditModal/user.edit.modal';
import PageContent from '../../components/common/PageContent';
import { UserCoreResponse } from '../../models/http/responses/user.response.models';
import { getUsersColumns } from './Tables/user.table';
import useUsers from '../../hooks/users/useUsers';
import useBuildings from '../../hooks/useBuildings';
import useGroups from '../../hooks/groups/useGroups';

const Users = () => {
  const { buildings, loading: loadingBuildings } = useBuildings();
  const { users, loading, getUsers } = useUsers();
  const { groups, loading: loadingGroups } = useGroups();

  const [selectedUser, setSelectedUser] = useState<UserCoreResponse>();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const columns = getUsersColumns({
    handleEditClick: handleEditButton,
    isLoading: loading || loadingBuildings || loadingGroups,
  });

  function handleEditButton(user: UserCoreResponse) {
    setSelectedUser(user);
    setEditModalOpen(true);
  }

  return (
    <PageContent>
      <DataTable loading={loading} columns={columns} data={users} />
      <EditUserModal
        groups={groups}
        buildings={buildings}
        user={selectedUser}
        isOpen={editModalOpen}
        refetch={() => {
          getUsers();
        }}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedUser(undefined);
        }}
      />
    </PageContent>
  );
};

export default Users;
