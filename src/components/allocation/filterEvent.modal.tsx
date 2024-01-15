import {
  Button,
  Checkbox,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Flex,
  HStack,
  FormLabel,
  VStack,
} from '@chakra-ui/react';

import { BsSearch } from 'react-icons/bs';

interface FilterEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterFn: (classVal: string, classroomVal: string) => void;
  handleSubjectChange: (newValue: string) => void;
  handleClassroomChange: (newValue: string) => void;
  subjectSearchValue: string;
  classroomSearchValue: string;
}

export function FilterEventModal(props: FilterEventModalProps) {
  function handleCloseModal() {
    props.handleClassroomChange('');
    props.handleSubjectChange('');
    props.onClose();
  }

  function handleFilterClick() {
    props.filterFn(props.subjectSearchValue, props.classroomSearchValue);
    props.onClose();
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={handleCloseModal}
      closeOnOverlayClick={false}
      motionPreset='slideInBottom'
      size={'xl'}
      scrollBehavior='outside'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Filtrar alocações</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack spacing={5}>
            <VStack alignItems='start' spacing={0} w='full'>
              <FormLabel fontWeight='bold'>Disciplina</FormLabel>
              <Input
                type='text'
                value={props.subjectSearchValue}
                onChange={(event) => props.handleSubjectChange(event.target.value)}
              />
            </VStack>

            <VStack alignItems='start' spacing={0} w='full'>
              <FormLabel fontWeight='bold'>Sala</FormLabel>
              <Input
                type='text'
                value={props.classroomSearchValue}
                onChange={(event) => props.handleClassroomChange(event.target.value)}
              />
            </VStack>
          </HStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='red' mr={5} onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button leftIcon={<BsSearch />} colorScheme='teal' variant='solid' onClick={handleFilterClick}>
            Filtrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
