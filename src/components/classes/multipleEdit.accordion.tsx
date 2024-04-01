import {
  Alert,
  AlertIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
  VStack,
  Skeleton,
  StackDivider,
} from '@chakra-ui/react';
import Class from 'models/class.model';
import BuildingsService from 'services/buildings.service';
import { useContext, useEffect, useState } from 'react';
import { Building } from 'models/building.model';
import { appContext } from 'context/AppContext';
import { MultipleEditAllocation } from './multipleEdit.allocation';
import Classroom, { ClassroomSchedule } from 'models/classroom.model';
import { ConflictCalculator } from 'utils/conflict.calculator';

interface MultipleEditAccordionProps {
  subjectsMap: [string, Class[]][];
  schedulesMap: [string, string, ClassroomSchedule][];
  handleSelectBuilding: (
    building_id: string,
    building_name: string,
    event_id: string,
    classrooms: Classroom[],
  ) => void;
  handleSelectClassroom: (
    new_classroom: Classroom,
    old_classroom: Classroom,
    event_id: string,
    week_day?: string,
    start_time?: string,
    end_time?: string,
  ) => void;
}

export default function MultipleEditAccordion({
  subjectsMap,
  schedulesMap,
  handleSelectBuilding,
  handleSelectClassroom,
}: MultipleEditAccordionProps) {
  const { dbUser } = useContext(appContext);

  const [buildingsList, setBuildingsList] = useState<Building[]>([]);
  const [buildingsLoading, setBuildingsLoading] = useState(true);

  const buildingsService = new BuildingsService();

  useEffect(() => {
    getBuildingsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbUser]);

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

  function getClassroomSchedule(classroom: string, building: string) {
    const schedule = schedulesMap.find((map) => {
      if ((map[0] === classroom, map[1] === building)) return true;
    });
    if (schedule) return schedule[2];
    return ConflictCalculator.defaultSchedule();
  }

  return (
    <Skeleton isLoaded={!buildingsLoading}>
      <Accordion allowMultiple={true} w={'full'}>
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
              <VStack divider={<StackDivider borderColor='blackAlpha.500' />}>
                {subjectMap[1].map((cl, idx) => (
                  <VStack
                    spacing={3}
                    key={idx}
                    alignSelf={'flex-start'}
                    alignItems={'flex-start'}
                  >
                    <Text as={'b'} mt={4}>
                      {`Turma ${cl.class_code.slice(-2)} - ${
                        cl.vacancies
                      } vagas: `}
                    </Text>

                    <VStack divider={<StackDivider borderColor='gray.200' />}>
                      -
                      {cl.week_days.map((day, i) => (
                        <MultipleEditAllocation
                          key={i}
                          eventID={cl.events_ids[i]}
                          weekDay={day}
                          startTime={cl.start_time[i]}
                          endTime={cl.end_time[i]}
                          buildingsList={buildingsList}
                          building={cl.buildings ? cl.buildings[i] : undefined}
                          classroom={
                            cl.classrooms ? cl.classrooms[i] : undefined
                          }
                          schedule={
                            cl.classrooms && cl.buildings
                              ? getClassroomSchedule(
                                  cl.classrooms[i],
                                  cl.buildings[i],
                                )
                              : ConflictCalculator.defaultSchedule()
                          }
                          onSelectClassroom={handleSelectClassroom}
                          onSelectBuilding={handleSelectBuilding}
                        />
                      ))}
                    </VStack>
                  </VStack>
                ))}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Skeleton>
  );
}
