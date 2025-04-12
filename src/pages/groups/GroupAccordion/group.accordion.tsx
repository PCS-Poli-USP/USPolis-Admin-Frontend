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
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { GroupResponse } from 'models/http/responses/group.response.models';
import moment from 'moment';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import { PiChair } from 'react-icons/pi';

interface GroupAccordionProps {
  groups: GroupResponse[];
  onGroupUpdate: (group: GroupResponse) => void;
  onGroupDelete: (group: GroupResponse) => void;
}

function GroupAccordion(props: GroupAccordionProps) {
  return (
    <Accordion
      allowMultiple
      defaultIndex={[0]}
      borderColor={'uspolis.blue'}
      border={'1px'}
    >
      {props.groups.length === 0 ? (
        <Alert status={'warning'} fontSize={'sm'} mb={4}>
          <AlertIcon />
          Nenhum Grupo adicionado
        </Alert>
      ) : undefined}
      {props.groups.map((group, index) => (
        <AccordionItem key={index}>
          {({ isExpanded }) => (
            <>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  <Text
                    as={'b'}
                  >{`${group.abbreviation} - ${group.name}`}</Text>
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
                  <Text>{`Atualizado em ${moment(group.updated_at).format(
                    'DD/MM/YYYY  [às] HH:mm',
                  )}`}</Text>
                  <Spacer />
                  <Button
                    leftIcon={<BsFillPenFill />}
                    colorScheme={'yellow'}
                    size={'sm'}
                    variant={'ghost'}
                    onClick={() => {
                      props.onGroupUpdate(group);
                    }}
                  >
                    Atualizar Grupo
                  </Button>
                  <Button
                    leftIcon={<BsFillTrashFill />}
                    colorScheme={'red'}
                    size={'sm'}
                    variant={'ghost'}
                    onClick={() => props.onGroupDelete(group)}
                  >
                    Deletar Grupo
                  </Button>
                </HStack>
                <Divider mb={2} borderColor={'blackAlpha.500'} />
                <Flex
                  direction={'row'}
                  w={'full'}
                  gap={'40px'}
                  justifyContent={'space-between'}
                >
                  <Flex
                    direction={'column'}
                    w={'50%'}
                    gap={'20px'}
                    border={'1px'}
                    borderRadius={'10px'}
                    padding={'15px'}
                  >
                    <Text fontWeight={'bold'}>Usuários</Text>
                    {group.user_strs.length > 0 ? (
                      <SimpleGrid
                        w={'full'}
                        minChildWidth={'250px'}
                        spacing={'15px'}
                      >
                        {group.user_strs.map((user, index) => (
                          <Flex
                            key={index}
                            justify={'flex-start'}
                            align={'center'}
                            gap={'10px'}
                          >
                            <Icon boxSize={'20px'} as={FaUser} />
                            <Text
                              maxW={'250px'}
                              h={'50px'}
                              overflowX={'hidden'}
                              textOverflow={'ellipsis'}
                            >
                              {`${user}`}
                            </Text>
                          </Flex>
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Alert status={'warning'} fontSize={'sm'} mb={4}>
                        <AlertIcon />
                        Nenhum usuário adicionado
                      </Alert>
                    )}
                  </Flex>
                  <Flex
                    direction={'column'}
                    w={'50%'}
                    gap={'10px'}
                    borderRadius={'10px'}
                    padding={'15px'}
                    border={'1px'}
                  >
                    <Text fontWeight={'bold'}>Salas</Text>
                    {group.classroom_strs.length > 0 ? (
                      <SimpleGrid
                        w={'full'}
                        minChildWidth={'160px'}
                        spacing={'15px'}
                        alignItems={'flex-end'}
                      >
                        {group.classroom_strs.map((classroom, index) => (
                          <Flex
                            key={index}
                            justify={'flex-start'}
                            align={'center'}
                            gap={'5px'}
                            w={'160px'}
                          >
                            <Icon boxSize={'20px'} as={PiChair} />
                            <Text
                              w={'160px'}
                              overflowX={'hidden'}
                              textOverflow={'ellipsis'}
                              h={'50px'}
                            >{`${classroom}`}</Text>
                          </Flex>
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Alert status={'warning'} fontSize={'sm'} mb={4}>
                        <AlertIcon />
                        Nenhuma sala adicionada
                      </Alert>
                    )}
                  </Flex>
                </Flex>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default GroupAccordion;
