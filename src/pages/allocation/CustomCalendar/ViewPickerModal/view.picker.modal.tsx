import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';

type ViewOption = {
  value: string;
  label: string;
};

interface ViewPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  view: ViewOption;
  options: ViewOption[];
  onSelectView: (option: ViewOption) => void;
}

function ViewPickerModal({
  isOpen,
  onClose,
  options,
  view,
  onSelectView,
}: ViewPickerModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='xs'
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent pt={4}>
        <ModalHeader>Selecione uma visualização</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Select
            value={view}
            options={options}
            onChange={(newOption) => {
              if (newOption)
                onSelectView({
                  label: newOption.label,
                  value: newOption.value,
                });
              onClose();
            }}
          />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}

export default ViewPickerModal;
