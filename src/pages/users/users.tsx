import React, { useEffect } from 'react';
import * as C from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import Navbar from 'components/common/navbar.component';
import UsersService from 'services/users.service';
import { User, CreateUser } from 'models/user.model';
import DataTable from 'components/common/dataTable.component';
import { FilterBoolean } from 'utils/tanstackTableHelpers/tableFiltersFns';

const Users = () => {
  const usersService = new UsersService();

  const [users, setUsers] = React.useState<User[]>([]);

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
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await usersService.list();
      console.log(response.data);
      setUsers(response.data);
    } catch (err) {
      console.log('err');
      console.error(err);
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
        </C.Flex>
        <DataTable columns={columns} data={users} />
      </C.Flex>
    </>
  );
};

export default Users;
