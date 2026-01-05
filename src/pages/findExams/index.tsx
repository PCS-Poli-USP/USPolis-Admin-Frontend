import PageContent from '../../components/common/PageContent';
import { useEffect, useState } from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import useSubjects from '../../hooks/useSubjetcts';
import useClasses from '../../hooks/classes/useClasses';
import useExams from '../../hooks/exams/useExams';

import ExamClassAccordion from './ExamClassAccordion';
import { classNumberFromClassCode } from '../../utils/classes/classes.formatter';
import TooltipSelect from '../../components/common/TooltipSelect';
import PageHeaderWithFilter from '../../components/common/PageHeaderWithFilter';
import usePageHeaderWithFilter from '../../components/common/PageHeaderWithFilter/usePageHeaderWithFilter';
import HelpPopover from '../../components/common/HelpPopover';
import { ReservationStatus } from '../../utils/enums/reservations.enum';

type OptionType = {
  value: number;
  label: string;
};

function FindExams() {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const { loading: loadingS, subjects, getAllSubjects } = useSubjects(false);
  const { classes, getClassesBySubject, loading } = useClasses(false);
  const { loading: loadingExams, exams, getExams } = useExams();
  const activeExams = exams.filter(
    (exam) => exam.reservation.status == ReservationStatus.APPROVED,
  );

  const subjectWithExams = activeExams.map((exam) => exam.subject_id);

  const [selectedSubjectId, setSelectedSubjectId] = useState<number>();
  const [selectedClassId, setSelectedClassId] = useState<number>();

  const pageHeaderProps = usePageHeaderWithFilter();

  useEffect(() => {
    getAllSubjects();
    getExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subjectOptions = subjects
    .filter((subject) => subjectWithExams.includes(subject.id))
    .map<OptionType>((subject) => ({
      value: subject.id,
      label: `${subject.code} - ${subject.name}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const classesOptions = classes
    ? classes.map<OptionType>((c) => ({
        value: c.id,
        label: classNumberFromClassCode(c.code),
      }))
    : [];

  return (
    <PageContent>
      <Flex
        direction={'row'}
        justify={'flex-start'}
        align={'center'}
        gap={'10px'}
      >
        <PageHeaderWithFilter
          {...pageHeaderProps}
          title={isMobile ? 'Provas' : 'Encontre suas provas'}
          tooltip='Buscar provas em outro período'
          onConfirm={(start, end) => {
            getExams(start, end);
          }}
        />
        <Box h={'full'} mb={'10px'}>
          <HelpPopover title='Não encontrou sua prova?' size='md'>
            <Flex direction={'column'} gap={'5px'} textAlign={'justify'}>
              <Text>
                A página mostra apenas provas que ainda <b>não</b> passaram.
              </Text>
              <Text>
                Se quiser encontrar uma prova que já aconteceu, utilize o filtro
                ao lado.
              </Text>
              <Text>
                Escolha um período <b>grande</b> o suficiente.
              </Text>
            </Flex>
          </HelpPopover>
        </Box>
      </Flex>
      <Flex direction={'column'} gap={'20px'}>
        <Flex direction={isMobile ? 'column' : 'row'} gap={'20px'}>
          <Box w={isMobile ? '100%' : '400px'}>
            <Text>Disciplina: </Text>
            <TooltipSelect
              placeholder={
                subjectOptions.length > 0
                  ? 'Selecione uma disciplina'
                  : 'Nenhuma disciplina com prova encontrada'
              }
              isDisabled={subjectOptions.length == 0}
              isClearable={true}
              isMulti={false}
              value={subjectOptions.filter(
                (opt) => opt.value == selectedSubjectId,
              )}
              isLoading={loading || loadingS || loadingExams}
              options={subjectOptions}
              onChange={(option) => {
                if (option) {
                  setSelectedSubjectId(option.value as number);
                  getClassesBySubject(option.value as number);
                }
                if (!option) {
                  setSelectedSubjectId(undefined);
                }
              }}
            />
          </Box>

          <Box hidden={!selectedSubjectId} w={isMobile ? '100%' : '400px'}>
            <Text>Turma: </Text>
            <TooltipSelect
              value={classesOptions.filter(
                (opt) => opt.value == selectedClassId,
              )}
              isClearable={true}
              placeholder={
                !selectedSubjectId
                  ? 'Selecione uma disciplina primeiro'
                  : classes.length > 0
                    ? 'Selecione uma turma'
                    : 'Nenhuma turma disponível'
              }
              options={classesOptions}
              isDisabled={!selectedSubjectId || classes.length === 0}
              onChange={(option) => {
                if (option) {
                  setSelectedClassId(option.value as number);
                } else {
                  setSelectedClassId(undefined);
                }
              }}
            />
          </Box>
        </Flex>
        <Box w={isMobile ? '100%' : '820px'}>
          {!selectedSubjectId ? (
            <Alert status='warning' borderRadius={'5px'} w={'full'}>
              <AlertIcon />
              {subjectOptions.length > 0
                ? 'Selecione uma disciplina'
                : 'Nenhuma disciplina com prova encontrada'}
            </Alert>
          ) : (
            <Box>
              <Text fontSize='2xl' mb={'10px'}>
                Provas:{' '}
              </Text>
              {selectedSubjectId ? (
                <>
                  {activeExams.length > 0 && (
                    <ExamClassAccordion
                      exams={activeExams.filter((exam) => {
                        if (selectedClassId) {
                          return (
                            exam.subject_id == selectedSubjectId &&
                            exam.classes
                              .map((cls) => cls.id)
                              .includes(selectedClassId)
                          );
                        }
                        return exam.subject_id == selectedSubjectId;
                      })}
                      loading={loading}
                    />
                  )}
                  {activeExams.length == 0 && (
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
