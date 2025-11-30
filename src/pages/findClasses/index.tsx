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
import ClassAccordion from './ClassAccordion';
import useClasses from '../../hooks/classes/useClasses';
import { classNumberFromClassCode } from '../../utils/classes/classes.formatter';
import TooltipSelect, { Option } from '../../components/common/TooltipSelect';

function FindClasses() {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const selectRef = useRef<SelectInstance<Option>>(null);
  const {
    loading: loadingS,
    subjects,
    getAllSubjectsActives,
  } = useSubjects(false);
  const { classes, getClassesBySubject, loading } = useClasses(false);
  const [subjectOption, setSubjectOption] = useState<Option>();
  const [classOption, setClassOption] = useState<Option>();

  useEffect(() => {
    getAllSubjectsActives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContent>
      <Text fontSize='4xl' mb={4}>
        Encontre suas aulas
      </Text>
      <Flex direction={'column'} gap={'20px'}>
        <Flex direction={isMobile ? 'column' : 'row'} gap={'20px'}>
          <Box w={isMobile ? '100%' : '400px'}>
            <Text fontWeight={'bold'}>Disciplina: </Text>
            <TooltipSelect
              placeholder={
                subjects.length > 0
                  ? 'Selecione uma disciplina'
                  : 'Nenhuma disciplina ativa encontrda'
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

          <Box hidden={!subjectOption} w={isMobile ? '100%' : '400px'}>
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
            <Alert status='warning' w={isMobile ? '100%' : '400px'}>
              <AlertIcon />
              Nenhuma disciplina com turmas foi encontrada
            </Alert>
          )}

          {subjects.length > 0 && !subjectOption && (
            <Alert status='warning' w={isMobile ? '100%' : '400px'}>
              <AlertIcon />
              Selecione uma disciplina
            </Alert>
          )}

          {subjectOption && (
            <Box w={isMobile ? '100%' : '820px'}>
              <Text fontSize='2xl'>Turmas: </Text>
              {subjectOption ? (
                <>
                  {classes.length > 0 && (
                    <ClassAccordion
                      classes={
                        classOption
                          ? classes.filter(
                              (cls) => cls.id === classOption.value,
                            )
                          : classes
                      }
                      loading={loading}
                    />
                  )}
                  {classes.length == 0 && (
                    <Alert
                      status='warning'
                      borderRadius={'10px'}
                      w={'fit-content'}
                    >
                      <AlertIcon />
                      Nenhum oferecimento encontrado para essa disciplina
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

export default FindClasses;
