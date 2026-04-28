import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { ClassResponse } from '../../../models/http/responses/class.response.models';
import { useEffect, useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import { classNumberFromClassCode } from '../../../utils/classes/classes.formatter';
import { getScheduleWithTimeString } from '../../../utils/schedules/schedule.formatter';
import { MdOutlineRoom } from 'react-icons/md';
import { PiStudent } from 'react-icons/pi';

interface ClassStackProps {
  classes: ClassResponse[];
  loading: boolean;
  onClassClick: (cls: ClassResponse) => void;
  selectedSubjectsIds: Set<number>;
  selectedClassesIds: Set<number>;
}

function ClassStack({
  classes,
  loading,
  onClassClick,
  selectedSubjectsIds,
}: ClassStackProps) {
  const [filterValue, setFilterValue] = useState('');
  const [subjectMap, setSubjectMap] = useState<Map<string, ClassResponse[]>>(
    new Map(),
  );
  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    const map = new Map<string, ClassResponse[]>();
    if (classes.length > 0) {
      let data = classes;
      if (filterValue) {
        data = classes.filter((c) => {
          const subject = `${c.subject_name}-${c.subject_code}`;
          return subject.toLowerCase().includes(filterValue.toLowerCase());
        });
      }
      data.forEach((c) => {
        const subject = `${c.subject_name}-${c.subject_code}`;
        if (!map.has(subject)) {
          map.set(subject, []);
        }
        map.get(subject)?.push(c);
      });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSubjectMap(map);
  }, [classes, filterValue]);

  const entries = Array.from(subjectMap.entries());
  return (
    <Skeleton isLoaded={!loading} w={'full'} h={'80vh'} borderRadius={'10px'}>
      <Flex direction={'column'} p={'0px'} overflowY={'auto'} height={'80vh'}>
        <Flex
          direction={'column'}
          p={'15px 20px 0px 20px'}
          gap={'15px'}
          mb={'20px'}
        >
          <Text fontWeight={'bold'} textAlign={'left'} fontSize={'lg'}>
            Turmas disponíveis
          </Text>
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <LuSearch />
            </InputLeftElement>
            <Input
              placeholder='Filtrar por disciplinas...'
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </InputGroup>
        </Flex>

        <Accordion allowMultiple index={Array.from(expandedIndexes)}>
          {entries.map(([subject, classes], idx) => {
            const subjectName = subject.split('-')[0];
            const subjectCode = subject.split('-')[1];
            const itemSelected =
              classes.length > 0 &&
              selectedSubjectsIds.has(classes[0].subject_id);

            if (itemSelected && expandedIndexes.has(idx)) {
              setExpandedIndexes((prev) => {
                const newSet = new Set(prev);
                newSet.delete(idx);
                return newSet;
              });
            }

            return (
              <AccordionItem key={subject} isDisabled={itemSelected}>
                <AccordionButton
                  mt={'5px'}
                  mb={'5px'}
                  disabled={itemSelected}
                  onClick={() => {
                    if (expandedIndexes.has(idx)) {
                      setExpandedIndexes((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(idx);
                        return newSet;
                      });
                    } else {
                      setExpandedIndexes((prev) => new Set(prev.add(idx)));
                    }
                  }}
                >
                  <Flex justifyContent={'space-between'} w={'full'}>
                    <Tooltip
                      label={
                        itemSelected
                          ? 'Disciplina já adicionada à grade horária'
                          : `${subjectName} (${subjectCode})`
                      }
                      fontSize='md'
                      placement='right'
                    >
                      <Flex direction={'column'}>
                        <Text
                          noOfLines={1}
                          textOverflow={'ellipsis'}
                          textAlign={'left'}
                          fontWeight={'bold'}
                        >
                          {subjectName}
                        </Text>
                        <Text textAlign={'left'} fontSize={'sm'}>
                          {subjectCode}
                        </Text>
                      </Flex>
                    </Tooltip>
                    <AccordionIcon />
                  </Flex>
                </AccordionButton>
                <AccordionPanel>
                  <Flex direction={'column'} gap={'10px'}>
                    {classes.map((c) => (
                      <Tooltip
                        label={
                          itemSelected
                            ? 'Turma já adicionada à grade horária'
                            : 'Adicionar turma à grade horária'
                        }
                        fontSize='md'
                        placement='right'
                        key={c.id}
                      >
                        <Flex
                          key={c.id}
                          direction={'column'}
                          p={'10px'}
                          border={'1px'}
                          borderRadius={'10px'}
                          _hover={{
                            boxShadow: '0 10px 10px -10px rgba(0, 0, 0, 0.5)',
                            cursor: itemSelected ? 'not-allowed' : 'pointer',
                            opacity: 0.8,
                          }}
                          gap={'4px'}
                          onClick={() => {
                            onClassClick(c);
                          }}
                        >
                          <Text
                            fontWeight={'bold'}
                          >{`Turma ${classNumberFromClassCode(c.code)}`}</Text>
                          {/* <Tooltip
                          label={c.professors.join(', ')}
                          fontSize='md'
                          placement='right'
                          > */}
                          <Flex align={'center'} gap={'5px'}>
                            <PiStudent />
                            <Text
                              fontSize={'sm'}
                              textOverflow={'ellipsis'}
                              noOfLines={1}
                            >
                              {c.professors.join(', ')}
                            </Text>
                          </Flex>
                          {/* </Tooltip> */}
                          {c.schedules.map((s, index) => (
                            <Flex direction={'column'}>
                              <Text key={`C${c.id}-S${index}`} fontSize={'sm'}>
                                {getScheduleWithTimeString(s)}
                              </Text>
                              <Flex align={'center'} fontWeight={'bold'}>
                                <MdOutlineRoom />
                                <Text
                                  fontSize={'sm'}
                                  ml={'5px'}
                                  // textColor={s.classroom ? '' : 'uspolis.red'}
                                >
                                  {`Sala: ${
                                    s.classroom ? s.classroom : 'Não alocada'
                                  }`}
                                </Text>
                              </Flex>
                            </Flex>
                          ))}
                        </Flex>
                      </Tooltip>
                    ))}

                    {classes.length == 0 && (
                      <Text fontSize={'md'} textAlign={'center'}>
                        Nenhuma turma encontrada
                      </Text>
                    )}
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            );
          })}

          {entries.length === 0 && !loading && (
            <Flex
              direction={'column'}
              align={'center'}
              justify={'center'}
              gap={'20px'}
              mt={'20px'}
            >
              <Text fontSize={'lg'}>Nenhuma turma encontrada</Text>
            </Flex>
          )}
        </Accordion>
      </Flex>
    </Skeleton>
  );
}

export default ClassStack;
