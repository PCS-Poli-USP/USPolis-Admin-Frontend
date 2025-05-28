import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
} from '@chakra-ui/react';
import { GroupModalProps } from './group.modal.interface';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform//resolvers/yup';
import { schema, defaultValues } from './group.modal.form';
import { Input, MultiSelect, SelectInput } from '../../../components/common';
import { useEffect, useState } from 'react';
import { filterString } from '../../../utils/filters';
import { BuildingResponse } from '../../../models/http/responses/building.response.models';

function GroupModal({
  isOpen,
  onClose,
  group,
  buildings,
  users,
  classrooms,
  isUpdate,
  createGroup,
  updateGroup,
}: GroupModalProps) {
  const form = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingResponse>();

  function handleClose() {
    form.reset(defaultValues);
    setSelectedBuilding(undefined);
    onClose();
  }

  const { watch } = form;
  const classroom_ids = watch('classroom_ids');

  async function handleSubmit() {
    const isValid = await form.trigger();
    if (!isValid) return;
    const values = form.getValues();
    if (isUpdate && group) {
      updateGroup(group.id, values);
    } else {
      createGroup(values);
    }
    handleClose();
  }

  useEffect(() => {
    if (group) {
      form.reset({
        name: group.name,
        user_ids: group.user_ids,
        classroom_ids: group.main ? [] : group.classroom_ids,
        building_id: group.building_id,
        main: group.main,
      });
      setSelectedBuilding(
        buildings.find((building) => building.id === group.building_id),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={'4xl'}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isUpdate ? 'Atualizar' : 'Cadastrar'} Grupo</ModalHeader>
        <ModalCloseButton />
        <FormProvider {...form}>
          <form>
            <ModalBody>
              <Flex direction={'column'} w={'full'} gap={'10px'}>
                <Flex w={'full'} gap={'10px'}>
                  <Input
                    w={'100%'}
                    name='name'
                    label='Nome'
                    placeholder='Insira o nome do grupo'
                  />
                </Flex>
                <MultiSelect
                  name='user_ids'
                  label={`Usuários`}
                  options={users.map((user) => ({
                    label: `${user.name} (${user.email})`,
                    value: user.id,
                  }))}
                />

                <Flex
                  w={'100%'}
                  align={'center'}
                  justify={'center'}
                  gap={'5px'}
                >
                  <SelectInput
                    name='building_id'
                    label='Prédio'
                    disabled={group && group.main}
                    placeholder='Selecione um prédio'
                    options={buildings.map((building) => ({
                      label: building.name,
                      value: building.id,
                    }))}
                    onChange={(option) => {
                      form.setValue('classroom_ids', []);
                      if (option) {
                        setSelectedBuilding(
                          buildings.filter(
                            (building) => building.id === option.value,
                          )[0],
                        );
                      } else {
                        setSelectedBuilding(undefined);
                      }
                    }}
                  />
                </Flex>

                <MultiSelect
                  name='classroom_ids'
                  disabled={group && group.main}
                  label={
                    group && group.main
                      ? 'Salas'
                      : `Salas (${classroom_ids.length})`
                  }
                  placeholder={
                    group && group.main
                      ? 'Grupo principal não tem salas'
                      : 'Selecione as salas do grupo'
                  }
                  options={
                    selectedBuilding
                      ? classrooms
                          .filter((val) =>
                            filterString(val.building, selectedBuilding.name),
                          )
                          .map((classroom) => ({
                            label: `${classroom.name} (${classroom.building})`,
                            value: classroom.id,
                          }))
                      : classrooms.map((classroom) => ({
                          label: `${classroom.name} (${classroom.building})`,
                          value: classroom.id,
                        }))
                  }
                />
              </Flex>
            </ModalBody>
          </form>
        </FormProvider>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
            {isUpdate ? 'Atualizar' : 'Confirmar'}
          </Button>
          <Button onClick={handleClose}>Fechar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
export default GroupModal;
