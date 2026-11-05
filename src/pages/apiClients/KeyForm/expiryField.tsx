import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import { useFormContext } from 'react-hook-form';
import { daysUntil } from '../../../utils/apiKeys/apiKeys.validator';
import {
  dateInputBounds,
  plural,
} from '../../../utils/apiKeys/apiKeys.formatter';

const SHORTCUTS = [30, 90, 180, 365];

interface ExpiryFieldProps {
  shortcutsLabel?: string;
}

function ExpiryField({ shortcutsLabel }: ExpiryFieldProps) {
  const {
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useFormContext<{ expires_on: string }>();
  const date = watch('expires_on');
  const error = errors.expires_on?.message;
  const { min, max } = dateInputBounds();
  const days = date ? daysUntil(date) : null;

  function setDate(value: string) {
    setValue('expires_on', value, {
      shouldDirty: true,
      shouldValidate: isSubmitted,
    });
  }

  const shortcuts = SHORTCUTS.map((n) => {
    const active = days === n;
    return (
      <Button
        key={n}
        size='sm'
        variant={active ? 'solid' : 'outline'}
        colorScheme='blue'
        onClick={() => setDate(moment().add(n, 'days').format('YYYY-MM-DD'))}
      >
        {n} dias
      </Button>
    );
  });

  return (
    <FormControl isRequired isInvalid={!!error}>
      <FormLabel>Validade</FormLabel>
      <Flex gap={2} wrap='wrap' align='center'>
        {!shortcutsLabel && shortcuts}
        <Input
          isRequired={false}
          type='date'
          w='auto'
          value={date}
          min={min}
          max={max}
          onChange={(e) => setDate(e.target.value)}
        />
        {shortcutsLabel && (
          <>
            <Text fontSize='sm' color='uspolis.textMuted'>
              {shortcutsLabel}
            </Text>
            {shortcuts}
          </>
        )}
      </Flex>
      <Text
        fontSize='sm'
        mt={2}
        color={error ? 'red.500' : 'uspolis.textMuted'}
      >
        {error ??
          (days !== null && days > 0
            ? `Expira em ${moment(date).format('DD/MM/YYYY')} 23:59, daqui a ${plural(days, 'dia', 'dias')}. Máximo de 365 dias.`
            : 'Máximo de 365 dias.')}
      </Text>
    </FormControl>
  );
}

export default ExpiryField;
