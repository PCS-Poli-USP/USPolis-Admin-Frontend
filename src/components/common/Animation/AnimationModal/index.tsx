import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Center,
  Button,
} from '@chakra-ui/react';
import { ModalProps } from 'models/interfaces';
import TravelHand from '../TravelHand';

interface AnimationModalProps extends ModalProps {
  onOpen: () => void;
}

export default function AnimationModal({
  isOpen,
  onClose,
  onOpen,
}: AnimationModalProps) {
  return (
    <>
    <Button onClick={() => onOpen()}>Animar</Button>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody alignContent={'center'} justifyContent={'center'}>
          <Center>
            <TravelHand />
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
    </>
  );
}
