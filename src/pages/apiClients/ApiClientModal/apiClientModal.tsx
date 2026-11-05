import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Input, TextareaInput } from '../../../components/common';
import useApiKeysService from '../../../hooks/API/services/useApiKeysService';
import useCustomToast from '../../../hooks/useCustomToast';
import { CreateApiClient } from '../../../models/http/requests/apiKey.request.models';
import { apiErrorMessage } from '../../../utils/apiKeys/apiKeys.errors';
import { defaultValues, schema } from './apiClientModal.form';
import { ApiClientForm, ApiClientModalProps } from './apiClientModal.interface';

function ApiClientModal({
  isOpen,
  onClose,
  selectedClient,
  onSaved,
}: ApiClientModalProps) {
  const { createClient, updateClient } = useApiKeysService();
  const showToast = useCustomToast();
  const [loading, setLoading] = useState(false);
  const isEdit = !!selectedClient;

  const form = useForm<ApiClientForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { reset, handleSubmit, setError } = form;

  useEffect(() => {
    if (!isOpen) return;
    reset(
      selectedClient
        ? {
            name: selectedClient.name,
            organization: selectedClient.organization ?? '',
            contact_name: selectedClient.contact_name,
            contact_email: selectedClient.contact_email,
            description: selectedClient.description,
          }
        : defaultValues,
    );
  }, [isOpen, selectedClient, reset]);

  async function onSubmit(values: ApiClientForm) {
    const data: CreateApiClient = {
      name: values.name.trim(),
      organization: values.organization.trim() || undefined,
      contact_name: values.contact_name.trim(),
      contact_email: values.contact_email.trim(),
      description: values.description.trim(),
    };
    setLoading(true);
    try {
      const response = selectedClient
        ? await updateClient(selectedClient.id, data)
        : await createClient(data);
      onSaved(response.data, !selectedClient);
      onClose();
    } catch (error) {
      const message = apiErrorMessage(
        error,
        'Não foi possível salvar o cliente de API.',
      );
      // 409: a client with this name already exists (case-insensitive).
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.response?.status === 409)
        setError('name', { message });
      showToast('Erro ao salvar cliente', message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      size={{ base: 'full', md: 'xl' }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEdit ? 'Editar cliente de API' : 'Novo cliente de API'}
        </ModalHeader>
        <ModalCloseButton />
        <FormProvider {...form}>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <VStack gap={4}>
                <Input
                  label='Nome *'
                  name='name'
                  placeholder='Ex: Grêmio Politécnico'
                />
                <Input
                  label='Organização'
                  name='organization'
                  placeholder='Opcional'
                />
                <SimpleGrid columns={{ base: 1, md: 1 }} gap={4} w='100%'>
                  <Input label='Nome do contato *' name='contact_name' />
                  <Input
                    label='E-mail do contato *'
                    name='contact_email'
                    type='email'
                  />
                </SimpleGrid>
                <TextareaInput
                  label='Descrição'
                  name='description'
                  placeholder='Para que o parceiro vai usar a API'
                />
              </VStack>
            </ModalBody>
            <ModalFooter gap={2}>
              <Button colorScheme='red' onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme='blue' type='submit' isLoading={loading}>
                {isEdit ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
}

export default ApiClientModal;
