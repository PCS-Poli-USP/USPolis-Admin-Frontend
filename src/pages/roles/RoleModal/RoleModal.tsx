import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Flex,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { RoleForm, RoleModalProps } from './role.modal.interface';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema, defaultValues } from './role.modal.form';
import { Input, TextareaInput } from '../../../components/common';
import { AddIcon } from '@chakra-ui/icons';
import { useRef, useState } from 'react';
import { CreatePermission } from '../../../models/http/requests/permission.request.models';
import PermissionForm from '../PermissionForm/PermissionForm';

function RoleModal({ isOpen, onClose, isUpdate }: RoleModalProps) {
  const permissionFormRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<RoleForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { trigger, reset, getValues, clearErrors } = form;

  const [permissionsData, setPermissionsData] = useState<CreatePermission[]>(
    [],
  );

  function handleClose() {
    reset();
    clearErrors();
    onClose();
  }

  async function handleSave() {
    const valid = await trigger();
    if (!valid) return;

    const values = getValues();

    console.log(values);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isUpdate ? 'Editar Cargo' : 'Cadastrar Cargo'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormProvider {...form}>
            <Input name='name' label='Nome' mb={'10px'} />
            <TextareaInput name='description' label='Descrição' />
          </FormProvider>
          <Flex
            direction={'column'}
            align={'center'}
            justify={'center'}
            mt={'10px'}
            gap={'10px'}
          >
            <Tabs w={'full'}>
              <TabList>
                <Tab>Novas Permissões</Tab>
                <Tab>Selecionar Permissões</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <PermissionForm ref={permissionFormRef} />
                  <Flex w={'full'} align={'center'} justify={'flex-end'} mt={'10px'}>
                    <Button
                      variant={'ghost'}
                      leftIcon={<AddIcon />}
                      size={'sm'}
                    >
                      Adicionar Permissão
                    </Button>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button
            mr={3}
            colorScheme='red'
            variant={'outline'}
            onClick={handleClose}
          >
            Cancelar
          </Button>

          <Button
            colorScheme='blue'
            onClick={handleSave}
            leftIcon={<AddIcon />}
          >
            {isUpdate ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default RoleModal;
