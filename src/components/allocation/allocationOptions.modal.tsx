import {
  Button,
  List,
  ListItem,
  ListIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

import { DownloadIcon, CalendarIcon } from '@chakra-ui/icons';
import Dialog from '../common/Dialog/dialog.component';
import { useState } from 'react';

interface AllocationOptionsProps {
  isOpen: boolean;
  hasError: boolean;
  onLoad: () => void;
  onNew: () => void;
  onClose: () => void;
}

export default function AllocationOptions({
  isOpen,
  hasError,
  onLoad,
  onNew,
  onClose,
}: AllocationOptionsProps) {
  const {
    isOpen: isOpenAllocDialog,
    onOpen: onOpenAllocDialog,
    onClose: onCloseAllocDialog,
  } = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);

  function handleAllocClick() {
    onOpenAllocDialog();
  }

  function handleAllocConfirm() {
    onCloseAllocDialog();
    if (isLoading) onLoad();
    else onNew();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Alocação Automática</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Dialog
            isOpen={isOpenAllocDialog}
            onClose={onCloseAllocDialog}
            onConfirm={handleAllocConfirm}
            title={
              isLoading
                ? 'Deseja recuperar a última alocação feita para as turmas e salas cadastradas'
                : 'Deseja calcular uma alocação para as turmas e salas cadastradas'
            }
            warningText='ATENÇÃO: AO CONFIRMAR QUALQUER ALOCAÇÃO SALVA SERÁ PERDIDA'
          />
          <List spacing={3}>
            <ListItem>
              <ListIcon as={DownloadIcon} />
              Recuperar a última alocação
            </ListItem>
            <ListItem>
              <ListIcon as={CalendarIcon} />
              Fazer uma nova alocação
            </ListItem>
          </List>
          {hasError ? (
            <Alert status={'error'} mt={4}>
              <AlertIcon />
              Não há alocação para recuperar, faça uma alocação antes!
            </Alert>
          ) : undefined}
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme='blue'
            mr={3}
            leftIcon={<DownloadIcon />}
            onClick={() => {
              setIsLoading(true);
              handleAllocClick();
            }}
          >
            Recuperar
          </Button>
          <Button
            colorScheme='blue'
            mr={3}
            leftIcon={<CalendarIcon />}
            onClick={() => {
              setIsLoading(false);
              handleAllocClick();
            }}
          >
            Fazer
          </Button>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
