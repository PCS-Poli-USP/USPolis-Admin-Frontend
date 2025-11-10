import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  SlideFade,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ModalProps } from '../../../models/interfaces';
import { useState } from 'react';
import FeedbackContent from './FeedbackContent/feedback.content';
import BugReportContent from './BugReportContent/bug.report.content';
import { RadioButton } from '../form/RadioButton';
import { useForm } from 'react-hook-form';
import { FeedbackForm } from './FeedbackContent/feedback.interface';
import { defaultValues, schema } from './FeedbackContent/feedback.form';
import { yupResolver } from '@hookform/resolvers/yup';
import { BugReportForm } from './BugReportContent/bug.report.interface';
import {
  defaultValues as reportDefaultValues,
  schema as reportSchema,
} from './BugReportContent/bug.report.form';
import { CreateFeedback } from '../../../models/http/requests/feedback.request.models';
import useFeedbacks from '../../../hooks/feedbacks/useFeedbacks';
import useBugReports from '../../../hooks/bugReports/useBugReports';
import { CreateBugReport } from '../../../models/http/requests/bugReport.request.models';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ContactUsModalProps extends ModalProps {}

enum ViewType {
  FEEDBACK = 'feedback',
  BUG_REPORT = 'bug_report',
}

const ViewTypeTranslation = {
  [ViewType.BUG_REPORT]: 'Reporte um problema',
  [ViewType.FEEDBACK]: 'Sugestões/Comentários',
};

function ContactUsModal({ isOpen, onClose }: ContactUsModalProps) {
  const {
    isOpen: isOpenSlide,
    onClose: onCloseSlide,
    onToggle,
  } = useDisclosure();
  const { createFeedback } = useFeedbacks();
  const { createReport } = useBugReports();
  const [selectedView, setSelectedVIew] = useState<ViewType>();
  const [files, setFiles] = useState<File[]>([]);

  const feedbackForm = useForm<FeedbackForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const bugReportForm = useForm<BugReportForm>({
    defaultValues: reportDefaultValues,
    resolver: yupResolver(reportSchema),
  });

  async function handleConfirm() {
    if (selectedView == ViewType.FEEDBACK) {
      const isValid = await feedbackForm.trigger();
      if (!isValid) return;

      const values = feedbackForm.getValues();
      const data: CreateFeedback = {
        title: values.title,
        message: values.message,
      };
      await createFeedback(data);
    }
    if (selectedView == ViewType.BUG_REPORT) {
      const isValid = await bugReportForm.trigger();
      if (!isValid) return;
      const values = bugReportForm.getValues();
      const data: CreateBugReport = {
        type: values.type,
        priority: values.priority,
        description: values.description,
        evidences: files,
      };
      await createReport(data);
    }
    handleClose();
  }

  function handleClose() {
    setSelectedVIew(undefined);
    feedbackForm.reset();
    bugReportForm.reset();
    onCloseSlide();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size={'4xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Fale conosco</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            direction={'column'}
            gap={'20px'}
            align={'center'}
            justify={'center'}
            mb={'20px'}
          >
            <Text fontWeight={'bold'} fontSize={'2xl'}>
              Escolha uma opção:
            </Text>
            <Flex direction={'row'} align={'center'} justify={'center'}>
              <RadioButton
                name='view'
                options={[
                  {
                    value: ViewType.FEEDBACK,
                    label: ViewTypeTranslation[ViewType.FEEDBACK],
                  },
                  {
                    value: ViewType.BUG_REPORT,
                    label: ViewTypeTranslation[ViewType.BUG_REPORT],
                  },
                ]}
                onChange={(next) => {
                  setSelectedVIew(next as ViewType);
                  if (!selectedView) onToggle();
                }}
                wrap={false}
              />
            </Flex>
          </Flex>
          <SlideFade in={isOpenSlide} offsetY='20px'>
            {selectedView == ViewType.FEEDBACK && (
              <FeedbackContent form={feedbackForm} />
            )}
            {selectedView == ViewType.BUG_REPORT && (
              <BugReportContent form={bugReportForm} setFiles={setFiles} />
            )}
          </SlideFade>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleConfirm}>
            Enviar
          </Button>
          <Button colorScheme='blue' onClick={handleClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ContactUsModal;
