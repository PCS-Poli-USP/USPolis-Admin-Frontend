import { Text, VStack } from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import { ReservationModalThirdStepProps } from './reservation.modal.steps.third.interface';
import { CheckBox, Select } from 'components/common';
import { useEffect } from 'react';
import useClassroomsSolicitations from 'hooks/useClassroomSolicitations';

function ReservationModalThirdStep(props: ReservationModalThirdStepProps) {
  const has_solicitation = props.form.watch('has_solicitation');
  const { loading, solicitations, getSolicitations } =
    useClassroomsSolicitations(false);
  const { resetField } = props.form;

  useEffect(() => {
    if (has_solicitation) {
      if (!solicitations.length) getSolicitations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [has_solicitation, solicitations]);

  return (
    <VStack w={'full'} align={'strech'} h={'full'}>
      <FormProvider {...props.form}>
        <form>
          <CheckBox
            label='Referente a uma solicitação?'
            name='has_solicitation'
            text='Vincular a uma solicitação'
            mb={'10px'}
            onChange={(value) => {
              if (!value)
                resetField('solicitation_id', { defaultValue: undefined });
            }}
            disabled={
              props.isUpdate &&
              props.selectedReservation &&
              props.selectedReservation.has_solicitation
            }
          />
          <Select
            name='solicitation_id'
            label='Solicitação'
            isLoading={loading}
            placeholder={
              loading ? 'Carregando...' : 'Selecione uma solicitação'
            }
            options={solicitations
              .filter((value) => {
                if (
                  props.selectedReservation &&
                  props.selectedReservation.has_solicitation
                ) {
                  return (
                    !value.closed ||
                    value.id === props.selectedReservation.solicitation_id
                  );
                }
                return !value.closed;
              })
              .map((solicitation) => ({
                value: solicitation.id,
                label: `${solicitation.reservation_title} - ${solicitation.user}`,
              }))}
            disabled={
              props.isUpdate &&
              props.selectedReservation &&
              props.selectedReservation.has_solicitation
            }
          />
          <Text
            hidden={
              !(
                props.isUpdate &&
                props.selectedReservation &&
                props.selectedReservation.has_solicitation
              )
            }
          >
            A reserva já possui uma solicitação vinculada
          </Text>
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ReservationModalThirdStep;
