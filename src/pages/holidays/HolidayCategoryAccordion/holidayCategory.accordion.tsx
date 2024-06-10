import { AddIcon, MinusIcon } from '@chakra-ui/icons';
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
  Skeleton,
  Spacer,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
import { HolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';
import HolidayCategoryAccordionItem from './holidayCategory.accordion.item';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { HolidayUnfetchResponse } from 'models/http/responses/holiday.response.models';
import { useEffect } from 'react';
import { sortAllHolidaysFromHolidaysCategories } from 'utils/holidaysCategories/holidaysCategories.sorter';

interface HolidayCategoryAccordionProps {
  loading: boolean;
  categories: HolidayCategoryResponse[];
  onHolidayCategoryUpdate: (data: HolidayCategoryResponse) => void;
  onHolidayCategoryDelete: (data: HolidayCategoryResponse) => void;
  onHolidayCreate: (category: HolidayCategoryResponse) => void;
  onHolidayUpdate: (data: HolidayUnfetchResponse) => void;
  onHolidayDelete: (data: HolidayUnfetchResponse) => void;
}

export function HolidayCategoryAccordion(props: HolidayCategoryAccordionProps) {
  useEffect(() => {
    sortAllHolidaysFromHolidaysCategories(props.categories);
  }, [props.categories]);

  return (
    <>
      {props.loading ? (
        <Skeleton w={'100%'} h={'400px'}/>
      ) : (
        <Accordion allowMultiple borderColor={'blackAlpha.900'}>
          {props.categories.length === 0 ? (
            <Alert status={'warning'} fontSize={'sm'} mb={4}>
              <AlertIcon />
              Nenhuma categoria de feriado adicionado
            </Alert>
          ) : undefined}
          {props.categories.map((category, index) => (
            <AccordionItem key={index}>
              {({ isExpanded }) => (
                <>
                  <AccordionButton>
                    <Box as='span' flex='1' textAlign='left'>
                      <Text
                        as={'b'}
                      >{`Categoria de Feriado - ${category.name}`}</Text>
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
                      <Spacer />
                      <Button
                        leftIcon={<BsFillPenFill />}
                        colorScheme={'yellow'}
                        size={'sm'}
                        variant={'ghost'}
                        onClick={() => props.onHolidayCategoryUpdate(category)}
                      >
                        Atualizar Categoria
                      </Button>
                      <Button
                        leftIcon={<BsFillTrashFill />}
                        colorScheme={'red'}
                        size={'sm'}
                        variant={'ghost'}
                        onClick={() => props.onHolidayCategoryDelete(category)}
                      >
                        Deletar Categoria
                      </Button>
                      <Button
                        leftIcon={<AddIcon />}
                        size={'sm'}
                        variant={'ghost'}
                        onClick={() => props.onHolidayCreate(category)}
                      >
                        Cadastrar Feriado
                      </Button>
                    </HStack>
                    <Divider mb={2} borderColor={'blackAlpha.500'} />
                    <VStack
                      divider={<StackDivider borderColor='blackAlpha.500' />}
                    >
                      {category.holidays.length === 0 ? (
                        <Alert status={'warning'} fontSize={'sm'} mb={4}>
                          <AlertIcon />
                          Nenhum feriado adicionado a essa categoria
                        </Alert>
                      ) : undefined}
                      {category.holidays.map((holiday, idx) => (
                        <HolidayCategoryAccordionItem
                          key={idx}
                          holiday={holiday}
                          onHolidayUpdate={props.onHolidayUpdate}
                          onHolidayDelete={props.onHolidayDelete}
                        />
                      ))}
                    </VStack>
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </>
  );
}

export default HolidayCategoryAccordion;
