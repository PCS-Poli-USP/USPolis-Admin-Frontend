import {
  Alert,
  AlertIcon,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  ListItem,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import Select from 'react-select';
import Classroom from 'models/classroom.model';
import { useState } from 'react';
import { SClass } from 'models/class.model';

interface ClassroomOption {
  value: string;
  label: string;
}

interface MultipleEditAllocationModal {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newClassroom: string) => void;
  classrooms: Classroom[];
  seletecSubjects: [string, SClass[]][];
}

export default function MultipleEditAllocationModal({
  isOpen,
  onClose,
  onSave,
  classrooms,
  seletecSubjects,
}: MultipleEditAllocationModal) {
  const [selectedClassroom, setSelectedClassroom] = useState('');

  function handleSaveClick() {
    if (selectedClassroom.length === 0) return;
    onSave(selectedClassroom);
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar alocação de várias turmas</ModalHeader>
        <ModalCloseButton />

        <ModalBody px={6}>
          <Text as={'b'}>Turmas selecionadas:</Text>

          {seletecSubjects.length === 0 ? (
            <Alert status='error' mb={4}>
              <AlertIcon />
              Nenhuma turma foi selecionada
            </Alert>
          ) : undefined}

          <VStack spacing={2} alignItems={'flex-start'} mb={4} mt={4}>
            {seletecSubjects.map((value, index) => (
              <Text key={index}>
                {value[0]} - {value[1].length} Turmas
              </Text>
            ))}
          </VStack>

          <Select
            placeholder={'Sala - Capacidade'}
            options={classrooms.map((it) => ({
              value: it.classroom_name,
              label: `${it.classroom_name} - ${it.capacity}`,
            }))}
            onChange={(selected) => {
              const selectedCl = selected as ClassroomOption;
              setSelectedClassroom(selectedCl.value);
            }}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme='blue'
            mr={2}
            onClick={handleSaveClick}
            isDisabled={seletecSubjects.length === 0}
          >
            Salvar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
