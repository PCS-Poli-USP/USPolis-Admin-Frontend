import {
  Alert,
  AlertIcon,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { ModalProps } from '../../../models/interfaces';
import { BugReportResponse } from '../../../models/http/responses/bugReport.response.models';
import { useState } from 'react';

const USPOLIS_SERVER_URL = import.meta.env.VITE_USPOLIS_API_ENDPOINT;

interface EvidenceModalProps extends ModalProps {
  selectedReport?: BugReportResponse;
}

function EvidenceModal({
  isOpen,
  onClose,
  selectedReport,
}: EvidenceModalProps) {
  const [zoomMap, setZoomMap] = useState<boolean[]>([]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'3xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Evidências</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!selectedReport && (
            <Alert status='error'>
              <AlertIcon />
              Nenhum relatório selecionado!
            </Alert>
          )}

          {selectedReport && (
            <Flex direction={'column'} gap={'20px'}>
              {selectedReport.evidences_ids.map((id, idx) => (
                <Image
                  key={idx}
                  alt={`Evidencia ${id}`}
                  src={`${USPOLIS_SERVER_URL}/admin/reports/evidences/${id}`}
                  _hover={{ cursor: zoomMap[idx] ? 'zoom-out' : 'zoom-in' }}
                  transform={zoomMap[idx] ? 'scale(1.5)' : undefined}
                  onClickCapture={() => {
                    setZoomMap((prev) => {
                      const newZ = [...prev];
                      newZ[idx] = !newZ[idx];
                      return newZ;
                    });
                  }}
                  onMouseLeave={() => {
                    setZoomMap((prev) => {
                      const newZ = [...prev];
                      newZ[idx] = false;
                      return newZ;
                    });
                  }}
                />
              ))}
            </Flex>
          )}
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EvidenceModal;
