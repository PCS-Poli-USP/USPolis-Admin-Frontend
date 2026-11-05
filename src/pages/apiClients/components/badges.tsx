import { Badge, Flex } from '@chakra-ui/react';
import { ReactElement } from 'react';
import {
  LuBan,
  LuCircleCheck,
  LuCirclePause,
  LuClock,
  LuLink,
} from 'react-icons/lu';
import { ApiKeyStatus } from '../../../utils/enums/apiKeyStatus.enum';
import { ApiKeyLinkStatus } from '../../../utils/enums/apiKeyLinkStatus.enum';
import { ApiKeyDeliveryLinkResponse } from '../../../models/http/responses/apiKey.response.models';
import { formatDateTime } from '../../../utils/apiKeys/apiKeys.formatter';

const KEY_STATUS_STYLE: Record<
  ApiKeyStatus,
  { colorScheme: string; icon: ReactElement }
> = {
  [ApiKeyStatus.ACTIVE]: { colorScheme: 'green', icon: <LuCircleCheck /> },
  [ApiKeyStatus.EXPIRED]: { colorScheme: 'gray', icon: <LuClock /> },
  [ApiKeyStatus.CLIENT_INACTIVE]: {
    colorScheme: 'orange',
    icon: <LuCirclePause />,
  },
  [ApiKeyStatus.REVOKED]: { colorScheme: 'red', icon: <LuBan /> },
};

function StatusPill({
  colorScheme,
  icon,
  label,
}: {
  colorScheme: string;
  icon: ReactElement;
  label: string;
}) {
  return (
    <Badge
      colorScheme={colorScheme}
      textTransform='none'
      fontSize='13px'
      fontWeight='semibold'
      px={2}
      py='2px'
      borderRadius='md'
      display='inline-flex'
      alignItems='center'
      gap={1}
      whiteSpace='nowrap'
    >
      {icon}
      {label}
    </Badge>
  );
}

export function KeyStatusBadge({ status }: { status: ApiKeyStatus }) {
  return (
    <StatusPill
      {...KEY_STATUS_STYLE[status]}
      label={ApiKeyStatus.translate(status)}
    />
  );
}

export function ClientStatusBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <StatusPill colorScheme='green' icon={<LuCircleCheck />} label='Ativo' />
  ) : (
    <StatusPill colorScheme='orange' icon={<LuCirclePause />} label='Inativo' />
  );
}

export function LimitsBadge({
  usesDefault,
  prefix = '',
}: {
  usesDefault: boolean;
  prefix?: string;
}) {
  return (
    <Badge
      textTransform='none'
      fontWeight='medium'
      borderRadius='md'
      px={2}
      colorScheme={usesDefault ? 'gray' : 'cyan'}
    >
      {prefix}
      {usesDefault ? 'Padrão' : 'Personalizado'}
    </Badge>
  );
}

export function PrefixChips({ prefixes }: { prefixes: string[] }) {
  return (
    <Flex wrap='wrap' gap={1} maxW='240px'>
      {prefixes.map((p) => (
        <Badge
          key={p}
          textTransform='none'
          fontFamily='mono'
          fontWeight='normal'
          borderRadius='md'
          px={2}
        >
          {p}
        </Badge>
      ))}
    </Flex>
  );
}

// Delivery state of a key issued by one-time link, shown under its status.
export function DeliveryLinkNote({
  link,
}: {
  link: ApiKeyDeliveryLinkResponse | null;
}) {
  if (!link) return null;
  if (link.status === ApiKeyLinkStatus.PENDING)
    return (
      <Flex fontSize='13px' align='center' gap={1} color='orange.600' mt={1}>
        <LuLink />
        Link aguardando abertura
      </Flex>
    );
  if (link.status === ApiKeyLinkStatus.CONSUMED)
    return (
      <Flex
        fontSize='13px'
        align='center'
        gap={1}
        color='uspolis.textMuted'
        mt={1}
        whiteSpace='nowrap'
      >
        <LuLink />
        Entregue em {formatDateTime(link.consumed_at)}
      </Flex>
    );
  return (
    <Flex
      fontSize='13px'
      align='center'
      gap={1}
      color='uspolis.textMuted'
      mt={1}
      whiteSpace='nowrap'
    >
      <LuLink />
      {link.status === ApiKeyLinkStatus.EXPIRED
        ? `Link expirou sem ser aberto`
        : `Link invalidado em ${formatDateTime(link.invalidated_at)}`}
    </Flex>
  );
}
