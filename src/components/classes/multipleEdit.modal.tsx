import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
  StackDivider,
  useToast,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import { SClass } from 'models/class.model';
import MultipleEditAccordion from './multipleEdit.accordion';
import { useEffect, useState } from 'react';
import { CalendarIcon, DeleteIcon } from '@chakra-ui/icons';
import Classroom from 'models/classroom.model';
import ClassroomsService from 'services/classrooms.service';
import MultipleEditAllocationModal from './multipleEdit.allocation.modal';
import { sortClassrooms } from 'utils/sorter';
import { BsSearch } from 'react-icons/bs';

interface MultipleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectsMap: [string, SClass[]][];
}

export default function MultipleEditModal({
  isOpen,
  onClose,
  subjectsMap,
}: MultipleEditModalProps) {
  const {
    isOpen: isOpenMultipleAllocEdit,
    onOpen: onOpenMultipleAllocEdit,
    onClose: onCloseMultipleAllocEdit,
  } = useDisclosure();

  const [subjectSearchValue, setSubjectSearchValue] = useState('');
  const [classroomSearchValue, setClassroomSearchValue] = useState('');
  const [classroomsList, SetClassroomsList] = useState<Classroom[]>([]);
  const [map, SetMap] = useState<[string, SClass[]][]>([]);
  const [filteredMap, SetFilteredMap] = useState<[string, SClass[]][]>([]);

  const classroomsService = new ClassroomsService();
  const toast = useToast();
  const toastSuccess = (message: string) => {
    toast({
      position: 'top-left',
      title: 'Sucesso!',
      description: message,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  const toastError = (message: string) => {
    toast({
      position: 'top-left',
      title: 'Erro!',
      description: message,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  useEffect(() => {
    if (subjectsMap.length > 0) {
      SetMap(subjectsMap);
    }
  }, [subjectsMap]);

  useEffect(() => {
    if (classroomsList.length === 0) {
      classroomsService
        .list()
        .then((it) => {
          SetClassroomsList(it.data.sort(sortClassrooms));
        })
        .catch((error) => {
          toastError(`Erro ao carregar salas: ${error}`);
        });
    }
  }, [classroomsList]);

  function getSelectedClasses() {
    const selectedMap: [string, SClass[]][] = [];
    map.forEach((value) => {
      const selectedClasses: SClass[] = [];
      value[1].forEach((cl) => {
        if (cl.selected) selectedClasses.push(cl);
      });
      if (selectedClasses.length > 0) {
        selectedMap.push([value[0], selectedClasses]);
      }
    });
    return selectedMap;
  }

  function handleSelectAll(selected: boolean) {
    const newMap = [...map];
    newMap.forEach((value) => {
      value[1].forEach((sclass) => (sclass.selected = selected));
    });
    SetMap(newMap);
  }

  function handleClickOne(subjectCode: string, classCode: string) {
    const newMap = [...map];
    const mapIndex = newMap.findIndex((value) => value[0] === subjectCode);
    if (mapIndex >= 0) {
      const classIndex = newMap[mapIndex][1].findIndex(
        (value) => value.class_code === classCode,
      );

      if (classIndex >= 0) {
        newMap[mapIndex][1][classIndex].selected =
          !newMap[mapIndex][1][classIndex].selected;
      }
    }
    SetMap(newMap);
  }

  function handleClickAll(subjectCode: string, selected: boolean) {
    const newMap = [...map];
    const mapIndex = newMap.findIndex((value) => value[0] === subjectCode);
    if (mapIndex >= 0) {
      newMap[mapIndex][1].forEach((value) => (value.selected = selected));
    }
    SetMap(newMap);
  }

  function handleAllocationClick() {
    onOpenMultipleAllocEdit();
  }

  function handleMultipleAlloc(classroom: string) {}

  function FilterSubjects(subjectValue: string) {
    if (subjectValue) {
      const newMap = map.filter((value) => value[0].includes(subjectValue));
      SetFilteredMap(newMap);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'4xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edição Múltipla</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={2} mb={4} alignItems={'flex-start'}>
            <Text as={'b'}>Opções:</Text>
            <HStack spacing={2}>
              <InputGroup w='fit-content'>
                <InputLeftElement pointerEvents='none'>
                  <BsSearch color='gray.300' />
                </InputLeftElement>
                <Input
                  type='text'
                  placeholder='Filtrar disciplinas'
                  value={subjectSearchValue}
                  onChange={(event) => {
                    setSubjectSearchValue(event.target.value.toUpperCase());
                    FilterSubjects(event.target.value.toUpperCase());
                  }}
                />
              </InputGroup>
              <Button variant={'solid'} onClick={() => handleSelectAll(true)}>
                Selecionar todas disciplinas
              </Button>
              <Button variant={'solid'} onClick={() => handleSelectAll(false)}>
                Remover todas disciplinas
              </Button>
            </HStack>
          </VStack>

          <MultipleEditAccordion
            subjectsMap={subjectSearchValue ? filteredMap : map}
            handleClickCheckBox={handleClickOne}
            handleSelectAllCheckBox={handleClickAll}
          />
          <MultipleEditAllocationModal
            isOpen={isOpenMultipleAllocEdit}
            onClose={onCloseMultipleAllocEdit}
            onSave={handleMultipleAlloc}
            classrooms={classroomsList}
            seletecSubjects={getSelectedClasses()}
          />
        </ModalBody>

        <ModalFooter>
          <HStack spacing={2}>
            <Button
              colorScheme={'yellow'}
              leftIcon={<CalendarIcon />}
              onClick={handleAllocationClick}
            >
              Alocar selecionados
            </Button>
            <Button colorScheme={'red'} leftIcon={<DeleteIcon />}>
              Excluir selecionados
            </Button>
            <Button colorScheme={'blue'} mr={3} onClick={onClose}>
              Fechar
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
