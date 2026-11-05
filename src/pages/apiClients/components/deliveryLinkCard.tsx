import {
  Badge,
  Button,
  Flex,
  Grid,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Fragment, useState } from 'react';
import { LuLink } from 'react-icons/lu';
import Dialog from '../../../components/common/Dialog/dialog.component';
import useApiKeysService from '../../../hooks/API/services/useApiKeysService';
import useCustomToast from '../../../hooks/useCustomToast';
import { ApiKeyDeliveryLinkResponse } from '../../../models/http/responses/apiKey.response.models';
import { ApiKeyLinkStatus } from '../../../utils/enums/apiKeyLinkStatus.enum';
import { apiErrorMessage } from '../../../utils/apiKeys/apiKeys.errors';
import { formatDateTime } from '../../../utils/apiKeys/apiKeys.formatter';

const STATUS_COLOR: Record<ApiKeyLinkStatus, string> = {
  [ApiKeyLinkStatus.PENDING]: 'orange',
  [ApiKeyLinkStatus.CONSUMED]: 'green',
  [ApiKeyLinkStatus.EXPIRED]: 'gray',
  [ApiKeyLinkStatus.INVALIDATED]: 'red',
};

interface DeliveryLinkCardProps {
  link: ApiKeyDeliveryLinkResponse;
  // Invalidating also revokes the key, so the page must reload it.
  onInvalidated: () => void;
}

function DeliveryLinkCard({ link, onInvalidated }: DeliveryLinkCardProps) {
  const { invalidateDeliveryLink } = useApiKeysService();
  const showToast = useCustomToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const pending = link.status === ApiKeyLinkStatus.PENDING;

  async function handleInvalidate() {
    if (loading) return;
    setLoading(true);
    try {
      await invalidateDeliveryLink(link.id);
      showToast(
        'Link invalidado',
        'O link não abre mais e a chave foi revogada.',
        'success',
      );
      onClose();
      onInvalidated();
    } catch (error) {
      showToast(
        'Erro ao invalidar link',
        apiErrorMessage(error, 'Não foi possível invalidar o link.'),
        'error',
      );
    } finally {
      setLoading(false);
    }
  }

  const rows: [string, string][] = [
    ['Gerado em', formatDateTime(link.created_at)],
    ['Válido até', formatDateTime(link.expires_at)],
    [
      'E-mail',
      link.emailed_at
        ? `Enviado para ${link.emailed_to} em ${formatDateTime(link.emailed_at)}`
        : 'Não enviado',
    ],
  ];
  if (link.consumed_at)
    rows.push([
      'Aberto em',
      `${formatDateTime(link.consumed_at)}${link.consumed_ip ? ` (IP ${link.consumed_ip})` : ''}`,
    ]);
  if (link.invalidated_at)
    rows.push(['Invalidado em', formatDateTime(link.invalidated_at)]);

  return (
    <Flex
      direction='column'
      gap={3}
      border='1px solid'
      borderColor='uspolis.blue'
      borderRadius='lg'
      p={6}
      maxW='880px'
    >
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleInvalidate}
        title='Invalidar o link de entrega?'
        multipleWarningText={[
          'O link deixará de abrir e a chave será revogada, já que o parceiro não a recebeu.',
          'Para entregar a chave, emita outra.',
        ]}
      />
      <Flex justify='space-between' align='center' gap={2} wrap='wrap'>
        <Flex align='center' gap={2} fontSize='xl' fontWeight='bold'>
          <LuLink />
          Entrega por link
        </Flex>
        <Badge
          colorScheme={STATUS_COLOR[link.status]}
          textTransform='none'
          fontSize='13px'
          borderRadius='md'
          px={2}
        >
          {ApiKeyLinkStatus.translate(link.status)}
        </Badge>
      </Flex>
      <Grid templateColumns='minmax(80px, 180px) minmax(0, 1fr)' gap='8px 16px'>
        {rows.map(([label, value]) => (
          <Fragment key={label}>
            <Text color='uspolis.textMuted'>{label}</Text>
            <Text overflowWrap='anywhere'>{value}</Text>
          </Fragment>
        ))}
      </Grid>
      {pending && (
        <Flex
          justify='space-between'
          align='center'
          gap={3}
          wrap='wrap'
          pt={3}
          borderTop='1px solid'
          borderColor='uspolis.border'
        >
          <Text fontSize='sm' color='uspolis.textMuted' flex='1 1 300px'>
            O link só pode ser copiado ou enviado no momento da emissão. Se ele
            se perdeu, invalide-o e emita outra chave.
          </Text>
          <Button
            size='sm'
            variant='outline'
            colorScheme='red'
            onClick={onOpen}
          >
            Invalidar link
          </Button>
        </Flex>
      )}
    </Flex>
  );
}

export default DeliveryLinkCard;
