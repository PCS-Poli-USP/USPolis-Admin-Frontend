import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Spinner,
} from '@chakra-ui/react';
import { ModalProps } from '../../../models/interfaces';
import { BugReportResponse } from '../../../models/http/responses/bugReport.response.models';
import { useEffect, useState } from 'react';

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
  const [loadingMap, setLoadingMap] = useState<boolean[]>([]);
  const [errorMap, setErrorMap] = useState<boolean[]>([]);

  useEffect(() => {
    if (selectedReport) {
      selectedReport.evidences_ids.forEach(() => {
        loadingMap.push(true);
        errorMap.push(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReport]);

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
                <>
                  {!errorMap[idx] ? (
                    <Skeleton isLoaded={!loadingMap[idx]}>
                      <Image
                        key={idx}
                        alt={`Evidencia ${id}`}
                        src={`${USPOLIS_SERVER_URL}/admin/reports/evidences/${id}`}
                        _hover={{
                          cursor: zoomMap[idx] ? 'zoom-out' : 'zoom-in',
                        }}
                        transform={zoomMap[idx] ? 'scale(1.5)' : undefined}
                        onLoad={() =>
                          setLoadingMap((prev) => {
                            prev[idx] = false;
                            return [...prev];
                          })
                        }
                        onError={() => {
                          setErrorMap((prev) => {
                            prev[idx] = true;
                            return prev;
                          });
                          setLoadingMap((prev) => {
                            prev[idx] = false;
                            return [...prev];
                          });
                        }}
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
                    </Skeleton>
                  ) : (
                    <Alert status='error'>
                      <AlertIcon />
                      {`Erro ao carregar evidência ${idx + 1}`}
                    </Alert>
                  )}
                </>
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
