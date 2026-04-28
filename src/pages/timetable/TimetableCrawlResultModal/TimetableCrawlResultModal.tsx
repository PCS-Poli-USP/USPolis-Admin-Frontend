import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Button,
  CircularProgress,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import { ModalProps } from '../../../models/interfaces';
import { UserScheduleCrawlResponse } from '../../../models/http/responses/userSchedule.response.models';
import { ViewOffIcon } from '@chakra-ui/icons';
import { CrawlStatus } from '../../../utils/enums/crawlStatus.enum';
import { WeekDay } from '../../../utils/enums/weekDays.enum';
import moment from 'moment';

interface TimetableCrawlResultModalProps extends ModalProps {
  crawling: boolean;
  result: UserScheduleCrawlResponse | undefined;
}

function TimetableCrawlResultModal({
  isOpen,
  onClose,
  crawling,
  result,
}: TimetableCrawlResultModalProps) {
  const isErrorResult = !result || result.status === CrawlStatus.ERROR;
  const status = result?.status ?? CrawlStatus.ERROR;

  const statusTitle = isErrorResult
    ? 'Erro na importacao da grade'
    : `${CrawlStatus.translate(status)}`;

  const statusDescription = isErrorResult
    ? 'Nao foi possivel concluir a importacao da grade horaria. Tente novamente e, se o problema persistir, entre em contato com o suporte.'
    : result.message || 'Importacao processada com sucesso.';

  const missingItems = result?.missing_items ?? [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'lg'}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Flex direction={'column'} gap={'20px'} mt={'20px'}>
            {crawling && (
              <Flex
                direction={'column'}
                align={'center'}
                justify={'center'}
                gap={'20px'}
              >
                <CircularProgress
                  isIndeterminate
                  color={'uspolis.blue'}
                  size={'100px'}
                />
                <Heading size={'md'}>Importando sua grade horaria</Heading>
                <Text>
                  Isso pode levar alguns segundos, por favor aguarde...
                </Text>
              </Flex>
            )}

            {!crawling && (
              <Flex direction={'column'} gap={'16px'}>
                <Alert status={status} borderRadius={'10px'}>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>{statusTitle}</AlertTitle>
                    <AlertDescription>{statusDescription}</AlertDescription>
                  </Box>
                </Alert>

                {!isErrorResult && result?.user_schedule && (
                  <Flex direction={'column'} gap={'8px'}>
                    <Heading size={'sm'}>Importado com sucesso</Heading>
                    <Text>
                      A grade foi salva com{' '}
                      <Badge colorScheme={'blue'}>
                        {result.user_schedule.entries.length} aulas
                      </Badge>{' '}
                      no sistema.
                    </Text>
                    <Text>
                      Periodo: {moment(result.user_schedule.start_date).format('DD/MM/YYYY') || '-'} ate{' '}
                      {moment(result.user_schedule.end_date).format('DD/MM/YYYY') || '-'}.
                    </Text>
                  </Flex>
                )}

                <Divider />

                <Flex direction={'column'} gap={'8px'}>
                  <Heading size={'sm'}>Itens não encontrados</Heading>
                  {missingItems.length === 0 && (
                    <Text>Nenhum item faltante foi identificado.</Text>
                  )}
                  {missingItems.length > 0 && (
                    <Flex direction={'column'} gap={'6px'}>
                      {missingItems.map((item, index) => (
                        <Text
                          key={`${item.week_day}-${item.start_time}-${index}`}
                        >
                          {WeekDay.translate(item.week_day)}: {item.start_time}{' '}
                          - {item.end_time}
                        </Text>
                      ))}
                    </Flex>
                  )}
                </Flex>
              </Flex>
            )}
          </Flex>
        </ModalBody>

        <ModalFooter>
          {!result && crawling && (
            <Button
              colorScheme={'blue'}
              onClick={onClose}
              rightIcon={<ViewOffIcon />}
            >
              Ocultar
            </Button>
          )}
          {!crawling && (
            <Button colorScheme={'blue'} onClick={onClose}>
              Fechar
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default TimetableCrawlResultModal;
