import {
  Alert,
  AlertIcon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from '@chakra-ui/react';
import { ModalProps } from '../../../models/interfaces';
import { BugReportResponse } from '../../../models/http/responses/bugReport.response.models';

interface BugDescriptionModalProps extends ModalProps {
  selectedBugResponse: BugReportResponse | undefined;
}

function BugDescriptionModal(props: BugDescriptionModalProps) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size={'xl'}>
      <ModalContent>
        <ModalHeader>Descrição do Bug Reportado: </ModalHeader>
        <ModalCloseButton />
        <ModalBody padding={'20px'}>
          {props.selectedBugResponse && (
            <Textarea
              value={props.selectedBugResponse.description}
              h={'400px'}
            />
          )}
          {!props.selectedBugResponse && (
            <Alert status='error'>
              <AlertIcon />
              Nenhum reporte encontrado!
            </Alert>
          )}
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}

export default BugDescriptionModal;
