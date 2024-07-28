// import useCustomToast from 'hooks/useCustomToast';
// import { CreateUser } from 'models/common/user.common.model';
// import { UpdateUser } from 'models/http/requests/user.request.models';

// import { UserResponse } from 'models/http/responses/user.response.models';
// import { useCallback, useEffect, useState } from 'react';
// import UsersService from 'services/api/users.service';
// import { sortUsersResponse } from 'utils/users/users.sorter';


// const service = new UsersService();

// const useUsers = () => {
//   const [loading, setLoading] = useState(false);
//   const [users, setUsers] = useState<UserResponse[]>([]);

//   const showToast = useCustomToast();

//   const getUsers = useCallback(async () => {
//     setLoading(true);
//     await service
//       .list()
//       .then((response) => {
//         setUsers(response.data.sort(sortUsersResponse));
//       })
//       .catch((error) => {
//         showToast('Erro', 'Erro ao carregar usuários', 'error');
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [showToast]);

//   const createUser = useCallback(
//     async (data: CreateUser) => {
//       setLoading(true);
//       await service
//         .create(data)
//         .then((response) => {
//           showToast(
//             'Sucesso',
//             `Usuário ${data.name} criado com sucesso!`,
//             'success',
//           );
//           getUsers();
//         })
//         .catch((error) => {
//           showToast('Erro', `Erro ao criar reserva: ${error}`, 'error');
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     },
//     [getUsers, showToast],
//   );

//   const updateUser = useCallback(
//     async (id: number, data: UpdateUser) => {
//       setLoading(true);
//       await service
//         .update(id, data)
//         .then((response) => {
//           showToast('Sucesso', `Reserva atualizado com sucesso!`, 'success');
//           getUsers();
//         })
//         .catch((error) => {
//           showToast(
//             'Erro',
//             `Erro ao atualizar o usuário: ${error}`,
//             'error',
//           );
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     },
//     [getUsers, showToast],
//   );

//   const deleteUser = useCallback(
//     async (id: number) => {
//       setLoading(true);
//       await service
//         .delete(id)
//         .then((response) => {
//           showToast('Sucesso!', 'Sucesso ao remover usuário', 'success');

//           getUsers();
//         })
//         .catch((error) => {
//           showToast('Erro!', 'Erro ao remover usuário', 'error');
//           console.log(error);
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     },
//     [getUsers, showToast],
//   );

//   useEffect(() => {
//     getUsers();
//   }, [getUsers]);

//   return {
//     loading,
//     users,
//     getUsers,
//     createUser,
//     updateUser,
//     deleteUser,
//   };
// };

// export default useUsers;
export default 10;