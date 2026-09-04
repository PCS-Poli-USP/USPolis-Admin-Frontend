import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { CalendarResponse } from '../../../models/http/responses/calendar.responde.models';
import { UserResponse } from '../../../models/http/responses/user.response.models';
import {
  MONTH_LETTERS,
  getISOMonth,
} from '../../../utils/calendars/calendar.formatter';
import { withAlpha } from '../../../utils/holidaysCategories/holidaysCategories.colors';

interface CalendarCardProps {
  calendar: CalendarResponse;
  loggedUser: UserResponse | null;
  colorMap: Map<number, string>;
  showMonthStrip?: boolean;
  onView: (calendar: CalendarResponse) => void;
  onUpdate: (calendar: CalendarResponse) => void;
  onDelete: (calendar: CalendarResponse) => void;
}

export function CalendarCard({
  calendar,
  loggedUser,
  colorMap,
  showMonthStrip = true,
  onView,
  onUpdate,
  onDelete,
}: CalendarCardProps) {
  const isOwner = loggedUser
    ? loggedUser.is_admin || loggedUser.id === calendar.owner_id
    : false;

  const holidays = calendar.categories.flatMap((category) => category.holidays);

  const perMonth = new Array(12).fill(0);
  holidays.forEach((holiday) => {
    perMonth[getISOMonth(holiday.date)] += 1;
  });
  const maxPerMonth = Math.max(1, ...perMonth);

  return (
    <Flex
      direction={'column'}
      bg={'uspolis.white'}
      border={'1px solid'}
      borderColor={'uspolis.border'}
      borderRadius={'10px'}
      overflow={'hidden'}
      h={'100%'}
    >
      <HStack align={'flex-start'} spacing={3} p={'16px 18px 12px'}>
        <VStack align={'flex-start'} spacing={1} flex={1} minW={0}>
          <Text
            fontSize={'18px'}
            fontWeight={'bold'}
            color={'uspolis.black'}
            noOfLines={2}
          >
            {calendar.name}
          </Text>
          <Text fontSize={'13px'} color={'uspolis.textMuted'} noOfLines={1}>
            {`Criado por ${calendar.created_by}`}
          </Text>
        </VStack>
        <Tag
          flex={'none'}
          borderRadius={'20px'}
          bg={'uspolis.surfaceSubtle'}
          color={'uspolis.text'}
          fontSize={'13px'}
          fontWeight={'bold'}
        >
          {calendar.year}
        </Tag>
      </HStack>

      <VStack align={'stretch'} spacing={'10px'} px={'18px'} pb={'14px'}>
        <HStack spacing={'18px'} align={'flex-start'}>
          <VStack align={'flex-start'} spacing={0}>
            <Text
              fontSize={'20px'}
              fontWeight={'bold'}
              color={'uspolis.text'}
              lineHeight={1.2}
            >
              {holidays.length}
            </Text>
            <Text fontSize={'12px'} color={'uspolis.textMuted'}>
              feriados
            </Text>
          </VStack>
          <VStack align={'flex-start'} spacing={0}>
            <Text
              fontSize={'20px'}
              fontWeight={'bold'}
              color={'uspolis.text'}
              lineHeight={1.2}
            >
              {calendar.categories.length}
            </Text>
            <Text fontSize={'12px'} color={'uspolis.textMuted'}>
              categorias
            </Text>
          </VStack>
        </HStack>

        {calendar.categories.length > 0 ? (
          <Flex wrap={'wrap'} gap={'6px'}>
            {calendar.categories.map((category) => {
              const color = colorMap.get(category.id) ?? '#408080';
              return (
                <Tag
                  key={category.id}
                  borderRadius={'20px'}
                  fontSize={'12px'}
                  fontWeight={'medium'}
                  whiteSpace={'nowrap'}
                  color={color}
                  bg={withAlpha(color, '18')}
                  border={'1px solid'}
                  borderColor={withAlpha(color, '40')}
                >
                  {`${category.name} · ${category.holidays.length}`}
                </Tag>
              );
            })}
          </Flex>
        ) : (
          <Alert
            status={'warning'}
            fontSize={'13px'}
            borderRadius={'6px'}
            py={2}
          >
            <AlertIcon />
            Nenhuma categoria de feriado adicionada
          </Alert>
        )}

        {showMonthStrip && (
          <Flex gap={'3px'} mt={'2px'}>
            {perMonth.map((count, index) => (
              <VStack key={index} spacing={'4px'} flex={1} minW={0}>
                <Box
                  w={'100%'}
                  h={'26px'}
                  borderRadius={'3px'}
                  bg={count === 0 ? 'uspolis.surfaceSubtle' : 'uspolis.blue'}
                  opacity={
                    count === 0 ? 1 : 0.25 + 0.75 * (count / maxPerMonth)
                  }
                  title={`${MONTH_LETTERS[index]} · ${count} feriado(s)`}
                />
                <Text fontSize={'10px'} color={'uspolis.textMuted'}>
                  {MONTH_LETTERS[index]}
                </Text>
              </VStack>
            ))}
          </Flex>
        )}
      </VStack>

      <Box mt={'auto'}>
        <Divider />
        <HStack spacing={1} p={'10px 12px'}>
          <Button
            flex={1}
            size={'sm'}
            variant={'ghost'}
            leftIcon={<CalendarIcon />}
            onClick={() => onView(calendar)}
          >
            Visualizar
          </Button>
          <Button
            flex={1}
            size={'sm'}
            variant={'ghost'}
            colorScheme={'yellow'}
            leftIcon={<BsFillPenFill />}
            hidden={!isOwner}
            onClick={() => onUpdate(calendar)}
          >
            Editar
          </Button>
          <Button
            flex={1}
            size={'sm'}
            variant={'ghost'}
            colorScheme={'red'}
            leftIcon={<BsFillTrashFill />}
            hidden={!isOwner}
            onClick={() => onDelete(calendar)}
          >
            Excluir
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
}

export default CalendarCard;
