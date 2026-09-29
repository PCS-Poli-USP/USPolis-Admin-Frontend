import {
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Select,
  Text,
  Wrap,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.js';
import moment from 'moment';
import { CheckBox } from '../../../components/common';
import { SwitchInput } from '../../../components/common/form/SwitchInput';
import UserImage from '../../../components/common/UserImage/user.image';
import GroupFormatter from '../../../utils/groups/group.formatter';
import useUsers from '../../../hooks/users/useUsers';
import { defaultValues, schema } from './user.drawer.form';
import { UserDrawerProps } from './user.drawer.interface';

export default function UserDrawer(props: UserDrawerProps) {
  const { updateUser } = useUsers(false);
  const [addingRole, setAddingRole] = useState(false);
  const [pendingGroupId, setPendingGroupId] = useState('');

  const form = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (props.user) {
      form.reset({
        is_admin: props.user.is_admin,
        group_ids: props.user.group_ids,
        receive_emails: props.user.receive_emails,
      });
    }
    setAddingRole(false);
    setPendingGroupId('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.user]);

  const watchedGroupIds = form.watch('group_ids');
  const selectedGroupIds = useMemo(() => watchedGroupIds ?? [], [watchedGroupIds]);

  const selectedGroups = useMemo(
    () => props.groups.filter((group) => selectedGroupIds.includes(group.id)),
    [props.groups, selectedGroupIds],
  );

  const availableGroups = useMemo(
    () => props.groups.filter((group) => !selectedGroupIds.includes(group.id)),
    [props.groups, selectedGroupIds],
  );

  const buildingNames = useMemo(
    () => Array.from(new Set(selectedGroups.map((group) => group.building))),
    [selectedGroups],
  );

  function handleRemoveGroup(groupId: number) {
    form.setValue(
      'group_ids',
      selectedGroupIds.filter((id) => id !== groupId),
    );
  }

  function handlePickGroup(value: string) {
    setPendingGroupId(value);
    if (!value) return;
    form.setValue('group_ids', [...selectedGroupIds, Number(value)]);
    setAddingRole(false);
    setPendingGroupId('');
  }

  function handleClose() {
    props.onClose();
  }

  async function handleSave() {
    if (!props.user) return;
    const isValid = await form.trigger();
    if (!isValid) return;
    await updateUser(props.user.id, form.getValues());
    props.refetch();
    props.onClose();
  }

  return (
    <Drawer isOpen={props.isOpen} onClose={handleClose} placement={'right'} size={'md'}>
      <DrawerOverlay />
      <DrawerContent bg={'uspolis.white'}>
        <DrawerCloseButton />
        <DrawerHeader borderBottom={'1px solid'} borderColor={'uspolis.lightGray'}>
          {props.user && (
            <Flex align={'flex-start'} gap={'12px'}>
              <UserImage boxSize={'52px'} url={props.user.user_info?.picture} />
              <Box minW={0}>
                <Text fontSize={'17px'} fontWeight={'bold'} noOfLines={1}>
                  {props.user.name}
                </Text>
                <Text fontSize={'12.5px'} color={'uspolis.textMuted'} noOfLines={1}>
                  {props.user.email}
                </Text>
              </Box>
            </Flex>
          )}
        </DrawerHeader>

        <DrawerBody>
          <FormProvider {...form}>
            <Flex direction={'column'} gap={'10px'} py={'16px'}>
              <CheckBox name='is_admin' text='Administrador do sistema' />

              <Flex align={'center'} justify={'space-between'} mt={'10px'}>
                <Text fontSize={'15px'} fontWeight={'bold'} color={'uspolis.blue'}>
                  Notificações por email
                </Text>
                <SwitchInput name='receive_emails' />
              </Flex>

              <Box mt={'22px'}>
                <Text fontSize={'11.5px'} fontWeight={'bold'} letterSpacing={'0.06em'} color={'uspolis.textMuted'}>
                  {`PAPÉIS (${selectedGroups.length})`}
                </Text>
                <Flex direction={'column'} gap={'8px'} mt={'10px'}>
                  {selectedGroups.map((group) => (
                    <Flex
                      key={group.id}
                      border={'1px solid'}
                      borderColor={'uspolis.border'}
                      borderRadius={'8px'}
                      p={'10px 12px'}
                      align={'flex-start'}
                      justify={'space-between'}
                      gap={'8px'}
                    >
                      <Box>
                        <Text fontSize={'13.5px'} fontWeight={'bold'}>
                          {GroupFormatter.getGroupName(group)}
                        </Text>
                        <Text fontSize={'12px'} color={'uspolis.textMuted'} mt={'2px'}>
                          {group.building}
                        </Text>
                      </Box>
                      <IconButton
                        aria-label='remover-papel'
                        icon={<CloseIcon boxSize={'10px'} />}
                        size={'xs'}
                        variant={'ghost'}
                        colorScheme={'red'}
                        onClick={() => handleRemoveGroup(group.id)}
                      />
                    </Flex>
                  ))}
                  {selectedGroups.length === 0 && (
                    <Text fontSize={'12.5px'} color={'uspolis.textMuted'}>
                      Nenhum papel atribuído
                    </Text>
                  )}
                </Flex>

                {addingRole && (
                  <Select
                    mt={'10px'}
                    size={'sm'}
                    placeholder='Selecione um papel para adicionar…'
                    value={pendingGroupId}
                    onChange={(e) => handlePickGroup(e.target.value)}
                  >
                    {availableGroups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {`${group.building} - ${GroupFormatter.getGroupName(group)}`}
                      </option>
                    ))}
                  </Select>
                )}
                <Button
                  mt={'10px'}
                  size={'sm'}
                  w={'full'}
                  variant={'outline'}
                  borderStyle={'dashed'}
                  colorScheme={'blue'}
                  onClick={() => setAddingRole((v) => !v)}
                >
                  {addingRole ? 'Cancelar' : '+ Adicionar papel'}
                </Button>
              </Box>

              <Box mt={'22px'}>
                <Text fontSize={'11.5px'} fontWeight={'bold'} letterSpacing={'0.06em'} color={'uspolis.textMuted'}>
                  PRÉDIOS (via papéis)
                </Text>
                <Wrap mt={'8px'}>
                  {buildingNames.map((name) => (
                    <Badge key={name} colorScheme={'green'}>
                      {name}
                    </Badge>
                  ))}
                  {buildingNames.length === 0 && (
                    <Text fontSize={'12.5px'} color={'uspolis.textMuted'}>
                      Nenhum prédio associado
                    </Text>
                  )}
                </Wrap>
              </Box>

              {props.user && (
                <Text fontSize={'12px'} color={'uspolis.textMuted'} mt={'22px'}>
                  {`Criado por ${props.user.created_by ? props.user.created_by : 'Sistema automático'} · atualizado em ${moment(
                    props.user.updated_at,
                  ).format('DD/MM/YYYY')}`}
                </Text>
              )}
            </Flex>
          </FormProvider>
        </DrawerBody>

        <DrawerFooter borderTop={'1px solid'} borderColor={'uspolis.lightGray'} gap={'10px'}>
          <Button variant={'outline'} colorScheme={'blue'} onClick={handleClose}>
            Cancelar
          </Button>
          <Button colorScheme={'blue'} onClick={handleSave}>
            Salvar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
