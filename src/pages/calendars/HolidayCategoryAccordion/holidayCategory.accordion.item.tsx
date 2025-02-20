import { HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { HolidayResponse } from 'models/http/responses/holiday.response.models';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { datetimeToDate } from 'utils/formatters';

interface HolidayCategoryAccordionItemProps {
  isOwner: boolean;
  holiday: HolidayResponse;
  onHolidayUpdate: (data: HolidayResponse) => void;
  onHolidayDelete: (data: HolidayResponse) => void;
}

function HolidayCategoryAccordionItem(
  props: HolidayCategoryAccordionItemProps,
) {
  return (
    <HStack spacing={4} alignSelf={'flex-start'} alignItems={'center'}>
      <Text>{`${props.holiday.name} - ${datetimeToDate(
        props.holiday.date,
      )}`}</Text>
      <Tooltip label='Editar Feriado'>
        <IconButton
          hidden={!props.isOwner}
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
          hidden={!props.isOwner}
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
