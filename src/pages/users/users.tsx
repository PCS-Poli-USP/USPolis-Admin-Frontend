import React, { useContext, useEffect, useState } from 'react';
import * as C from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import Navbar from 'components/common/navbar.component';
import UsersService from 'services/users.service';
import { User, CreateUser, EditUser } from 'models/user.model';
import DataTable from 'components/common/dataTable.component';
import { FilterBoolean } from 'utils/tanstackTableHelpers/tableFiltersFns';
import { appContext } from 'context/AppContext';
import { FaEllipsisV } from 'react-icons/fa';
import EditUserModal from 'components/users/edit.modal';
import Dialog from 'components/common/dialog.component';
import RegisterUser from './registerUser';
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

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
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
      accessorKey: 'isAdmin',
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
      meta: { isNumeric: true },
      cell: ({ row }) => (
        <C.Menu>
          <C.MenuButton
            as={C.IconButton}
            aria-label='Options'
            icon={<C.Icon as={FaEllipsisV} />}
            variant='ghost'
          />
          <C.MenuList>
            <C.MenuItem onClick={() => handleEditButton(row.original)}>
              Editar
            </C.MenuItem>
            <C.MenuItem onClick={() => handleDeleteButton(row.original)}>
              Deletar
            </C.MenuItem>
          </C.MenuList>
        </C.Menu>
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
        email: form.email,
        username: form.username,
        isAdmin: form.isAdmin,
        building_ids: form.isAdmin
          ? undefined
          : form.buildings.map((it) => it.value),
      });
      fetchUsers();
    } catch (err) {
      alert('Erro ao cadastrar usuário!');
      console.error(err);
      setLoading(false);
    }
  }

  async function editUser(data: EditUser, user_id: string) {
    setLoading(true);
    try {
      await usersService.update(data, user_id);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      alert(`Erro ao editar usuário:\n${err.response.data.message}`);
      setLoading(false);
    }
  }

  async function deleteUser(user_id: string) {
    setLoading(true);
    try {
      await usersService.delete(user_id);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      alert(`Erro ao deletar usuário:\n${err.response.data.message}`);
      setLoading(false);
    }
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
          isAdmin: contextUser?.isAdmin,
        }}
        otherData={{
          email: contextUser?.email,
          username: contextUser?.username,
        }}
        onSave={(form) => {
          editUser(
            {
              building_ids: form.buildings?.map((b) => b.value),
              isAdmin: form.isAdmin,
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
