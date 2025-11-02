import { useState } from 'react';
import * as C from '@chakra-ui/react';

import DataTable from '../../components/common/DataTable/dataTable.component';
import EditUserModal from './UserEditModal/user.edit.modal';
import Dialog from '../../components/common/Dialog/dialog.component';
import PageContent from '../../components/common/PageContent';
import { UserResponse } from '../../models/http/responses/user.response.models';
import { getUsersColumns } from './Tables/user.table';
import useUsers from '../../hooks/users/useUsers';
import useBuildings from '../../hooks/useBuildings';
import useGroups from '../../hooks/groups/useGroups';

const Users = () => {
  const { buildings, loading: loadingBuildings } = useBuildings();
  const { users, loading, deleteUser, getUsers } = useUsers();
  const { groups, loading: loadingGroups } = useGroups();

  const [selectedUser, setSelectedUser] = useState<UserResponse>();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const columns = getUsersColumns({
    handleEditClick: handleEditButton,
    handleDeleteClick: handleDeleteButton,
    isLoading: loading || loadingBuildings || loadingGroups,
  });

  function handleEditButton(user: UserResponse) {
    setSelectedUser(user);
    setEditModalOpen(true);
  }

  function handleDeleteButton(user: UserResponse) {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  }

  return (
    <PageContent>
      <C.Flex justifyContent={'space-between'} alignItems={'center'}>
        <C.Text fontSize='4xl' mb={4}>
          Usuários
        </C.Text>
      </C.Flex>
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
      <Dialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
        }}
        onConfirm={() => {
          if (!selectedUser) return;
          deleteUser(selectedUser.id);
          setDeleteDialogOpen(false);
        }}
        title={`Deseja deletar o usuário "${selectedUser?.name}"`}
      />
    </PageContent>
  );
};

export default Users;
