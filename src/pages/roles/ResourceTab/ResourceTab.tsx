import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  Divider,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';
import { PermissionResponse } from '../../../models/http/responses/permissions.response.models';
import { Resource } from '../../../utils/enums/resources.enums';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { PermissionAction } from '../../../utils/enums/actions.enums';
import moment from 'moment';
import { FaUserGear } from 'react-icons/fa6';
import { FaUnlock, FaUser } from 'react-icons/fa';

interface ResourceTabProps {
  resource: Resource;
  permissions: PermissionResponse[];
}

function ResourceTab({ resource, permissions }: ResourceTabProps) {
  const parentMap = new Map<string, PermissionResponse[]>();
  const parentIcon = Resource.getIcon(
    permissions.length > 0
      ? permissions[0].parent_resource || resource
      : resource,
  );
  permissions.forEach((permission) => {
    const parentName =
      permission.parent_name || permission.resource_name || 'Desconhecido';

    if (parentMap.has(parentName)) {
      parentMap.get(parentName)!.push(permission);
      return;
    }

    parentMap.set(parentName, [permission]);
  });

  const resourceActions = PermissionAction.getValues(resource);

  return (
    <Flex direction={'column'} w={'900px'} h={'full'} gap={'10px'}>
      <Flex justify={'space-between'}>
        <Text>Total de {parentMap.size} itens</Text>
        <Flex gap={'20px'}>
          {resourceActions.map((action, i) => (
            <>
              {i !== 0 && (
                <Divider key={`divider-${i}`} orientation='vertical' />
              )}
              <Text key={action}>
                {PermissionAction.translate(action, resource)}
              </Text>
            </>
          ))}
        </Flex>
      </Flex>
      <Accordion allowToggle w={'full'} width={'940px'}>
        {Array.from(parentMap.entries()).map(([parentName, perms]) => (
          <AccordionItem key={parentName}>
            {({ isExpanded }) => (
              <>
                <h2>
                  <AccordionButton gap={'10px'}>
                    {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    <Box
                      as='span'
                      flex='1'
                      textAlign='left'
                      fontWeight={'bold'}
                    >
                      {parentIcon} {parentName} ({perms.length})
                    </Box>
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <Flex direction={'column'} gap={'10px'} paddingLeft={'0px'}>
                    {perms.map((perm, idx) => (
                      <Flex
                        key={`${resource}-${perm.id}`}
                        direction={'column'}
                        bg={idx % 2 == 0 ? 'gray.100' : 'white'}
                        borderRadius={'0.5rem'}
                        p={'10px 25px'}
                        gap={'15px'}
                        border={'1px solid '}
                      >
                        <Flex
                          align={'center'}
                          justify={'space-between'}
                          gap={'10px'}
                        >
                          <Text textAlign={'center'} fontWeight={'bold'}>
                            {Resource.getIcon(perm.resource)}{' '}
                            {perm.resource_name}
                          </Text>
                          <Flex gap={'86px'} mr={'10px'}>
                            {resourceActions.map((action) => (
                              <Checkbox
                                key={action}
                                isChecked={perm.actions.includes(action)}
                              />
                            ))}
                          </Flex>
                        </Flex>
                        <Divider />
                        <Flex gap={'10px'} justify={'space-between'}>
                          <Flex align={'center'} gap={'5px'}>
                            <Icon as={FaUserGear} />
                            {` ${perm.role_name || 'Nenhum associado'}`}
                          </Flex>
                          <Flex align={'center'} gap={'5px'}>
                            <Icon as={FaUser} />
                            {` ${perm.user_name || 'Nenhum associado'}`}
                          </Flex>
                          <Flex fontSize={'sm'} gap={'5px'} align={'center'}>
                            <Icon as={FaUnlock} />
                            {` ${perm.granted_by} às ${moment(perm.granted_at).format('DD/MM/YYYY, HH:mm')}`}
                          </Flex>
                        </Flex>
                      </Flex>
                    ))}
                  </Flex>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </Flex>
  );
}

export default ResourceTab;
