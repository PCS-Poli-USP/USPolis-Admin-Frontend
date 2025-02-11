import { useContext, useEffect, useState } from 'react';
import * as C from '@chakra-ui/react';

import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';

import { ColumnDef } from '@tanstack/react-table';
import DataTable from 'components/common/DataTable/dataTable.component';
import { FilterBoolean } from 'utils/tanstackTableHelpers/tableFiltersFns';
import { appContext } from 'context/AppContext';
import EditUserModal from 'components/users/edit.modal';
import Dialog from 'components/common/Dialog/dialog.component';
import PageContent from 'components/common/PageContent';
import { UserResponse } from 'models/http/responses/user.response.models';
import { UpdateUser } from 'models/http/requests/user.request.models';
import useUsersService from 'hooks/API/services/useUsersService';

const Users = () => {
  const { loading, setLoading } = useContext(appContext);
  const usersService = useUsersService();

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [contextUser, setContextUser] = useState<UserResponse | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const toast = C.useToast();
  const toastSuccess = (message: string) => {
    toast({
      position: 'top-left',
      title: 'Sucesso!',
      description: message,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  const toastError = (message: string) => {
    toast({
      position: 'top-left',
      title: 'Erro!',
      description: message,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const columns: ColumnDef<UserResponse>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'is_admin',
      header: 'Admin',
      meta: { isBoolean: true },
      filterFn: FilterBoolean,
    },
    {
      accessorKey: 'updated_at',
      header: 'Atualizado em',
    },
    {
      accessorKey: 'created_by',
      header: 'Criado por',
    },
    {
      accessorFn: (row) => row.buildings?.map((b) => b.name).join(', '),
      header: 'Prédios',
    },
    {
      id: 'options',
      header: 'Opções',
      cell: ({ row }) => (
        <C.HStack spacing='0px' width='fit-content'>
          <C.Tooltip label='Editar'>
            <C.IconButton
              colorScheme='yellow'
              size='xs'
              variant='ghost'
              aria-label='editar-usuaio'
              icon={<BsFillPenFill />}
              onClick={() => handleEditButton(row.original)}
            />
          </C.Tooltip>

          <C.Tooltip label='Deletar'>
            <C.IconButton
              colorScheme='red'
              size='xs'
              variant='ghost'
              aria-label='deletar-usuario'
              icon={<BsFillTrashFill />}
              onClick={() => handleDeleteButton(row.original)}
            />
          </C.Tooltip>
        </C.HStack>
      ),
    },
  ];

  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const response = await usersService.list();
      console.log(response.data);
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
      toastSuccess(`Usuário editado!`);
    } catch (err: any) {
      console.error(err);
      toastError(`Erro ao editar usuário:\n${err.response.data.message}`);
      setLoading(false);
    }
    fetchUsers();
  }

  async function deleteUser(user_id: number) {
    setLoading(true);
    try {
      await usersService.deleteById(user_id);
      toastSuccess(`Usuário deletado!`);
    } catch (err: any) {
      console.error(err);
      toastError(`Erro ao deletar usuário:\n${err.response.data.message}`);
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
        onClose={() => setEditModalOpen(false)}
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
