import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Tag,
  Text,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { useContext, useEffect, useState } from 'react';
import { appContext } from '../../../context/AppContext';
import useUsers from '../../../hooks/users/useUsers';
import { UserPermissionResponse } from '../../../models/http/responses/user.response.models';
import { Resource } from '../../../utils/enums/resources.enums';
import { PermissionAction } from '../../../utils/enums/actions.enums';
import { summarizeRole } from '../../../utils/roles/role.formatter';

// Papéis e permissões — real RBAC data, only fetchable (and shown) for admins.
function ProfileRoles() {
  const { loggedUser } = useContext(appContext);
  const { getUsersWithPermissions } = useUsers(false);

  const [myAccess, setMyAccess] = useState<UserPermissionResponse>();
  const [loadedAccess, setLoadedAccess] = useState(false);
  const [expandedRoles, setExpandedRoles] = useState<number[]>([0]);

  useEffect(() => {
    if (!loggedUser?.is_admin) return;
    getUsersWithPermissions().then((users) => {
      setMyAccess(users.find((user) => user.id === loggedUser.id));
      setLoadedAccess(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser?.is_admin]);

  if (!loggedUser?.is_admin) return null;

  const myRoles = myAccess?.roles || [];
  const myDirectPermissions = myAccess?.permissions || [];
  const rolesAllExpanded = expandedRoles.length === myRoles.length;

  return (
    <Box mt={'22px'}>
      <Flex align={'baseline'} justify={'space-between'} gap={'16px'} wrap={'wrap'}>
        <Box>
          <HStack align={'baseline'} spacing={'10px'}>
            <Text fontSize={'19px'} fontWeight={'bold'} color={'uspolis.text'}>
              Papéis e permissões
            </Text>
            {loadedAccess && (
              <Text fontSize={'13.5px'} color={'uspolis.textMuted'}>
                {myRoles.length === 1 ? '1 papel' : `${myRoles.length} papéis`}
              </Text>
            )}
          </HStack>
          <Text fontSize={'13.5px'} color={'uspolis.textMuted'} mt={'4px'} maxW={'66ch'}>
            Um papel diz o que você pode fazer e onde. Abra um papel para ver as permissões e o
            escopo.
          </Text>
        </Box>
        {myRoles.length > 0 && (
          <Button
            size={'sm'}
            variant={'outline'}
            colorScheme={'blue'}
            onClick={() =>
              setExpandedRoles(rolesAllExpanded ? [] : myRoles.map((_, index) => index))
            }
          >
            {rolesAllExpanded ? 'Recolher todos' : 'Abrir todos'}
          </Button>
        )}
      </Flex>

      {!loadedAccess && (
        <Text fontSize={'13.5px'} color={'uspolis.textMuted'} mt={'14px'}>
          Carregando papéis e permissões…
        </Text>
      )}

      {loadedAccess && myRoles.length === 0 && myDirectPermissions.length === 0 && (
        <Box mt={'14px'} p={'12px 14px'} border={'1px dashed'} borderColor={'uspolis.border'} borderRadius={'10px'}>
          <Text fontSize={'13.5px'} color={'uspolis.textMuted'}>
            Nenhum papel ou permissão granular atribuída a você. Seu acesso vem inteiramente da
            sua conta de administrador, não de papéis específicos.
          </Text>
        </Box>
      )}

      {myRoles.length > 0 && (
        <Accordion
          allowMultiple
          index={expandedRoles}
          onChange={(indexes) => setExpandedRoles(indexes as number[])}
          display={'flex'}
          flexDirection={'column'}
          gap={'12px'}
          mt={'16px'}
        >
          {myRoles.map((role, index) => {
            const summary = summarizeRole(role);
            return (
              <AccordionItem
                key={role.id}
                border={'1px solid'}
                borderColor={'uspolis.blue'}
                borderRadius={'10px'}
                overflow={'hidden'}
              >
                <AccordionButton py={'12px'} px={'16px'} _hover={{ bg: 'uspolis.hover' }}>
                  <VStack align={'flex-start'} spacing={'2px'} flex={1}>
                    <Text fontWeight={'bold'} color={'uspolis.text'} fontSize={'15.5px'}>
                      {role.name}
                    </Text>
                    <Text fontSize={'13px'} color={'uspolis.textMuted'}>
                      {summary.pills.length === 0
                        ? 'Sem permissões específicas'
                        : `${summary.pills.length} ${summary.pills.length === 1 ? 'permissão' : 'permissões'}`}
                    </Text>
                  </VStack>
                  {expandedRoles.includes(index) ? (
                    <MinusIcon fontSize='12px' />
                  ) : (
                    <AddIcon fontSize='12px' />
                  )}
                </AccordionButton>
                <AccordionPanel px={'16px'} pb={'16px'} pt={0}>
                  <Divider borderColor={'uspolis.border'} mb={'14px'} />
                  {role.description && (
                    <Text fontSize={'14px'} color={'uspolis.black'} mb={'14px'} maxW={'74ch'}>
                      {role.description}
                    </Text>
                  )}

                  {summary.pills.length > 0 && (
                    <Box mb={'14px'}>
                      <Text
                        fontSize={'11.5px'}
                        fontWeight={'bold'}
                        letterSpacing={'0.06em'}
                        textTransform={'uppercase'}
                        color={'uspolis.textMuted'}
                      >
                        O que este papel permite
                      </Text>
                      <Wrap spacing={'8px'} mt={'8px'}>
                        {summary.pills.map((pill) => (
                          <Tag
                            key={pill}
                            borderRadius={'full'}
                            bg={'uspolis.lightBlue'}
                            color={'uspolis.darkBlue'}
                            fontSize={'12.5px'}
                            fontWeight={'medium'}
                          >
                            {pill}
                          </Tag>
                        ))}
                      </Wrap>
                    </Box>
                  )}

                  <Flex gap={'20px'} wrap={'wrap'}>
                    {summary.places.length > 0 && (
                      <Box flex={'1 1 260px'} border={'1px solid'} borderColor={'uspolis.border'} borderRadius={'10px'} p={'14px'}>
                        <Text
                          fontSize={'11.5px'}
                          fontWeight={'bold'}
                          letterSpacing={'0.06em'}
                          textTransform={'uppercase'}
                          color={'uspolis.textMuted'}
                        >
                          {`Onde vale · ${summary.places.length} ${summary.places.length === 1 ? 'local' : 'locais'}`}
                        </Text>
                        <VStack align={'flex-start'} spacing={'4px'} mt={'8px'}>
                          {summary.places.map((place) => (
                            <Text key={place} fontSize={'13.5px'} color={'uspolis.black'}>
                              {`· ${place}`}
                            </Text>
                          ))}
                        </VStack>
                      </Box>
                    )}
                    {summary.granted.length > 0 && (
                      <Box flex={'1 1 260px'} border={'1px solid'} borderColor={'uspolis.border'} borderRadius={'10px'} p={'14px'}>
                        <Text
                          fontSize={'11.5px'}
                          fontWeight={'bold'}
                          letterSpacing={'0.06em'}
                          textTransform={'uppercase'}
                          color={'uspolis.textMuted'}
                        >
                          De onde veio
                        </Text>
                        <VStack align={'flex-start'} spacing={'4px'} mt={'8px'}>
                          {summary.granted.map((line) => (
                            <Text key={line} fontSize={'13.5px'} color={'uspolis.textMuted'}>
                              {`Por ${line}`}
                            </Text>
                          ))}
                        </VStack>
                      </Box>
                    )}
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      {myDirectPermissions.length > 0 && (
        <Box mt={myRoles.length > 0 ? '16px' : '0px'}>
          <Text
            fontSize={'11.5px'}
            fontWeight={'bold'}
            letterSpacing={'0.06em'}
            textTransform={'uppercase'}
            color={'uspolis.textMuted'}
          >
            Permissões atribuídas diretamente
          </Text>
          <Wrap spacing={'8px'} mt={'8px'}>
            {myDirectPermissions.map((permission) =>
              permission.actions.map((action) => (
                <Tag
                  key={`${permission.id}-${action}`}
                  borderRadius={'full'}
                  variant={'outline'}
                  colorScheme={'blue'}
                  fontSize={'12.5px'}
                >
                  {`${Resource.translate(permission.resource)} · ${PermissionAction.translate(action, permission.resource)}${
                    permission.resource_name ? ` · ${permission.resource_name}` : ''
                  }`}
                </Tag>
              )),
            )}
          </Wrap>
        </Box>
      )}
    </Box>
  );
}

export default ProfileRoles;
