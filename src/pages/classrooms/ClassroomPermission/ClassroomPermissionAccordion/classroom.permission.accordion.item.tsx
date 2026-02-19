import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  SimpleGrid,
  Flex,
  Icon,
  Text,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  IconButton,
} from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa';
import TooltipSelect from '../../../../components/common/TooltipSelect';
import { UserCoreResponse } from '../../../../models/http/responses/user.response.models';
import { useState } from 'react';
import { ClassroomPermissionType } from '../../../../utils/enums/classroomPermissionType.enum';
import { CloseIcon } from '@chakra-ui/icons';
import { ClassroomPermissionByClassroomResponse } from '../../../../models/http/responses/classroomPermission.response.models';
import useClassroomPermissions from '../../../../hooks/classroomPermissions/useClassroomPermissions';
import { LuPen, LuTrash } from 'react-icons/lu';
import { Tooltip } from '@mui/material';

interface ClassroomPermissionAccordionItemProps {
  users: UserCoreResponse[];
  classroomPermissions: ClassroomPermissionByClassroomResponse;
  refetch: () => void;
  loading: boolean;
}

function ClassroomPermissionAccordionItem({
  users,
  classroomPermissions,
  refetch,
}: ClassroomPermissionAccordionItemProps) {
  const {
    createClassroomPermission,
    updateClassroomPermission,
    deleteClassroomPermission,
  } = useClassroomPermissions(false);

  const [userPermissionMap] = useState<Map<number, ClassroomPermissionType[]>>(
    new Map(
      classroomPermissions.users_permissioned.map((u) => [
        u.user_id,
        u.permissions,
      ]),
    ),
  );
  const [permissionedUsersIds] = useState<Set<number>>(
    new Set(classroomPermissions.users_permissioned.map((u) => u.user_id)),
  );
  const unpermissionedUsers = users.filter(
    (user) => !permissionedUsersIds.has(user.id),
  );

  // Form states
  const [selectedUser, setSelectedUser] = useState<UserCoreResponse | null>(
    null,
  );
  const [selectedPermissions, setSelectedPermissions] = useState<
    ClassroomPermissionType[]
  >([]);
  const [isEditing, setIsEditing] = useState(false);

  async function handleAddClick(
    user_id: number,
    classroom_id: number,
    permissions: ClassroomPermissionType[],
  ) {
    await createClassroomPermission({
      user_id,
      classroom_id,
      permissions,
    });
    refetch();
  }

  async function handleDeleteClick(permission_id: number) {
    await deleteClassroomPermission(permission_id);
    refetch();
  }

  async function handleEditClick(
    permission_id: number,
    new_permissions: ClassroomPermissionType[],
  ) {
    setIsEditing(false);
    await updateClassroomPermission(permission_id, {
      permissions: new_permissions,
    });
    refetch();
  }

  const permissionedUsers = users.filter((user) =>
    permissionedUsersIds.has(user.id),
  );

  return (
    <AccordionItem>
      <AccordionButton>
        <Box as='span' flex='1' textAlign='left' fontWeight={'bold'}>
          {classroomPermissions.building_name} -{' '}
          {classroomPermissions.classroom_name}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4} minHeight={'300px'}>
        <Divider mb={2} borderColor={'uspolis.blue'} />
        <Flex
          flexDirection={'row'}
          mb={'5px'}
          justify={'flex-start'}
          align={'center'}
          gap={'20px'}
        >
          <Text fontWeight={'bold'}>Usuário:</Text>
          <Box w={'300px'}>
            <TooltipSelect
              isClearable
              value={
                selectedUser
                  ? { label: selectedUser.name, value: selectedUser.id }
                  : null
              }
              placeholder={'Permicionar usuário...'}
              options={unpermissionedUsers.map((user) => ({
                label: `${user.name} (${user.email})`,
                value: user.id,
              }))}
              onChange={(value) => {
                if (value) {
                  setSelectedUser(
                    users.find((user) => user.id === value.value) || null,
                  );
                }
                if (!value) {
                  setSelectedUser(null);
                }
              }}
            />
          </Box>
          {selectedUser && (
            <>
              <Text fontWeight={'bold'}>Permissões:</Text>
              <Box w={'300px'}>
                <TooltipSelect
                  isMulti
                  placeholder={'Selecione as permissões'}
                  options={ClassroomPermissionType.getValues().map(
                    (permission) => ({
                      label: ClassroomPermissionType.translate(permission),
                      value: permission,
                    }),
                  )}
                  value={selectedPermissions.map((val) => ({
                    label: ClassroomPermissionType.translate(val),
                    value: val,
                  }))}
                  onChange={(value) => {
                    if (!value) {
                      setSelectedPermissions([]);
                    }
                    if (value) {
                      setSelectedPermissions(
                        value.map((v) => v.value as ClassroomPermissionType),
                      );
                    }
                  }}
                />
              </Box>
              <Button
                onClick={() => {
                  if (isEditing) {
                    const user_permissions =
                      classroomPermissions.users_permissioned.find(
                        (val) => val.user_id == selectedUser.id,
                      );
                    if (user_permissions) {
                      handleEditClick(
                        user_permissions.permission_id,
                        selectedPermissions,
                      );
                    }
                  }

                  if (!isEditing) {
                    handleAddClick(
                      selectedUser.id,
                      classroomPermissions.classroom_id,
                      selectedPermissions,
                    );
                  }
                }}
                disabled={selectedPermissions.length == 0}
              >
                {isEditing ? 'Salvar' : 'Adicionar'}
              </Button>
            </>
          )}
        </Flex>
        <Divider mb={'20px'} borderColor={'uspolis.blue'} />

        {permissionedUsersIds.size > 0 && (
          <SimpleGrid w={'full'} minChildWidth={'250px'} spacing={'15px'}>
            {permissionedUsers.map((userPermissioned, index) => (
              <Flex key={index} direction={'column'} gap={'5px'}>
                <Flex justify={'flex-start'} align={'center'} gap={'10px'}>
                  <Icon boxSize={'20px'} as={FaUser} />
                  <Text
                    maxW={'250px'}
                    h={'50px'}
                    overflowX={'hidden'}
                    textOverflow={'ellipsis'}
                    alignContent={'center'}
                  >
                    {`${userPermissioned.name} (${userPermissioned.email})`}
                  </Text>
                  <Flex direction={'column'}>
                    <Tooltip title='Editar permissões' placement='top'>
                      <IconButton
                        aria-label='edit-user-permissions'
                        icon={<LuPen />}
                        colorScheme='yellow'
                        variant='ghost'
                        size={'sm'}
                        onClick={() => {
                          setIsEditing(true);
                          const permissions = userPermissionMap.get(
                            userPermissioned.id,
                          );
                          setSelectedUser(userPermissioned);
                          setSelectedPermissions(permissions || []);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title='Remover TODAS permissões' placement='top'>
                      <IconButton
                        aria-label='remove-user-permissions'
                        icon={<LuTrash />}
                        colorScheme='red'
                        variant='ghost'
                        size={'sm'}
                        onClick={() => {
                          const user_permissions =
                            classroomPermissions.users_permissioned.find(
                              (val) => val.user_id == userPermissioned.id,
                            );

                          if (user_permissions) {
                            handleDeleteClick(user_permissions.permission_id);
                          }
                        }}
                      />
                    </Tooltip>
                  </Flex>
                </Flex>
                <Flex gap={'5px'}>
                  {userPermissionMap
                    .get(userPermissioned.id)
                    ?.map((permission, permIndex) => (
                      <Box
                        key={permIndex}
                        bg={'uspolis.blue'}
                        color={'white'}
                        borderRadius={'5px'}
                        px={'10px'}
                        py={'5px'}
                        justifyContent={'center'}
                        alignContent={'center'}
                      >
                        {ClassroomPermissionType.translate(permission)}{' '}
                        <IconButton
                          aria-label='remove-permission'
                          icon={<CloseIcon />}
                          size={'xs'}
                          onClick={() => {
                            const user_permissions =
                              classroomPermissions.users_permissioned.find(
                                (val) => val.user_id == userPermissioned.id,
                              );

                            if (user_permissions) {
                              if (user_permissions.permissions.length == 1)
                                handleDeleteClick(
                                  user_permissions.permission_id,
                                );
                              if (user_permissions.permissions.length > 1) {
                                const new_permissions =
                                  user_permissions.permissions.filter(
                                    (val) => val != permission,
                                  );
                                handleEditClick(
                                  user_permissions.permission_id,
                                  new_permissions,
                                );
                              }
                            }
                          }}
                        />
                      </Box>
                    ))}
                </Flex>
              </Flex>
            ))}
          </SimpleGrid>
        )}

        {permissionedUsersIds.size === 0 && (
          <Flex height={'230px'} alignItems={'center'} justify={'center'}>
            <Alert
              status='warning'
              borderRadius={'5px'}
              justifyContent={'center'}
            >
              <AlertIcon />
              <AlertTitle>
                Nenhum usuário com permissão para esta sala.
              </AlertTitle>
            </Alert>
          </Flex>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}

export default ClassroomPermissionAccordionItem;
