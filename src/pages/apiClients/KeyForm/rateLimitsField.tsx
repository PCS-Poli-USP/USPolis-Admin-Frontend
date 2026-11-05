import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Select,
  Switch,
  Text,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { useFormContext } from 'react-hook-form';
import { RateLimitResponse } from '../../../models/http/responses/apiKey.response.models';
import {
  RATE_LIMIT_WINDOWS,
  formatNumber,
  windowLabel,
} from '../../../utils/apiKeys/apiKeys.formatter';
import { KeyLimitsForm } from './keyForm.interface';

interface RateLimitsFieldProps {
  defaults: RateLimitResponse[];
  defaultsInline?: boolean;
}

function RateLimitsField({ defaults, defaultsInline }: RateLimitsFieldProps) {
  const {
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useFormContext<KeyLimitsForm>();
  const useDefault = watch('use_default_limits');
  const rules = watch('rate_limits') ?? [];
  const error =
    errors.rate_limits?.message ?? errors.rate_limits?.root?.message;

  function setRules(value: KeyLimitsForm['rate_limits']) {
    setValue('rate_limits', value, {
      shouldDirty: true,
      shouldValidate: isSubmitted,
    });
  }

  function addRule() {
    const used = rules.map((r) => r.window_seconds);
    const free = RATE_LIMIT_WINDOWS.find((w) => !used.includes(w.value));
    setRules([
      ...rules,
      { max_requests: 100, window_seconds: free ? free.value : 60 },
    ]);
  }

  return (
    <Flex direction='column' gap={3}>
      <FormControl display='flex' alignItems='center' gap={3}>
        <Switch
          id='use_default_limits'
          colorScheme='blue'
          isChecked={useDefault}
          onChange={(e) =>
            setValue('use_default_limits', e.target.checked, {
              shouldDirty: true,
              shouldValidate: isSubmitted,
            })
          }
        />
        <FormLabel htmlFor='use_default_limits' mb={0}>
          Usar limites padrão
        </FormLabel>
      </FormControl>

      {useDefault ? (
        <Flex
          direction={defaultsInline ? 'row' : 'column'}
          wrap='wrap'
          gap={defaultsInline ? '6px 20px' : '6px'}
          p='12px 16px'
          bg='uspolis.surfaceSubtle'
          borderRadius='md'
        >
          {defaults.map((d) => (
            <Text key={d.window_seconds}>
              <strong>{formatNumber(d.max_requests)}</strong> requisições{' '}
              {windowLabel(d.window_seconds)}
            </Text>
          ))}
        </Flex>
      ) : (
        <Flex direction='column' gap={2}>
          {rules.map((rule, i) => (
            <Flex key={i} align='center' gap={2} wrap='wrap'>
              <Input
                type='number'
                min={1}
                w='120px'
                value={Number.isNaN(rule.max_requests) ? '' : rule.max_requests}
                onChange={(e) =>
                  setRules(
                    rules.map((r, j) =>
                      j === i
                        ? { ...r, max_requests: e.target.valueAsNumber }
                        : r,
                    ),
                  )
                }
              />
              <Text>requisições</Text>
              <Select
                w='auto'
                value={rule.window_seconds}
                onChange={(e) =>
                  setRules(
                    rules.map((r, j) =>
                      j === i
                        ? { ...r, window_seconds: Number(e.target.value) }
                        : r,
                    ),
                  )
                }
              >
                {RATE_LIMIT_WINDOWS.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label}
                  </option>
                ))}
              </Select>
              <IconButton
                aria-label='Remover regra'
                title='Remover regra'
                size='sm'
                variant='ghost'
                colorScheme='red'
                icon={<CloseIcon boxSize={2.5} />}
                onClick={() => setRules(rules.filter((_, j) => j !== i))}
              />
            </Flex>
          ))}
          <Box>
            <Button
              size='sm'
              variant='outline'
              borderStyle='dashed'
              colorScheme='blue'
              leftIcon={<AddIcon boxSize={2.5} />}
              onClick={addRule}
            >
              Adicionar regra
            </Button>
          </Box>
          {error && (
            <Text color='red.500' fontSize='sm'>
              {error}
            </Text>
          )}
        </Flex>
      )}
      <Text fontSize='sm' color='uspolis.textMuted'>
        Todas as regras valem ao mesmo tempo: a requisição é bloqueada quando
        qualquer uma for excedida. Cada janela pode aparecer uma única vez.
      </Text>
    </Flex>
  );
}

export default RateLimitsField;
