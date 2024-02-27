import {
  Button,
  ListItem,
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

import { useEffect, useState } from 'react';
import JupiterCrawlerAccordion from './jupiterCrawler.accordion';

interface JupiterCrawlerModalProps {
  isOpen: boolean;
  onClose: () => void;
  successSubjects: string[];
  failedSubjects: string[];
}

export default function JupiterCrawlerModal({
  isOpen,
  onClose,
  successSubjects,
  failedSubjects,
}: JupiterCrawlerModalProps) {

  const [successSubjectsList, setSuccessSubjectsList] = useState<string[]>([]);
  const [failedSubjectsList, setFailedSubjectsList] = useState<string[]>([]);

  useEffect(() => {
    if (successSubjects && successSubjects.length > 0) setSuccessSubjectsList(successSubjects);
    if (failedSubjects && failedSubjects.length > 0) setFailedSubjectsList(failedSubjects);
  }, [successSubjects, failedSubjects]);


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      motionPreset='slideInBottom'
      size='4xl'
      scrollBehavior='outside'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Jupiter Crawler</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {failedSubjectsList.length > 0 ? (
            <Text fontSize='md' fontWeight='normal' mb={4}>
              Não foi possível carregar todas as disciplinas, isso pode ter ocorrido
              por 3 principais motivos:
              <OrderedList>
                <ListItem>
                  Código da disciplina digitado incorretamente
                </ListItem>
                <ListItem>
                  Disciplina não está com o oferecimento no jupiter web
                </ListItem>
                <ListItem>
                  Erro de formatação no jupiter
                </ListItem>
              </OrderedList>
            </Text>
          ) : (
            <Text fontSize='md' fontWeight='bold' mb={4}>
              Todas as disciplinas foram carregadas com sucesso
            </Text>
          )}
          <JupiterCrawlerAccordion
            success={successSubjectsList}
            failed={failedSubjectsList}
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={0} onClick={onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
