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
  const [newClassroom, setNewClassroom] = useState('');
  const [selectedClassroom, setSelectedClassroom] =
    useState<AvailableClassroom>({
      classroom_name: '',
      building: '',
      capacity: 0,
    });
  const [buildingIdSelection, setBuildingIdSelection] = useState<
    string | undefined
  >(undefined);
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
      setBuildingIdSelection(buildingsList[0].id);
    }
  }, [buildingsList]);

  useEffect(() => {
    getBuildingsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbUser]);

  useEffect(() => {
    if (buildingIdSelection) {
      setNewClassroom('');
      setClassroomsLoading(true);
      getAvailableClassrooms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildingIdSelection]);

  async function getAvailableClassrooms() {
    const response = await classroomsService.getAvailableWithConflictIndicator({
      events_ids: classEvents.map((it) => it.id!),
      building_id: buildingIdSelection!,
    });
    setAndSortAvailableClassrooms(response.data);
    setClassroomsLoading(false);
  }

  useEffect(() => {
    setCheckedEvents(classEvents.map((it) => it.id ?? ''));
  }, [classEvents]);

  useEffect(() => {
    const classroom = availableClassrooms?.find(
      (it) => it.classroom_name === newClassroom,
    );
    if (classroom) {
      setSelectedClassroom(classroom);
    }
    // eslint-disable-next-line
  }, [newClassroom]);

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

  function handleSaveClick() {
    onSave(checkedEvents as string[], newClassroom, buildingIdSelection!);
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
              !selectedClassroom.classroom_name
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
            <Text>
              {Capitalize(classEvents[0].weekday)} - {classEvents[0].startTime}{' '}
              {classEvents[0].endTime}
            </Text>
          )}

          <FormControl>
            <FormLabel mt={4}>Prédio</FormLabel>
            {buildingsList.length !== 1 && (
              <Select
                placeholder='selecionar prédio'
                onChange={(event) => setBuildingIdSelection(event.target.value)}
                icon={buildingsLoading ? <Spinner size='sm' /> : undefined}
              >
                {buildingsList.map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.name}
                  </option>
                ))}
              </Select>
            )}
            <FormLabel mt={4}>Salas disponíveis</FormLabel>
            <Select
              icon={classroomsLoading ? <Spinner size='sm' /> : undefined}
              disabled={classroomsLoading || !buildingIdSelection}
              placeholder='Sala - Capacidade'
              isInvalid={classData?.subscribers > selectedClassroom.capacity}
              value={newClassroom}
              onChange={(event) => {
                setNewClassroom(event.target.value);
              }}
            >
              {availableClassrooms.map((it) => (
                <option key={it.classroom_name} value={it.classroom_name}>
                  {it.conflicted ? <strong>! </strong> : ''}
                  {it.classroom_name} - {it.capacity}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme='blue'
            mr={2}
            onClick={handleSaveClick}
            isDisabled={!newClassroom}
          >
            Salvar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
