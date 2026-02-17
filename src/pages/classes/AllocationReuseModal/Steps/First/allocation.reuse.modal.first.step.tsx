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
  isValid: boolean;
}

function AllocationReuseModalFirstStep({
  subjects,
  classesBySubject,
  map,
  setMap,
  isValid,
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedSubjectsOptions(newSelectedSubjects);
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
              A reutilização de alocações vai buscar as alocações das turmas das
              disciplinas que você selecionar.
            </Text>
            <Text>
              O sistema irá tentar buscar exatamente a mesma turma, mas no ano
              que você pedir.
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
            hasError={!isValid && Array.from(map.keys()).length == 0}
            onChange={(value) => {
              const removedSubjects = selectedSubjectsOptions.filter(
                (s) => !value.some((v) => v.value === s.value),
              );
              setSelectedSubjectsOptions(value as Option[]);

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
            {Array.from(map.values()).flatMap((val) => val.class_ids).length}{' '}
            turmas selecionadas):
          </Text>
        )}
        {subjects
          .filter((subject) =>
            selectedSubjectsOptions.some((s) => s.value === subject.id),
          )
          .map((subject) => {
            const allClasses = classesBySubject.get(subject.id);
            const classes = map.get(subject.id)?.class_ids || [];

            return (
              <Box key={subject.id} mt={4}>
                <Text fontWeight={'bold'} fontSize={'lg'}>
                  {subject.code} - {subject.name}
                </Text>
                <Collapsable
                  title={`Escolher turmas [ ${classes.length} / ${allClasses ? allClasses.length : 0} ]`}
                  iconSize={'25px'}
                  titleSize='sm'
                  titleColor={
                    classes.length == 0 ? 'uspolis.red' : 'uspolis.text'
                  }
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
                        }}
                      >
                        Desmarcar tudo
                      </Button>
                    </Flex>
                    {classesBySubject.get(subject.id)?.map((cls) => (
                      <Checkbox
                        key={`C${cls.id}`}
                        size={'lg'}
                        isChecked={
                          map.has(subject.id)
                            ? (
                                map.get(subject.id) as SubjectWithClasses
                              ).class_ids.includes(cls.id)
                            : false
                        }
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
