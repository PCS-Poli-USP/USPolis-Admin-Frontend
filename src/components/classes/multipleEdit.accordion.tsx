import {
  Alert,
  AlertIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  FormLabel,
  HStack,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Select as CSelect } from '@chakra-ui/react';
import Select from 'react-select';
import Class from 'models/class.model';
import { getClassScheduleShortText } from 'utils/classes/classes.formatter';
import ClassroomsService from 'services/classrooms.service';
import BuildingsService from 'services/buildings.service';
import { useContext, useEffect, useState } from 'react';
import { AvailableClassroom } from 'models/classroom.model';
import { Building } from 'models/building.model';
import { appContext } from 'context/AppContext';
import Event from 'models/event.model';
import { Capitalize } from 'utils/formatters';

interface ClassroomOption {
  value: string;
  label: string;
}

interface MultipleEditAccordionProps {
  subjectsMap: [string, Class[]][];
  // handleClickCheckBox: (subjectCode: string, classCode: string) => void;
  // handleSelectAllCheckBox: (subjectCode: string, value: boolean) => void;
}

export default function MultipleEditAccordion({
  subjectsMap,
}: // handleClickCheckBox,
// handleSelectAllCheckBox,
MultipleEditAccordionProps) {
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

  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [selectedClass, setSelectedClass] = useState<Class>();

  const classroomsService = new ClassroomsService();
  const buildingsService = new BuildingsService();

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
      events_ids: selectedClass ? selectedClass.events_ids : [],
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

  return (
    <Accordion allowMultiple={true}>
      {subjectsMap.length === 0 ? (
        <Alert status='warning' fontSize='sm' mb={4}>
          <AlertIcon />
          Nenhuma turma selecionada
        </Alert>
      ) : undefined}

      {subjectsMap.map((subjectMap, index) => (
        <AccordionItem key={index}>
          <AccordionButton>
            <Box as='span' flex='1' textAlign='left'>
              <Text as={'b'}>
                {subjectMap[0]} - {subjectMap[1][0].subject_name} -{' '}
                {subjectMap[1].length} Turmas
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            {/* <Text fontWeight={'bold'}>Turmas:</Text> */}
            <VStack>
              {subjectMap[1].map((cl, idx) => (
                <VStack
                  spacing={3}
                  key={idx}
                  alignSelf={'flex-start'}
                  alignItems={'flex-start'}
                >
                  <Text as={'b'}>
                    {`Turma ${cl.class_code.slice(-2)} - ${
                      cl.vacancies
                    } vagas: `}
                  </Text>

                  <VStack>
                    {cl.week_days.map((day, i) => (
                      <HStack key={i}>
                        <Text>{`${Capitalize(day)} - ${cl.start_time[i]} às ${cl.end_time}: `}</Text>
                        {buildingsList.length !== 1 && (
                          <>
                            <FormLabel mt={4}>Prédio</FormLabel>
                            <CSelect
                              w={'fit-content'}
                              placeholder='Selecionar prédio'
                              onChange={(event) => {
                                setSelectedBuilding(
                                  buildingsList.find(
                                    (it) => it.id === event.target.value,
                                  ),
                                );
                              }}
                              icon={
                                buildingsLoading ? (
                                  <Spinner size='sm' />
                                ) : undefined
                              }
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
                            const selectedClassroom =
                              selected as ClassroomOption;
                            setSelectedClassroom(
                              availableClassrooms.find(
                                (it) =>
                                  selectedClassroom.value === it.classroom_name,
                              ),
                            );
                          }}
                        />
                        {selectedClassroom?.conflicted && (
                          <Text colorScheme={'yellow'} fontSize='sm' ml={4}>
                            Esta alocação gerará conflitos
                          </Text>
                        )}
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
              ))}
            </VStack>
            <Text mt={2} fontWeight={'bold'}>
              *NA = Não alocada
            </Text>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
