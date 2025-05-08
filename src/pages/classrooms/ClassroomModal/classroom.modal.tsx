import {
  Button,
  Checkbox,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
import { Input, MultiSelect, SelectInput } from '../../../components/common';
import { NumberInput } from '../../../components/common/form/NumberInput';
import { CheckBox } from '../../../components/common/form/CheckBox';
import useClassrooms from '../../../hooks/classrooms/useClassrooms';
import { AudiovisualType } from '../../../utils/enums/audiovisualType.enum';
import GroupFormatter from '../../../utils/groups/group.formatter';

export default function ClassroomModal(props: ClassroomModalProps) {
  const form = useForm<ClassroomForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const { trigger, reset, getValues, clearErrors, setValue, watch } = form;
  const { createClassroom, updateClassroom } = useClassrooms();

  const building_id = watch('building_id');

  useEffect(() => {
    if (props.selectedClassroom) {
      reset({ ...props.selectedClassroom });
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
      await updateClassroom(props.selectedClassroom.id, values);
    } else {
      await createClassroom(values);
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
      size={'lg'}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {props.isUpdate ? 'Editar Sala' : 'Cadastrar Sala'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormProvider {...form}>
            <form>
              <SelectInput
                mb={4}
                label={'Prédio'}
                name={'building_id'}
                placeholder={'Escolha um prédio'}
                disabled={props.buildings.length === 1}
                options={props.buildings.map((building) => ({
                  value: building.id,
                  label: building.name,
                }))}
              />

              <Input label={'Nome'} name={'name'} placeholder='Nome da sala' />

              <Flex
                direction={'row'}
                justify={'center'}
                align={'center'}
                w={'full'}
                gap={'5px'}
              >
                <NumberInput
                  mt={4}
                  min={0}
                  label={'Andar'}
                  name={'floor'}
                  placeholder={'Andar da sala'}
                />

                <NumberInput
                  min={0}
                  mt={4}
                  label={'Capacidade'}
                  name={'capacity'}
                  placeholder={'Capacidade da sala'}
                />
              </Flex>
              <Text fontWeight={'bold'} mt={4} mb={'10px'}>
                Recursos
              </Text>

              <VStack w={'full'} alignItems={'start'} gap={'10px'} mb={'10px'}>
                <CheckBox text={'Ar condicionado'} name={'air_conditioning'} />
                <CheckBox text={'Acessibilidade'} name={'accessibility'} />
                <SelectInput
                  name='audiovisual'
                  label='Recurso audiovisual'
                  w={'250px'}
                  options={AudiovisualType.values().map((type) => ({
                    label: AudiovisualType.translate(type),
                    value: type,
                  }))}
                />
              </VStack>

              <MultiSelect
                label='Grupos'
                name='group_ids'
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
            </form>
          </FormProvider>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleSaveClick}>
            {props.isUpdate ? 'Atualizar' : 'Cadastrar'}
          </Button>
          <Button onClick={() => handleCloseModal()}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
