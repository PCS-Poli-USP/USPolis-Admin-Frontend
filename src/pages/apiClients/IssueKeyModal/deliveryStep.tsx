import { Badge, Box, Button, Flex, Radio, Text } from '@chakra-ui/react';
import { LuEye, LuLink } from 'react-icons/lu';
import { ApiKeyLinkTtlHours } from '../../../models/http/requests/apiKey.request.models';

export type KeyDelivery = 'link' | 'show';

const TTLS: { value: ApiKeyLinkTtlHours; label: string }[] = [
  { value: 1, label: '1 hora' },
  { value: 24, label: '24 horas' },
  { value: 72, label: '72 horas' },
];

interface DeliveryStepProps {
  delivery: KeyDelivery;
  onDeliveryChange: (delivery: KeyDelivery) => void;
  ttl: ApiKeyLinkTtlHours;
  onTtlChange: (ttl: ApiKeyLinkTtlHours) => void;
  contactEmail: string;
}

function Option({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <Flex
      gap={3}
      p={4}
      border='1px solid'
      borderColor={selected ? 'uspolis.blue' : 'uspolis.border'}
      borderRadius='md'
      cursor='pointer'
      onClick={onSelect}
    >
      <Radio isChecked={selected} colorScheme='blue' mt='3px' />
      <Flex direction='column' gap={2.5} flex={1} minW={0}>
        {children}
      </Flex>
    </Flex>
  );
}

function DeliveryStep({
  delivery,
  onDeliveryChange,
  ttl,
  onTtlChange,
  contactEmail,
}: DeliveryStepProps) {
  return (
    <Flex direction='column' gap={2.5}>
      <Option
        selected={delivery === 'link'}
        onSelect={() => onDeliveryChange('link')}
      >
        <Flex align='center' gap={2} fontWeight='bold' wrap='wrap'>
          <LuLink />
          Link de visualização única
          <Badge
            colorScheme='cyan'
            textTransform='none'
            fontWeight='medium'
            borderRadius='md'
            px={2}
          >
            Recomendado
          </Badge>
        </Flex>
        <Text fontSize='sm' color='uspolis.black' lineHeight={1.45}>
          Gera um link para enviar ao parceiro (por e-mail para {contactEmail}{' '}
          ou copiando). Ele mostra a chave <strong>uma única vez</strong> e
          deixa de funcionar depois de aberto ou quando expirar. Nem você verá a
          chave.
        </Text>
        {delivery === 'link' && (
          <Flex gap={2} wrap='wrap' align='center'>
            <Text fontSize='sm' color='uspolis.textMuted'>
              Expira em:
            </Text>
            {TTLS.map((t) => (
              <Button
                key={t.value}
                size='sm'
                colorScheme='blue'
                variant={ttl === t.value ? 'solid' : 'outline'}
                onClick={(e) => {
                  e.stopPropagation();
                  onTtlChange(t.value);
                }}
              >
                {t.label}
              </Button>
            ))}
          </Flex>
        )}
        {delivery === 'link' && (
          <Text fontSize='13px' color='uspolis.textMuted'>
            Se o link não for aberto até expirar, a chave é revogada
            automaticamente.
          </Text>
        )}
      </Option>
      <Option
        selected={delivery === 'show'}
        onSelect={() => onDeliveryChange('show')}
      >
        <Flex align='center' gap={2} fontWeight='bold'>
          <LuEye />
          Exibir a chave agora
        </Flex>
        <Box fontSize='sm' color='uspolis.black' lineHeight={1.45}>
          A chave aparece uma única vez nesta tela e você a entrega ao parceiro
          pessoalmente ou por outro canal seguro.
        </Box>
      </Option>
    </Flex>
  );
}

export default DeliveryStep;
