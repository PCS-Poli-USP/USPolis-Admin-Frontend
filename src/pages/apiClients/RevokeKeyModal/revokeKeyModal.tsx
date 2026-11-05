import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Code,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { LuBan } from 'react-icons/lu';
import useApiKeysService from '../../../hooks/API/services/useApiKeysService';
import useCustomToast from '../../../hooks/useCustomToast';
import { ApiKeyResponse } from '../../../models/http/responses/apiKey.response.models';
import { apiErrorMessage } from '../../../utils/apiKeys/apiKeys.errors';

// Backend limit for ApiKeyRevoke.reason.
const MAX_REASON = 500;

interface RevokeKeyModalProps {
  apiKey: ApiKeyResponse | undefined;
  onClose: () => void;
  onRevoked: (key: ApiKeyResponse) => void;
}

function RevokeKeyModal({ apiKey, onClose, onRevoked }: RevokeKeyModalProps) {
  const { revokeKey } = useApiKeysService();
  const showToast = useCustomToast();
  const cancelRef = useRef(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setReason('');
    setError('');
  }, [apiKey]);

  async function handleConfirm() {
    if (!apiKey) return;
    if (reason.trim().length < 3)
      return setError('Informe um motivo com pelo menos 3 caracteres.');
    setLoading(true);
    try {
      const response = await revokeKey(apiKey.id, { reason: reason.trim() });
      showToast(
        'Chave revogada',
        `"${apiKey.name}" deixou de funcionar.`,
        'success',
      );
      onRevoked(response.data);
      onClose();
    } catch (err) {
      showToast(
        'Erro ao revogar chave',
        apiErrorMessage(err, 'Não foi possível revogar a chave.'),
        'error',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog
      isOpen={!!apiKey}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent mx={4}>
        <AlertDialogHeader>Revogar a chave “{apiKey?.name}”?</AlertDialogHeader>
        <AlertDialogBody display='flex' flexDirection='column' gap={3.5}>
          <Text color='red'>
            A revogação é imediata e permanente. O parceiro precisará de uma
            nova chave.
          </Text>
          <Code bg='transparent' fontSize='13px' p={0}>
            {apiKey?.masked_key}
          </Code>
          <FormControl isRequired isInvalid={!!error}>
            <FormLabel>Motivo</FormLabel>
            <Textarea
              value={reason}
              maxLength={MAX_REASON}
              rows={3}
              resize='vertical'
              placeholder='Ex.: chave exposta, parceiro encerrou o uso, rotação'
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
            />
            <Text>Caracteres restantes: {MAX_REASON - reason.length}</Text>
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
        </AlertDialogBody>
        <AlertDialogFooter gap={2}>
          <Button ref={cancelRef} size='sm' variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button
            size='sm'
            colorScheme='red'
            leftIcon={<LuBan />}
            isLoading={loading}
            onClick={handleConfirm}
          >
            Revogar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default RevokeKeyModal;
