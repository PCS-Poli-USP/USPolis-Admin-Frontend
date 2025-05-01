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
  Checkbox,
} from '@chakra-ui/react';
import { GroupModalProps } from './group.modal.interface';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform//resolvers/yup';
import { schema, defaultValues } from './group.modal.form';
import {
  CheckBox,
  Input,
  MultiSelect,
  SelectInput,
} from '../../../components/common';
import useGroups from '../../../hooks/groups/useGroups';
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
  refetch,
}: GroupModalProps) {
  const form = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });
  const { createGroup, updateGroup } = useGroups(false);
  const [allUsers, setAllUsers] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingResponse>();

  function handleClose() {
    form.reset(defaultValues);
    onClose();
  }

  const { watch } = form;
  const classroom_ids = watch('classroom_ids');
  const user_ids = watch('user_ids');
  const main = watch('main');

  async function handleSubmit() {
    const isValid = await form.trigger();
    if (!isValid) return;
    const values = form.getValues();
    if (isUpdate && group) {
      await updateGroup(group.id, values);
    } else {
      await createGroup(values);
    }
    handleClose();
    refetch();
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
                  label={`Usuários ${allUsers ? '' : 'autorizados'} (${
                    user_ids.length
                  })`}
                  options={users
                    .filter(
                      (user) => allUsers || user.is_admin || user.buildings,
                    )
                    .map((user) => ({
                      label: `${user.name} (${user.email})`,
                      value: user.id,
                    }))}
                />
                <Checkbox
                  value={allUsers ? 'true' : 'false'}
                  onChange={(event) => {
                    setAllUsers(event.target.checked);
                  }}
                >
                  Ver todos usuários
                </Checkbox>

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
                      if (option) {
                        setSelectedBuilding(
                          buildings.filter(
                            (building) => building.id === option.value,
                          )[0],
                        );
                      } else {
                        setSelectedBuilding(undefined);
                        form.setValue('classroom_ids', []);
                      }
                    }}
                  />
                </Flex>

                <MultiSelect
                  name='classroom_ids'
                  label={`Salas (${classroom_ids.length})`}
                  disabled={main}
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
                <CheckBox
                  name='main'
                  text='Grupo principal'
                  disabled={group && group.main}
                  onChange={(value) => {
                    if (value) {
                      form.setValue('classroom_ids', []);
                      form.clearErrors('classroom_ids');
                    }
                  }}
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
