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
  FormLabel,
  FormControl,
} from '@chakra-ui/react';
import { GroupModalProps } from './group.modal.interface';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema, defaultValues } from './group.modal.form';
import { Input, MultiSelect, Option } from 'components/common';
import useGroups from 'hooks/useGroups';
import { useEffect } from 'react';
import { Select } from 'chakra-react-select';

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

  function handleClose() {
    form.reset(defaultValues);
    onClose();
  }

  const { watch } = form;
  const classroom_ids = watch('classroom_ids');
  const user_ids = watch('user_ids');

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
        abbreviation: group.abbreviation,
        user_ids: group.user_ids,
        classroom_ids: group.classroom_ids,
      });
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
                    w={'75%'}
                    name='name'
                    label='Nome'
                    placeholder='Insira o nome do grupo'
                  />
                  <Input
                    w={'25%'}
                    name='abbreviation'
                    label='Sigla'
                    max={10}
                    min={3}
                    placeholder='Entre 3 a 10 caracteres'
                  />
                </Flex>
                <MultiSelect
                  name='user_ids'
                  label={`Usuários Administrativos (${user_ids.length})`}
                  options={users
                    .filter((user) => user.is_admin || user.buildings)
                    .map((user) => ({
                      label: `${user.name} (${user.email})`,
                      value: user.id,
                    }))}
                />
                <FormControl>
                  <FormLabel>Inserção rápida</FormLabel>
                  <Select
                    options={buildings.map((building) => ({
                      label: `${building.name}`,
                      value: building.id,
                    }))}
                    placeholder='Selecione um prédio e adicione suas salas'
                    closeMenuOnSelect={true}
                    isLoading={false}
                    isDisabled={false}
                    onChange={(selected: Option) => {
                      if (selected) {
                        const current = form.getValues('classroom_ids');
                        classrooms.forEach((classroom) => {
                          if (classroom.building_id === selected.value) {
                            current.push(classroom.id);
                          }
                        });
                        const unique = new Set(current);
                        const selectedClassroomIds = Array.from(unique);
                        form.setValue('classroom_ids', selectedClassroomIds);
                      }
                    }}
                  />
                </FormControl>
                <MultiSelect
                  name='classroom_ids'
                  label={`Salas (${classroom_ids.length})`}
                  options={classrooms.map((classroom) => ({
                    label: `${classroom.name} (${classroom.building})`,
                    value: classroom.id,
                  }))}
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
