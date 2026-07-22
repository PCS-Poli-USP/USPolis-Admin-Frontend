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
  Grid,
  IconButton,
  Tooltip,
  Text,
} from '@chakra-ui/react';
import { PermissionResponse } from '../../../models/http/responses/permissions.response.models';
import { Resource } from '../../../utils/enums/resources.enums';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { PermissionAction } from '../../../utils/enums/actions.enums';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaUserGear } from 'react-icons/fa6';
import { FaUnlock } from 'react-icons/fa';
import { LuPen, LuTrash } from 'react-icons/lu';

interface ResourceTabProps {
  resource: Resource;
  permissions: PermissionResponse[];
  onEdit: (permission: PermissionResponse) => void;
  onRemove: (permission: PermissionResponse) => void;
}

function ResourceTab({
  resource,
  permissions,
  onEdit,
  onRemove,
}: ResourceTabProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 250);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const resourceActions = PermissionAction.getValues(resource);
  const actionWidth = 90;
  const labelWidth = 300;
  const optionsWidth = 100;
  const margin = 40; // margem para gaps e divisores

  const fullWidth =
    resourceActions.length * actionWidth + optionsWidth + labelWidth + margin; // actionWidthpx por ação, optionsWidthpx para opções, 40px para gaps e divisores
  const actionColumns = `repeat(${resourceActions.length}, minmax(0, 1fr))`;
  const actionAreaWidth = `${resourceActions.length * actionWidth}px`;
  const optionsAreaWidth = `${optionsWidth}px`;

  return (
    <Flex direction={'column'} w={fullWidth} h={'full'} gap={'10px'}>
      <Flex
        justify={'space-between'}
        position={'sticky'}
        top={'60px'}
        zIndex={1}
        align={'center'}
        bg={'uspolis.white'}
        py={'10px'}
        gap={'20px'}
        borderBottom={hasScrolled ? '1px solid' : undefined}
        borderColor={'gray.200'}
        mr={'17px'}
      >
        <Text
          flex={'1'}
          minW={0}
          maxW={`${labelWidth}px`}
          fontWeight={'bold'}
          ml={'20px'}
        >
          Total de {parentMap.size} itens
        </Text>
        <Flex align={'center'} gap={'20px'}>
          <Flex w={actionAreaWidth} flexShrink={0} justify={'space-between'}>
            <Grid
              templateColumns={actionColumns}
              gap={'20px'}
              w={'full'}
              textAlign={'center'}
              alignItems={'center'}
            >
              {resourceActions.map((action, index) => (
                <Flex key={action} align={'center'} justify={'center'} minW={0}>
                  {index !== 0 && (
                    <Divider orientation='vertical' h={'20px'} mx={'12px'} />
                  )}
                  <Text whiteSpace={'nowrap'} fontWeight={'bold'}>
                    {PermissionAction.translate(action, resource)}
                  </Text>
                </Flex>
              ))}
            </Grid>
          </Flex>
          <Divider orientation='vertical' h={'24px'} />
          <Flex w={optionsAreaWidth} flexShrink={0} justify={'center'}>
            <Text
              whiteSpace={'nowrap'}
              textAlign={'center'}
              fontWeight={'bold'}
            >
              Opções
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Accordion allowToggle w={'full'}>
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
                  <Flex direction={'column'} gap={'10px'}>
                    {perms.map((perm, idx) => (
                      <Flex
                        key={`${resource}-${perm.id}`}
                        direction={'column'}
                        bg={
                          idx % 2 == 0 ? 'uspolis.lightGray' : 'uspolis.white'
                        }
                        borderRadius={'0.5rem'}
                        p={'10px 25px'}
                        gap={'15px'}
                        border={'1px solid '}
                      >
                        <Flex
                          align={'center'}
                          justify={'space-between'}
                          gap={'20px'}
                        >
                          <Text
                            flex={'1'}
                            minW={0}
                            textAlign={'start'}
                            fontWeight={'bold'}
                          >
                            {Resource.getIcon(perm.resource)}{' '}
                            {perm.resource_name}
                          </Text>
                          <Flex
                            w={actionAreaWidth}
                            flexShrink={0}
                            justify={'space-between'}
                          >
                            <Grid
                              templateColumns={actionColumns}
                              gap={'20px'}
                              w={'full'}
                              justifyItems={'center'}
                            >
                              {resourceActions.map((action, index) => (
                                <Flex
                                  key={action}
                                  align={'center'}
                                  justify={'center'}
                                  minW={0}
                                >
                                  {index !== 0 && (
                                    <Divider
                                      orientation='vertical'
                                      mx={'12px'}
                                      borderColor={'transparent'}
                                      color={'transparent'}
                                    />
                                  )}
                                  <Checkbox
                                    isChecked={perm.actions.includes(action)}
                                    readOnly={true}
                                  />
                                </Flex>
                              ))}
                            </Grid>
                          </Flex>
                          <Flex
                            w={optionsAreaWidth}
                            flexShrink={0}
                            justify={'flex-end'}
                          >
                            <Divider orientation='vertical' h={'24px'} />
                            <Flex gap={'6px'}>
                              <Tooltip label='Editar permissão' placement='top'>
                                <IconButton
                                  aria-label='editar permissão'
                                  icon={<LuPen />}
                                  size='sm'
                                  variant='outline'
                                  colorScheme='yellow'
                                  onClick={() => onEdit(perm)}
                                />
                              </Tooltip>
                              <Tooltip
                                label='Excluir permissão'
                                placement='top'
                              >
                                <IconButton
                                  aria-label='excluir permissão'
                                  icon={<LuTrash />}
                                  size='sm'
                                  variant='outline'
                                  colorScheme='red'
                                  onClick={() => onRemove(perm)}
                                />
                              </Tooltip>
                            </Flex>
                          </Flex>
                        </Flex>
                        <Divider />
                        <Flex
                          gap={'10px'}
                          justify={'space-between'}
                          align={'center'}
                        >
                          <Flex align={'center'} gap={'5px'}>
                            <Icon as={FaUserGear} />
                            {` ${perm.role_name}`}
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
