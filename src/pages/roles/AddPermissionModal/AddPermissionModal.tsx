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
import { useRef } from 'react';
import PermissionPicker, {
  PermissionPickerPayload,
  PermissionPickerRef,
} from '../PermissionPicker/PermissionPicker';
import { ClassroomResponse } from '../../../models/http/responses/classroom.response.models';
import { CourseResponse } from '../../../models/http/responses/course.response.models';
import { BuildingResponse } from '../../../models/http/responses/building.response.models';
import { Resource } from '../../../utils/enums/resources.enums';

interface AddPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payloads: PermissionPickerPayload[]) => void | Promise<void>;
  classrooms: ClassroomResponse[];
  courses: CourseResponse[];
  buildings: BuildingResponse[];
  existingPermissions: { resource: Resource; resource_id?: number }[];
  isLoading?: boolean;
}

// Single reusable modal for adding a permission, used both from RoleModal
// (buffers the payload locally until the role is saved) and from RoleCard
// (creates the permission immediately against an already-saved role).
function AddPermissionModal({
  isOpen,
  onClose,
  onConfirm,
  classrooms,
  courses,
  buildings,
  existingPermissions,
  isLoading = false,
}: AddPermissionModalProps) {
  const pickerRef = useRef<PermissionPickerRef>(null);

  function handleClose() {
    pickerRef.current?.reset();
    onClose();
  }

  async function handleConfirm() {
    const payloads = pickerRef.current?.confirm();
    if (!payloads) return;
    await onConfirm(payloads);
    pickerRef.current?.reset();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={'2xl'}
      scrollBehavior='inside'
      isCentered
    >
      <ModalOverlay />
      <ModalContent borderRadius={'14px'} maxH={'80vh'}>
        <ModalHeader>Adicionar Permissão</ModalHeader>
        <ModalCloseButton onClick={handleClose} />
        <ModalBody minH={'340px'} display={'flex'} flexDirection={'column'}>
          <PermissionPicker
            ref={pickerRef}
            classrooms={classrooms}
            courses={courses}
            buildings={buildings}
            existingPermissions={existingPermissions}
          />
        </ModalBody>
        <ModalFooter>
          <Button mr={3} variant={'outline'} onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            colorScheme='blue'
            isLoading={isLoading}
            onClick={handleConfirm}
          >
            Adicionar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AddPermissionModal;
