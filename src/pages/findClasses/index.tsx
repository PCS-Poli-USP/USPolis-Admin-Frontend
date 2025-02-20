import PageContent from 'components/common/PageContent';
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import Select from 'react-select';
import { useRef, useState } from 'react';
import useSubjects from 'hooks/useSubjetcts';
import { SelectInstance } from 'react-select';
import ClassAccordion from './ClassAccordion';
import useClasses from 'hooks/classes/useClasses';

type OptionType = {
  value: number;
  label: string;
};

function FindClasses() {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const selectRef = useRef<SelectInstance<OptionType>>(null);
  const { subjects } = useSubjects();
  const { classes, getClassesBySubject, loading } = useClasses(false);
  const [subjectOption, setSubjectOption] = useState<OptionType>();
  const [classOption, setClassOption] = useState<OptionType>();

  return (
    <PageContent>
      <Text fontSize='4xl' mb={4}>
        Encontre suas aulas
      </Text>
      <Flex direction={'column'} gap={'20px'}>
        <Flex direction={isMobile ? 'column' : 'row'} gap={'20px'}>
          <Box w={isMobile ? '100%' : '400px'}>
            <Text>Disciplina: </Text>
            <Select
              placeholder='Selecione uma disciplina'
              value={subjectOption}
              isClearable={true}
              isLoading={loading}
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
                  : 'Selecione uma turma'
              }
              options={
                classes
                  ? classes.map<OptionType>((c) => ({
                      value: c.id,
                      label: c.code.slice(-2),
                    }))
                  : []
              }
              isDisabled={!subjectOption}
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
            <Alert status='warning'>
              <AlertIcon />
              Selecione uma disciplina
            </Alert>
          ) : (
            <Box>
              <Text fontSize='2xl'>Turmas: </Text>
              {subjectOption ? (
                <ClassAccordion
                  classes={
                    classOption
                      ? classes.filter((cls) => cls.id === classOption.value)
                      : classes
                  }
                  loading={loading}
                />
              ) : undefined}
            </Box>
          )}
        </Box>
      </Flex>
    </PageContent>
  );
}

export default FindClasses;
