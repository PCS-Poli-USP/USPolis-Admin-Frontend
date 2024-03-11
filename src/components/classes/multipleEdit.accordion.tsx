import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  Box,
  HStack,
  Text,
  Checkbox,
} from '@chakra-ui/react';
import { SClass } from 'models/class.model';
import { getClassScheduleShortText} from 'utils/classes/classes.formatter';

interface MultipleEditAccordionProps {
  subjectsMap: [string, SClass[]][];
  handleClickCheckBox: (subjectCode: string, classCode: string) => void;
  handleSelectAllCheckBox: (subjectCode: string, value: boolean) => void;
}

export default function MultipleEditAccordion({
  subjectsMap,
  handleClickCheckBox,
  handleSelectAllCheckBox,
}: MultipleEditAccordionProps) {
  return (
    <Accordion allowMultiple={true}>
      {subjectsMap.map((subjectMap, index) => (
        <AccordionItem key={index}>
          <AccordionButton>
            <Box as='span' flex='1' textAlign='left'>
              <Text as={'b'}>
                {subjectMap[0]} - {subjectMap[1][0].subject_name} -{' '}
                {subjectMap[1].length} Turmas
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Button
              mb={2}
              size={'md'}
              variant={'outline'}
              onClick={() => {
                handleSelectAllCheckBox(subjectMap[0], true);
              }}
            >
              Selecionar tudo
            </Button>

            <Button
              mb={2}
              ml={2}
              size={'md'}
              variant={'outline'}
              onClick={() => {
                handleSelectAllCheckBox(subjectMap[0], false);
              }}
            >
              Remover tudo
            </Button>
            <Text fontWeight={'bold'}>Turmas:</Text>
            {subjectMap[1].map((value, index) => (
              <HStack spacing={3} key={index}>
                <Checkbox
                  isChecked={value.selected}
                  onChange={(event) => {
                    handleClickCheckBox(value.subject_code, value.class_code);
                  }}
                />
                <Text>{`${value.subject_code} - Turma ${value.class_code.slice(
                  -2,
                )}, ${value.vacancies} vagas`} - {getClassScheduleShortText(value)}</Text>
              </HStack>
            ))}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
