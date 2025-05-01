import {
  Button,
  Flex,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

import { useEffect } from 'react';
import { UserEditModalProps } from './user.edit.modal.interface';
import { defaultValues, schema } from './user.edit.modal.form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.js';
import { FormProvider, useForm } from 'react-hook-form';
import { CheckBox, MultiSelect } from '../../../components/common';

export default function EditUserModal(props: UserEditModalProps) {
  const form = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (props.user) {
      form.reset({
        ...defaultValues,
        is_admin: props.user.is_admin,
        group_ids: props.user.groups
          ? props.user.groups.map((group) => group.id)
          : [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.user]);

  function handleSaveClick() {
    // props.onSave(form);
    // setForm(initialForm);
    // props.onClose();
  }

  function handleCloseModal() {
    props.onClose();
  }

  return (
    <Modal isOpen={props.isOpen} onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{'Editar informações do usuário'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormProvider {...form}>
            <form>
              <Flex direction={'column'} gap={4}>
                <Flex direction={'column'}>
                  <FormLabel>Email</FormLabel>
                  <Input value={props.user?.email} disabled />
                </Flex>
                <CheckBox name='is_admin' text='Administrador' />
                <MultiSelect
                  label='Prédios'
                  name='building_ids'
                  disabled={true}
                  options={props.buildings.map((building) => ({
                    label: building.name,
                    value: building.id,
                  }))}
                  placeholder='Os prédios dependem dos grupos'
                />
                <MultiSelect
                  label='Grupos'
                  name='group_ids'
                  options={props.groups.map((group) => ({
                    label: group.name,
                    value: group.id,
                  }))}
                  placeholder='Selecione os grupos'
                  onChange={(options) => {
                    const groups_ids = options.map((option) => {
                      return option.value;
                    });
                    const groups = props.groups.filter((group) =>
                      groups_ids.includes(group.id),
                    );
                    const buildings_ids = groups.map((group) => {
                      return group.building_id;
                    });
                    form.setValue('building_ids', buildings_ids);
                  }}
                />
              </Flex>
            </form>
          </FormProvider>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleSaveClick}>
            Atualizar
          </Button>
          <Button onClick={props.onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
