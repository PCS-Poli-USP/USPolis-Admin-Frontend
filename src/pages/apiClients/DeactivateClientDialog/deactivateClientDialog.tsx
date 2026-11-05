import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { LuCirclePause } from 'react-icons/lu';
import { ModalProps } from '../../../models/interfaces';
import { plural } from '../../../utils/apiKeys/apiKeys.formatter';

interface DeactivateClientDialogProps extends ModalProps {
  clientName: string;
  activeKeys: number;
  loading: boolean;
  onConfirm: () => void;
}

function DeactivateClientDialog({
  isOpen,
  onClose,
  clientName,
  activeKeys,
  loading,
  onConfirm,
}: DeactivateClientDialogProps) {
  const cancelRef = useRef(null);
  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent mx={4}>
        <AlertDialogHeader>
          Desativar o cliente “{clientName}”?
        </AlertDialogHeader>
        <AlertDialogBody display='flex' flexDirection='column' gap={2.5}>
          <Text color='red' fontWeight='bold'>
            {activeKeys === 1
              ? 'A chave ativa deste cliente deixará de funcionar imediatamente.'
              : `Todas as ${plural(activeKeys, 'chave ativa', 'chaves ativas')} deste cliente deixarão de funcionar imediatamente.`}
          </Text>
          <Text>
            As chaves não serão revogadas: ao reativar o cliente, elas voltam a
            funcionar.
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter gap={2}>
          <Button ref={cancelRef} size='sm' variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button
            size='sm'
            colorScheme='red'
            leftIcon={<LuCirclePause />}
            isLoading={loading}
            onClick={onConfirm}
          >
            Desativar cliente
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeactivateClientDialog;
