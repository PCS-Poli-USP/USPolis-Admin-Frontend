import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { useRef } from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  warningText?: string;
}

export default function Dialog({ isOpen, onClose, onConfirm, title, warningText = '' }: DialogProps) {
  const cancelRef = useRef(null);
  return (
    <AlertDialog leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen} isCentered>
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>{title}?</AlertDialogHeader>
        <AlertDialogBody color='red'>{warningText}</AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose} colorScheme='red' variant='outline' size='sm'>
            Cancelar
          </Button>
          <Button ml={2} onClick={onConfirm} colorScheme='blue' size='sm'>
            Confirmar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
