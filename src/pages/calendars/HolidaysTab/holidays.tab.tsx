import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  Skeleton,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { HolidayCategoryResponse } from '../../../models/http/responses/holidayCategory.response.models';
import { HolidayResponse } from '../../../models/http/responses/holiday.response.models';
import { UserResponse } from '../../../models/http/responses/user.response.models';
import {
  MONTH_NAMES,
  WEEKDAY_SHORT_NAMES,
  getISODay,
  getISOMonth,
  getISOWeekday,
  isoToBRDate,
} from '../../../utils/calendars/calendar.formatter';
import { withAlpha } from '../../../utils/holidaysCategories/holidaysCategories.colors';

interface HolidaysTabProps {
  loading: boolean;
  year: number;
  categories: HolidayCategoryResponse[];
  colorMap: Map<number, string>;
  loggedUser: UserResponse | null;
  selectedCategoryId: number | null;
  search: string;
  onSearch: (value: string) => void;
  onSelectCategory: (id: number | null) => void;
  onCreateCategory: () => void;
  onUpdateCategory: (category: HolidayCategoryResponse) => void;
  onDeleteCategory: (category: HolidayCategoryResponse) => void;
  onCreateHoliday: () => void;
  onUpdateHoliday: (holiday: HolidayResponse) => void;
  onDeleteHoliday: (holiday: HolidayResponse) => void;
}

interface HolidayGroup {
  month: number;
  items: HolidayResponse[];
}

function stripAccents(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function isCategoryOwner(
  loggedUser: UserResponse | null,
  category: HolidayCategoryResponse,
) {
  if (!loggedUser) return false;
  return loggedUser.is_admin || loggedUser.id === category.owner_id;
}

export function HolidaysTab(props: HolidaysTabProps) {
  const { categories, colorMap, loggedUser, selectedCategoryId, search, year } =
    props;

  const selectedCategory =
    categories.find((category) => category.id === selectedCategoryId) ?? null;

  const query = stripAccents(search.trim());

  const holidays = categories
    .filter(
      (category) => !selectedCategory || category.id === selectedCategory.id,
    )
    .flatMap((category) => category.holidays)
    .filter((holiday) => {
      if (!query) return true;
      return (
        stripAccents(holiday.name).includes(query) ||
        isoToBRDate(holiday.date).includes(query)
      );
    })
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const groups: HolidayGroup[] = [];
  holidays.forEach((holiday) => {
    const month = getISOMonth(holiday.date);
    const last = groups[groups.length - 1];
    if (!last || last.month !== month) {
      groups.push({ month, items: [holiday] });
      return;
    }
    last.items.push(holiday);
  });

  const panelTitle = selectedCategory
    ? selectedCategory.name
    : `Todos os feriados de ${year}`;
  const panelSubtitle = selectedCategory
    ? `${selectedCategory.holidays.length} feriados · criado por ${selectedCategory.created_by}`
    : `${categories.length} categorias · clique em uma categoria para filtrar`;

  return (
    <Grid
      templateColumns={{ base: '1fr', lg: '320px 1fr' }}
      gap={4}
      alignItems={'start'}
    >
      <Box
        bg={'uspolis.white'}
        border={'1px solid'}
        borderColor={'uspolis.border'}
        borderRadius={'10px'}
        overflow={'hidden'}
      >
        <HStack justify={'space-between'} p={'12px 16px'}>
          <Text
            fontSize={'13px'}
            fontWeight={'bold'}
            textTransform={'uppercase'}
            letterSpacing={'0.04em'}
            color={'uspolis.textMuted'}
          >
            Categorias
          </Text>
          <Text fontSize={'12px'} color={'uspolis.textMuted'}>
            {year}
          </Text>
        </HStack>
        <Divider />

        <Skeleton isLoaded={!props.loading}>
          {categories.length === 0 ? (
            <Alert
              status={'warning'}
              fontSize={'13px'}
              m={3}
              w={'auto'}
              borderRadius={'6px'}
            >
              <AlertIcon />
              Nenhuma categoria de feriado adicionada
            </Alert>
          ) : (
            <VStack align={'stretch'} spacing={0}>
              {categories.map((category) => {
                const active = selectedCategoryId === category.id;
                const owner = isCategoryOwner(loggedUser, category);
                return (
                  <HStack
                    key={category.id}
                    spacing={'10px'}
                    p={'11px 14px'}
                    cursor={'pointer'}
                    borderBottom={'1px solid'}
                    borderBottomColor={'uspolis.border'}
                    borderLeft={'3px solid'}
                    borderLeftColor={active ? 'uspolis.blue' : 'transparent'}
                    bg={active ? 'uspolis.surfaceSubtle' : 'transparent'}
                    _hover={{ bg: 'uspolis.hover' }}
                    onClick={() =>
                      props.onSelectCategory(active ? null : category.id)
                    }
                  >
                    <Box
                      flex={'none'}
                      w={'10px'}
                      h={'10px'}
                      borderRadius={'50%'}
                      bg={colorMap.get(category.id)}
                    />
                    <VStack
                      align={'flex-start'}
                      spacing={'2px'}
                      flex={1}
                      minW={0}
                    >
                      <Text
                        fontSize={'14px'}
                        fontWeight={'medium'}
                        color={'uspolis.black'}
                        noOfLines={1}
                      >
                        {category.name}
                      </Text>
                      <Text
                        fontSize={'12px'}
                        color={'uspolis.textMuted'}
                        noOfLines={1}
                      >
                        {`${category.holidays.length} feriados · ${category.created_by}`}
                      </Text>
                    </VStack>
                    <HStack spacing={'2px'}>
                      <IconButton
                        aria-label={'Atualizar categoria'}
                        title={'Atualizar categoria'}
                        icon={<BsFillPenFill />}
                        size={'xs'}
                        variant={'ghost'}
                        colorScheme={'yellow'}
                        hidden={!owner}
                        onClick={(event) => {
                          event.stopPropagation();
                          props.onUpdateCategory(category);
                        }}
                      />
                      <IconButton
                        aria-label={'Remover categoria'}
                        title={'Remover categoria'}
                        icon={<BsFillTrashFill />}
                        size={'xs'}
                        variant={'ghost'}
                        colorScheme={'red'}
                        hidden={!owner}
                        onClick={(event) => {
                          event.stopPropagation();
                          props.onDeleteCategory(category);
                        }}
                      />
                    </HStack>
                  </HStack>
                );
              })}
            </VStack>
          )}
        </Skeleton>

        <Divider />
        <Button
          w={'100%'}
          variant={'ghost'}
          justifyContent={'flex-start'}
          borderRadius={0}
          leftIcon={<AddIcon />}
          onClick={props.onCreateCategory}
        >
          Nova categoria
        </Button>
      </Box>

      <Box
        bg={'uspolis.white'}
        border={'1px solid'}
        borderColor={'uspolis.border'}
        borderRadius={'10px'}
        overflow={'hidden'}
      >
        <Flex align={'center'} gap={3} wrap={'wrap'} p={'14px 18px'}>
          <VStack align={'flex-start'} spacing={'2px'} minW={0}>
            <Text
              fontSize={'17px'}
              fontWeight={'bold'}
              color={'uspolis.black'}
              noOfLines={1}
            >
              {panelTitle}
            </Text>
            <Text fontSize={'13px'} color={'uspolis.textMuted'} noOfLines={1}>
              {panelSubtitle}
            </Text>
          </VStack>
          <Box flex={1} />
          <Input
            w={'220px'}
            size={'sm'}
            borderRadius={'6px'}
            placeholder={'Buscar feriado…'}
            value={search}
            onChange={(event) => props.onSearch(event.target.value)}
          />
          <Button
            size={'sm'}
            colorScheme={'blue'}
            leftIcon={<AddIcon />}
            isDisabled={categories.length === 0}
            title={
              categories.length === 0
                ? 'Crie uma categoria antes de cadastrar feriados'
                : undefined
            }
            onClick={props.onCreateHoliday}
          >
            Feriado
          </Button>
        </Flex>
        <Divider />

        <Skeleton isLoaded={!props.loading}>
          {groups.length === 0 ? (
            <Text
              py={'56px'}
              px={5}
              textAlign={'center'}
              color={'uspolis.textMuted'}
              fontSize={'14px'}
            >
              Nenhum feriado encontrado
            </Text>
          ) : (
            groups.map((group) => (
              <Box key={group.month}>
                <HStack
                  spacing={'10px'}
                  p={'9px 18px'}
                  bg={'uspolis.surfaceSubtle'}
                  borderBottom={'1px solid'}
                  borderBottomColor={'uspolis.border'}
                >
                  <Text
                    fontSize={'12px'}
                    fontWeight={'bold'}
                    textTransform={'uppercase'}
                    letterSpacing={'0.05em'}
                    color={'uspolis.textMuted'}
                  >
                    {MONTH_NAMES[group.month]}
                  </Text>
                  <Text fontSize={'12px'} color={'uspolis.textMuted'}>
                    {`${group.items.length} ${
                      group.items.length === 1 ? 'feriado' : 'feriados'
                    }`}
                  </Text>
                </HStack>

                {group.items.map((holiday) => {
                  const color = colorMap.get(holiday.category_id) ?? '#408080';
                  const category = categories.find(
                    (item) => item.id === holiday.category_id,
                  );
                  const owner = category
                    ? isCategoryOwner(loggedUser, category)
                    : false;
                  return (
                    <HStack
                      key={holiday.id}
                      spacing={'14px'}
                      p={'11px 18px'}
                      borderBottom={'1px solid'}
                      borderBottomColor={'uspolis.border'}
                      _hover={{ bg: 'uspolis.hover' }}
                    >
                      <VStack
                        flex={'none'}
                        w={'46px'}
                        h={'46px'}
                        spacing={'2px'}
                        justify={'center'}
                        borderRadius={'8px'}
                        bg={withAlpha(color, '16')}
                        color={color}
                      >
                        <Text
                          fontSize={'16px'}
                          fontWeight={'bold'}
                          lineHeight={1}
                        >
                          {getISODay(holiday.date)}
                        </Text>
                        <Text
                          fontSize={'10px'}
                          textTransform={'uppercase'}
                          letterSpacing={'0.04em'}
                        >
                          {WEEKDAY_SHORT_NAMES[getISOWeekday(holiday.date)]}
                        </Text>
                      </VStack>

                      <VStack
                        align={'flex-start'}
                        spacing={'2px'}
                        flex={1}
                        minW={0}
                      >
                        <Text
                          fontSize={'15px'}
                          fontWeight={'medium'}
                          color={'uspolis.black'}
                          noOfLines={1}
                        >
                          {holiday.name}
                        </Text>
                        <Text fontSize={'12px'} color={'uspolis.textMuted'}>
                          {isoToBRDate(holiday.date)}
                        </Text>
                      </VStack>

                      <Tag
                        borderRadius={'20px'}
                        fontSize={'12px'}
                        fontWeight={'medium'}
                        whiteSpace={'nowrap'}
                        color={color}
                        bg={withAlpha(color, '14')}
                        border={'1px solid'}
                        borderColor={withAlpha(color, '35')}
                      >
                        {category ? category.name : holiday.category}
                      </Tag>

                      <HStack spacing={'2px'}>
                        <IconButton
                          aria-label={'Editar feriado'}
                          title={'Editar feriado'}
                          icon={<BsFillPenFill />}
                          size={'sm'}
                          variant={'ghost'}
                          colorScheme={'yellow'}
                          hidden={!owner}
                          onClick={() => props.onUpdateHoliday(holiday)}
                        />
                        <IconButton
                          aria-label={'Excluir feriado'}
                          title={'Excluir feriado'}
                          icon={<BsFillTrashFill />}
                          size={'sm'}
                          variant={'ghost'}
                          colorScheme={'red'}
                          hidden={!owner}
                          onClick={() => props.onDeleteHoliday(holiday)}
                        />
                      </HStack>
                    </HStack>
                  );
                })}
              </Box>
            ))
          )}
        </Skeleton>
      </Box>
    </Grid>
  );
}

export default HolidaysTab;
