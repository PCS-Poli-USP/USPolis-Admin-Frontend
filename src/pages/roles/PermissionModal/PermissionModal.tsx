import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { RefObject } from 'react';
import PermissionForm, {
  PermisionFormRef,
} from '../PermissionForm/PermissionForm';
import { RoleResponse } from '../../../models/http/responses/role.response.models';
import { PermissionResponse } from '../../../models/http/responses/permissions.response.models';
import { IPermissionForm } from '../PermissionForm/permission.form.interface';

function mapPermissionToFormValues(
  permission: PermissionResponse,
): IPermissionForm {
  return {
    resource: permission.resource,
    actions: permission.actions,
    resource_id: permission.resource_id ?? 0,
    resource_ids: [],
    resource_name: permission.resource_name ?? '',
    all_resources: permission.resource_id === -1,
    role_id: permission.role_id,
  };
}

interface PermissionModalProps {
  isOpen: boolean;
  isUpdate: boolean;
  isBatchOpen: boolean;
  editingPermission: PermissionResponse | null;
  permissionFormRef: RefObject<PermisionFormRef | null>;
  roles: RoleResponse[];
  onClose: () => void;
  onCloseBatch: () => void;
  onSubmitPermission: () => void;
  onSubmitBatch: () => void;
}

function PermissionModal({
  isOpen,
  isUpdate,
  isBatchOpen,
  editingPermission,
  permissionFormRef,
  roles,
  onClose,
  onCloseBatch,
  onSubmitPermission,
  onSubmitBatch,
}: PermissionModalProps) {
  const initialValues = editingPermission
    ? mapPermissionToFormValues(editingPermission)
    : null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={'2xl'}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isUpdate ? 'Editar Permissão' : 'Adicionar Permissão'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PermissionForm
              ref={permissionFormRef}
              showRoleSelect={true}
              roles={roles}
              initialValues={initialValues}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              colorScheme='red'
              variant={'outline'}
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button colorScheme='blue' onClick={onSubmitPermission}>
              {isUpdate ? 'Atualizar' : 'Salvar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isBatchOpen} onClose={onCloseBatch} size={'2xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar Permissões em lote</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PermissionForm
              ref={permissionFormRef}
              batchMode={true}
              showRoleSelect={true}
              roles={roles}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              colorScheme='red'
              variant={'outline'}
              onClick={onCloseBatch}
            >
              Cancelar
            </Button>
            <Button colorScheme='blue' onClick={onSubmitBatch}>
              Salvar lote
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PermissionModal;
