import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { RoleForm, RoleModalProps } from './role.modal.interface';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema, defaultValues } from './role.modal.form';
import { Input, TextareaInput } from '../../../components/common';
import { AddIcon } from '@chakra-ui/icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import PermissionForm, {
  PermisionFormRef,
} from '../PermissionForm/PermissionForm';
import PermissionCard from '../PermissionCard/PermissionCard';
import { IPermissionForm } from '../PermissionForm/permission.form.interface';
import { PermissionResponse } from '../../../models/http/responses/permissions.response.models';
import PermissionFilters from '../PermissionFilters/PermissionFilters';
import { PermissionAction } from '../../../utils/enums/actions.enums';
import { Resource } from '../../../utils/enums/resources.enums';
import useRoles from '../../../hooks/roles/useRoles';
import { CreateRole } from '../../../models/http/requests/role.request.models';

function RoleModal({
  isOpen,
  onClose,
  isUpdate,
  selectedRole,
  permissions,
  refetch,
}: RoleModalProps) {
  const permissionFormRef = useRef<PermisionFormRef>(null);

  const form = useForm<RoleForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { trigger, reset, getValues, clearErrors } = form;
  const { createRole, updateRole } = useRoles(false);

  const [permissionsData, setPermissionsData] = useState<IPermissionForm[]>([]);
  const [permissionsIds, setPermissionsIds] = useState<Set<number>>(new Set());
  const [tabIndex, setTabIndex] = useState(0);
  const [resourceFilter, setResourceFilter] = useState<Resource | ''>('');
  const [actionFilter, setActionFilter] = useState<PermissionAction | ''>('');
  const [search, setSearch] = useState('');

  const filteredPermissions = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return permissions.filter((permission) => {
      if (resourceFilter && permission.resource !== resourceFilter) {
        return false;
      }

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

  function handleClose() {
    reset();
    clearErrors();
    onClose();
  }

  async function handleSave() {
    const valid = await trigger();
    if (!valid) return;

    const values = getValues();

    const resourcesSet = new Set<string>();
    const permissionsIdsSet = new Set<number>(permissionsIds);

    permissionsData.forEach((permission) => {
      resourcesSet.add(permission.resource);
    });
    permissions.forEach((permission) => {
      if (permissionsIdsSet.has(permission.id)) {
        resourcesSet.add(permission.resource);
      }
    });

    const payload: CreateRole = {
      name: values.name,
      description: values.description,
      resources: Array.from(resourcesSet) as Resource[],
      permissions: [
        ...permissionsData.map((permission) => ({
          resource: permission.resource,
          actions: permission.actions,
          resource_id:
            permission.all_resources || permission.resource_id === -1
              ? -1
              : permission.resource_id > 0
                ? permission.resource_id
                : undefined,
          user_id: permission.user_id,
          role_id: permission.role_id,
        })),
      ],
      permission_ids: permissions.flatMap((permission) => {
        if (permissionsIdsSet.has(permission.id)) {
          return [[permission.id, permission.resource] as [number, Resource]];
        }
        return [];
      }),
    };

    if (!isUpdate) {
      await createRole(payload);
    }

    if (isUpdate && selectedRole) {
      await updateRole(selectedRole.id, payload);
    }
    refetch();
    handleClose();
    onClose();
  }

  async function handleAddPermission() {
    console.log(permissionFormRef.current);
    if (!permissionFormRef.current) return;

    console.log('Validating permission form...');
    const permissionData = await permissionFormRef.current.validate();
    if (!permissionData) return;

    setPermissionsData((prev) => [...prev, permissionData]);
    permissionFormRef.current.reset();
    console.log('Permission added:', permissionData);
  }

  function handleEditPermission(
    permission: PermissionResponse | IPermissionForm,
  ) {
    if (!permissionFormRef.current) return;

    const permissionFormValues: IPermissionForm =
      'id' in permission
        ? {
            resource: permission.resource,
            actions: permission.actions,
            resource_id: permission.resource_id ?? 0,
            resource_name: permission.resource_name ?? '',
            all_resources: permission.resource_id === -1,
            user_id: permission.user_id,
            role_id: permission.role_id,
          }
        : permission;

    permissionFormRef.current.setValues(permissionFormValues);
    setTabIndex(1);

    if ('id' in permission) {
      setPermissionsIds((prev) => {
        const next = new Set(prev);
        next.delete(permission.id);
        return next;
      });
      return;
    }

    setPermissionsData((prev) => prev.filter((item) => item !== permission));
  }

  function handleRemovePermission(
    permission: PermissionResponse | IPermissionForm,
  ) {
    if ('id' in permission) {
      setPermissionsIds((prev) => {
        const next = new Set(prev);
        next.delete(permission.id);
        return next;
      });
      return;
    }

    setPermissionsData((prev) => prev.filter((item) => item !== permission));
  }

  function handleSelectPermission(permissionId: number, checked: boolean) {
    setPermissionsIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(permissionId);
      } else {
        next.delete(permissionId);
      }
      return next;
    });
  }

  const selectedPermissions = permissions.filter((permission) =>
    permissionsIds.has(permission.id),
  );

  useEffect(() => {
    if (selectedRole) {
      reset({
        name: selectedRole.name,
        description: selectedRole.description,
      });
      setPermissionsIds(new Set(selectedRole.permissions.map((p) => p.id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRole]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={'3xl'}
      scrollBehavior='inside'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isUpdate ? 'Editar Cargo' : 'Cadastrar Cargo'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormProvider {...form}>
            <Input name='name' label='Nome' mb={'10px'} />
            <TextareaInput name='description' label='Descrição' />
          </FormProvider>
          <Flex
            direction={'column'}
            align={'center'}
            justify={'center'}
            mt={'10px'}
            gap={'10px'}
          >
            <Tabs w={'full'} index={tabIndex} onChange={setTabIndex}>
              <TabList>
                <Tab>Permissões Atuais</Tab>
                <Tab>Nova Permissão</Tab>
                <Tab>Selecionar Permissões</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Flex direction={'column'} gap={'10px'}>
                    {permissionsData.length === 0 &&
                      permissionsIds.size === 0 && (
                        <Alert status='warning' borderRadius={'10px'}>
                          <AlertIcon />
                          Nenhuma permissão adicionada ainda. Adicione
                          permissões.
                        </Alert>
                      )}
                    {permissionsData.map((permission, index) => (
                      <PermissionCard
                        key={`new-${index}`}
                        permission={permission}
                        create={true}
                        onEdit={handleEditPermission}
                        onRemove={handleRemovePermission}
                      />
                    ))}
                    {selectedPermissions.map((permission) => (
                      <PermissionCard
                        key={`selected-${permission.id}`}
                        permission={permission}
                        create={false}
                        onEdit={handleEditPermission}
                        onRemove={handleRemovePermission}
                        maxW='100%'
                      />
                    ))}
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <PermissionForm ref={permissionFormRef} />
                  <Flex
                    w={'full'}
                    align={'center'}
                    justify={'flex-end'}
                    mt={'10px'}
                  >
                    <Button
                      variant={'ghost'}
                      leftIcon={<AddIcon />}
                      size={'sm'}
                      onClick={handleAddPermission}
                    >
                      Adicionar Permissão
                    </Button>
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex
                    direction={'column'}
                    gap={'10px'}
                    overflowY={'scroll'}
                    justify={'center'}
                    justifyContent={'center'}
                    paddingBottom={'10px'}
                  >
                    <div style={{ marginBottom: '10px' }}>
                      <PermissionFilters
                        search={search}
                        setSearch={setSearch}
                        resourceFilter={resourceFilter}
                        setResourceFilter={setResourceFilter}
                        actionFilter={actionFilter}
                        setActionFilter={setActionFilter}
                      />
                    </div>
                    {filteredPermissions.map((permission) => (
                      <PermissionCard
                        key={permission.id}
                        permission={permission}
                        create={false}
                        selectable={true}
                        isSelected={permissionsIds.has(permission.id)}
                        onSelectChange={(checked) =>
                          handleSelectPermission(permission.id, checked)
                        }
                        maxW='95%'
                      />
                    ))}
                    {filteredPermissions.length === 0 && (
                      <Alert status='info' borderRadius={'10px'}>
                        <AlertIcon />
                        Nenhuma permissão disponível. Crie novas permissões para
                        adicioná-las aos cargos.
                      </Alert>
                    )}
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button
            mr={3}
            colorScheme='red'
            variant={'outline'}
            onClick={handleClose}
          >
            Cancelar
          </Button>

          <Button
            colorScheme='blue'
            onClick={handleSave}
            leftIcon={<AddIcon />}
          >
            {isUpdate ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default RoleModal;
