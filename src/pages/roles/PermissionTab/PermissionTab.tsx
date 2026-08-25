import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { useMemo, useRef, useState } from 'react';
import { PermisionFormRef } from '../PermissionForm/PermissionForm';
import PermissionFilters from '../PermissionFilters/PermissionFilters';
import usePermissions from '../../../hooks/permissions/usePermissions';
import { Resource } from '../../../utils/enums/resources.enums';
import { PermissionAction } from '../../../utils/enums/actions.enums';
import { CreatePermission } from '../../../models/http/requests/permission.request.models';
import { RoleResponse } from '../../../models/http/responses/role.response.models';
import { PermissionResponse } from '../../../models/http/responses/permissions.response.models';
import { IoFileTrayFull } from 'react-icons/io5';
import ResourceTab from '../ResourceTab/ResourceTab';
import { normalizeString } from '../../../utils/formatters';
import PermissionModal from '../PermissionModal/PermissionModal';
import { UpdatePermission } from '../../../models/http/requests/permission.request.models';
import { FaSearch } from 'react-icons/fa';

interface PermissionTabProps {
  roles: RoleResponse[];
  permissions: PermissionResponse[];
  resetPermissions: () => Promise<void>;
  viewOnly: boolean;
  setViewOnly: (viewOnly: boolean) => void;
  viewOnlyLabel: string;
  viewOnlyPermissions?: PermissionResponse[];
}

function PermissionTab({
  roles,
  permissions,
  resetPermissions,
  setViewOnly,
  viewOnly = false,
  viewOnlyLabel = 'Permissões',
  viewOnlyPermissions = [],
}: PermissionTabProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isBatchOpen,
    onOpen: onOpenBatch,
    onClose: onCloseBatch,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const permissionFormRef = useRef<PermisionFormRef>(null);
  const deleteCancelRef = useRef<HTMLButtonElement | null>(null);
  const {
    createPermission,
    createBatchPermission,
    updatePermission,
    deletePermission,
  } = usePermissions(false);

  const [resourceFilter, setResourceFilter] = useState<Resource | ''>('');
  const [actionFilter, setActionFilter] = useState<PermissionAction | ''>('');
  const [search, setSearch] = useState('');
  const [resourceNameFilter, setResourceNameFilter] = useState('');
  const [parentNameFilter, setParentNameFilter] = useState('');
  const [resourceTabIndex, setResourceTabIndex] = useState(0);
  const [editingPermission, setEditingPermission] =
    useState<PermissionResponse | null>(null);
  const [permissionToDelete, setPermissionToDelete] =
    useState<PermissionResponse | null>(null);

  const filteredPermissions = useMemo(() => {
    const searchValue = normalizeString(search);
    const resourceNameValue = normalizeString(resourceNameFilter);
    const parentNameValue = normalizeString(parentNameFilter);

    const currentPermissions = viewOnly ? viewOnlyPermissions : permissions;
    return currentPermissions.filter((permission) => {
      if (resourceFilter && permission.resource !== resourceFilter)
        return false;
      if (actionFilter && !permission.actions.includes(actionFilter)) {
        return false;
      }
      if (
        resourceNameValue &&
        !normalizeString(permission.resource_name || '').includes(
          resourceNameValue,
        )
      ) {
        return false;
      }
      if (
        parentNameValue &&
        !normalizeString(permission.parent_name || '').includes(parentNameValue)
      ) {
        return false;
      }

      if (!searchValue) return true;

      const searchable = [
        Resource.translate(permission.resource),
        permission.resource_name || '',
        permission.parent_name || '',
        permission.resource_id ? String(permission.resource_id) : '',
        permission.actions
          .map((action) =>
            PermissionAction.translate(action, permission.resource),
          )
          .join(' '),
      ].join(' ');

      return normalizeString(searchable).includes(searchValue);
    });
  }, [
    permissions,
    resourceFilter,
    actionFilter,
    search,
    resourceNameFilter,
    parentNameFilter,
    viewOnly,
    viewOnlyPermissions,
  ]);

  const permissionMap = useMemo(() => {
    const map = new Map<Resource, PermissionResponse[]>();

    filteredPermissions.forEach((permission) => {
      if (!map.has(permission.resource)) {
        map.set(permission.resource, []);
      }
      map.get(permission.resource)?.push(permission);
    });

    return map;
  }, [filteredPermissions]);

  function handleCloseModal() {
    setEditingPermission(null);
    permissionFormRef.current?.reset();
    onClose();
  }

  function handleCloseBatchModal() {
    permissionFormRef.current?.reset();
    onCloseBatch();
  }

  function handleOpenCreatePermission() {
    setEditingPermission(null);
    permissionFormRef.current?.reset();
    onOpen();
  }

  function handleEditPermission(permission: PermissionResponse) {
    setEditingPermission(permission);
    onOpen();
  }

  function handleAskDeletePermission(permission: PermissionResponse) {
    setPermissionToDelete(permission);
    onOpenDelete();
  }

  async function handleConfirmDeletePermission() {
    if (!permissionToDelete) return;

    await deletePermission(permissionToDelete.id, permissionToDelete.resource);
    await resetPermissions();
    setPermissionToDelete(null);
    onCloseDelete();
  }

  async function handleCreatePermission() {
    if (!permissionFormRef.current) return;

    const permissionData = await permissionFormRef.current.validate();
    if (!permissionData) return;

    const resourceId = permissionData.all_resources
      ? -1
      : permissionData.resource_id;

    const payload: CreatePermission = {
      resource: permissionData.resource,
      actions: permissionData.actions,
      resource_id:
        resourceId === -1 ? -1 : resourceId > 0 ? resourceId : undefined,
      role_id: permissionData.role_id as number,
    };

    if (editingPermission) {
      const updatePayload: UpdatePermission = payload;
      await updatePermission(editingPermission.id, updatePayload);
    } else {
      await createPermission(payload);
    }
    await resetPermissions();
    permissionFormRef.current.reset();
    setEditingPermission(null);
    onClose();
  }

  async function handleCreateBatchPermission() {
    if (!permissionFormRef.current) return;

    const permissionData = await permissionFormRef.current.validate();
    if (!permissionData) return;

    const resourceIds = permissionData.resource_ids ?? [];
    const payloads: CreatePermission[] = resourceIds.map(
      (resourceId: number) => ({
        resource: permissionData.resource,
        actions: permissionData.actions,
        resource_id: resourceId,
        role_id: permissionData.role_id as number,
      }),
    );

    if (payloads.length === 0) return;

    await createBatchPermission({ permissions: payloads });
    await resetPermissions();
    permissionFormRef.current.reset();
    onCloseBatch();
  }

  console.log('Permission label', viewOnlyLabel);
  return (
    <Flex direction={'column'} gap={'16px'} w={'full'}>
      <Flex
        w={'full'}
        justify={'space-between'}
        align={'center'}
        gap={'12px'}
        wrap={'wrap'}
      >
        <Flex direction={'column'}>
          <Flex gap={'10px'}>
            <Text fontSize={'xl'} fontWeight={'bold'}>
              {`${viewOnly ? `Visualizando ${viewOnlyLabel}` : 'Permissões'}`}
            </Text>
            {viewOnly && (
              <Tooltip
                label='Fechar visualização apenas leitura'
                aria-label='A tooltip'
              >
                <IconButton
                  aria-label='close-view-only'
                  icon={<CloseIcon />}
                  variant={'outline'}
                  size={'sm'}
                  onClick={() => setViewOnly(false)}
                />
              </Tooltip>
            )}
          </Flex>
          <Text color={'gray.500'}>Gerencie e filtre permissões</Text>
        </Flex>
        <Flex gap={'10px'} wrap={'wrap'}>
          <Button
            leftIcon={<AddIcon />}
            onClick={handleOpenCreatePermission}
            disabled={viewOnly}
          >
            Adicionar Permissão
          </Button>
          <Button
            leftIcon={<IoFileTrayFull />}
            variant={'outline'}
            onClick={onOpenBatch}
            disabled={viewOnly}
          >
            Adicionar em lote
          </Button>
        </Flex>
      </Flex>

      <PermissionFilters
        search={search}
        setSearch={setSearch}
        resourceNameFilter={resourceNameFilter}
        setResourceNameFilter={setResourceNameFilter}
        parentNameFilter={parentNameFilter}
        setParentNameFilter={setParentNameFilter}
        resourceFilter={resourceFilter}
        setResourceFilter={setResourceFilter}
        actionFilter={actionFilter}
        setActionFilter={setActionFilter}
      />

      <Flex>
        {permissionMap.size > 0 && (
          <Tabs
            w={'full'}
            minH={'700px'}
            index={resourceTabIndex}
            onChange={(tabIndex) => setResourceTabIndex(tabIndex)}
          >
            <TabList>
              {Array.from(permissionMap.keys()).map((resource) => (
                <Tab
                  key={resource}
                  // onClick={() => {
                  //   setResourceTabIndex(index);
                  // }}
                >
                  {Resource.translate(resource)} (
                  {permissionMap.get(resource)?.length || 0})
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {Array.from(permissionMap.entries()).map(
                ([resource, permissions]) => (
                  <TabPanel key={resource}>
                    <ResourceTab
                      resource={resource}
                      permissions={permissions}
                      onEdit={handleEditPermission}
                      onRemove={handleAskDeletePermission}
                    />
                  </TabPanel>
                ),
              )}
            </TabPanels>
          </Tabs>
        )}

        {filteredPermissions.length === 0 && (
          <Flex
            direction={'column'}
            align={'center'}
            justify={'center'}
            w={'full'}
            h={'full'}
            p={4}
            gap={'10px'}
          >
            <FaSearch size={'128px'} />
            <Text fontWeight={'bold'} fontSize={'xl'}>
              Nenhuma permissão encontrada
            </Text>
            <Text maxW={'800px'}>
              Nenhuma permissão corresponde aos filtros aplicados. Tente ajustar
              os filtros para encontrar as permissões desejadas.
            </Text>
            <Button
              colorScheme='blue'
              onClick={() => {
                setParentNameFilter('');
                setResourceNameFilter('');
                setResourceFilter('');
                setActionFilter('');
                setSearch('');
              }}
            >
              Limpar Filtros
            </Button>
          </Flex>
        )}
      </Flex>

      <PermissionModal
        isOpen={isOpen}
        isUpdate={!!editingPermission}
        isBatchOpen={isBatchOpen}
        editingPermission={editingPermission}
        permissionFormRef={permissionFormRef}
        roles={roles}
        onClose={handleCloseModal}
        onCloseBatch={handleCloseBatchModal}
        onSubmitPermission={handleCreatePermission}
        onSubmitBatch={handleCreateBatchPermission}
      />

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={deleteCancelRef}
        onClose={() => {
          setPermissionToDelete(null);
          onCloseDelete();
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Remover permissão
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja remover esta permissão? Esta ação não pode
              ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={deleteCancelRef}
                onClick={() => {
                  setPermissionToDelete(null);
                  onCloseDelete();
                }}
              >
                Cancelar
              </Button>
              <Button bg={'red'} onClick={handleConfirmDeletePermission} ml={3}>
                Remover
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}

export default PermissionTab;
