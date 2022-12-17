import { Input } from '@chakra-ui/input';
import { Modal, ModalContent } from '@chakra-ui/modal';
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
        <Input type='date' onChange={(event) => setSelectedDate(event.target.value)} />
      </ModalContent>
    </Modal>
  );
}
