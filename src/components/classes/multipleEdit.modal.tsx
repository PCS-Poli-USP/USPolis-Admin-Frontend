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
  useToast,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import Class from 'models/class.model';
import MultipleEditAccordion from './multipleEdit.accordion';
import { useEffect, useState } from 'react';
import { CalendarIcon, DeleteIcon } from '@chakra-ui/icons';
import MultipleEditAllocationModal from './multipleEdit.allocation.modal';
import { BsSearch } from 'react-icons/bs';
import EventsService from 'services/events.service';
import Dialog from 'components/common/dialog.component';
import { ClassesBySubject } from 'utils/mappers/classes.mapper';

interface MultipleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  classes: Class[];
}

export default function MultipleEditModal({
  isOpen,
  onClose,
  onRefresh,
  classes,
}: MultipleEditModalProps) {
  const {
    isOpen: isOpenMultipleAllocEdit,
    onOpen: onOpenMultipleAllocEdit,
    onClose: onCloseMultipleAllocEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteDialog,
    onOpen: onOpenDeleteDialog,
    onClose: onCloseDeleteDialog,
  } = useDisclosure();

  const [subjectSearchValue, setSubjectSearchValue] = useState('');
  const [map, setMap] = useState<[string, Class[]][]>([]);
  const [filteredMap, setFilteredMap] = useState<[string, Class[]][]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);

  const eventsService = new EventsService();

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
    if (classes.length > 0) {
      if (filteredClasses.length > 0) setMap(ClassesBySubject(filteredClasses));
      else setMap(ClassesBySubject(classes));
    } else setMap([]);
  }, [classes, filteredClasses]);

  // function getSelectedClasses() {
  //   const selectedMap: [string, SClass[]][] = [];
  //   map.forEach((value) => {
  //     const selectedClasses: SClass[] = [];
  //     value[1].forEach((cl) => {
  //       if (cl.selected) selectedClasses.push(cl);
  //     });
  //     if (selectedClasses.length > 0) {
  //       selectedMap.push([value[0], selectedClasses]);
  //     }
  //   });
  //   return selectedMap;
  // }

  function getSelectedEventsIds() {
    const events_ids: string[] = [];
    classes.forEach((cl) => events_ids.push(...cl.events_ids));
    return events_ids;
  }


  function handleAllocationClick() {
    onOpenMultipleAllocEdit();
  }

  function handleMultipleAlloc(
    events_ids: string[],
    newClassroom: string,
    building_id: string,
  ) {
    eventsService
      .editManyAllocations({
        events_ids,
        classroom: newClassroom,
        building_id,
      })
      .then((it) => {
        toastSuccess('Alocação editada com sucesso!');
        // refetch data
        // TODO: create AllocationContext
      })
      .catch((error) => {
        toastError(`Erro ao editar alocação: ${error}`);
      })
      .finally(() => {
        onRefresh();
      });
  }

  function handleDeleteEventsClick() {
    onOpenDeleteDialog();
  }

  function handleDeleteEventsConfirm() {
    onCloseDeleteDialog();
    const events_ids = getSelectedEventsIds();
    eventsService
      .deleteManyEvents({ events_ids })
      .then((it) => {
        toastSuccess('Turmas removidas com sucesso!');
      })
      .catch((error) => {
        toastError(`Erro ao remover turmas: ${error}`);
      })
      .finally(() => {
        onRefresh();
      });
  }

  function handleMultipleAllocDelete(events_ids: string[]) {
    eventsService
      .deleteManyAllocations({
        events_ids,
      })
      .then((it) => {
        toastSuccess('Alocações removidas com sucesso!');
        // refetch data
        // TODO: create AllocationContext
      })
      .catch((error) => {
        toastError(`Erro ao remover alocações: ${error}`);
      })
      .finally(() => {
        onRefresh();
      });
  }

  function handleCloseClick() {
    setMap([]);
    onClose();
  }

  function FilterSubjects(subjectValue: string) {
    if (subjectValue) {
      const filtered = classes.filter((cl) =>
        cl.subject_code.includes(subjectValue),
      );
      setFilteredClasses(filtered);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCloseClick} size={'5xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edição de Turmas Selecionadas</ModalHeader>
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
            </HStack>
          </VStack>

          <MultipleEditAccordion
            subjectsMap={map}
            // handleClickCheckBox={handleClickOne}
            // handleSelectAllCheckBox={handleClickAll}
          />
          {/* <MultipleEditAllocationModal
            isOpen={isOpenMultipleAllocEdit}
            onClose={onCloseMultipleAllocEdit}
            onSave={handleMultipleAlloc}
            onDelete={handleMultipleAllocDelete}
            seletecSubjects={getSelectedClasses()}
          /> */}

          <Dialog
            isOpen={isOpenDeleteDialog}
            onClose={onCloseDeleteDialog}
            onConfirm={handleDeleteEventsConfirm}
            title={'Deseja remover as turmas selecioandas'}
            warningText={'Atenção: ao confirmar essas turmas serão excluídas'}
          />
        </ModalBody>

        <ModalFooter>
          <HStack spacing={2}>
            <Button
              colorScheme={'yellow'}
              leftIcon={<CalendarIcon />}
              onClick={handleAllocationClick}
              disabled={map.length === 0}
            >
              Alocar selecionados
            </Button>
            <Button
              colorScheme={'red'}
              leftIcon={<DeleteIcon />}
              onClick={handleDeleteEventsClick}
              disabled={map.length === 0}
            >
              Excluir selecionados
            </Button>
            <Button colorScheme={'blue'} mr={3} onClick={handleCloseClick}>
              Fechar
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
