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
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Icon,
  SimpleGrid,
  Switch,
  Text,
} from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import { appContext } from '../../context/AppContext';
import { useContext, useEffect } from 'react';
import {
  getUserBuildings,
  getUserRole,
} from '../../utils/users/users.formatter';
import { AddIcon, EmailIcon, MinusIcon } from '@chakra-ui/icons';
import { LiaBuilding } from 'react-icons/lia';
import moment from 'moment';
import { HiUserGroup } from 'react-icons/hi';
import UserImage from '../../components/common/UserImage/user.image';
import { PiChair } from 'react-icons/pi';
import LoadingPage from '../../components/common/LoadingPage';
import Page401 from '../page401';
import GroupFormatter from '../../utils/groups/group.formatter';
import { LuMail, LuMailX } from 'react-icons/lu';
import useUsers from '../../hooks/users/useUsers';
import HelpPopover from '../../components/common/HelpPopover';

function Profile() {
  const { loggedUser, loading, isAuthenticated, getSelfFromBackend } =
    useContext(appContext);
  const userInfo = loggedUser?.user_info;
  const { updateUserEmailNotifications } = useUsers(false);

  useEffect(() => {
    getSelfFromBackend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(loggedUser);

  return (
    <PageContent>
      {!loading && loggedUser ? (
        <>
          <Center>
            <Grid
              id='profile-grid'
              w={'1000px'}
              h={'auto'}
              templateColumns='repeat(1, 1fr)'
              border={'2px'}
              borderRadius={'10px'}
              padding={'20px'}
            >
              <GridItem
                colSpan={1}
                h={'300px'}
                mb={'30px'}
                id='profile-info-grid'
              >
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
                    w={'300px'}
                    gap={'10px'}
                  >
                    <UserImage boxSize='120px' />

                    <Text fontSize={'2xl'} fontWeight={'bold'}>
                      {userInfo ? userInfo.name : 'Usuário não encontrado'}
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
                      <EmailIcon />{' '}
                      {userInfo ? userInfo.email : 'Email não encontrado'}
                    </Box>
                    <Box>
                      {`Último acesso em ${moment(
                        loggedUser.last_visited,
                      ).format('DD/MM/YYYY [às] HH:mm:ss')}`}
                    </Box>
                  </Flex>
                </Flex>
              </GridItem>

              <GridItem
                colSpan={1}
                h={'50px'}
                id='profile-notifications-grid'
                hidden={
                  (!loggedUser.buildings ||
                    loggedUser.buildings.length === 0) &&
                  !loggedUser.is_admin
                }
              >
                <Flex dir='row' justify={'start'} align={'center'} gap={'10px'}>
                  <FormControl display='flex' alignItems='center'>
                    {loggedUser.receive_emails ? (
                      <LuMail size={'25px'} />
                    ) : (
                      <LuMailX size={'25px'} />
                    )}
                    <FormLabel
                      htmlFor='email-alerts'
                      fontSize={'xl'}
                      fontWeight={'bold'}
                      ml='10px'
                      mb='0'
                    >
                      Notificações por email?
                    </FormLabel>
                    <Switch
                      id='email-alerts'
                      isChecked={loggedUser.receive_emails}
                      mr={'5px'}
                      onChange={async (e) => {
                        await updateUserEmailNotifications(e.target.checked);
                        await getSelfFromBackend();
                      }}
                    />
                    <HelpPopover title='O que é notificado?'>
                      <Flex direction={'column'} gap={'5px'}>
                        <Text fontWeight={'bold'}>
                          Para responsáveis por prédios:
                        </Text>
                        <Text fontSize={'sm'}>
                          Uma reserva foi criada/cancelada e ela estiver no seu
                          prédio ou for em uma sala que você tem permissão.
                        </Text>
                      </Flex>
                    </HelpPopover>
                  </FormControl>
                </Flex>
              </GridItem>

              <GridItem colSpan={1} h={'50px'} id='profile-buildings-grid'>
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

              <GridItem colSpan={1} h={'auto'} id='profile-groups-grid'>
                <Flex
                  dir='row'
                  justify={'start'}
                  align={'center'}
                  gap={'10px'}
                  mb={'20px'}
                >
                  <HiUserGroup size={'25px'} />
                  <Text fontSize={'xl'} fontWeight={'bold'}>
                    Grupos e salas
                  </Text>
                </Flex>

                {loggedUser.groups.length === 0 ? (
                  <Alert
                    status={'warning'}
                    fontSize={'sm'}
                    mb={4}
                    borderRadius={'10px'}
                  >
                    <AlertIcon />
                    Não pertence a nenhum grupo nem possui salas, se você for um
                    responsável por prédio entre em contato por uspolis@usp.br.
                  </Alert>
                ) : (
                  <Accordion
                    allowMultiple
                    defaultIndex={[0]}
                    borderColor={'uspolis.blue'}
                    border={'1px'}
                  >
                    {loggedUser.groups.map((group, index) => (
                      <AccordionItem key={index}>
                        {({ isExpanded }) => (
                          <>
                            <AccordionButton>
                              <Box as='span' flex='1' textAlign='left'>
                                <Text as={'b'}>{`${GroupFormatter.getGroupName(
                                  group,
                                )} (${
                                  group.classroom_strs.length
                                } salas)`}</Text>
                              </Box>
                              {isExpanded ? (
                                <MinusIcon fontSize='12px' />
                              ) : (
                                <AddIcon fontSize='12px' />
                              )}
                            </AccordionButton>
                            <AccordionPanel>
                              <Flex
                                key={index}
                                direction={'column'}
                                gap={'10px'}
                              >
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
                )}
              </GridItem>
            </Grid>
          </Center>
        </>
      ) : undefined}
      {isAuthenticated && loading && <LoadingPage />}
      {!isAuthenticated && !loading ? <Page401 /> : undefined}
    </PageContent>
  );
}

export default Profile;
