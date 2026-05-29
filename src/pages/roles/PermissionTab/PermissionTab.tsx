import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useMemo, useRef, useState } from 'react';
import PermissionForm, {
  PermisionFormRef,
} from '../PermissionForm/PermissionForm';
import PermissionFilters from '../PermissionFilters/PermissionFilters';
import usePermissions from '../../../hooks/permissions/usePermissions';
import { Resource } from '../../../utils/enums/resources.enums';
import { PermissionAction } from '../../../utils/enums/actions.enums';
import { CreatePermission } from '../../../models/http/requests/permission.request.models';
import { RoleResponse } from '../../../models/http/responses/role.response.models';
import { UserCoreResponse } from '../../../models/http/responses/user.response.models';
import { PermissionResponse } from '../../../models/http/responses/permissions.response.models';
import { IoFileTrayFull } from 'react-icons/io5';
import ResourceTab from '../ResourceTab/ResourceTab';

interface PermissionTabProps {
  roles: RoleResponse[];
  users: UserCoreResponse[];
  permissions: PermissionResponse[];
  resetPermissions: () => Promise<void>;
}

function PermissionTab({
  roles,
  users,
  permissions,
  resetPermissions,
}: PermissionTabProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isBatchOpen,
    onOpen: onOpenBatch,
    onClose: onCloseBatch,
  } = useDisclosure();
  const permissionFormRef = useRef<PermisionFormRef>(null);
  const { createPermission, createBatchPermission, loading } =
    usePermissions(false);

  const [resourceFilter, setResourceFilter] = useState<Resource | ''>('');
  const [actionFilter, setActionFilter] = useState<PermissionAction | ''>('');
  const [search, setSearch] = useState('');
  const [resourceTabIndex, setResourceTabIndex] = useState(0);

  const filteredPermissions = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return permissions.filter((permission) => {
      if (resourceFilter && permission.resource !== resourceFilter)
        return false;
      if (actionFilter && !permission.actions.includes(actionFilter)) {
        return false;
      }

      if (!searchValue) return true;

      const searchable = [
        Resource.translate(permission.resource),
        permission.resource_name || '',
        permission.resource_id ? String(permission.resource_id) : '',
        permission.actions
          .map((action) =>
            PermissionAction.translate(action, permission.resource),
          )
          .join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(searchValue);
    });
  }, [permissions, resourceFilter, actionFilter, search]);

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
    permissionFormRef.current?.reset();
    onClose();
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
      user_id: permissionData.user_id,
      role_id: permissionData.role_id,
    };

    await createPermission(payload);
    await resetPermissions();
    permissionFormRef.current.reset();
    onClose();
  }

  async function handleCreateBatchPermission() {
    if (!permissionFormRef.current) return;

    const permissionData = await permissionFormRef.current.validate();
    if (!permissionData) return;

    const resourceIds = permissionData.resource_ids ?? [];
    const payloads: CreatePermission[] = resourceIds.map((resourceId) => ({
      resource: permissionData.resource,
      actions: permissionData.actions,
      resource_id: resourceId,
      user_id: permissionData.user_id,
      role_id: permissionData.role_id,
    }));

    if (payloads.length === 0) return;

    await createBatchPermission({ permissions: payloads });
    await resetPermissions();
    permissionFormRef.current.reset();
    onCloseBatch();
  }

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
          <Text fontSize={'xl'} fontWeight={'bold'}>
            Permissões
          </Text>
          <Text color={'gray.500'}>Gerencie e filtre permissões</Text>
        </Flex>
        <Flex gap={'10px'} wrap={'wrap'}>
          <Button leftIcon={<AddIcon />} onClick={onOpen}>
            Adicionar Permissão
          </Button>
          <Button
            leftIcon={<IoFileTrayFull />}
            variant={'outline'}
            onClick={onOpenBatch}
          >
            Adicionar em lote
          </Button>
        </Flex>
      </Flex>

      <PermissionFilters
        search={search}
        setSearch={setSearch}
        resourceFilter={resourceFilter}
        setResourceFilter={setResourceFilter}
        actionFilter={actionFilter}
        setActionFilter={setActionFilter}
      />

      <Flex>
        {permissionMap.size > 0 && (
          <Tabs
            w={'full'}
            h={'700px'}
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
            <TabPanels h={'full'}>
              {Array.from(permissionMap.entries()).map(
                ([resource, permissions]) => (
                  <TabPanel key={resource} h={'full'}>
                    <ResourceTab
                      resource={resource}
                      permissions={permissions}
                    />
                  </TabPanel>
                ),
              )}
            </TabPanels>
          </Tabs>
        )}
        {filteredPermissions.length === 0 && !loading && (
          <Alert status='info' borderRadius={'10px'}>
            <AlertIcon />
            Nenhuma permissão encontrada.
          </Alert>
        )}
      </Flex>

      <Modal isOpen={isOpen} onClose={handleCloseModal} size={'2xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar Permissão</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PermissionForm
              ref={permissionFormRef}
              showUserRoleSelects={true}
              roles={roles}
              users={users}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              colorScheme='red'
              variant={'outline'}
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
            <Button colorScheme='blue' onClick={handleCreatePermission}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isBatchOpen}
        onClose={() => {
          permissionFormRef.current?.reset();
          onCloseBatch();
        }}
        size={'2xl'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar Permissões em lote</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PermissionForm
              ref={permissionFormRef}
              batchMode={true}
              showUserRoleSelects={true}
              roles={roles}
              users={users}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              colorScheme='red'
              variant={'outline'}
              onClick={() => {
                permissionFormRef.current?.reset();
                onCloseBatch();
              }}
            >
              Cancelar
            </Button>
            <Button colorScheme='blue' onClick={handleCreateBatchPermission}>
              Salvar lote
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default PermissionTab;
