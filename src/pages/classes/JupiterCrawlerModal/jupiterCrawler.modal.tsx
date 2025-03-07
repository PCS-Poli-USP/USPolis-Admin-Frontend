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

import JupiterCrawlerAccordion from './jupiterCrawler.accordion';
import { SubjectCrawlResponse } from 'models/http/responses/subject.response.models';

interface JupiterCrawlerModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: SubjectCrawlResponse;
}

export default function JupiterCrawlerModal({
  isOpen,
  onClose,
  data,
}: JupiterCrawlerModalProps) {
  function handleClose() {
    onClose();
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
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
          {data ? (
            <>
              {data.errors.length > 0 ? (
                <Text fontSize='md' fontWeight='normal' mb={4}>
                  Não foi possível carregar/atualizar todas as disciplinas, isso
                  pode ter ocorrido por:
                  <OrderedList>
                    <ListItem fontWeight={'bold'}>
                      Código da disciplina digitado incorretamente ou não existe
                      oferecimento no jupiter web
                    </ListItem>
                    <ListItem fontWeight={'bold'}>
                      O jupiter web não segue a formatação esperada
                    </ListItem>
                    <ListItem fontWeight={'bold'}>
                      Erro interno no sistema ao salvar informações, contate o
                      suporte
                    </ListItem>
                  </OrderedList>
                </Text>
              ) : (
                <Text fontSize='md' fontWeight='bold' mb={4}>
                  {`Todas as disciplinas foram ${
                    data.update ? 'atualizadas' : 'carregadas'
                  } com sucesso`}
                </Text>
              )}
              <JupiterCrawlerAccordion
                success={data.sucess}
                failed={data.failed}
                erros={data.errors}
                update={data.update}
              />
            </>
          ) : (
            <Text>
              Não foi possível carregar o resultado da busca no JupiterWeb{' '}
            </Text>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={0} onClick={handleClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
