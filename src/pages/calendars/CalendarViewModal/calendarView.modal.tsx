import {
  Box,
  Divider,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { CalendarViewModalProps } from './calendarView.modal.interface';
import {
  MONTH_NAMES,
  WEEKDAY_LETTERS,
  buildMonthCells,
} from '../../../utils/calendars/calendar.formatter';
import { buildHolidayCategoryColorMap } from '../../../utils/holidaysCategories/holidaysCategories.colors';

interface HolidayMark {
  color: string;
  name: string;
}

function CalendarViewModal(props: CalendarViewModalProps) {
  const calendar = props.calendar;
  const categories = calendar ? calendar.categories : [];
  const colorMap = buildHolidayCategoryColorMap(categories);

  const marks = new Map<string, HolidayMark>();
  categories.forEach((category) => {
    const color = colorMap.get(category.id) ?? '#408080';
    category.holidays.forEach((holiday) => {
      marks.set(holiday.date, { color, name: holiday.name });
    });
  });

  const year = calendar ? calendar.year : new Date().getFullYear();

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      size={'6xl'}
      isCentered
    >
      <ModalOverlay />
      <ModalContent maxH={'90vh'} overflowY={'auto'}>
        <ModalHeader>
          <VStack align={'flex-start'} spacing={0}>
            <Text fontSize={'19px'} fontWeight={'bold'} color={'uspolis.black'}>
              {`Calendário ${calendar ? calendar.name : ''}`}
            </Text>
            <Text
              fontSize={'13px'}
              color={'uspolis.textMuted'}
              fontWeight={'normal'}
            >
              {`${year} · ${marks.size} dias sem aula · criado por ${
                calendar ? calendar.created_by : ''
              }`}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <Flex wrap={'wrap'} gap={'14px'} pb={3}>
            {categories.map((category) => (
              <HStack key={category.id} spacing={'7px'}>
                <Box
                  w={'11px'}
                  h={'11px'}
                  borderRadius={'3px'}
                  bg={colorMap.get(category.id)}
                />
                <Text fontSize={'13px'} color={'uspolis.black'}>
                  {category.name}
                </Text>
                <Text fontSize={'12px'} color={'uspolis.textMuted'}>
                  {`${category.holidays.length} dias`}
                </Text>
              </HStack>
            ))}
          </Flex>
          <Divider mb={4} />

          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing={'18px'}
          >
            {MONTH_NAMES.map((monthName, monthIndex) => (
              <VStack key={monthName} align={'stretch'} spacing={'6px'}>
                <Text
                  fontSize={'13px'}
                  fontWeight={'bold'}
                  color={'uspolis.text'}
                >
                  {monthName}
                </Text>
                <SimpleGrid columns={7} spacing={'2px'}>
                  {WEEKDAY_LETTERS.map((weekday, index) => (
                    <Text
                      key={`${monthName}-wd-${index}`}
                      fontSize={'9px'}
                      color={'uspolis.textMuted'}
                      textAlign={'center'}
                      pb={'2px'}
                    >
                      {weekday}
                    </Text>
                  ))}
                  {buildMonthCells(year, monthIndex).map((cell) => {
                    const mark = cell.date ? marks.get(cell.date) : undefined;
                    return (
                      <Text
                        key={cell.key}
                        fontSize={'11px'}
                        textAlign={'center'}
                        py={'3px'}
                        borderRadius={'4px'}
                        title={mark ? mark.name : undefined}
                        bg={mark ? mark.color : undefined}
                        color={mark ? 'white' : 'uspolis.textMuted'}
                        fontWeight={mark ? 'bold' : 'normal'}
                      >
                        {cell.label}
                      </Text>
                    );
                  })}
                </SimpleGrid>
              </VStack>
            ))}
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default CalendarViewModal;
