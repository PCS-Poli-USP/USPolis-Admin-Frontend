import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Divider,
  Link,
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

const SUPPORT_EMAIL = 'uspolis@usp.br';

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
  const isErrorResult = !result || CrawlStatus.isError(result.status);
  const status = result?.status ?? CrawlStatus.ERROR;
  const isUnmatchedFailure = result?.status === CrawlStatus.FAILURE;

  const statusTitle = isErrorResult
    ? 'Erro na importacao da grade'
    : `${CrawlStatus.translate(status)}`;

  const statusDescription = isUnmatchedFailure ? (
    <>
      Sua grade foi obtida do JupiterWeb, mas nenhuma das disciplinas
      encontradas esta cadastrada no sistema do USPolis ainda. Peca para a
      secretaria do seu departamento ou para o suporte (
      <Link href={`mailto:${SUPPORT_EMAIL}`} textDecoration={'underline'}>
        {SUPPORT_EMAIL}
      </Link>
      ) cadastrarem essas disciplinas no sistema. Veja os itens nao encontrados
      abaixo.
    </>
  ) : isErrorResult ? (
    'Nao foi possivel concluir a importacao da grade horaria. Tente novamente e, se o problema persistir, entre em contato com o suporte.'
  ) : (
    result.message || 'Importacao processada com sucesso.'
  );

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
                <Alert
                  status={CrawlStatus.toAlertStatus(status)}
                  borderRadius={'10px'}
                >
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
                      Periodo:{' '}
                      {moment(result.user_schedule.start_date).format(
                        'DD/MM/YYYY',
                      ) || '-'}{' '}
                      ate{' '}
                      {moment(result.user_schedule.end_date).format(
                        'DD/MM/YYYY',
                      ) || '-'}
                      .
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
                    <Flex direction={'column'} gap={'12px'}>
                      {missingItems.map((item, index) => (
                        <Box key={`${item.code}-${item.class_code}-${index}`}>
                          <Text fontWeight={'semibold'}>
                            {item.code} - {item.name} (Turma {item.class_code})
                          </Text>
                          {item.available_days.map((slot, slotIndex) => (
                            <Text key={slotIndex} fontSize={'sm'}>
                              {WeekDay.translate(slot.week_day)}:{' '}
                              {slot.start_time.slice(0, 5)} -{' '}
                              {slot.end_time.slice(0, 5)}
                            </Text>
                          ))}
                          {item.observations && (
                            <Text fontSize={'sm'} fontStyle={'italic'}>
                              {item.observations}
                            </Text>
                          )}
                        </Box>
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
