import { Modal, ModalContent, ModalOverlay, Spinner } from '@chakra-ui/react';

interface LoadingProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Loading({ isOpen, onClose }: LoadingProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} closeOnEsc={false}>
      <ModalOverlay display='flex' alignItems='center' justifyContent='center'>
        <Spinner thickness='4px' speed='0.65s' emptyColor='uspolis.grey' color='uspolis.blue' size='xl' />
      </ModalOverlay>
      <ModalContent></ModalContent> {/* block scrolling when loading */}
    </Modal>
  );
}
