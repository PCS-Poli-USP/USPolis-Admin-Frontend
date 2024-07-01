import {
  HStack,
  IconButton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { HolidayUnfetchResponse } from 'models/http/responses/holiday.response.models';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { datetimeToDate } from 'utils/formatters';

interface HolidayCategoryAccordionItemProps {
  holiday: HolidayUnfetchResponse;
  onHolidayUpdate: (data: HolidayUnfetchResponse) => void;
  onHolidayDelete: (data: HolidayUnfetchResponse) => void;
}

function HolidayCategoryAccordionItem(
  props: HolidayCategoryAccordionItemProps,
) {
  return (
    <HStack spacing={4} alignSelf={'flex-start'} alignItems={'center'}>
      <Text>{`Data: ${datetimeToDate(props.holiday.date)}`}</Text>
      <Tooltip label='Editar Feriado'>
        <IconButton
          colorScheme='yellow'
          size='xs'
          variant='ghost'
          aria-label='editar-turma'
          icon={<BsFillPenFill />}
          onClick={() => props.onHolidayUpdate(props.holiday)}
        />
      </Tooltip>

      <Tooltip label='Excluir Feriado'>
        <IconButton
          colorScheme='red'
          size='xs'
          variant='ghost'
          aria-label='excluir-feriado'
          icon={<BsFillTrashFill />}
          onClick={() => props.onHolidayDelete(props.holiday)}
        />
      </Tooltip>
    </HStack>
  );
}

export default HolidayCategoryAccordionItem;
