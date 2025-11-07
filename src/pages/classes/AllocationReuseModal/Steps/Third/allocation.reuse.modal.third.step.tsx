import { Flex, Heading, Text } from '@chakra-ui/react';
import { SubjectResponse } from '../../../../../models/http/responses/subject.response.models';
import { ClassResponse } from '../../../../../models/http/responses/class.response.models';
import { classNumberFromClassCode } from '../../../../../utils/classes/classes.formatter';
import { ScheduleAllocationData } from '../../allocation.reuse.modal';

import { getScheduleWithTimeString } from '../../../../../utils/schedules/schedule.formatter';
import moment from 'moment';

interface AllocationReuseModalThirdStepProps {
  subjects: SubjectResponse[];
  classesBySubject: Map<number, ClassResponse[]>;
  selectedSubjects: Set<number>;
  selectedClasses: Set<number>;
  allocationMap: Map<number, ScheduleAllocationData>;
}

function AllocationReuseModalThirdStep({
  subjects,
  classesBySubject,
  selectedClasses,
  selectedSubjects,
  allocationMap,
}: AllocationReuseModalThirdStepProps) {
  const subjectData = subjects.filter((subject) =>
    selectedSubjects.has(subject.id),
  );
  return (
    <Flex
      direction={'column'}
      width={'100%'}
      alignItems={'flex-start'}
      justify={'flex-start'}
      gap={'10px'}
    >
      <Heading size={'md'}>Revisão da Reutilização</Heading>
      <Flex
        direction={'column'}
        maxH={'300px'}
        overflowY={'auto'}
        width={'100%'}
        gap={'10px'}
      >
        {subjectData.map((subject, index) => {
          const classes = classesBySubject.get(subject.id) || [];
          const classesSelected = classes.filter((cls) =>
            selectedClasses.has(cls.id),
          );
          return (
            <Flex
              key={`S${index}`}
              direction={'column'}
              width={'100%'}
              gap={'10px'}
            >
              {classesSelected.map((cls, clsIndex) => {
                const classCode = classNumberFromClassCode(cls.code);
                const schedules = cls.schedules;
                const allocationData: ScheduleAllocationData[] = [];
                schedules.forEach((schedule) => {
                  if (allocationMap.has(schedule.id)) {
                    allocationData.push(
                      allocationMap.get(schedule.id) as ScheduleAllocationData,
                    );
                  }
                });
                if (
                  allocationData &&
                  allocationData.some((data) => data.classrooms.length > 0)
                ) {
                  return (
                    <Flex
                      key={`C${clsIndex}`}
                      direction={'column'}
                      borderWidth={'1px'}
                      borderRadius={'md'}
                      p={'10px'}
                      bgColor={'uspolis.gray'}
                    >
                      <Text fontWeight={'bold'}>
                        {subject.name} - Turma {classCode} -{' '}
                        <Text as={'span'} fontSize={'sm'} align={'center'}>
                          ({moment(cls.start_date).format('DD/MM/YYYY')} até{' '}
                          {moment(cls.end_date).format('DD/MM/YYYY')})
                        </Text>
                      </Text>
                      {schedules.map((schedule, index) => {
                        const data = allocationData.at(index) || undefined;
                        if (data && data.classrooms.length > 0) {
                          return (
                            <>
                              <Text>{getScheduleWithTimeString(schedule)}</Text>
                              <Text>Salas: {data.classrooms.join(', ')}</Text>
                            </>
                          );
                        }
                        return <></>;
                      })}
                    </Flex>
                  );
                }
                return <></>;
              })}
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}

export default AllocationReuseModalThirdStep;
