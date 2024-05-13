import { useContext, useEffect, useState } from 'react';
import * as C from '@chakra-ui/react';

import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';

import { ColumnDef } from '@tanstack/react-table';
import Navbar from 'components/common/navbar.component';
import UsersService from 'services/users.service';
import { User, EditUser } from 'models/database/user.model';
import DataTable from 'components/common/dataTable.component';
import { FilterBoolean } from 'utils/tanstackTableHelpers/tableFiltersFns';
import { appContext } from 'context/AppContext';
import EditUserModal from 'components/users/edit.modal';
import Dialog from 'components/common/dialog.component';
import RegisterUserModal, {
  RegisterUserFormValues,
} from 'components/users/register.modal';

const Users = () => {
  const { setLoading } = useContext(appContext);
  const usersService = new UsersService();

  const [users, setUsers] = useState<User[]>([]);
  const [contextUser, setContextUser] = useState<User | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);
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

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'username',
      header: 'Username',
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
      accessorFn: (row) => row.buildings.map((b) => b.name).join(', '),
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

  function handleCreateButton() {
    setRegisterModalOpen(true);
  }

  function handleEditButton(user: User) {
    setContextUser(user);
    setEditModalOpen(true);
  }

  function handleDeleteButton(user: User) {
    setDeleteDialogOpen(true);
    setContextUser(user);
  }

  async function registerUser(form: RegisterUserFormValues) {
    try {
      setLoading(true);
      const response = await usersService.create({
        name: form.name,
        email: form.email,
        username: form.username,
        is_admin: form.is_admin,
        building_ids: form.is_admin
          ? undefined
          : form.buildings.map((it) => it.value),
      });
      toastSuccess(`Usuário cadastrado!`);
    } catch (err: any) {
      toastError(`Erro ao cadastrar usuário:\n${err.response.data.message}`);
      console.error(err);
      setLoading(false);
    }
    fetchUsers();
  }

  async function editUser(data: EditUser, user_id: string) {
    setLoading(true);
    try {
      await usersService.update(data, user_id);
      toastSuccess(`Usuário editado!`);
    } catch (err: any) {
      console.error(err);
      toastError(`Erro ao editar usuário:\n${err.response.data.message}`);
      setLoading(false);
    }
    fetchUsers();
  }

  async function deleteUser(user_id: string) {
    setLoading(true);
    try {
      await usersService.delete(user_id);
      toastSuccess(`Usuário deletado!`);
    } catch (err: any) {
      console.error(err);
      toastError(`Erro ao deletar usuário:\n${err.response.data.message}`);
      setLoading(false);
    }
    fetchUsers();
  }

  return (
    <>
      <Navbar />
      <C.Flex paddingX={4} direction={'column'}>
        <C.Flex justifyContent={'space-between'} alignItems={'center'}>
          <C.Text fontSize='4xl' mb={4}>
            Usuários
          </C.Text>
          <C.Button onClick={handleCreateButton}>Cadastrar</C.Button>
        </C.Flex>
        <DataTable columns={columns} data={users} />
      </C.Flex>
      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        formData={{
          buildings: contextUser?.buildings.map((b) => ({
            label: b.name,
            value: b.id,
          })),
          is_admin: contextUser?.is_admin,
        }}
        otherData={{
          email: contextUser?.email,
          username: contextUser?.username,
        }}
        onSave={(form) => {
          editUser(
            {
              building_ids: form.buildings?.map((b) => b.value),
              is_admin: form.is_admin,
            },
            contextUser!.id,
          );
        }}
      />
      <RegisterUserModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSave={(form) => {
          registerUser(form);
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
        title={`Deseja deletar o usuário "${contextUser?.username}"`}
      />
    </>
  );
};

export default Users;
