import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useClipboard,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  LuCheck,
  LuCircleCheck,
  LuClock,
  LuCopy,
  LuMail,
  LuMailCheck,
} from 'react-icons/lu';
import useApiKeysService from '../../../hooks/API/services/useApiKeysService';
import useCustomToast from '../../../hooks/useCustomToast';
import {
  ApiClientResponse,
  ApiKeyDeliveryLinkResponse,
  ApiKeyLinkCreatedResponse,
} from '../../../models/http/responses/apiKey.response.models';
import { apiErrorMessage } from '../../../utils/apiKeys/apiKeys.errors';
import { formatDateTime } from '../../../utils/apiKeys/apiKeys.formatter';

// Backend limit for ApiKeyLinkEmailSend.message.
const MAX_MESSAGE = 1000;

interface DeliveryLinkModalProps {
  created: ApiKeyLinkCreatedResponse | undefined;
  client: ApiClientResponse;
  onLinkChange: (link: ApiKeyDeliveryLinkResponse) => void;
  // `invalidated`: the admin killed the link, which also revoked the key.
  onFinish: (created: ApiKeyLinkCreatedResponse, invalidated: boolean) => void;
}

// Shows the one-time link right after a key is issued by link. The token in
// it exists only in this modal (the server never stores it), so the link
// can't be copied or emailed once it closes. Render it with `key` set to the
// key's id so its state resets for every new key.
function DeliveryLinkModal({
  created,
  client,
  onLinkChange,
  onFinish,
}: DeliveryLinkModalProps) {
  const { sendKeyLinkEmail, invalidateDeliveryLink } = useApiKeysService();
  const showToast = useCustomToast();
  const { onCopy, hasCopied } = useClipboard(created?.url ?? '', 2500);
  const [link, setLink] = useState(created?.link);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmInvalidate, setConfirmInvalidate] = useState(false);
  const [invalidating, setInvalidating] = useState(false);

  function updateLink(updated: ApiKeyDeliveryLinkResponse) {
    setLink(updated);
    onLinkChange(updated);
  }

  async function handleEmail() {
    if (!created) return;
    setSending(true);
    try {
      const response = await sendKeyLinkEmail(created.key.id, {
        token: created.token,
        message: message.trim() || undefined,
      });
      updateLink(response.data);
      showToast(
        'E-mail enviado',
        `O link de uso único foi enviado para ${response.data.emailed_to ?? client.contact_email}.`,
        'success',
      );
    } catch (error) {
      showToast(
        'Erro ao enviar e-mail',
        apiErrorMessage(error, 'Não foi possível enviar o e-mail.'),
        'error',
      );
    } finally {
      setSending(false);
    }
  }

  async function handleInvalidate() {
    if (!created || !link) return;
    setInvalidating(true);
    try {
      const response = await invalidateDeliveryLink(link.id);
      updateLink(response.data);
      showToast(
        'Link invalidado',
        `O link não abre mais e a chave "${created.key.name}" foi revogada.`,
        'success',
      );
      onFinish(created, true);
    } catch (error) {
      showToast(
        'Erro ao invalidar link',
        apiErrorMessage(error, 'Não foi possível invalidar o link.'),
        'error',
      );
    } finally {
      setInvalidating(false);
      setConfirmInvalidate(false);
    }
  }

  const emailed = !!link?.emailed_at;

  return (
    <Modal
      isOpen={!!created}
      onClose={() => {}}
      size='2xl'
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay bg='blackAlpha.700' />
      <ModalContent role='alertdialog'>
        <ModalHeader display='flex' alignItems='center' gap={2.5}>
          <Box color='green.500'>
            <LuCircleCheck />
          </Box>
          Chave emitida: {created?.key.name}
        </ModalHeader>
        <ModalBody>
          <Flex direction='column' gap={4}>
            <Alert status='warning' borderRadius='md' alignItems='flex-start'>
              <AlertIcon />
              <AlertDescription lineHeight={1.5}>
                <strong>O link só é exibido agora.</strong> Envie por e-mail ou
                copie antes de fechar: depois não será possível recuperá-lo, e
                para entregar a chave seria preciso invalidar este link e emitir
                outra.
              </AlertDescription>
            </Alert>

            <Flex
              direction='column'
              gap={2.5}
              p={4}
              border='1px solid'
              borderColor='uspolis.blue'
              borderRadius='md'
            >
              <Text fontSize='sm' color='uspolis.black' lineHeight={1.45}>
                O link mostra a chave <strong>uma única vez</strong> e deixa de
                funcionar depois de aberto ou quando expirar. Nem você verá a
                chave.
              </Text>
              <Flex gap={2} wrap='wrap'>
                <Box
                  flex='1 1 260px'
                  minW={0}
                  py={2}
                  px={3}
                  borderRadius='md'
                  bg='uspolis.surfaceSubtle'
                  border='1px solid'
                  borderColor='uspolis.border'
                  fontFamily='mono'
                  fontSize='13px'
                  wordBreak='break-all'
                  userSelect='all'
                >
                  {created?.url}
                </Box>
                <Button
                  colorScheme={hasCopied ? 'green' : 'blue'}
                  leftIcon={hasCopied ? <LuCheck /> : <LuCopy />}
                  onClick={onCopy}
                >
                  {hasCopied ? 'Copiado!' : 'Copiar link'}
                </Button>
              </Flex>

              <FormControl>
                <FormLabel fontSize='sm' mb={1}>
                  Mensagem no e-mail (opcional)
                </FormLabel>
                <Textarea
                  size='sm'
                  rows={2}
                  maxLength={MAX_MESSAGE}
                  resize='vertical'
                  borderRadius='md'
                  placeholder='Ex.: Segue a chave de produção do site, conforme combinado.'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </FormControl>
              <Flex align='center' gap={2.5} wrap='wrap'>
                <Button
                  variant='outline'
                  colorScheme='blue'
                  leftIcon={emailed ? <LuMailCheck /> : <LuMail />}
                  isLoading={sending}
                  loadingText='Enviando…'
                  onClick={handleEmail}
                >
                  {emailed ? 'Reenviar e-mail' : 'Enviar link via e-mail'}
                </Button>
                <Text
                  fontSize='sm'
                  color={emailed ? 'green.600' : 'uspolis.textMuted'}
                  overflowWrap='anywhere'
                >
                  {emailed
                    ? `Enviado para ${link?.emailed_to} em ${formatDateTime(link?.emailed_at)}`
                    : `Para ${client.contact_name} · ${client.contact_email}`}
                </Text>
              </Flex>

              <Flex
                fontSize='13px'
                color='uspolis.textMuted'
                align='center'
                gap='6px'
                wrap='wrap'
              >
                <LuClock />
                Válido até {formatDateTime(link?.expires_at)} · uma abertura.
                {!confirmInvalidate && (
                  <Link
                    color='red.600'
                    onClick={() => setConfirmInvalidate(true)}
                  >
                    Invalidar link
                  </Link>
                )}
              </Flex>
              {confirmInvalidate && (
                <Alert status='error' borderRadius='md' gap={2} flexWrap='wrap'>
                  <AlertIcon />
                  <AlertDescription flex='1 1 240px' fontSize='sm'>
                    Invalidar o link também <strong>revoga a chave</strong>, que
                    ninguém recebeu. Para entregar ao parceiro, emita outra.
                  </AlertDescription>
                  <Flex gap={2}>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => setConfirmInvalidate(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size='sm'
                      colorScheme='red'
                      isLoading={invalidating}
                      onClick={handleInvalidate}
                    >
                      Invalidar e revogar
                    </Button>
                  </Flex>
                </Alert>
              )}
            </Flex>

            <Checkbox
              colorScheme='blue'
              isChecked={confirmed || emailed}
              isDisabled={emailed}
              onChange={(e) => setConfirmed(e.target.checked)}
              pt={3}
              borderTop='1px solid'
              borderColor='uspolis.border'
              fontWeight='medium'
            >
              Já enviei ou copiei o link e vou entregá-lo por um canal seguro
            </Checkbox>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme='blue'
            isDisabled={!(confirmed || emailed)}
            onClick={() => created && onFinish(created, false)}
          >
            Concluir
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeliveryLinkModal;
