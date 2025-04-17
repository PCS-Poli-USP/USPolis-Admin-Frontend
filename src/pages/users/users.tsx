import { useContext, useEffect, useState } from 'react';
import * as C from '@chakra-ui/react';

import DataTable from '../../components/common/DataTable/dataTable.component';
import { appContext } from '../../context/AppContext';
import EditUserModal from './UserEditModal/user.edit.modal';
import Dialog from '../../components/common/Dialog/dialog.component';
import PageContent from '../../components/common/PageContent';
import { UserResponse } from '../../models/http/responses/user.response.models';
import { UpdateUser } from '../../models/http/requests/user.request.models';
import useUsersService from '../../hooks/API/services/useUsersService';
import { getUsersColumns } from './Tables/user.table';
import useCustomToast from '../../hooks/useCustomToast';

const Users = () => {
  const { loading, setLoading } = useContext(appContext);
  const usersService = useUsersService();
  const showToast = useCustomToast();

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [contextUser, setContextUser] = useState<UserResponse | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const columns = getUsersColumns({
    handleEditClick: handleEditButton,
    handleDeleteClick: handleDeleteButton,
  });

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const response = await usersService.list();
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        fetchUsers();
      }, 1000);
    }
  }

  function handleEditButton(user: UserResponse) {
    setContextUser(user);
    setEditModalOpen(true);
  }

  function handleDeleteButton(user: UserResponse) {
    setDeleteDialogOpen(true);
    setContextUser(user);
  }

  async function editUser(user_id: number, data: UpdateUser) {
    setLoading(true);
    try {
      await usersService.update(user_id, data);
      showToast('Sucesso', `Usuário editado!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(
        'Erro',
        `Erro ao editar usuário:\n${err.response.data.message}`,
        'error',
      );
      setLoading(false);
    }
    fetchUsers();
  }

  async function deleteUser(user_id: number) {
    setLoading(true);
    try {
      await usersService.deleteById(user_id);
      showToast('Sucesso', `Usuário deletado!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(
        'Erro',
        `Erro ao deletar usuário:\n${err.response.data.message}`,
        'error',
      );
      setLoading(false);
    }
    fetchUsers();
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
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setContextUser(null);
        }}
        formData={{
          buildings: contextUser?.buildings?.map((b) => ({
            label: b.name,
            value: b.id,
          })),
          is_admin: contextUser?.is_admin,
        }}
        otherData={{
          email: contextUser?.email,
        }}
        onSave={(form) => {
          editUser(contextUser!.id, {
            building_ids: form.buildings?.map((b) => b.value),
            is_admin: form.is_admin ? form.is_admin : false,
          });
        }}
      />
      <Dialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
        }}
        onConfirm={() => {
          deleteUser(contextUser!.id);
          setDeleteDialogOpen(false);
        }}
        title={`Deseja deletar o usuário "${contextUser?.name}"`}
      />
    </PageContent>
  );
};

export default Users;
