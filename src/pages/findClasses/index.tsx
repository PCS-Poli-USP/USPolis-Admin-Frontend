import PageContent from '../../components/common/PageContent';
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import useSubjects from '../../hooks/useSubjetcts';
import { SelectInstance } from 'react-select';
import useClasses from '../../hooks/classes/useClasses';
import { classNumberFromClassCode } from '../../utils/classes/classes.formatter';
import TooltipSelect, { Option } from '../../components/common/TooltipSelect';
import ClassGrid from './ClassGrid';
import { ClassSchedulingResponse } from '../../models/http/responses/class.response.models';

function FindClasses() {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const selectRef = useRef<SelectInstance<Option>>(null);
  const {
    loading: loadingS,
    subjects,
    getAllSubjectsActives,
  } = useSubjects(false);
  const { classes, getClassesBySubject, loading, getCommingClasses } =
    useClasses(false);
  const [subjectOption, setSubjectOption] = useState<Option>();
  const [classOption, setClassOption] = useState<Option>();
  const [commingClasses, setCommingClasses] = useState<
    Array<ClassSchedulingResponse>
  >([]);

  async function fetchData() {
    Promise.all([getAllSubjectsActives(), getCommingClasses()])
      .then(([, comming]) => {
        // Handle the fetched data if needed
        if (comming !== undefined) {
          setCommingClasses(comming);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContent>
      <Flex
        direction={'column'}
        gap={'20px'}
        margin={'0 auto'}
        alignItems={'center'}
      >
        <Flex direction={isMobile ? 'column' : 'row'} gap={'20px'}>
          <Box w={isMobile ? '100%' : '400px'}>
            <Text fontWeight={'bold'}>Disciplina: </Text>
            <TooltipSelect
              placeholder={
                subjects.length > 0
                  ? 'Selecione uma disciplina'
                  : 'Nenhuma disciplina ativa encontrada'
              }
              value={subjectOption}
              isClearable={true}
              isLoading={loading || loadingS}
              options={subjects
                .map<Option>((subject) => ({
                  value: subject.id,
                  label: `${subject.code} - ${subject.name}`,
                }))
                .sort((a, b) => a.label.localeCompare(b.label))}
              onChange={(option) => {
                if (option) {
                  setSubjectOption(option);
                  getClassesBySubject(option.value as number);
                } else {
                  setSubjectOption(undefined);
                  if (selectRef.current) selectRef.current.clearValue();
                }
              }}
            />
          </Box>

          <Box w={isMobile ? '100%' : '400px'}>
            <Text fontWeight={'bold'}>Turma: </Text>
            <TooltipSelect
              ref={selectRef}
              value={classOption}
              isClearable={true}
              placeholder={
                !subjectOption
                  ? 'Selecione uma disciplina primeiro'
                  : classes.length > 0
                    ? 'Selecione uma turma'
                    : 'Nenhuma turma disponível'
              }
              options={
                classes
                  ? classes.map<Option>((c) => ({
                      value: c.id,
                      label: classNumberFromClassCode(c.code),
                    }))
                  : []
              }
              isDisabled={!subjectOption || classes.length === 0}
              onChange={(option) => {
                if (option) {
                  setClassOption(option);
                } else {
                  setClassOption(undefined);
                }
              }}
            />
          </Box>
        </Flex>
        <Box>
          {subjects.length == 0 && (
            <Alert status='warning' w={'100%'}>
              <AlertIcon />
              Nenhuma disciplina com turmas foi encontrada
            </Alert>
          )}

          {commingClasses.length === 0 && !subjectOption && (
            <Alert status='warning' w={'100%'}>
              <AlertIcon />
              Selecione uma disciplina
            </Alert>
          )}

          {subjects.length > 0 &&
            !subjectOption &&
            commingClasses.length > 0 && (
              <Flex direction={'column'} mt={'10px'} gap={'10px'}>
                <Text fontWeight={'bold'} fontSize={'xl'}>
                  Próximas disciplinas:{' '}
                </Text>
                <ClassGrid
                  classes={commingClasses}
                  columns={isMobile ? 1 : 3}
                />
              </Flex>
            )}

          {subjectOption && (
            <Box w={isMobile ? '100%' : '70vw'}>
              <Text fontSize='2xl' mb={'20px'}>
                Turmas:{' '}
              </Text>
              {subjectOption ? (
                <ClassGrid classes={classes} columns={isMobile ? 1 : 3} />
              ) : undefined}
            </Box>
          )}
        </Box>
      </Flex>
    </PageContent>
  );
}

export default FindClasses;
