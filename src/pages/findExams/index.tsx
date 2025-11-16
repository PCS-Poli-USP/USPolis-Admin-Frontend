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
import { SelectInstance } from 'react-select';
import useSubjects from '../../hooks/useSubjetcts';
import useClasses from '../../hooks/classes/useClasses';
import useExams from '../../hooks/exams/useExams';

import ExamClassAccordion from './ExamClassAccordion';
import { classNumberFromClassCode } from '../../utils/classes/classes.formatter';
import TooltipSelect, { Option } from '../../components/common/TooltipSelect';
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
  const selectRef = useRef<SelectInstance<Option>>(null);
  const { loading: loadingS, subjects, getAllSubjects } = useSubjects(false);
  const { classes, getClassesBySubject, loading } = useClasses(false);
  const { loading: loadingExams, exams, getExams } = useExams();
  const activeExams = exams.filter(
    (exam) => exam.reservation.status == ReservationStatus.APPROVED,
  );

  const [subjectOption, setSubjectOption] = useState<Option>();
  const [classOption, setClassOption] = useState<Option>();

  const pageHeaderProps = usePageHeaderWithFilter();

  useEffect(() => {
    getAllSubjects();
    getExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <Text>Turma: </Text>
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
                  ? classes.map<OptionType>((c) => ({
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
                  {activeExams.length > 0 && (
                    <ExamClassAccordion
                      exams={activeExams.filter((exam) => {
                        if (classOption) {
                          return (
                            exam.subject_id == subjectOption.value &&
                            exam.classes
                              .map((cls) => cls.id)
                              .includes(classOption.value as number)
                          );
                        }
                        return exam.subject_id == subjectOption.value;
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
