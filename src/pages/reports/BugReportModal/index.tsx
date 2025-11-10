import {
  Alert,
  AlertIcon,
  Button,
  Flex,
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
import TooltipSelect from '../../../components/common/TooltipSelect';
import { BugStatus } from '../../../utils/enums/bugReport.enum';
import { CloseIcon, DownloadIcon } from '@chakra-ui/icons';
import useBugReports from '../../../hooks/bugReports/useBugReports';
import { useState } from 'react';

interface BugReportModalProps extends ModalProps {
  selectedReport?: BugReportResponse;
  refetch: () => void;
}

function BugReportModal({
  isOpen,
  onClose,
  selectedReport,
  refetch,
}: BugReportModalProps) {
  const { updateReportStatus } = useBugReports();

  const [selectedStatus, setSelectedStatus] = useState<BugStatus | undefined>(
    selectedReport ? selectedReport.status : undefined,
  );

  async function handleSaveClick() {
    if (selectedStatus && selectedReport) {
      await updateReportStatus(selectedReport.id, selectedStatus);
    }
    setSelectedStatus(undefined);
    refetch();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Atualizar Situação</ModalHeader>
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
              <TooltipSelect
                options={BugStatus.values().map((val) => ({
                  label: BugStatus.translate(val),
                  value: val,
                }))}
                defaultValue={{
                  label: BugStatus.translate(selectedReport.status),
                  value: selectedReport.status,
                }}
                onChange={(val) => {
                  if (val) {
                    setSelectedStatus(val.value as BugStatus);
                  }
                }}
                placeholder={'Escolha a situação do relatório'}
              />
            </Flex>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={onClose}
            mr={'10px'}
            colorScheme='red'
            rightIcon={<CloseIcon />}
          >
            Cancelar
          </Button>
          <Button
            colorScheme='blue'
            onClick={handleSaveClick}
            rightIcon={<DownloadIcon />}
          >
            Atualizar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default BugReportModal;
