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
  Checkbox,
  Box,
} from '@chakra-ui/react';
import { GroupModalProps } from './group.modal.interface';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform//resolvers/yup';
import { schema, defaultValues } from './group.modal.form';
import { Input, MultiSelect, Option } from '../../../components/common';
import useGroups from '../../../hooks/useGroups';
import { useEffect, useState } from 'react';
import { Select } from 'chakra-react-select';
import { filterString } from '../../../utils/filters';

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
  const [selectedBuilding, setSelectedBuilding] = useState<Option | null>(null);

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
                <FormControl>
                  <FormLabel>Filtro e inserção rápida</FormLabel>
                  <Flex w={'100%'}>
                    <Box w={'100%'}>
                      <Select
                        options={buildings.map((building) => ({
                          label: `${building.name}`,
                          value: building.id,
                        }))}
                        placeholder='Selecione um prédio e adicione suas salas'
                        closeMenuOnSelect={true}
                        isLoading={false}
                        isDisabled={false}
                        onChange={(selected) => {
                          if (selected) {
                            setSelectedBuilding(selected);
                          }
                        }}
                      />
                    </Box>
                    <Button
                      // rightIcon={<AddIcon />}
                      onClick={() => {
                        if (selectedBuilding === null) return;
                        const current = form.getValues('classroom_ids');
                        classrooms.forEach((classroom) => {
                          if (
                            classroom.building_id === selectedBuilding.value
                          ) {
                            current.push(classroom.id);
                          }
                        });
                        const unique = new Set(current);
                        const selectedClassroomIds = Array.from(unique);
                        form.setValue('classroom_ids', selectedClassroomIds);
                      }}
                    >
                      {' '}
                      Inserir salas
                    </Button>
                  </Flex>
                </FormControl>
                <MultiSelect
                  name='classroom_ids'
                  label={`Salas (${classroom_ids.length})`}
                  options={
                    selectedBuilding
                      ? classrooms
                          .filter((val) =>
                            filterString(val.building, selectedBuilding.label),
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
