import {
  Alert,
  AlertIcon,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Stack,
  Text,
  useCheckboxGroup,
} from '@chakra-ui/react';
import { appContext } from 'context/AppContext';
import { Building } from 'models/building.model';
import { AvailableClassroom } from 'models/classroom.model';
import { EventByClassrooms } from 'models/event.model';
import { useContext, useEffect, useState } from 'react';
import BuildingsService from 'services/buildings.service';
import ClassroomsService from 'services/classrooms.service';
import { Capitalize } from 'utils/formatters';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    events_ids: string[],
    newClassroom: string,
    building_id: string,
  ) => void;
  classEvents: EventByClassrooms[];
}

export default function EditEventModal({
  isOpen,
  onClose,
  onSave,
  classEvents,
}: EditEventModalProps) {
  const { dbUser } = useContext(appContext);
  const [availableClassrooms, setAvailableClassrooms] = useState<
    AvailableClassroom[]
  >([]);
  const [selectedClassroom, setSelectedClassroom] =
    useState<AvailableClassroom>();
  const [selectedBuilding, setSelectedBuilding] = useState<Building>();
  const [buildingsList, setBuildingsList] = useState<Building[]>([]);
  const [buildingsLoading, setBuildingsLoading] = useState(true);
  const [classroomsLoading, setClassroomsLoading] = useState(false);
  const checkBoxHook = useCheckboxGroup();
  const checkedEvents = checkBoxHook.value;
  const setCheckedEvents = checkBoxHook.setValue;
  const getCheckboxProps = checkBoxHook.getCheckboxProps;

  const classroomsService = new ClassroomsService();
  const buildingsService = new BuildingsService();

  const classData = classEvents[0];

  useEffect(() => {
    if (buildingsList.length === 1) {
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

  useEffect(() => {
    resetClassroomsDropdown();
    getAvailableClassrooms();
  }, [checkedEvents]);

  useEffect(() => {
    setCheckedEvents(classEvents.map((it) => it.id ?? ''));
  }, [classEvents]);

  async function getAvailableClassrooms() {
    if (!selectedBuilding) return;
    if (checkedEvents.length < 1) return;
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
      events_ids: classEvents.map((it) => it.id!),
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

  function resetClassroomsDropdown() {
    setAvailableClassrooms([]);
  }

  function handleSaveClick() {
    onSave(
      checkedEvents as string[],
      selectedClassroom?.classroom_name!,
      selectedBuilding?.id!,
    );
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
        <ModalHeader>
          Editar alocação - {classData?.subjectCode}
          <Text fontSize='md' fontWeight='normal'>
            {classData?.classCodeText} -{' '}
            {classData?.professors.join(', ').length > 25
              ? classData?.professors[0] + '...'
              : classData?.professors.join(', ')}
          </Text>
          <Alert
            status={
              !selectedClassroom?.classroom_name
                ? 'info'
                : classData?.subscribers > selectedClassroom.capacity
                ? 'error'
                : 'success'
            }
            fontSize='md'
            mt={2}
          >
            <AlertIcon />
            Inscritos: {classData?.subscribers}
          </Alert>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody px={6}>
          {classEvents.length > 1 ? (
            <Stack mt={1} spacing={1}>
              <Checkbox
                isChecked={checkedEvents.length === classEvents.length}
                onChange={(e) => {
                  e.target.checked
                    ? setCheckedEvents(classEvents.map((it) => it.id ?? ''))
                    : setCheckedEvents([]);
                }}
              >
                Todos os horários
              </Checkbox>
              {classEvents.map((it) => {
                return (
                  <Stack key={it.id} spacing={1} pl={6}>
                    <Checkbox
                      key={it.id}
                      {...getCheckboxProps({ value: it.id })}
                    >
                      {Capitalize(it.weekday)} - {it.startTime} {it.endTime}
                    </Checkbox>
                  </Stack>
                );
              })}
            </Stack>
          ) : (
            classEvents[0] && (
              <Text>
                {Capitalize(classEvents[0].weekday)} -{' '}
                {classEvents[0].startTime} {classEvents[0].endTime}
              </Text>
            )
          )}

          <FormControl>
            <FormLabel mt={4}>Prédio</FormLabel>
            {buildingsList.length !== 1 && (
              <Select
                placeholder='selecionar prédio'
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
              </Select>
            )}
            <FormLabel mt={4}>Salas disponíveis</FormLabel>
            {selectedClassroom?.conflicted && (
              <Alert status='warning' fontSize='sm' mb={4}>
                <AlertIcon />
                Esta alocação gerará conflitos
              </Alert>
            )}
            <Select
              icon={classroomsLoading ? <Spinner size='sm' /> : undefined}
              disabled={
                classroomsLoading ||
                !selectedBuilding ||
                availableClassrooms.length < 1
              }
              placeholder='Sala - Capacidade'
              isInvalid={
                selectedClassroom &&
                classData?.subscribers > selectedClassroom.capacity
              }
              value={selectedClassroom?.classroom_name}
              onChange={(event) => {
                setSelectedClassroom(
                  availableClassrooms.find(
                    (it) => event.target.value === it.classroom_name,
                  ),
                );
              }}
            >
              {availableClassrooms.map((it) =>
                it.conflicted ? (
                  <option key={it.classroom_name} value={it.classroom_name}>
                    ⚠️ {it.classroom_name} - {it.capacity}
                  </option>
                ) : (
                  <option key={it.classroom_name} value={it.classroom_name}>
                    {it.classroom_name} - {it.capacity}
                  </option>
                ),
              )}
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme='blue'
            mr={2}
            onClick={handleSaveClick}
            isDisabled={!selectedClassroom || checkedEvents.length < 1}
          >
            Salvar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
