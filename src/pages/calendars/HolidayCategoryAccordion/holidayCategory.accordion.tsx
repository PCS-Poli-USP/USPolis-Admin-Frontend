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
import { HolidayCategoryResponse } from '../../../models/http/responses/holidayCategory.response.models';
import HolidayCategoryAccordionItem from './holidayCategory.accordion.item';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { sortAllHolidaysFromHolidaysCategories } from '../../../utils/holidaysCategories/holidaysCategories.sorter';
import { HolidayResponse } from '../../../models/http/responses/holiday.response.models';
import { UserResponse } from '../../../models/http/responses/user.response.models';

interface HolidayCategoryAccordionProps {
  loading: boolean;
  loggedUser: UserResponse | null;
  categories: HolidayCategoryResponse[];
  onHolidayCategoryUpdate: (data: HolidayCategoryResponse) => void;
  onHolidayCategoryDelete: (data: HolidayCategoryResponse) => void;
  onHolidayCreate: (category: HolidayCategoryResponse) => void;
  onHolidayUpdate: (data: HolidayResponse) => void;
  onHolidayDelete: (data: HolidayResponse) => void;
}

export function HolidayCategoryAccordion(props: HolidayCategoryAccordionProps) {
  useEffect(() => {
    sortAllHolidaysFromHolidaysCategories(props.categories);
  }, [props.categories]);

  const [lastOpenedIndex, setLastOpenedIndex] = useState<number[]>();
  return (
    <>
      {props.loading ? (
        <Skeleton w={'100%'} h={'400px'} />
      ) : (
        <Accordion
          allowMultiple
          borderColor={'uspolis.blue'}
          border={'1px'}
          index={lastOpenedIndex ? lastOpenedIndex : undefined}
          onChange={(val) => setLastOpenedIndex(val as number[])}
        >
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
                      >{`Categoria de Feriado: ${category.name}`}</Text>
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
                      <Text>{`Criador por ${category.created_by}`}</Text>
                      <Spacer />
                      <Button
                        leftIcon={<BsFillPenFill />}
                        colorScheme={'yellow'}
                        size={'sm'}
                        variant={'ghost'}
                        onClick={() => props.onHolidayCategoryUpdate(category)}
                        hidden={
                          props.loggedUser
                            ? !props.loggedUser.is_admin &&
                              props.loggedUser.id !== category.owner_id
                            : true
                        }
                      >
                        Atualizar Categoria
                      </Button>
                      <Button
                        leftIcon={<BsFillTrashFill />}
                        hidden={
                          props.loggedUser
                            ? !props.loggedUser.is_admin &&
                              props.loggedUser.id !== category.owner_id
                            : true
                        }
                        colorScheme={'red'}
                        size={'sm'}
                        variant={'ghost'}
                        onClick={() => props.onHolidayCategoryDelete(category)}
                      >
                        Excluir Categoria
                      </Button>
                      <Button
                        hidden={
                          props.loggedUser
                            ? !props.loggedUser.is_admin &&
                              props.loggedUser.id !== category.owner_id
                            : true
                        }
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
                          isOwner={
                            props.loggedUser
                              ? props.loggedUser.is_admin ||
                                props.loggedUser.id === category.owner_id
                              : false
                          }
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
