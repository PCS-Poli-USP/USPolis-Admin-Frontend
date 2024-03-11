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
import { SClass } from 'models/class.model';
import MultipleEditAccordion from './multipleEdit.accordion';
import { useEffect, useState } from 'react';
import { CalendarIcon, DeleteIcon } from '@chakra-ui/icons';
import MultipleEditAllocationModal from './multipleEdit.allocation.modal';
import { BsSearch } from 'react-icons/bs';
import EventsService from 'services/events.service';
import Dialog from 'components/common/dialog.component';

interface MultipleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  subjectsMap: [string, SClass[]][];
}

export default function MultipleEditModal({
  isOpen,
  onClose,
  onRefresh,
  subjectsMap,
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
  const [map, SetMap] = useState<[string, SClass[]][]>([]);
  const [filteredMap, SetFilteredMap] = useState<[string, SClass[]][]>([]);

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
    if (subjectsMap.length > 0) {
      SetMap(subjectsMap);
    } else SetMap([]);
  }, [subjectsMap]);

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

  function getSelectedEventsIds() {
    const events_ids: string[] = [];
    map.forEach((value) =>
      value[1].forEach((cl) => {
        if (cl.selected) {
          events_ids.push(...cl.events_ids);
        }
      }),
    );
    return events_ids;
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
    SetMap([]);
    onClose();
  }

  function FilterSubjects(subjectValue: string) {
    if (subjectValue) {
      const newMap = map.filter((value) => value[0].includes(subjectValue));
      SetFilteredMap(newMap);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCloseClick} size={'5xl'}>
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
                Marcar todas disciplinas
              </Button>
              <Button variant={'solid'} onClick={() => handleSelectAll(false)}>
                Desmarcar todas disciplinas
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
            onDelete={handleMultipleAllocDelete}
            seletecSubjects={getSelectedClasses()}
          />

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
