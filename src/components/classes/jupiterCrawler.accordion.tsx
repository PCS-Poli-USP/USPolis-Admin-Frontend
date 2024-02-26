import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { sortSubjects } from 'utils/sorter';

interface JupiterCrawlerAccordionProps {
  success: string[];
  failed: string[];
}

export default function JupiterCrawlerAccordion({
  success,
  failed,
}: JupiterCrawlerAccordionProps) {
  const [successSubjects, setSuccessSubjects] = useState<string[]>([]);
  const [failedSubjects, setFailedSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (success.length > 0) setSuccessSubjects(success);
    if (failed.length > 0) setFailedSubjects(failed);
  }, [success, failed]);

  success.sort(sortSubjects);
  failed.sort(sortSubjects);

  return (
    <Accordion
      defaultIndex={failed && failed.length > 0 ? [1] : [0]}
      allowMultiple={true}
    >
      <AccordionItem>
        <AccordionButton
          bg={'uspolis.blue'}
          color={'blackAlpha.900'}
          fontWeight={'bold'}
        >
          <Box as='span' flex='1' textAlign='left'>
            Disciplinas Carregadas
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <UnorderedList>
            {successSubjects.map((value, index) => (
              <ListItem key={index}>{value}</ListItem>
            ))}
          </UnorderedList>
        </AccordionPanel>
      </AccordionItem>

      {failedSubjects.length > 0 ? (
        <AccordionItem>
          <AccordionButton bg={'red.500'} color={'black'} fontWeight={'bold'}>
            <Box as='span' flex='1' textAlign='left'>
              Disciplinas Não Carregadas
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <UnorderedList>
              {failedSubjects.map((value, index) => (
                <ListItem key={index}>{value}</ListItem>
              ))}
            </UnorderedList>
          </AccordionPanel>
        </AccordionItem>
      ) : undefined}
    </Accordion>
  );
}
