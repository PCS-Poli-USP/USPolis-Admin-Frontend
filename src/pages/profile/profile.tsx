import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Icon,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import { appContext } from '../../context/AppContext';
import { useContext } from 'react';
import {
  getUserBuildings,
  getUserRole,
} from '../../utils/users/users.formatter';
import { AddIcon, EmailIcon, MinusIcon } from '@chakra-ui/icons';
import { LiaBuilding } from 'react-icons/lia';
import moment from 'moment';
import { HiUserGroup } from 'react-icons/hi';
import UserImage from '../../components/common/EmptyPage/UserImage/user.image';
import { PiChair } from 'react-icons/pi';

function Profile() {
  const { loggedUser } = useContext(appContext);
  const userInfo = loggedUser?.user_info;
  return (
    <PageContent>
      {loggedUser && userInfo ? (
        <>
          <Center>
            <Grid
              w={'1000px'}
              h={'auto'}
              templateColumns='repeat(1, 1fr)'
              border={'2px'}
              borderRadius={'10px'}
              padding={'20px'}
            >
              <GridItem colSpan={1} h={'300px'} mb={'30px'}>
                <Flex
                  align={'center'}
                  justify={'center'}
                  direction={'column'}
                  p={'20px'}
                  w={'full'}
                  gap={'20px'}
                >
                  <Flex
                    direction={'column'}
                    justify={'center'}
                    align={'center'}
                    w={'full'}
                    gap={'10px'}
                  >
                    <UserImage user={loggedUser} boxSize='120px' />

                    <Text fontSize={'2xl'} fontWeight={'bold'}>
                      {userInfo.name}
                    </Text>
                    <Text fontSize={'xl'} fontWeight={'bold'}>
                      {getUserRole(loggedUser)}
                    </Text>
                  </Flex>
                  <Flex
                    direction={'column'}
                    gap={'10px'}
                    justify={'center'}
                    align={'center'}
                  >
                    <Box>
                      <EmailIcon /> {userInfo.email}
                    </Box>
                    <Box>
                      {`Último acesso em ${moment(
                        loggedUser.last_visited,
                      ).format('DD/MM/YYYY [às] HH:mm:ss')}`}
                    </Box>
                  </Flex>
                </Flex>
              </GridItem>

              <GridItem colSpan={1} h={'50px'}>
                <Flex dir='row' justify={'start'} align={'center'} gap={'10px'}>
                  <LiaBuilding size={'25px'} />
                  <Text fontSize={'xl'} fontWeight={'bold'}>
                    Prédios:
                  </Text>
                  <Text
                    h={'100%'}
                    fontSize={'xl'}
                    alignSelf={'center'}
                    justifySelf={'center'}
                  >
                    {getUserBuildings(loggedUser)}
                  </Text>
                </Flex>
              </GridItem>

              <GridItem colSpan={1} h={'auto'}>
                <Flex
                  dir='row'
                  justify={'start'}
                  align={'center'}
                  gap={'10px'}
                  mb={'20px'}
                >
                  <HiUserGroup size={'30px'} />
                  <Text fontSize={'2xl'} fontWeight={'bold'}>
                    Grupos e salas
                  </Text>
                </Flex>

                <Accordion
                  allowMultiple
                  allowToggle
                  borderColor={'uspolis.blue'}
                  border={'1px'}
                >
                  {loggedUser.groups.length === 0 ? (
                    <Alert status={'warning'} fontSize={'sm'} mb={4}>
                      <AlertIcon />
                      Não pertence a nenhum grupo nem possui salas
                    </Alert>
                  ) : undefined}

                  {loggedUser.groups.map((group, index) => (
                    <AccordionItem key={index}>
                      {({ isExpanded }) => (
                        <>
                          <AccordionButton>
                            <Box as='span' flex='1' textAlign='left'>
                              <Text
                                as={'b'}
                              >{`${group.name} (${group.classroom_strs.length} salas)`}</Text>
                            </Box>
                            {isExpanded ? (
                              <MinusIcon fontSize='12px' />
                            ) : (
                              <AddIcon fontSize='12px' />
                            )}
                          </AccordionButton>
                          <AccordionPanel>
                            <Flex key={index} direction={'column'} gap={'10px'}>
                              <SimpleGrid
                                w={'full'}
                                minChildWidth={'160px'}
                                spacing={'15px'}
                                alignItems={'flex-end'}
                              >
                                {group.classroom_strs.length === 0 ? (
                                  <Alert
                                    status={'warning'}
                                    fontSize={'sm'}
                                    borderRadius={'10px'}
                                    mb={4}
                                  >
                                    <AlertIcon />
                                    Esse grupo não possui salas
                                  </Alert>
                                ) : undefined}
                                {group.classroom_strs.map(
                                  (classroom, index) => (
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
                                        alignContent={'center'}
                                        h={'50px'}
                                      >{`${classroom}`}</Text>
                                    </Flex>
                                  ),
                                )}
                              </SimpleGrid>
                            </Flex>
                          </AccordionPanel>
                        </>
                      )}
                    </AccordionItem>
                  ))}
                </Accordion>
              </GridItem>
            </Grid>
          </Center>
        </>
      ) : (
        <Text fontSize={'4xl'}>Entre primeiro para acessar essa página!</Text>
      )}
    </PageContent>
  );
}

export default Profile;
