/* eslint-disable react-hooks/incompatible-library */
import {
  Button,
  Checkbox,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import {
  ClassroomForm,
  ClassroomModalProps,
} from './classroom.modal.interface';
import { FormProvider, useForm } from 'react-hook-form';
import { defaultValues, schema } from './classroom.modal.form';
import { yupResolver } from '@hookform//resolvers/yup';
import {
  Input,
  MultiSelectInput,
  SelectInput,
  TextareaInput,
} from '../../../components/common';
import { NumberInput } from '../../../components/common/form/NumberInput';
import { CheckBox } from '../../../components/common/form/CheckBox';
import useClassrooms from '../../../hooks/classrooms/useClassrooms';
import { AudiovisualType } from '../../../utils/enums/audiovisualType.enum';
import GroupFormatter from '../../../utils/groups/group.formatter';
import HelpPopover from '../../../components/common/HelpPopover';

export default function ClassroomModal(props: ClassroomModalProps) {
  const form = useForm<ClassroomForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const { trigger, reset, getValues, clearErrors, setValue, watch } = form;
  const { createClassroom, updateClassroom } = useClassrooms();

  const building_id = watch('building_id');
  // const remote = watch('remote');
  // const laboratory = watch('laboratory');
  // const reservable = watch('reservable');

  useEffect(() => {
    if (props.selectedClassroom) {
      reset({
        ...props.selectedClassroom,
        reservable: props.selectedClassroom.reservable,
        restricted: props.selectedClassroom.restricted,
      });
    }
    if (props.buildings.length === 1) {
      setValue('building_id', props.buildings[0].id);
    }
    if (props.groups.length === 1) {
      setValue('group_ids', [props.groups[0].id]);
    }
  }, [props, reset, setValue]);

  async function handleSaveClick() {
    const isValid = await trigger();
    if (!isValid) return;
    const values = getValues();

    if (props.isUpdate && props.selectedClassroom) {
      await updateClassroom(props.selectedClassroom.id, {
        ...values,
        reservable: values.reservable,
        restricted: values.restricted,
      });
    } else {
      await createClassroom({
        ...values,
        reservable: values.reservable,
        restricted: values.restricted,
      });
    }
    props.refetch();
    handleCloseModal();
  }

  function handleCloseModal() {
    reset(defaultValues);
    clearErrors();
    props.onClose();
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={handleCloseModal}
      size={'3xl'}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent
        w="calc(100vw - 16px)"
        maxW={{ base: 'calc(100vw - 16px)', md: '3xl' }}
        minW={0}
        maxH="90vh"
      >
        <ModalHeader>
          {props.isUpdate ? 'Editar Sala' : 'Cadastrar Sala'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} px={{ base: 4, md: 6 }} overflowY="auto">
          <FormProvider {...form}>
            <form style={{ minWidth: 0 }}>
              <SelectInput
                mb={4}
                label={'Prédio'}
                name={'building_id'}
                placeholder={'Escolha um prédio'}
                disabled={props.buildings.length === 1}
                hidden={props.buildings.length === 1}
                options={props.buildings.map((building) => ({
                  value: building.id,
                  label: building.name,
                }))}
              />

              <Input label={'Nome'} name={'name'} placeholder='Nome da sala' />

              <Flex
                justify={'center'}
                align={'center'}
                w={'full'}
                gap={'5px'}
              >
                <NumberInput
                  mt={4}
                  w="calc(50% - 3px)"
                  min={0}
                  label={'Andar'}
                  name={'floor'}
                  placeholder={'Andar da sala'}
                />

                <NumberInput
                  min={0}
                  mt={4}
                  w="calc(50% - 3px)"
                  label={'Capacidade'}
                  name={'capacity'}
                  placeholder={'Capacidade da sala'}
                />
              </Flex>

              <Flex
                mt="20px"
                mb="20px"
                direction={{ base: 'column', md: 'row' }}
                gap={{ base: 5, md: 3 }}
                w="full"
              >
                <VStack w="full" minW={0} alignItems="start" gap="10px">
                  <Flex justify="space-between" w="full">
                    <Flex direction="column" gap="10px" mr={{ base: 0, md: '20px' }}>
                      <Text fontWeight={'bold'}>Recursos</Text>
                      <CheckBox
                        text={'Ar condicionado'}
                        name={'air_conditioning'}
                      />
                      <CheckBox
                        text={'Acessibilidade'}
                        name={'accessibility'}
                      />
                    </Flex>
                  </Flex>

                  <SelectInput
                    name='audiovisual'
                    label='Recurso audiovisual'
                    w="full"
                    options={AudiovisualType.values().map((type) => ({
                      label: AudiovisualType.translate(type),
                      value: type,
                    }))}
                  />
                </VStack>

                <Flex direction="column" gap="10px" w="full" minW={0}>
                  <HStack
                    w={'full'}
                    align={'center'}
                    justify={'start'}
                    gap={'10px'}
                  >
                    <Text fontWeight={'bold'}>Configurações</Text>
                    <HelpPopover
                      title='O que são configurações?'
                      placement='right'
                    >
                      <VStack
                        direction={'column'}
                        gap={'5px'}
                        textAlign={'justify'}
                        divider={<StackDivider />}
                      >
                        <Text fontSize={'sm'}>
                          As configurações determinam a natureza da sala e como
                          ela pode ser utilizada.
                        </Text>
                        {/* <Text fontSize={'sm'}>
                          Se ela é <strong>remota</strong>, não vai aparecer no
                          mapa de salas nem nos relatórios e será ignorada para
                          verificar CONFLITOS.
                        </Text> */}
                        {/* <Text fontSize={'sm'}>
                          Se ela é um <strong>laboratório</strong>, vai ter um
                          indentificador [LAB], não pode ser remota podendo ser
                          reservável ou não.
                        </Text> */}
                        <Text fontSize={'sm'}>
                          Se uma sala é <strong>reservável</strong> pode ser
                          solicitada pelos usuários.
                        </Text>
                        <Text fontSize={'sm'}>
                          Se ela é <strong>restrita</strong> não aparece no mapa
                          de salas.
                        </Text>
                      </VStack>
                    </HelpPopover>
                  </HStack>

                  {/* <CheckBox
                    text={'Remoto'}
                    name={'remote'}
                    disabled={laboratory || reservable}
                    onChange={(value) => {
                      if (value) {
                        form.setValue('laboratory', false);
                        form.setValue('reservable', false);
                      }
                    }}
                  /> */}
                  {/* <CheckBox
                    text={'Laboratório'}
                    name={'laboratory'}
                    disabled={remote}
                    onChange={(value) => {
                      if (value) form.setValue('remote', false);
                    }}
                  /> */}
                  <CheckBox
                    text={'Reservável'}
                    name={'reservable'}
                    // disabled={remote}
                  />
                  <CheckBox text={'Restrita'} name={'restricted'} />
                </Flex>
              </Flex>
              <MultiSelectInput
                label='Grupos'
                name='group_ids'
                hidden={props.groups.length === 1}
                disabled={props.groups.length === 1 || !building_id}
                placeholder={
                  !building_id
                    ? 'Selecione um prédio primeiro'
                    : 'Selecione para quais grupos a sala vai ser adicionada'
                }
                options={props.groups
                  .filter((group) => group.building_id === building_id)
                  .map((group) => ({
                    label: GroupFormatter.getGroupName(group),
                    value: group.id,
                  }))}
              />
              <Checkbox
                mt={'5px'}
                disabled={props.groups.length === 1 || !building_id}
                hidden={props.groups.length === 1}
                onChange={(event) => {
                  if (event.target.checked) {
                    const groups = props.groups
                      .filter((group) => group.building_id === building_id)
                      .map((group) => group.id);
                    setValue('group_ids', groups);
                  } else setValue('group_ids', []);
                }}
              >
                Selecionar todos
              </Checkbox>
              <TextareaInput
                name='observation'
                label='Observação'
                mt={'20px'}
              />
            </form>
          </FormProvider>
        </ModalBody>

        <ModalFooter
          direction={{ base: 'column-reverse', sm: 'row' }}
          gap={2}
        >
          <Button
            onClick={() => handleCloseModal()}
            mr={{ base: 0, sm: '10px' }}
            colorScheme='red'
            w={{ base: 'full', sm: 'auto' }}
          >
            Cancelar
          </Button>
          <Button colorScheme='blue' onClick={handleSaveClick} w={{ base: 'full', sm: 'auto' }}>
            {props.isUpdate ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
