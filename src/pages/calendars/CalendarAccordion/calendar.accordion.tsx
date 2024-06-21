import { AddIcon, CalendarIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  HStack,
  List,
  ListIcon,
  ListItem,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { CalendarResponse } from 'models/http/responses/calendar.responde.models';
import { useEffect } from 'react';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { sortCalendarResponse } from 'utils/calendars/calendar.sorter';
import { holidayCategoryToString } from 'utils/holidaysCategories/holidaysCategories.formatter';

interface HolidayCategoryAccordionProps {
  calendars: CalendarResponse[];
  onCalendarView: (data: CalendarResponse) => void;
  onCalendarUpdate: (data: CalendarResponse) => void;
  onCalendarDelete: (data: CalendarResponse) => void;
}

export function CalendarAccordion(props: HolidayCategoryAccordionProps) {
  useEffect(() => {
    props.calendars.sort(sortCalendarResponse);
  }, [props.calendars]);

  return (
    <Accordion allowMultiple borderColor={'blackAlpha.900'}>
      {props.calendars.length === 0 ? (
        <Alert status={'warning'} fontSize={'sm'} mb={4}>
          <AlertIcon />
          Nenhum Calendário adicionado
        </Alert>
      ) : undefined}
      {props.calendars.map((calendar, index) => (
        <AccordionItem key={index}>
          {({ isExpanded }) => (
            <>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  <Text as={'b'}>{`Calendario - ${calendar.name}`}</Text>
                </Box>
                {isExpanded ? (
                  <MinusIcon fontSize='12px' />
                ) : (
                  <AddIcon fontSize='12px' />
                )}
              </AccordionButton>

              <AccordionPanel>
                <Divider mb={2} borderColor={'blackAlpha.500'} />
                <HStack mb={4}>
                  <Text>{`Criado por ${calendar.created_by}`}</Text>
                  <Spacer />
                  <Button
                    leftIcon={<CalendarIcon />}
                    size={'sm'}
                    variant={'ghost'}
                    onClick={() => props.onCalendarView(calendar)}
                  >
                    Visualizar Calendário
                  </Button>
                  <Button
                    leftIcon={<BsFillPenFill />}
                    colorScheme={'yellow'}
                    size={'sm'}
                    variant={'ghost'}
                    onClick={() => props.onCalendarUpdate(calendar)}
                  >
                    Atualizar Calendário
                  </Button>
                  <Button
                    leftIcon={<BsFillTrashFill />}
                    colorScheme={'red'}
                    size={'sm'}
                    variant={'ghost'}
                    onClick={() => props.onCalendarDelete(calendar)}
                  >
                    Deletar Calendário
                  </Button>
                </HStack>
                <Divider mb={2} borderColor={'blackAlpha.500'} />
                <Text fontWeight={'bold'}>Categorias</Text>
                <List>
                  {calendar.categories.map((category, index) => (
                    <ListItem key={index}>
                      <ListIcon as={CalendarIcon}/>
                      {holidayCategoryToString(category)}
                    </ListItem>
                  ))}
                </List>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default CalendarAccordion;
