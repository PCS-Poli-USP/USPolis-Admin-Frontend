import { CheckIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Modal, ModalContent } from '@chakra-ui/modal';
import { IconButton } from '@chakra-ui/react';
import { useState } from 'react';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
}

export default function DatePickerModal({ isOpen, onClose, onSelectDate }: DatePickerModalProps) {
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
        <InputGroup>
          <Input type='date' onChange={(event) => setSelectedDate(event.target.value)} />
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
      </ModalContent>
    </Modal>
  );
}
