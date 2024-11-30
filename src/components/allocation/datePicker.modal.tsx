import {
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalContent,
  IconButton,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalCloseButton,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { useState } from 'react';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
}

export default function DatePickerModal({
  isOpen,
  onClose,
  onSelectDate,
}: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>();

  function handleCloseModal() {
    if (selectedDate) {
      onSelectDate(selectedDate);
    }
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} size='xs'>
      <ModalContent pt={4}>
        <ModalHeader>Selecione uma data</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <InputGroup>
            <Input
              type='date'
              onChange={(event) => {
                setSelectedDate(event.target.value);
              }}
            />
            <InputRightElement
              children={
                <IconButton
                  aria-label='Confirm date'
                  size='sm'
                  colorScheme='blue'
                  icon={<CheckIcon />}
                  onClick={handleCloseModal}
                />
              }
            />
          </InputGroup>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
