import { VStack } from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import { Input, SelectInput, Textarea } from 'components/common';
import { ReservationType } from 'utils/enums/reservations.enum';
import { ReservationModalFirstStepProps } from './reservation.modal.steps.first.interface';

function ReservationModalFirstStep(props: ReservationModalFirstStepProps) {
  return (
    <VStack w={'full'} align={'stretch'}>
      <FormProvider {...props.form}>
        <form>
          <Input label={'Título'} name={'title'} />
          <SelectInput
            mt={4}
            label={'Tipo'}
            name={'type'}
            options={ReservationType.getValues().map((value) => ({
              value: value,
              label: ReservationType.translate(value),
            }))}
          />
          <Textarea mt={4} label='Motivo (Opcional)' name='reason' />
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ReservationModalFirstStep;
