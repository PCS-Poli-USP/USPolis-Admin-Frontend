import {Box, Modal, ModalBody, ModalContent, ModalOverlay, SkeletonCircle, SkeletonText} from '@chakra-ui/react';

interface LoadingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoadingModal({ isOpen, onClose }: LoadingModalProps ) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Box padding='6' boxShadow='lg'>
            <SkeletonCircle size='10' />
            <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
