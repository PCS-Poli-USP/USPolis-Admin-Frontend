import PageContent from '../../components/common/PageContent';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import Select, { SelectInstance } from 'react-select';
import useSubjects from '../../hooks/useSubjetcts';
import useClasses from '../../hooks/classes/useClasses';
import useExams from '../../hooks/exams/useExams';

import ExamClassAccordion from './ExamClassAccordion';
import { classNumberFromClassCode } from '../../utils/classes/classes.formatter';

type OptionType = {
  value: number;
  label: string;
};

function FindExams() {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const selectRef = useRef<SelectInstance<OptionType>>(null);
  const { loading: loadingS, subjects, getAllSubjects } = useSubjects(false);
  const { classes, getClassesBySubject, loading } = useClasses(false);
  const { loading: loadingExams, exams, getExams } = useExams();

  const [subjectOption, setSubjectOption] = useState<OptionType>();
  const [classOption, setClassOption] = useState<OptionType>();

  useEffect(() => {
    getAllSubjects();
    getExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContent>
      <Text fontSize='4xl' mb={4}>
        Encontre suas provas
      </Text>
      <Flex direction={'column'} gap={'20px'}>
        <Flex direction={isMobile ? 'column' : 'row'} gap={'20px'}>
          <Box w={isMobile ? '100%' : '400px'}>
            <Text>Disciplina: </Text>
            <Select
              placeholder='Selecione uma disciplina'
              value={subjectOption}
              isClearable={true}
              isLoading={loading || loadingS || loadingExams}
              options={subjects
                .map<OptionType>((subject) => ({
                  value: subject.id,
                  label: `${subject.code} - ${subject.name}`,
                }))
                .sort((a, b) => a.label.localeCompare(b.label))}
              onChange={(option: OptionType | null) => {
                if (option) {
                  setSubjectOption(option);
                  getClassesBySubject(option.value);
                } else {
                  setSubjectOption(undefined);
                  if (selectRef.current) selectRef.current.clearValue();
                }
              }}
            />
          </Box>

          <Box hidden={!subjectOption} w={isMobile ? '100%' : '400px'}>
            <Text>Turma: </Text>
            <Select
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
                  ? classes.map<OptionType>((c) => ({
                      value: c.id,
                      label: classNumberFromClassCode(c.code),
                    }))
                  : []
              }
              isDisabled={!subjectOption || classes.length === 0}
              onChange={(option: OptionType | null) => {
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
          {!subjectOption ? (
            <Alert status='warning' borderRadius={'5px'}>
              <AlertIcon />
              Selecione uma disciplina
            </Alert>
          ) : (
            <Box>
              <Text fontSize='2xl' mb={'10px'}>
                Provas:{' '}
              </Text>
              {subjectOption ? (
                <>
                  {exams.length > 0 && (
                    <ExamClassAccordion
                      exams={exams.filter((exam) => {
                        if (classOption) {
                          return (
                            exam.subject_id == subjectOption.value &&
                            exam.classes
                              .map((cls) => cls.id)
                              .includes(classOption.value)
                          );
                        }
                        return exam.subject_id == subjectOption.value;
                      })}
                      loading={loading}
                    />
                  )}
                  {exams.length == 0 && (
                    <Alert
                      status='warning'
                      borderRadius={'10px'}
                      w={'fit-content'}
                    >
                      <AlertIcon />
                      Nenhuma prova encontrada para essa disciplina
                    </Alert>
                  )}
                </>
              ) : undefined}
            </Box>
          )}
        </Box>
      </Flex>
    </PageContent>
  );
}

export default FindExams;
