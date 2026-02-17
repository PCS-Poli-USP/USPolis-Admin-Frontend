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
import { useState } from 'react';
import { ClassroomPermissionType } from '../../../../utils/enums/classroomPermissionType.enum';
import { CloseIcon } from '@chakra-ui/icons';
import { ClassroomPermissionByUserResponse } from '../../../../models/http/responses/classroomPermission.response.models';
import useClassroomPermissions from '../../../../hooks/classroomPermissions/useClassroomPermissions';
import { LuPen, LuTrash } from 'react-icons/lu';
import { Tooltip } from '@mui/material';
import { ClassroomResponse } from '../../../../models/http/responses/classroom.response.models';
import HelpPopover from '../../../../components/common/HelpPopover';

interface UserClassroomPermissionAccordionItemProps {
  classrooms: ClassroomResponse[];
  userPermissions: ClassroomPermissionByUserResponse;
  refetch: () => void;
  loading: boolean;
}

function UserClassroomPermissionAccordionItem({
  classrooms,
  userPermissions,
  refetch,
}: UserClassroomPermissionAccordionItemProps) {
  const {
    createClassroomPermission,
    updateClassroomPermission,
    deleteClassroomPermission,
  } = useClassroomPermissions(false);

  const [classroomPermissionMap] = useState<
    Map<number, ClassroomPermissionType[]>
  >(
    new Map(
      userPermissions.classroom_permissions.map((c) => [
        c.classroom_id,
        c.permissions,
      ]),
    ),
  );
  const [permissionedClassroomIds] = useState<Set<number>>(
    new Set(userPermissions.classroom_permissions.map((c) => c.classroom_id)),
  );
  const unpermissionedClassrooms = classrooms.filter(
    (classroom) => !permissionedClassroomIds.has(classroom.id),
  );

  // Form states
  const [selectedClassroom, setSelectedClassroom] =
    useState<ClassroomResponse | null>(null);
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

  const permissionedClassrooms = classrooms.filter((classroom) =>
    permissionedClassroomIds.has(classroom.id),
  );

  return (
    <AccordionItem>
      <AccordionButton>
        <Box as='span' flex='1' textAlign='left' fontWeight={'bold'}>
          {userPermissions.user_name} - {userPermissions.user_email}
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
          <Text fontWeight={'bold'}>Sala:</Text>
          <Box w={'300px'} display='flex' flexDirection='row' gap={'5px'}>
            <TooltipSelect
              isClearable
              value={
                selectedClassroom
                  ? {
                      label: selectedClassroom.name,
                      value: selectedClassroom.id,
                    }
                  : null
              }
              placeholder={'Permicionar sala...'}
              options={unpermissionedClassrooms.map((classroom) => ({
                label: `${classroom.name} (${classroom.building})`,
                value: classroom.id,
              }))}
              onChange={(value) => {
                if (value) {
                  setSelectedClassroom(
                    classrooms.find(
                      (classroom) => classroom.id === value.value,
                    ) || null,
                  );
                }
                if (!value) {
                  setSelectedClassroom(null);
                }
              }}
            />
            <HelpPopover
              title='Por que não estou vendo uma sala?'
              tooltip='Não encontrou uma sala?'
              tooltipPlacement='top'
            >
              <Text>Apenas salas restritas aparecem aqui.</Text>
            </HelpPopover>
          </Box>
          {selectedClassroom && (
            <>
              <Text fontWeight={'bold'}>Permissões:</Text>
              <Box w={'300px'}>
                <TooltipSelect
                  isMulti
                  placeholder={'Selecione as permissões'}
                  value={selectedPermissions.map((val) => ({
                    label: ClassroomPermissionType.translate(val),
                    value: val,
                  }))}
                  options={ClassroomPermissionType.getValues().map(
                    (permission) => ({
                      label: ClassroomPermissionType.translate(permission),
                      value: permission,
                    }),
                  )}
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
                    const classroom_permissions =
                      userPermissions.classroom_permissions.find(
                        (val) => val.classroom_id == selectedClassroom?.id,
                      );
                    if (classroom_permissions) {
                      handleEditClick(
                        classroom_permissions.permission_id,
                        selectedPermissions,
                      );
                    }
                  }

                  if (!isEditing) {
                    handleAddClick(
                      userPermissions.user_id,
                      selectedClassroom?.id,
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

        {permissionedClassroomIds.size > 0 && (
          <SimpleGrid w={'full'} minChildWidth={'250px'} spacing={'15px'}>
            {permissionedClassrooms.map((classroomPermissioned, index) => (
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
                    {`${classroomPermissioned.name} (${classroomPermissioned.building})`}
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
                          const permissions = classroomPermissionMap.get(
                            classroomPermissioned.id,
                          );
                          setSelectedClassroom(classroomPermissioned);
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
                            userPermissions.classroom_permissions.find(
                              (val) =>
                                val.classroom_id == classroomPermissioned.id,
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
                  {classroomPermissionMap
                    .get(classroomPermissioned.id)
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
                              userPermissions.classroom_permissions.find(
                                (val) =>
                                  val.classroom_id == classroomPermissioned.id,
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

        {permissionedClassroomIds.size === 0 && (
          <Flex height={'230px'} alignItems={'center'} justify={'center'}>
            <Alert
              status='warning'
              borderRadius={'5px'}
              justifyContent={'center'}
            >
              <AlertIcon />
              <AlertTitle>
                Nenhuma sala com permissão para este usuário.
              </AlertTitle>
            </Alert>
          </Flex>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}

export default UserClassroomPermissionAccordionItem;
