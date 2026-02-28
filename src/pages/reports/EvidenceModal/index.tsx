import {
  Alert,
  AlertIcon,
  Button,
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
} from '@chakra-ui/react';
import { ModalProps } from '../../../models/interfaces';
import { BugReportResponse } from '../../../models/http/responses/bugReport.response.models';
import React, { useEffect, useState } from 'react';
import useBugReports from '../../../hooks/bugReports/useBugReports';
import { IoReloadCircle } from 'react-icons/io5';

const USPOLIS_SERVER_URL = import.meta.env.VITE_USPOLIS_API_ENDPOINT;

interface EvidenceModalProps extends ModalProps {
  selectedReport?: BugReportResponse;
}

function EvidenceModal({
  isOpen,
  onClose,
  selectedReport,
}: EvidenceModalProps) {
  const { loading, getReportEvidence } = useBugReports();

  const [zoomMap, setZoomMap] = useState<boolean[]>([]);
  const [loadingMap, setLoadingMap] = useState<boolean[]>([]);
  const [errorMap, setErrorMap] = useState<boolean[]>([]);
  const [reloadMap, setReloadMap] = useState<string[]>([]);

  useEffect(() => {
    if (selectedReport) {
      selectedReport.evidences_ids.forEach(() => {
        loadingMap.push(true);
        errorMap.push(false);
        reloadMap.push('');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReport]);

  async function handleReloadClick(id: number, idx: number) {
    const blob = await getReportEvidence(id);
    if (blob) {
      const imageURL = URL.createObjectURL(blob);
      setReloadMap((prev) => {
        prev[idx] = imageURL;
        return [...prev];
      });
    }
    if (!blob) {
      setReloadMap((prev) => {
        prev[idx] = 'UNDEFINED';
        return [...prev];
      });
    }
  }

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
                <React.Fragment key={`BUG-${selectedReport.id}-EVIDENCE-${id}`}>
                  {!errorMap[idx] ? (
                    <Skeleton isLoaded={!loadingMap[idx]}>
                      <Image
                        key={`IMG-REPORT_${selectedReport.id}-EVIDENCE_${id}`}
                        alt={`Evidencia ${id}`}
                        src={`${USPOLIS_SERVER_URL}/images/admin/reports/evidences/${id}`}
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
                    <Flex direction={'column'} gap={'5px'}>
                      <Flex
                        gap={'10px'}
                        align={'center'}
                        hidden={!!reloadMap[idx]}
                      >
                        <Alert status='error'>
                          <AlertIcon />
                          {`Erro ao carregar evidência ${idx + 1} usando cookies`}
                        </Alert>
                        <Button
                          onClick={() => handleReloadClick(id, idx)}
                          w={'fit-content'}
                          rightIcon={<IoReloadCircle />}
                          isLoading={loading}
                        >
                          Recarregar
                        </Button>
                      </Flex>

                      <Skeleton
                        isLoaded={!loading || reloadMap[idx].length > 0}
                      >
                        <Image
                          key={`IMG-REPORT_${selectedReport.id}-EVIDENCE_${id}`}
                          hidden={!reloadMap[idx]}
                          alt={`Não foi possível carregar evidencia de  id ${id}`}
                          src={reloadMap[idx]}
                          _hover={{
                            cursor: zoomMap[idx] ? 'zoom-out' : 'zoom-in',
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
                    </Flex>
                  )}
                </React.Fragment>
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
