import {
  Button,
  ListItem,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  OrderedList,
  Text,
} from '@chakra-ui/react';

import Class from 'models/class.model';
import AutomaticAllocationAccordion from './automaticAllocation.accordion';

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AutomaticAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  allocatedEvents: Class[];
  unallocatedEvents: Class[];
}

export default function AutomaticAllocationModal({
  isOpen,
  onSave,
  onClose,
  allocatedEvents,
  unallocatedEvents,
}: AutomaticAllocationModalProps) {
  const navigate = useNavigate();

  function handleAllocNavClick() {
    navigate('/allocation');
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      motionPreset='slideInBottom'
      size='2xl'
      scrollBehavior='outside'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Alocação Automática</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {unallocatedEvents.length > 0 ? (
            <Text fontSize='md' fontWeight='normal' mb={4}>
              Não foi possível alocar todas as turmas, isso pode ter ocorrido
              por 3 principais motivos:
              <OrderedList>
                <ListItem>
                  Salas insuficientes para as preferências das turmas
                </ListItem>
                <ListItem>
                  Salas insuficientes para a quantidade de alunos das turmas
                </ListItem>
                <ListItem>
                  Salas insuficientes para os horários das turmas
                </ListItem>
              </OrderedList>
            </Text>
          ) : (
            <Text fontSize='md' fontWeight='bold' mb={4}>
              Todas turmas foram alocadas com sucesso
            </Text>
          )}
          <AutomaticAllocationAccordion
            allocated={allocatedEvents}
            unallocated={unallocatedEvents}
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleAllocNavClick}>
            Ir para Alocações
          </Button>
          <Button colorScheme='blue' mr={0} onClick={onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
