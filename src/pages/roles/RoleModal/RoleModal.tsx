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
import { useEffect, useRef, useState } from 'react';
import PermissionForm, {
  PermisionFormRef,
} from '../PermissionForm/PermissionForm';
import PermissionCard from '../PermissionCard/PermissionCard';
import { IPermissionForm } from '../PermissionForm/permission.form.interface';
import { Resource } from '../../../utils/enums/resources.enums';
import useRoles from '../../../hooks/roles/useRoles';
import { CreateRole } from '../../../models/http/requests/role.request.models';

function RoleModal({
  isOpen,
  onClose,
  isUpdate,
  selectedRole,
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
  const [tabIndex, setTabIndex] = useState(0);

  function handleClose() {
    reset({ ...defaultValues });
    setPermissionsData([]);
    clearErrors();
    onClose();
  }

  async function handleSave() {
    const valid = await trigger();
    if (!valid) return;

    const values = getValues();

    const resourcesSet = new Set<string>(selectedRole?.resources ?? []);
    permissionsData.forEach((permission) => {
      resourcesSet.add(permission.resource);
    });

    const payload: CreateRole = {
      name: values.name.trim(),
      description: values.description.trim(),
      resources: Array.from(resourcesSet) as Resource[],
      permissions: permissionsData.map((permission) => ({
        resource: permission.resource,
        actions: permission.actions,
        resource_id:
          permission.all_resources || permission.resource_id === -1
            ? -1
            : permission.resource_id > 0
              ? permission.resource_id
              : undefined,
        role_id: permission.role_id as number,
      })),
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
    if (!permissionFormRef.current) return;

    const permissionData = await permissionFormRef.current.validate();
    if (!permissionData) return;

    setPermissionsData((prev) => [...prev, permissionData]);
    permissionFormRef.current.reset();
  }

  function handleEditPermission(permission: IPermissionForm) {
    if (!permissionFormRef.current) return;

    permissionFormRef.current.setValues(permission);
    setTabIndex(1);
    setPermissionsData((prev) => prev.filter((item) => item !== permission));
  }

  function handleRemovePermission(permission: IPermissionForm) {
    setPermissionsData((prev) => prev.filter((item) => item !== permission));
  }

  useEffect(() => {
    if (selectedRole) {
      reset({
        name: selectedRole.name,
        description: selectedRole.description,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRole]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={'3xl'}
      scrollBehavior='inside'
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isUpdate ? 'Editar Cargo' : 'Cadastrar Cargo'}
        </ModalHeader>
        <ModalCloseButton onClick={handleClose} />
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
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Flex direction={'column'} gap={'10px'}>
                    {permissionsData.length === 0 &&
                      (selectedRole?.permissions.length ?? 0) === 0 && (
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
                        onEdit={() => handleEditPermission(permission)}
                        onRemove={() => handleRemovePermission(permission)}
                      />
                    ))}
                    {selectedRole?.permissions.map((permission) => (
                      <PermissionCard
                        key={`current-${permission.id}`}
                        permission={permission}
                        create={false}
                        readOnly={true}
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
