import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useClipboard,
} from '@chakra-ui/react';
import { useState } from 'react';
import { LuCheck, LuCircleCheck, LuCopy } from 'react-icons/lu';
import { ApiKeyCreatedResponse } from '../../../models/http/responses/apiKey.response.models';

interface OneTimeKeyModalProps {
  createdKey: ApiKeyCreatedResponse | undefined;
  onFinish: (key: ApiKeyCreatedResponse) => void;
}

// Shows the plaintext key, which the API returns only once. It can't be
// dismissed (no close button, Esc or overlay click) until the admin confirms
// they stored it. Render it with `key` set to the created key's id so the
// confirmation resets for every new key.
function OneTimeKeyModal({ createdKey, onFinish }: OneTimeKeyModalProps) {
  const [confirmed, setConfirmed] = useState(false);
  const { onCopy, hasCopied } = useClipboard(createdKey?.key ?? '', 2500);

  return (
    <Modal
      isOpen={!!createdKey}
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
          Chave emitida: {createdKey?.name}
        </ModalHeader>
        <ModalBody>
          <Flex direction='column' gap={4}>
            <Alert status='warning' borderRadius='md' alignItems='flex-start'>
              <AlertIcon />
              <AlertDescription lineHeight={1.5}>
                <strong>Esta é a única vez que a chave será exibida.</strong>{' '}
                Guarde-a agora e entregue ao parceiro por um canal seguro (link
                de uso único ou pessoalmente), nunca por e-mail ou chat.
              </AlertDescription>
            </Alert>
            <Box
              p={4}
              borderRadius='md'
              bg='uspolis.surfaceSubtle'
              border='1px solid'
              borderColor='uspolis.border'
              fontFamily='mono'
              fontSize='15px'
              lineHeight={1.6}
              wordBreak='break-all'
              userSelect='all'
            >
              {createdKey?.key}
            </Box>
            <Button
              size='lg'
              w='100%'
              colorScheme={hasCopied ? 'green' : 'blue'}
              leftIcon={hasCopied ? <LuCheck /> : <LuCopy />}
              onClick={onCopy}
            >
              {hasCopied ? 'Copiado!' : 'Copiar chave'}
            </Button>
            <Text fontSize='sm' color='uspolis.textMuted'>
              A chave só funciona a partir do servidor do parceiro: requisições
              feitas do navegador são recusadas. Perdeu a chave? Não há como
              recuperá-la — revogue esta e emita outra.
            </Text>
            <Checkbox
              colorScheme='blue'
              isChecked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              pt={3}
              borderTop='1px solid'
              borderColor='uspolis.border'
              fontWeight='medium'
            >
              Já copiei e guardei a chave
            </Checkbox>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme='blue'
            isDisabled={!confirmed}
            onClick={() => createdKey && onFinish(createdKey)}
          >
            Concluir
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default OneTimeKeyModal;
