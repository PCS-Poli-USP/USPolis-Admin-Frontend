import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Select as CSelect } from '@chakra-ui/react';
import Select from 'react-select';
import { AvailableClassroom } from 'models/classroom.model';
import { useContext, useEffect, useState } from 'react';
import { SClass } from 'models/class.model';
import BuildingsService from 'services/buildings.service';
import ClassroomsService from 'services/classrooms.service';
import { Building } from 'models/building.model';
import { appContext } from 'context/AppContext';
import Dialog from 'components/common/dialog.component';

interface ClassroomOption {
  value: string;
  label: string;
}

interface MultipleEditAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    events_ids: string[],
    newClassroom: string,
    building_id: string,
  ) => void;
  onDelete: (events_ids: string[]) => void;
  seletecSubjects: [string, SClass[]][];
}

export default function MultipleEditAllocationModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  seletecSubjects,
}: MultipleEditAllocationModalProps) {
  const {
    isOpen: isOpenDialog,
    onOpen: onOpenDialog,
    onClose: onCloseDialog,
  } = useDisclosure();

  const { dbUser } = useContext(appContext);

  const [availableClassrooms, setAvailableClassrooms] = useState<
    AvailableClassroom[]
  >([]);
  const [selectedClassroom, setSelectedClassroom] =
    useState<AvailableClassroom>();
  const [classroomsLoading, setClassroomsLoading] = useState(false);

  const [selectedBuilding, setSelectedBuilding] = useState<Building>();
  const [buildingsList, setBuildingsList] = useState<Building[]>([]);
  const [buildingsLoading, setBuildingsLoading] = useState(true);

  const classroomsService = new ClassroomsService();
  const buildingsService = new BuildingsService();

  useEffect(() => {
    if (buildingsList.length === 1) {
      console.log('Meu prédio: ', buildingsList);
      setSelectedBuilding(buildingsList[0]);
    }
  }, [buildingsList]);

  useEffect(() => {
    getBuildingsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbUser]);

  useEffect(() => {
    getAvailableClassrooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBuilding]);

  async function getAvailableClassrooms() {
    if (!selectedBuilding) return;
    try {
      setClassroomsLoading(true);
      await tryGetAvailableClassrooms();
    } finally {
      setClassroomsLoading(false);
    }
  }

  async function tryGetAvailableClassrooms() {
    setSelectedClassroom(undefined);
    const response = await classroomsService.getAvailableWithConflictIndicator({
      events_ids: getEventsIds(),
      building_id: selectedBuilding?.id!,
    });
    setAndSortAvailableClassrooms(response.data);
    setClassroomsLoading(false);
  }

  function setAndSortAvailableClassrooms(value: AvailableClassroom[]) {
    setAvailableClassrooms(
      value.sort((a, b) => {
        if (a.conflicted && !b.conflicted) return 1;
        if (!a.conflicted && b.conflicted) return -1;
        if (a.classroom_name < b.classroom_name) return -1;
        if (a.classroom_name > b.classroom_name) return 1;
        return 0;
      }),
    );
  }

  function getBuildingsList() {
    if (dbUser) {
      if (dbUser.isAdmin) {
        setBuildingsLoading(true);
        buildingsService.list().then((response) => {
          setBuildingsList(response.data);
          setBuildingsLoading(false);
        });
      } else {
        setBuildingsList(dbUser.buildings);
      }
    }
  }

  function getEventsIds() {
    const events_ids: string[] = [];
    seletecSubjects.forEach((map) =>
      map[1].forEach((cl) => events_ids.push(...cl.events_ids)),
    );
    return events_ids;
  }

  function handleSaveClick() {
    const events_ids = getEventsIds();
    if (events_ids.length === 0) return;
    onSave(
      events_ids,
      selectedClassroom?.classroom_name!,
      selectedBuilding?.id!,
    );
    onClose();
  }

  function handleDeleteClick() {
    onOpenDialog();
  }

  function handleDeleteConfirm() {
    onCloseDialog();
    const events_ids = getEventsIds();
    if (events_ids.length > 0) {
      onDelete(events_ids);
      onClose();
    }
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
          <FormControl>
            {seletecSubjects.length === 0 ? (
              <Alert status='error' mb={4}>
                <AlertIcon />
                Nenhuma turma foi selecionada
              </Alert>
            ) : (
              <Alert status={'warning'} mb={4}>
                <AlertIcon />
                Todas turmas serão colocadas na mesma sala
              </Alert>
            )}

            <Text as={'b'}>Turmas selecionadas:</Text>

            <VStack spacing={2} alignItems={'flex-start'} mb={4} mt={4}>
              {seletecSubjects.map((value, index) => (
                <Text key={index}>
                  {value[0]} - {value[1].length} Turmas
                </Text>
              ))}
            </VStack>

            {buildingsList.length !== 1 && (
              <>
                <FormLabel mt={4}>Prédio</FormLabel>
                <CSelect
                  placeholder='Selecionar prédio'
                  onChange={(event) => {
                    setSelectedBuilding(
                      buildingsList.find((it) => it.id === event.target.value),
                    );
                  }}
                  icon={buildingsLoading ? <Spinner size='sm' /> : undefined}
                  value={selectedBuilding?.id}
                >
                  {buildingsList.map((it) => (
                    <option key={it.id} value={it.id}>
                      {it.name}
                    </option>
                  ))}
                </CSelect>
              </>
            )}

            <FormLabel mt={4}>Salas disponíveis</FormLabel>
            {selectedClassroom?.conflicted && (
              <Alert status='warning' fontSize='sm' mb={4}>
                <AlertIcon />
                Esta alocação gerará conflitos
              </Alert>
            )}

            <Select
              placeholder={'Sala - Capacidade'}
              isLoading={classroomsLoading}
              options={availableClassrooms.map((it) =>
                it.conflicted
                  ? {
                      value: it.classroom_name,
                      label: `⚠️ ${it.classroom_name} - ${it.capacity}`,
                    }
                  : {
                      value: it.classroom_name,
                      label: `${it.classroom_name} - ${it.capacity}`,
                    },
              )}
              onChange={(selected) => {
                const selectedClassroom = selected as ClassroomOption;
                setSelectedClassroom(
                  availableClassrooms.find(
                    (it) => selectedClassroom.value === it.classroom_name,
                  ),
                );
              }}
            />
          </FormControl>
          <Dialog
            isOpen={isOpenDialog}
            onClose={onCloseDialog}
            onConfirm={handleDeleteConfirm}
            title={`Deseja remover a alocação ds turmas selecionadas`}
            warningText='Atenção: ao confirmar a alocação dessas turmas serão perdidas'
          />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme='blue'
            mr={2}
            onClick={handleSaveClick}
            isDisabled={seletecSubjects.length === 0 || !selectedClassroom}
          >
            Salvar
          </Button>
          <Button colorScheme='red' mr={2} onClick={handleDeleteClick}>
            Remover
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
