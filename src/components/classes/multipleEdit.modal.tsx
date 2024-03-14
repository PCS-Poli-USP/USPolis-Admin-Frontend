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
  Text,
  VStack,
  Alert,
  AlertIcon,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import Class from 'models/class.model';
import MultipleEditAccordion from './multipleEdit.accordion';
import { useEffect, useState } from 'react';
import { CalendarIcon, DeleteIcon } from '@chakra-ui/icons';
import EventsService from 'services/events.service';
import Dialog from 'components/common/dialog.component';
import { ClassesBySubject } from 'utils/mappers/classes.mapper';
import { sortClassMapByClassAmount, sortClassMapBySubject } from 'utils/sorter';

interface MultipleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  classes: Class[];
}

interface Allocation {
  event_id: string;
  classroom?: string;
  building_id?: string;
}

export default function MultipleEditModal({
  isOpen,
  onClose,
  onRefresh,
  classes,
}: MultipleEditModalProps) {
  const {
    isOpen: isOpenDeleteDialog,
    onOpen: onOpenDeleteDialog,
    onClose: onCloseDeleteDialog,
  } = useDisclosure();

  const [map, setMap] = useState<[string, Class[]][]>([]);
  const [allocationMap, setAllocationMap] = useState<Allocation[]>([]);
  const [hasMissingData, setHasMissingData] = useState(false);

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
      const newAllocationMap: Allocation[] = [];
      classes.forEach((cl) => {
        cl.events_ids.forEach((id) => {
          newAllocationMap.push({ event_id: id });
        });
      });
      setAllocationMap(newAllocationMap);
      setMap(ClassesBySubject(classes));
    } else setMap([]);
  }, [classes]);

  function getSelectedEventsIds() {
    const events_ids: string[] = [];
    classes.forEach((cl) => events_ids.push(...cl.events_ids));
    return events_ids;
  }

  function handleSelectBuilding(building_id: string, event_id: string) {
    setHasMissingData(false);
    const newAllocationMap = [...allocationMap];
    newAllocationMap.forEach((alloc) => {
      if (alloc.event_id === event_id) {
        alloc.building_id = building_id;
      }
    });
    setAllocationMap(newAllocationMap);
  }

  function handleSelectClassroom(classroom: string, event_id: string) {
    setHasMissingData(false);
    const newAllocationMap = [...allocationMap];
    newAllocationMap.forEach((alloc) => {
      if (alloc.event_id === event_id) {
        alloc.classroom = classroom;
      }
    });
    setAllocationMap(newAllocationMap);
  }

  function handleAllocationClick() {
    const data = getAllocationData();
    if (
      data.events_ids.length === data.classrooms.length &&
      data.events_ids.length === data.buildings_ids.length
    ) {
      eventsService
        .editManyAllocationsInManyBuildings(data)
        .then((it) => {
          toastSuccess('Alocações editadas com sucesso!');
          // refetch data
          // TODO: create AllocationContext
        })
        .catch((error) => {
          toastError(`Erro ao editar alocações: ${error}`);
        })
        .finally(() => {
          onRefresh();
          onClose();
        });
    } else {
      setHasMissingData(true);
      return;
    }
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
        onClose();
      });
  }

  function getAllocationData() {
    const events_ids: string[] = [];
    const classrooms: string[] = [];
    const buildings_ids: string[] = [];
    allocationMap.forEach((alloc) => {
      events_ids.push(alloc.event_id);
      if (alloc.classroom) classrooms.push(alloc.classroom);
      if (alloc.building_id) buildings_ids.push(alloc.building_id);
    });
    return { events_ids, classrooms, buildings_ids };
  }

  function handleCloseClick() {
    setMap([]);
    setAllocationMap([]);
    setHasMissingData(false);
    onClose();
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
            <RadioGroup defaultValue={'1'}>
              <HStack spacing={2}>
                <Radio
                  size='sm'
                  value={'1'}
                  onChange={(event) => {
                    if (event.target.checked) {
                      const newMap = [...map];
                      newMap.sort(sortClassMapBySubject);
                      setMap(newMap);
                    }
                  }}
                >
                  Ordernar por Código da Disciplina
                </Radio>
                <Radio
                  size='sm'
                  value={'2'}
                  onChange={(event) => {
                    if (event.target.checked) {
                      const newMap = [...map];
                      newMap.sort(sortClassMapByClassAmount);
                      setMap(newMap);
                    }
                  }}
                >
                  Ordernar por Quantidade de Turmas
                </Radio>
              </HStack>
            </RadioGroup>
          </VStack>

          <MultipleEditAccordion
            subjectsMap={map}
            handleSelectBuilding={handleSelectBuilding}
            handleSelectClassroom={handleSelectClassroom}
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
          <VStack>
            {hasMissingData ? (
              <Alert status={'error'}>
                <AlertIcon />
                Selecione alocações para todas as turmas
              </Alert>
            ) : undefined}
            <HStack spacing={2}>
              <Button
                colorScheme={'yellow'}
                leftIcon={<CalendarIcon />}
                onClick={handleAllocationClick}
                disabled={map.length === 0 || hasMissingData}
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
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
