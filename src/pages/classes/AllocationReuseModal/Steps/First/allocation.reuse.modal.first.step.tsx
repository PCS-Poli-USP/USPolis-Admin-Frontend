import { Box, Button, Checkbox, Flex, Heading, Text } from '@chakra-ui/react';
import { SubjectResponse } from '../../../../../models/http/responses/subject.response.models';
import { ClassResponse } from '../../../../../models/http/responses/class.response.models';
import { useEffect, useState } from 'react';
import { classNumberFromClassCode } from '../../../../../utils/classes/classes.formatter';
import { Collapsable } from '../../../../../components/common/Collapsable';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { SubjectWithClasses } from '../../allocation.reuse.modal';
import HelpPopover from '../../../../../components/common/HelpPopover';
import moment from 'moment';
import TooltipSelect, {
  Option,
} from '../../../../../components/common/TooltipSelect';

interface AllocationReuseModalFirstStepProps {
  subjects: SubjectResponse[];
  classesBySubject: Map<number, ClassResponse[]>;
  map: Map<number, SubjectWithClasses>;
  setMap: (map: Map<number, SubjectWithClasses>) => void;
  selectedClasses: Set<number>;
  setSelectedClasses: (classes: Set<number>) => void;
  setSelectedSubjects: (subjects: Set<number>) => void;
}

function AllocationReuseModalFirstStep({
  subjects,
  classesBySubject,
  map,
  setMap,
  selectedClasses,
  setSelectedClasses,
  setSelectedSubjects,
}: AllocationReuseModalFirstStepProps) {
  const [selectedSubjectsOptions, setSelectedSubjectsOptions] = useState<
    Option[]
  >([]);

  useEffect(() => {
    const subjectIds = Array.from(map.keys());
    const newSelectedSubjects = subjects
      .filter((subject) => subjectIds.includes(subject.id))
      .map((subject) => ({
        label: `${subject.code} - ${subject.name}`,
        value: subject.id,
      }));
    setSelectedSubjectsOptions(newSelectedSubjects);

    const classesIds: number[] = [];
    for (const entry of map.values()) {
      classesIds.push(...entry.class_ids);
    }
    const newSelectedClasses = new Set<number>(classesIds);
    setSelectedClasses(newSelectedClasses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, subjects]);

  return (
    <Flex
      direction={'column'}
      width={'100%'}
      alignItems={'flex-start'}
      justify={'flex-start'}
      gap={'10px'}
    >
      <Heading size={'md'}>Disciplinas e Turmas:</Heading>
      <Flex direction={'row'} gap={'5px'} alignItems={'center'}>
        <Text>
          Escolha para quais disciplinas você deseja reutilizar alocações.
        </Text>
        <HelpPopover title='Como funciona a reutilização?'>
          <Flex direction={'column'} gap={'5px'} textAlign={'justify'}>
            <Text>
              A reutilização de alocação permite alocar as turmas das
              disciplinas selecionadas considerando a alocação de turmas
              similares de um ano anterior.
            </Text>
            <Text>
              Uma turma é considerada similar quando ela tem os mesmos dias de
              semana, recorrência e horário de início e fim.
            </Text>
          </Flex>
        </HelpPopover>
      </Flex>
      <Flex w={'100%'} gap={'5px'} align={'center'}>
        <Box w={'100%'}>
          <TooltipSelect
            placeholder={'Selecione as disciplinas'}
            isMulti={true}
            value={selectedSubjectsOptions}
            options={subjects.map((subject) => ({
              label: `${subject.code} - ${subject.name}`,
              value: subject.id,
            }))}
            onChange={(value) => {
              const removedSubjects = selectedSubjectsOptions.filter(
                (s) => !value.some((v) => v.value === s.value),
              );
              setSelectedSubjectsOptions(value as Option[]);
              setSelectedSubjects(new Set(value.map((v) => v.value as number)));
              const newMap = new Map(map);
              value.forEach((subject) => {
                if (!newMap.has(subject.value as number)) {
                  const classes = classesBySubject.get(subject.value as number);
                  const classIds = classes ? classes.map((cls) => cls.id) : [];
                  newMap.set(subject.value as number, {
                    subject_id: subject.value as number,
                    class_ids: classIds,
                  });
                }
              });
              removedSubjects.forEach((subject) => {
                const removedClasses = classesBySubject.get(
                  subject.value as number,
                );
                if (removedClasses) {
                  const newSelectedClasses = new Set(selectedClasses);
                  removedClasses.forEach((cls) =>
                    newSelectedClasses.delete(cls.id),
                  );
                  setSelectedClasses(newSelectedClasses);
                }
                newMap.delete(subject.value as number);
              });
              setMap(newMap);
            }}
          />
        </Box>
        <Button
          size={'sm'}
          leftIcon={<CheckIcon />}
          h={'40px'}
          onClick={() => {
            const options = subjects.map((subject) => ({
              label: `${subject.code} - ${subject.name}`,
              value: subject.id,
            }));
            setSelectedSubjectsOptions(options);
            setSelectedSubjects(new Set(subjects.map((s) => s.id)));
            const newMap = new Map<number, SubjectWithClasses>();
            subjects.forEach((subject) => {
              const classes = classesBySubject.get(subject.id);
              const classIds = classes ? classes.map((cls) => cls.id) : [];
              newMap.set(subject.id, {
                subject_id: subject.id,
                class_ids: classIds,
              });
            });
            setMap(newMap);
          }}
        >
          Selecionar tudo
        </Button>
      </Flex>
      <Box>
        {selectedSubjectsOptions.length > 0 && (
          <Text mt={'10px'}>
            Escolha as turmas <b>atuais</b> das disciplinas (
            {selectedClasses.size} turmas selecionadas):
          </Text>
        )}
        {subjects
          .filter((subject) =>
            selectedSubjectsOptions.some((s) => s.value === subject.id),
          )
          .map((subject) => {
            const classes = classesBySubject.get(subject.id);
            let i = 0;
            if (classes) {
              classes.forEach((cls) => {
                if (selectedClasses.has(cls.id)) {
                  i++;
                }
              });
            }
            return (
              <Box key={subject.id} mt={4}>
                <Text fontWeight={'bold'} fontSize={'lg'}>
                  {subject.code} - {subject.name}
                </Text>
                <Collapsable
                  title={`Escolher turmas [ ${i} / ${classes ? classes.length : 0} ]`}
                  titleColor={i > 0 ? 'uspolis.blue' : 'uspolis.red'}
                  iconSize={'25px'}
                  titleSize='sm'
                >
                  <Flex
                    direction={'column'}
                    gap={'5px'}
                    mb={'10px'}
                    ml={'20px'}
                  >
                    <Flex direction={'row'} gap={'5px'} mb={'5px'} mt={'5px'}>
                      <Button
                        size={'sm'}
                        leftIcon={<CheckIcon />}
                        onClick={() => {
                          const subjectClasses = classesBySubject.get(
                            subject.id,
                          );
                          if (!subjectClasses) return;

                          const class_ids = subjectClasses.map((cls) => cls.id);
                          const newMap = new Map(map);
                          newMap.set(subject.id, {
                            subject_id: subject.id,
                            class_ids: class_ids,
                          });
                          setMap(newMap);

                          const newSet = new Set(selectedClasses);
                          subjectClasses.forEach((cls) => newSet.add(cls.id));
                          setSelectedClasses(newSet);
                        }}
                      >
                        Selecionar tudo
                      </Button>
                      <Button
                        size={'sm'}
                        leftIcon={<CloseIcon />}
                        onClick={() => {
                          const subjectClasses = classesBySubject.get(
                            subject.id,
                          );
                          if (!subjectClasses) return;

                          const newMap = new Map(map);
                          newMap.set(subject.id, {
                            subject_id: subject.id,
                            class_ids: [],
                          });
                          setMap(newMap);

                          const newSet = new Set(selectedClasses);
                          subjectClasses.forEach((cls) =>
                            newSet.delete(cls.id),
                          );
                          setSelectedClasses(newSet);
                        }}
                      >
                        Desmarcar tudo
                      </Button>
                    </Flex>
                    {classesBySubject.get(subject.id)?.map((cls) => (
                      <Checkbox
                        key={`C${cls.id}`}
                        size={'lg'}
                        isChecked={selectedClasses.has(cls.id)}
                        onChange={(e) => {
                          const subjectMap = map.get(cls.subject_id);
                          if (!subjectMap) {
                            const newMap = new Map(map);
                            newMap.set(cls.subject_id, {
                              subject_id: cls.subject_id,
                              class_ids: e.target.checked ? [cls.id] : [],
                            });
                            setMap(newMap);
                          }

                          if (subjectMap) {
                            const newMap = new Map(map);
                            const updatedClasses = e.target.checked
                              ? [...subjectMap.class_ids, cls.id]
                              : subjectMap.class_ids.filter(
                                  (id) => id !== cls.id,
                                );
                            newMap.set(cls.subject_id, {
                              subject_id: cls.subject_id,
                              class_ids: updatedClasses,
                            });
                            setMap(newMap);
                          }
                          const newSelectedClasses = new Set(selectedClasses);
                          if (e.target.checked) {
                            newSelectedClasses.add(cls.id);
                          }
                          if (!e.target.checked) {
                            newSelectedClasses.delete(cls.id);
                          }
                          setSelectedClasses(newSelectedClasses);
                        }}
                      >
                        <Flex direction={'row'} gap={'5px'} align={'center'}>
                          Turma {classNumberFromClassCode(cls.code)} -{' '}
                          <Text fontSize={'sm'} fontWeight={'bold'}>
                            {moment(cls.start_date).format('DD/MM/YYYY')} até{' '}
                            {moment(cls.end_date).format('DD/MM/YYYY')}
                          </Text>
                        </Flex>
                      </Checkbox>
                    ))}
                  </Flex>
                </Collapsable>
              </Box>
            );
          })}
      </Box>
    </Flex>
  );
}

export default AllocationReuseModalFirstStep;
