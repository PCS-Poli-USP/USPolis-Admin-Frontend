import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  useDisclosure,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import {
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import { useState } from 'react';
import { LuPen, LuTrash } from 'react-icons/lu';
import { RoleResponse } from '../../../models/http/responses/role.response.models';
import { UserCoreResponse } from '../../../models/http/responses/user.response.models';
import { ClassroomResponse } from '../../../models/http/responses/classroom.response.models';
import { CourseResponse } from '../../../models/http/responses/course.response.models';
import { BuildingResponse } from '../../../models/http/responses/building.response.models';
import { PermissionResponse } from '../../../models/http/responses/permissions.response.models';
import { CreatePermission } from '../../../models/http/requests/permission.request.models';
import usePermissions from '../../../hooks/permissions/usePermissions';
import { Resource } from '../../../utils/enums/resources.enums';
import PermissionCard from '../PermissionCard/PermissionCard';
import AddPermissionModal from '../AddPermissionModal/AddPermissionModal';
import { PermissionPickerPayload } from '../PermissionPicker/PermissionPicker';
import TooltipSelect from '../../../components/common/TooltipSelect';
import Dialog from '../../../components/common/Dialog/dialog.component';

interface RoleCardProps {
  role: RoleResponse;
  users: UserCoreResponse[];
  classrooms: ClassroomResponse[];
  courses: CourseResponse[];
  buildings: BuildingResponse[];
  loading: boolean;
  refetchRoles: () => Promise<void>;
  addUserToRole: (role_id: number, user_id: number) => Promise<void>;
  removeUserFromRole: (role_id: number, user_id: number) => Promise<void>;
  onEdit: () => void;
  onRemove: () => void;
}

const selectMenuProps = {
  menuPortalTarget: document.body,
  styles: {
    menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 1500 }),
  },
};

function RoleCard({
  role,
  users,
  classrooms,
  courses,
  buildings,
  loading,
  refetchRoles,
  addUserToRole,
  removeUserFromRole,
  onEdit,
  onRemove,
}: RoleCardProps) {
  const { createPermission, createBatchPermission, deletePermission } =
    usePermissions(false);

  const [pendingUserId, setPendingUserId] = useState('');

  const [permissionToDelete, setPermissionToDelete] =
    useState<PermissionResponse | null>(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isAddPermissionOpen,
    onOpen: onAddPermissionOpen,
    onClose: onAddPermissionClose,
  } = useDisclosure();

  const availableUsers = users.filter(
    (user) => !role.user_ids.includes(user.id),
  );

  async function handleConfirmPermission(payloads: PermissionPickerPayload[]) {
    if (payloads.length === 0) return;

    if (payloads.length > 1) {
      const permissions: CreatePermission[] = payloads.map((payload) => ({
        resource: payload.resource,
        actions: payload.actions,
        resource_id: payload.resource_id,
        role_id: role.id,
      }));
      await createBatchPermission({ permissions });
    } else {
      await createPermission({
        resource: payloads[0].resource,
        actions: payloads[0].actions,
        resource_id: payloads[0].resource_id,
        role_id: role.id,
      });
    }

    await refetchRoles();
    onAddPermissionClose();
  }

  function handleAskRemovePermission(permission: PermissionResponse) {
    setPermissionToDelete(permission);
    onDeleteOpen();
  }

  async function handleConfirmRemovePermission() {
    if (!permissionToDelete) return;
    await deletePermission(permissionToDelete.id, permissionToDelete.resource);
    await refetchRoles();
    setPermissionToDelete(null);
    onDeleteClose();
  }

  async function handleRemoveUser(userId: number) {
    await removeUserFromRole(role.id, userId);
  }

  async function handleAddUser() {
    if (!pendingUserId) return;
    await addUserToRole(role.id, Number(pendingUserId));
    setPendingUserId('');
  }

  return (
    <>
      <Dialog
        title={
          'Remover Permissão' +
          (permissionToDelete
            ? ` de ${Resource.translate(permissionToDelete.resource)}`
            : '')
        }
        warningText={
          'Tem certeza que deseja remover esta permissão? Esta ação não pode ser desfeita.'
        }
        isOpen={isDeleteOpen}
        onClose={() => {
          setPermissionToDelete(null);
          onDeleteClose();
        }}
        onConfirm={handleConfirmRemovePermission}
      />
      <AddPermissionModal
        isOpen={isAddPermissionOpen}
        onClose={onAddPermissionClose}
        onConfirm={handleConfirmPermission}
        classrooms={classrooms}
        courses={courses}
        buildings={buildings}
        existingPermissions={role.permissions}
        isLoading={loading}
      />
      <AccordionItem
        border={'1px solid'}
        borderColor={'uspolis.border'}
        borderRadius={'12px'}
        overflow={'hidden'}
      >
        {({ isExpanded }) => (
          <>
            <AccordionButton
              py={'14px'}
              px={{ base: '12px', md: '18px' }}
              alignItems={{ base: 'flex-start', md: 'center' }}
              _hover={{ bg: 'uspolis.hover' }}
            >
              <Box as={'span'} mt={{ base: '3px', md: 0 }} flexShrink={0}>
                {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </Box>
              {/* Wraps when the name and the actions don't fit side by side
                  (phones): name and description on top, then the badges and
                  the buttons. Side by side, a long name broke word by word. */}
              <Flex
                flex={'1'}
                minW={0}
                justify={'space-between'}
                align={'center'}
                wrap={'wrap'}
                ml={{ base: '8px', md: '12px' }}
                gap={'8px 12px'}
              >
                <Box textAlign={'left'} minW={0} flex={'1 1 220px'}>
                  <Text fontSize={'15px'} fontWeight={'bold'}>
                    {role.name}
                  </Text>
                  <Text
                    fontSize={'13px'}
                    color={'uspolis.textMuted'}
                    noOfLines={{ base: 2, md: 1 }}
                  >
                    {role.description || 'Nenhuma descrição disponível'}
                  </Text>
                </Box>
                <Flex
                  align={'center'}
                  gap={'8px'}
                  flexShrink={0}
                  ml={'auto'}
                  wrap={'wrap'}
                  justify={'flex-end'}
                >
                  <Badge colorScheme={'blue'}>
                    {`${role.permissions.length} permiss${role.permissions.length === 1 ? 'ão' : 'ões'}`}
                  </Badge>
                  <Badge colorScheme={'green'}>
                    {`${role.user_ids.length} usuário${role.user_ids.length === 1 ? '' : 's'}`}
                  </Badge>
                  <IconButton
                    aria-label={`Editar papel ${role.name}`}
                    variant={'outline'}
                    size={{ base: 'md', md: 'sm' }}
                    colorScheme={'yellow'}
                    icon={<LuPen />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                  />
                  <IconButton
                    aria-label={`Remover papel ${role.name}`}
                    variant={'outline'}
                    size={{ base: 'md', md: 'sm' }}
                    colorScheme={'red'}
                    icon={<LuTrash />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                  />
                </Flex>
              </Flex>
            </AccordionButton>

            <AccordionPanel
              px={'18px'}
              pb={'20px'}
              borderTop={'1px solid'}
              borderColor={'uspolis.border'}
            >
              {isExpanded && (
                <>
                  <Box pt={'16px'}>
                    <Text fontSize={'13px'} fontWeight={'bold'} mb={'10px'}>
                      Permissões
                    </Text>
                    {role.permissions.length === 0 && (
                      <Alert
                        status='warning'
                        borderRadius={'8px'}
                        mb={'12px'}
                        fontSize={'13px'}
                      >
                        <AlertIcon />
                        Nenhuma permissão atribuída a este papel ainda.
                      </Alert>
                    )}
                    <Flex direction={'column'} gap={'8px'} mb={'12px'}>
                      {role.permissions.map((permission) => (
                        <PermissionCard
                          key={permission.id}
                          permission={permission}
                          create={false}
                          maxW='100%'
                          onRemove={() => handleAskRemovePermission(permission)}
                        />
                      ))}
                    </Flex>

                    <Button
                      size={'sm'}
                      variant={'outline'}
                      borderStyle={'dashed'}
                      colorScheme={'blue'}
                      leftIcon={<AddIcon />}
                      onClick={onAddPermissionOpen}
                    >
                      Adicionar Permissão
                    </Button>
                  </Box>

                  <Box pt={'22px'}>
                    <Text fontSize={'13px'} fontWeight={'bold'} mb={'10px'}>
                      Usuários com este papel
                    </Text>
                    <Wrap mb={'10px'}>
                      {role.user_strs.map((label, index) => (
                        <WrapItem key={role.user_ids[index]}>
                          <Badge
                            display={'flex'}
                            alignItems={'center'}
                            gap={'6px'}
                            colorScheme={'blue'}
                            borderRadius={'full'}
                            px={'10px'}
                            py={'4px'}
                          >
                            {label}
                            {/* The 8px icon alone was too small to tap. */}
                            <Box
                              as={'button'}
                              type={'button'}
                              aria-label={`Remover ${label} do papel`}
                              display={'inline-flex'}
                              p={'8px'}
                              m={'-8px'}
                              borderRadius={'full'}
                              _hover={{ bg: 'blackAlpha.100' }}
                              onClick={() =>
                                handleRemoveUser(role.user_ids[index])
                              }
                            >
                              <CloseIcon boxSize={'8px'} />
                            </Box>
                          </Badge>
                        </WrapItem>
                      ))}
                      {role.user_ids.length === 0 && (
                        <Text fontSize={'13px'} color={'uspolis.textMuted'}>
                          Nenhum usuário com este papel.
                        </Text>
                      )}
                    </Wrap>
                    <Flex gap={'8px'} align={'center'}>
                      <Box flex={'1 1 auto'} minW={0} maxW={'320px'}>
                        <TooltipSelect
                          {...selectMenuProps}
                          isClearable
                          placeholder={'+ Adicionar usuário...'}
                          value={
                            pendingUserId
                              ? {
                                  value: Number(pendingUserId),
                                  label:
                                    availableUsers.find(
                                      (u) => u.id === Number(pendingUserId),
                                    )?.name ?? '',
                                }
                              : null
                          }
                          options={availableUsers.map((user) => ({
                            value: user.id,
                            label: `${user.name} (${user.email})`,
                          }))}
                          onChange={(option) =>
                            setPendingUserId(option ? String(option.value) : '')
                          }
                        />
                      </Box>
                      <Button
                        size={'sm'}
                        h={'40px'}
                        flexShrink={0}
                        colorScheme={'blue'}
                        isDisabled={!pendingUserId}
                        onClick={handleAddUser}
                      >
                        Adicionar
                      </Button>
                    </Flex>
                  </Box>
                </>
              )}
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </>
  );
}

export default RoleCard;
