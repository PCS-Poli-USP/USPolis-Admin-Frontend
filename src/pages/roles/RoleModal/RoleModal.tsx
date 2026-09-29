import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { RoleForm, RoleModalProps } from './role.modal.interface';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema, defaultValues } from './role.modal.form';
import { Input, TextareaInput } from '../../../components/common';
import { useEffect, useState } from 'react';
import { PermissionPickerPayload } from '../PermissionPicker/PermissionPicker';
import AddPermissionModal from '../AddPermissionModal/AddPermissionModal';
import PermissionCard from '../PermissionCard/PermissionCard';
import { Resource } from '../../../utils/enums/resources.enums';
import useRoles from '../../../hooks/roles/useRoles';
import usePermissions from '../../../hooks/permissions/usePermissions';
import { CreateRole } from '../../../models/http/requests/role.request.models';
import { PermissionResponse } from '../../../models/http/responses/permissions.response.models';

function RoleModal({
  isOpen,
  onClose,
  isUpdate,
  selectedRole,
  refetch,
  classrooms,
  courses,
  buildings,
}: RoleModalProps) {
  const form = useForm<RoleForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { trigger, reset, getValues, clearErrors } = form;
  const { createRole, updateRole } = useRoles(false);
  const { deletePermission } = usePermissions(false);

  const [permissionsData, setPermissionsData] = useState<
    PermissionPickerPayload[]
  >([]);
  const [removedIds, setRemovedIds] = useState<number[]>([]);
  const {
    isOpen: isPickerOpen,
    onOpen: onPickerOpen,
    onClose: onPickerClose,
  } = useDisclosure();

  const existingPermissions = (selectedRole?.permissions ?? []).filter(
    (permission) => !removedIds.includes(permission.id),
  );

  function handleClose() {
    reset({ ...defaultValues });
    setPermissionsData([]);
    setRemovedIds([]);
    clearErrors();
    onClose();
  }

  async function handleSave() {
    const valid = await trigger();
    if (!valid) return;

    const values = getValues();

    const resourcesSet = new Set<string>(selectedRole?.resources ?? []);
    existingPermissions.forEach((permission) =>
      resourcesSet.add(permission.resource),
    );
    permissionsData.forEach((permission) =>
      resourcesSet.add(permission.resource),
    );

    const payload: CreateRole = {
      name: values.name.trim(),
      description: values.description.trim(),
      resources: Array.from(resourcesSet) as Resource[],
      permissions: [
        ...existingPermissions.map((permission) => ({
          resource: permission.resource,
          actions: permission.actions,
          resource_id: permission.resource_id,
          role_id: permission.role_id,
        })),
        ...permissionsData.map((permission) => ({
          resource: permission.resource,
          actions: permission.actions,
          resource_id: permission.resource_id,
          role_id: undefined as unknown as number,
        })),
      ],
    };

    if (!isUpdate) {
      await createRole(payload);
    }

    if (isUpdate && selectedRole) {
      await updateRole(selectedRole.id, payload);
    }
    refetch();
    handleClose();
  }

  async function handleRemoveExistingPermission(
    permission: PermissionResponse,
  ) {
    await deletePermission(permission.id, permission.resource);
    setRemovedIds((prev) => [...prev, permission.id]);
  }

  function handleRemoveNewPermission(index: number) {
    setPermissionsData((prev) => prev.filter((_, i) => i !== index));
  }

  function handleConfirmPicker(payloads: PermissionPickerPayload[]) {
    setPermissionsData((prev) => [...prev, ...payloads]);
    onPickerClose();
  }

  useEffect(() => {
    if (selectedRole) {
      reset({
        name: selectedRole.name,
        description: selectedRole.description,
      });
    }
    setPermissionsData([]);
    setRemovedIds([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRole]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={'2xl'}
        scrollBehavior='inside'
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent borderRadius={'14px'}>
          <ModalHeader>
            {isUpdate ? 'Editar Papel' : 'Cadastrar Papel'}
          </ModalHeader>
          <ModalCloseButton onClick={handleClose} />
          <ModalBody>
            <FormProvider {...form}>
              <Flex direction={'column'} gap={'12px'}>
                <Input
                  name='name'
                  label='Nome do papel'
                  placeholder='Ex: Coordenador de Prédio'
                />
                <TextareaInput
                  name='description'
                  label='Descrição'
                  placeholder='O que este papel pode fazer'
                />
              </Flex>
            </FormProvider>

            <Box mt={'22px'}>
              <Text fontSize={'13px'} fontWeight={'bold'} mb={'10px'}>
                Permissões deste papel
              </Text>

              {existingPermissions.length === 0 &&
                permissionsData.length === 0 && (
                  <Alert
                    status='warning'
                    borderRadius={'8px'}
                    mb={'12px'}
                    fontSize={'13px'}
                  >
                    <AlertIcon />
                    Nenhuma permissão adicionada ainda.
                  </Alert>
                )}

              <Flex direction={'column'} gap={'8px'} mb={'12px'}>
                {existingPermissions.map((permission) => (
                  <PermissionCard
                    key={`current-${permission.id}`}
                    permission={permission}
                    create={false}
                    maxW='100%'
                    onRemove={() => handleRemoveExistingPermission(permission)}
                  />
                ))}
                {permissionsData.map((permission, index) => (
                  <PermissionCard
                    key={`new-${index}`}
                    permission={{
                      resource: permission.resource,
                      actions: permission.actions,
                      resource_id: permission.resource_id ?? -1,
                      resource_name: permission.resource_name,
                      all_resources: permission.resource_id === -1,
                    }}
                    create={true}
                    maxW='100%'
                    onRemove={() => handleRemoveNewPermission(index)}
                  />
                ))}
              </Flex>

              <Button
                size={'sm'}
                variant={'outline'}
                borderStyle={'dashed'}
                colorScheme={'blue'}
                leftIcon={<AddIcon />}
                onClick={onPickerOpen}
              >
                Adicionar Permissão
              </Button>
            </Box>
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
            <Button colorScheme='blue' onClick={handleSave}>
              {isUpdate ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AddPermissionModal
        isOpen={isPickerOpen}
        onClose={onPickerClose}
        onConfirm={handleConfirmPicker}
        classrooms={classrooms}
        courses={courses}
        buildings={buildings}
        existingPermissions={[...existingPermissions, ...permissionsData]}
      />
    </>
  );
}

export default RoleModal;
