import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { LuKeyRound } from 'react-icons/lu';
import useApiKeysService from '../../../hooks/API/services/useApiKeysService';
import useCustomToast from '../../../hooks/useCustomToast';
import {
  ApiClientResponse,
  ApiKeyCreatedResponse,
  ApiKeyLinkCreatedResponse,
} from '../../../models/http/responses/apiKey.response.models';
import { ApiKeyLinkTtlHours } from '../../../models/http/requests/apiKey.request.models';
import { ModalProps } from '../../../models/interfaces';
import { apiErrorMessage } from '../../../utils/apiKeys/apiKeys.errors';
import { DEFAULT_LIMITS } from '../../../utils/apiKeys/apiKeys.formatter';
import ExpiryField from '../KeyForm/expiryField';
import {
  configToRequest,
  issueDefaultValues,
  issueSchema,
  limitsToRequest,
} from '../KeyForm/keyForm.form';
import { IssueKeyForm } from '../KeyForm/keyForm.interface';
import PrefixesField from '../KeyForm/prefixesField';
import RateLimitsField from '../KeyForm/rateLimitsField';
import DeliveryStep, { KeyDelivery } from './deliveryStep';

interface IssueKeyModalProps extends ModalProps {
  client: ApiClientResponse;
  onIssued: (key: ApiKeyCreatedResponse) => void;
  onIssuedViaLink: (created: ApiKeyLinkCreatedResponse) => void;
}

function Step({ n, title }: { n: number; title: string }) {
  return (
    <Flex align='center' gap={2.5} fontSize='17px' fontWeight='bold'>
      <Flex
        w='24px'
        h='24px'
        borderRadius='full'
        bg='uspolis.blue'
        color='white'
        fontSize='13px'
        align='center'
        justify='center'
      >
        {n}
      </Flex>
      {title}
    </Flex>
  );
}

function IssueKeyModal({
  isOpen,
  onClose,
  client,
  onIssued,
  onIssuedViaLink,
}: IssueKeyModalProps) {
  const { createKey, createKeyViaLink } = useApiKeysService();
  const showToast = useCustomToast();
  const [loading, setLoading] = useState(false);
  const [delivery, setDelivery] = useState<KeyDelivery>('link');
  const [ttl, setTtl] = useState<ApiKeyLinkTtlHours>(24);

  const form = useForm<IssueKeyForm>({
    defaultValues: issueDefaultValues(),
    resolver: yupResolver(issueSchema),
  });
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = form;

  function handleClose() {
    setDelivery('link');
    setTtl(24);
    onClose();
  }

  useEffect(() => {
    if (isOpen) reset(issueDefaultValues());
  }, [isOpen, reset]);

  async function onSubmit(values: IssueKeyForm) {
    setLoading(true);
    try {
      const data = { ...configToRequest(values), ...limitsToRequest(values) };
      if (delivery === 'link') {
        const response = await createKeyViaLink(client.id, {
          ...data,
          link_ttl_hours: ttl,
        });
        onIssuedViaLink(response.data);
      } else {
        const response = await createKey(client.id, data);
        onIssued(response.data);
      }
      setDelivery('link');
      setTtl(24);
    } catch (error) {
      showToast(
        'Erro ao emitir chave',
        apiErrorMessage(error, 'Não foi possível emitir a chave.'),
        'error',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size='3xl'
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb={0}>Emitir chave</ModalHeader>
        <Text px={6} pb={2} color='uspolis.textMuted'>
          Cliente: {client.name}
        </Text>
        <ModalCloseButton />
        <FormProvider {...form}>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Flex direction='column' gap={4}>
                <Divider />
                <Step n={1} title='Básico' />
                <FormControl isRequired isInvalid={!!errors.name}>
                  <FormLabel>Nome</FormLabel>
                  <Input
                    {...register('name')}
                    maxLength={256}
                    placeholder='Ex.: Site produção'
                  />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>
                <ExpiryField />

                <Divider />
                <Step n={2} title='Escopo' />
                <PrefixesField />

                <Divider />
                <Step n={3} title='Limites' />
                <RateLimitsField defaults={DEFAULT_LIMITS} defaultsInline />

                <Divider />
                <Step n={4} title='Entrega' />
                <Box pb={2}>
                  <DeliveryStep
                    delivery={delivery}
                    onDeliveryChange={setDelivery}
                    ttl={ttl}
                    onTtlChange={setTtl}
                    contactEmail={client.contact_email}
                  />
                </Box>
              </Flex>
            </ModalBody>
            <ModalFooter
              gap={2}
              borderTop='1px solid'
              borderColor='uspolis.border'
            >
              <Button colorScheme='red' onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                colorScheme='blue'
                type='submit'
                isLoading={loading}
                leftIcon={<LuKeyRound />}
              >
                {delivery === 'link' ? 'Emitir e gerar link' : 'Emitir chave'}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
}

export default IssueKeyModal;
