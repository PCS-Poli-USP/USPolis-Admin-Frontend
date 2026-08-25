import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Code,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  Skeleton,
  Text,
  Textarea,
  Wrap,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ApiAccessLogResponse } from '../../../models/http/responses/apiAccessLog.response.models';
import { ApiIncidentReportResponse } from '../../../models/http/responses/apiIncidentReport.response.models';
import { ApiSecurityLevel } from '../../../utils/enums/apiSecurityLevel.enum';
import { IncidentReportLevel } from '../../../utils/enums/incidentReportLevel.enum';
import { IncidentReportStatus } from '../../../utils/enums/incidentReportStatus.enum';
import useApiIncidentReports from '../../../hooks/apiIncidentReports/useApiIncidentReports';
import { statusCodeColorScheme } from '../apiStatus.utils';

interface AccessLogDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  log: ApiAccessLogResponse | null;
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <GridItem>
      <Text
        fontSize={'11px'}
        color={'uspolis.lightGray'}
        textTransform={'uppercase'}
      >
        {label}
      </Text>
      <Text fontSize={'13px'} wordBreak={'break-word'}>
        {value}
      </Text>
    </GridItem>
  );
}

function AccessLogDetailDrawer({
  isOpen,
  onClose,
  log,
}: AccessLogDetailDrawerProps) {
  const {
    findIncidentByAccessLogId,
    createIncident,
    updateIncidentStatus,
    loading,
  } = useApiIncidentReports();

  const [loadingIncident, setLoadingIncident] = useState(false);
  const [incident, setIncident] = useState<ApiIncidentReportResponse | null>(
    null,
  );
  const [level, setLevel] = useState<IncidentReportLevel>(
    IncidentReportLevel.MEDIUM,
  );
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState(false);

  useEffect(() => {
    if (!isOpen || !log) {
      setIncident(null);
      return;
    }
    setLoadingIncident(true);
    setLevel(IncidentReportLevel.MEDIUM);
    setDescription('');
    setDescriptionError(false);
    findIncidentByAccessLogId(log.id)
      .then((found) => setIncident(found ?? null))
      .finally(() => setLoadingIncident(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, log?.id]);

  async function handleCreateIncident() {
    if (!log) return;
    if (!description.trim()) {
      setDescriptionError(true);
      return;
    }
    const created = await createIncident({
      access_log_id: log.id,
      level,
      description: description.trim(),
    });
    if (created) {
      setIncident(created);
      setDescription('');
    }
  }

  async function handleChangeStatus(status: IncidentReportStatus) {
    if (!incident) return;
    const updated = await updateIncidentStatus(incident.id, status);
    if (updated) setIncident(updated);
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement={'right'} size={'md'}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader
          borderBottom={'1px solid'}
          borderColor={'uspolis.lightGray'}
        >
          {log && (
            <Flex align={'center'} gap={'10px'}>
              <Badge colorScheme={statusCodeColorScheme(log.status_code)}>
                {log.status_code}
              </Badge>
              <Text fontFamily={'monospace'} fontSize={'14px'}>
                {log.method}
              </Text>
              <Text
                fontFamily={'monospace'}
                fontSize={'13px'}
                color={'uspolis.lightGray'}
              >
                log #{log.id}
              </Text>
            </Flex>
          )}
          <Text
            fontFamily={'monospace'}
            fontSize={'13px'}
            wordBreak={'break-all'}
            fontWeight={'normal'}
            mt={'6px'}
          >
            {log?.endpoint}
          </Text>
        </DrawerHeader>

        <DrawerBody>
          {log && (
            <Flex direction={'column'} gap={'20px'} py={'16px'}>
              <Grid templateColumns={'1fr 1fr'} gap={'14px'}>
                <DetailField
                  label={'Data/hora'}
                  value={new Date(log.timestamp).toLocaleString('pt-BR')}
                />
                <DetailField
                  label={'Nível de segurança'}
                  value={ApiSecurityLevel.translate(log.security_level)}
                />
                <DetailField
                  label={'Tempo de resposta'}
                  value={`${log.response_time_ms ?? '-'} ms`}
                />
                <DetailField
                  label={'Endereço IP'}
                  value={log.ip_address ?? '—'}
                />
                <DetailField
                  label={'Usuário'}
                  value={log.user_email ?? 'anônimo'}
                />
                <DetailField
                  label={'User agent'}
                  value={log.user_agent ?? '—'}
                />
              </Grid>

              {log.detail && (
                <Box>
                  <Text
                    fontSize={'11px'}
                    color={'uspolis.lightGray'}
                    textTransform={'uppercase'}
                    mb={'6px'}
                  >
                    Detalhe
                  </Text>
                  <Text fontSize={'13px'}>{log.detail}</Text>
                </Box>
              )}

              {log.tags.length > 0 && (
                <Wrap>
                  {log.tags.map((tag) => (
                    <Badge key={tag} variant={'outline'} colorScheme={'gray'}>
                      {tag}
                    </Badge>
                  ))}
                </Wrap>
              )}

              {log.request_body && (
                <Box>
                  <Text
                    fontSize={'11px'}
                    color={'uspolis.lightGray'}
                    textTransform={'uppercase'}
                    mb={'6px'}
                  >
                    Corpo da requisição
                  </Text>
                  <Code
                    display={'block'}
                    whiteSpace={'pre-wrap'}
                    p={'12px'}
                    borderRadius={'6px'}
                    fontSize={'12px'}
                    maxH={'220px'}
                    overflowY={'auto'}
                  >
                    {log.request_body}
                  </Code>
                </Box>
              )}

              <Divider />

              <Box>
                <Text
                  fontSize={'11px'}
                  color={'uspolis.lightGray'}
                  textTransform={'uppercase'}
                  mb={'10px'}
                >
                  Incidente
                </Text>

                <Skeleton isLoaded={!loadingIncident}>
                  {incident ? (
                    <Flex
                      direction={'column'}
                      gap={'10px'}
                      border={'1px solid'}
                      borderColor={'uspolis.lightGray'}
                      borderRadius={'6px'}
                      p={'14px'}
                    >
                      <Flex align={'center'} gap={'8px'}>
                        <Badge
                          colorScheme={IncidentReportLevel.getColorScheme(
                            incident.level,
                          )}
                        >
                          {IncidentReportLevel.translate(incident.level)}
                        </Badge>
                        <Badge
                          colorScheme={IncidentReportStatus.getColorScheme(
                            incident.status,
                          )}
                        >
                          {IncidentReportStatus.translate(incident.status)}
                        </Badge>
                        <Text fontSize={'12px'} color={'uspolis.lightGray'}>
                          #{incident.id}
                        </Text>
                      </Flex>
                      <Text fontSize={'13px'}>{incident.description}</Text>
                      <ButtonGroup size={'xs'} isAttached variant={'outline'}>
                        {IncidentReportStatus.values().map((s) => (
                          <Button
                            key={s}
                            isDisabled={loading}
                            variant={
                              incident.status === s ? 'solid' : 'outline'
                            }
                            colorScheme={
                              incident.status === s
                                ? IncidentReportStatus.getColorScheme(s)
                                : 'gray'
                            }
                            onClick={() => handleChangeStatus(s)}
                          >
                            {IncidentReportStatus.translate(s)}
                          </Button>
                        ))}
                      </ButtonGroup>
                    </Flex>
                  ) : (
                    <Flex direction={'column'} gap={'12px'}>
                      <Box>
                        <Text
                          fontSize={'12px'}
                          color={'uspolis.gray'}
                          mb={'6px'}
                        >
                          Severidade
                        </Text>
                        <ButtonGroup size={'sm'} isAttached variant={'outline'}>
                          {IncidentReportLevel.values().map((lv) => (
                            <Button
                              key={lv}
                              variant={level === lv ? 'solid' : 'outline'}
                              colorScheme={
                                level === lv
                                  ? IncidentReportLevel.getColorScheme(lv)
                                  : 'gray'
                              }
                              onClick={() => setLevel(lv)}
                            >
                              {IncidentReportLevel.translate(lv)}
                            </Button>
                          ))}
                        </ButtonGroup>
                      </Box>
                      <Box>
                        <Text
                          fontSize={'12px'}
                          color={'uspolis.gray'}
                          mb={'6px'}
                        >
                          Descrição
                        </Text>
                        <Textarea
                          value={description}
                          onChange={(e) => {
                            setDescription(e.target.value);
                            setDescriptionError(false);
                          }}
                          placeholder={
                            'O que aconteceu, o que já foi verificado, quem é o responsável…'
                          }
                          rows={3}
                          isInvalid={descriptionError}
                        />
                        {descriptionError && (
                          <Text
                            fontSize={'12px'}
                            color={'uspolis.red'}
                            mt={'4px'}
                          >
                            Descrição é obrigatória.
                          </Text>
                        )}
                      </Box>
                      <Button
                        colorScheme={'red'}
                        alignSelf={'flex-start'}
                        isLoading={loading}
                        onClick={handleCreateIncident}
                      >
                        Abrir incidente
                      </Button>
                    </Flex>
                  )}
                </Skeleton>
              </Box>
            </Flex>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default AccessLogDetailDrawer;
