import { useEffect, useState } from 'react';
import ConflictsService from '../services/conflicts.service';
import Navbar from 'components/common/navbar.component';
import * as C from '@chakra-ui/react';
import Conflict from 'models/conflict.model';

const ConflictsPage = () => {
  const [conflicts, setConflicts] = useState<Conflict | null>(null);
  const [buildingNames, setBuildingNames] = useState<string[] | null>(null);
  const [selectedBuildingName, setSelectedBuildingName] = useState<string>('');
  const [classroomNames, setClassroomNames] = useState<string[] | null>(null);
  const [selectedClassroomName, setSelectedClassroomName] =
    useState<string>('');

  useEffect(() => {
    const conflictsService = new ConflictsService();
    conflictsService
      .list()
      .then((res) => {
        console.log(res.data);
        setConflicts(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert('Erro ao carregar conflitos');
      });
  }, []);

  useEffect(() => {
    setBuildingNames(
      conflicts?.buildings.map((building) => building.name) || [],
    );
  }, [conflicts]);

  useEffect(() => {
    if (selectedBuildingName) {
      setClassroomNames(
        conflicts?.buildings
          .find((building) => building.name === selectedBuildingName)
          ?.classrooms.map((classroom) => classroom.name) || [],
      );
    } else setClassroomNames(null);
  }, [selectedBuildingName, conflicts]);

  return (
    <>
      <Navbar />
      <C.Flex paddingX={4} direction={'column'}>
        <C.Text fontSize='4xl' mb={4}>
          Conflitos
        </C.Text>
        <C.Flex direction={'row'} gap={4} mb={4}>
          <C.Flex direction={'column'} flex={1}>
            <C.Text fontSize={'md'}>Prédio:</C.Text>
            <C.Select
              placeholder='Selecione o prédio'
              onChange={(e) => setSelectedBuildingName(e.target.value)}
            >
              {buildingNames?.map((buildingName) => (
                <option key={buildingName} value={buildingName}>
                  {buildingName}
                </option>
              ))}
            </C.Select>
          </C.Flex>
          <C.Flex direction={'column'} flex={1}>
            <C.Text fontSize={'md'}>Sala:</C.Text>
            <C.Select
              placeholder='Selecione a sala'
              onChange={(e) => setSelectedClassroomName(e.target.value)}
              disabled={!selectedBuildingName}
            >
              {classroomNames?.map((classroomName) => (
                <option key={classroomName} value={classroomName}>
                  {classroomName}
                </option>
              ))}
            </C.Select>
          </C.Flex>
        </C.Flex>
        <C.Flex direction={'column'}>
          {selectedBuildingName && selectedClassroomName ? (
            conflicts?.buildings
              .find((building) => building.name === selectedBuildingName)
              ?.classrooms.find(
                (classroom) => classroom.name === selectedClassroomName,
              )
              ?.week_days.map((week_day) => (
                <C.Flex
                  direction={'column'}
                  justifyContent={'space-between'}
                  padding={4}
                  border={'1px solid'}
                  borderColor={'gray.200'}
                  boxShadow={'md'}
                  borderRadius={4}
                  mb={4}
                  gap={2}
                >
                  <C.Text fontSize={'lg'} fontWeight={'bold'}>
                    {week_day.name}
                  </C.Text>
                  {week_day.events.map((event) => (
                    <C.Flex
                      key={event.id}
                      direction={'row'}
                      justifyContent={'space-between'}
                      border={'1px solid'}
                      borderColor={'gray.200'}
                      borderRadius={4}
                      padding={4}
                    >
                      <C.Flex direction={'column'} flex={1}>
                        <C.Text fontSize={'md'}>
                          Início: {event.start_time}
                        </C.Text>
                        <C.Text fontSize={'md'}>Fim: {event.end_time}</C.Text>
                      </C.Flex>
                      <C.Flex direction={'column'} flex={1}>
                        <C.Text fontSize={'md'}>
                          Professores:{' '}
                          {event.professors?.map((professor, index) => (
                            <>
                              {professor}
                              {event &&
                              event.professors &&
                              index !== event.professors.length - 1
                                ? ', '
                                : ''}
                            </>
                          ))}
                        </C.Text>
                      </C.Flex>
                      <C.Flex direction={'column'} flex={1}>
                        <C.Text fontSize={'md'}>
                          Código de turma: {event.class_code}
                        </C.Text>
                        <C.Text fontSize={'md'}>
                          Código de disciplina: {event.subject_code}
                        </C.Text>
                      </C.Flex>
                      <C.Button>Editar Alocação</C.Button>
                    </C.Flex>
                  ))}
                </C.Flex>
              ))
          ) : (
            <></>
          )}
        </C.Flex>
      </C.Flex>
    </>
  );
};

export default ConflictsPage;
