import { Text, VStack } from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import {
  CheckBox,
  Input,
  Select,
  SelectInput,
  Textarea,
} from 'components/common';
import { ReservationType } from 'utils/enums/reservations.enum';
import { ReservationModalFirstStepProps } from './reservation.modal.steps.first.interface';
import { sortDates } from 'utils/holidays/holidays.sorter';
import moment from 'moment';

function ReservationModalFirstStep(props: ReservationModalFirstStepProps) {
  const has_solicitation = props.form.watch('has_solicitation');
  const { resetField } = props.form;

  return (
    <VStack w={'full'} align={'stretch'}>
      <FormProvider {...props.form}>
        <form>
          <Input
            label={'Título'}
            name={'title'}
            disabled={!!props.vinculatedSolicitation}
          />
          <SelectInput
            mt={4}
            label={'Tipo'}
            name={'type'}
            options={ReservationType.getValues().map((value) => ({
              value: value,
              label: ReservationType.translate(value),
            }))}
            disabled={!!props.vinculatedSolicitation}
          />
          <Textarea
            mt={4}
            label='Motivo (Opcional)'
            name='reason'
            disabled={!!props.vinculatedSolicitation}
          />
          <CheckBox
            mt={'10px'}
            label='Referente a uma solicitação?'
            name='has_solicitation'
            text='Vincular a uma solicitação'
            mb={'10px'}
            onChange={(value) => {
              if (!value) {
                resetField('solicitation_id', { defaultValue: undefined });
                resetField('has_solicitation', { defaultValue: false });
                props.setVinculatedSolicitation(undefined);
              }
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
            isLoading={props.loadingSolicitations}
            placeholder={
              props.loadingSolicitations
                ? 'Carregando...'
                : 'Selecione uma solicitação'
            }
            onChange={(event) => {
              const solicitation_id = event.target.value;
              if (solicitation_id) {
                const solicitation = props.solicitations.find(
                  (value) => value.id === Number(solicitation_id),
                );
                props.setVinculatedSolicitation(solicitation);
                if (solicitation) {
                  props.form.setValue('title', solicitation.reservation_title);
                  props.form.setValue('reason', solicitation.reason);
                  props.form.setValue('type', solicitation.reservation_type);

                  if (solicitation.start_time && solicitation.end_time) {
                    props.secondForm.setValue(
                      'start_time',
                      solicitation.start_time,
                    );
                    props.secondForm.setValue(
                      'end_time',
                      solicitation.end_time,
                    );
                  }
                  props.setDates(solicitation.dates.sort(sortDates));
                  props.setSelectedDays(solicitation.dates);
                  props.secondForm.setValue(
                    'start_date',
                    solicitation.dates[0],
                  );
                  props.secondForm.setValue(
                    'end_date',
                    solicitation.dates[solicitation.dates.length - 1],
                  );
                }
              }
            }}
            options={props.solicitations
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
                label: `${solicitation.reservation_title} - ${solicitation.user} (${solicitation.email})`,
              }))}
            disabled={
              (props.isUpdate &&
                props.selectedReservation &&
                props.selectedReservation.has_solicitation) ||
              (!has_solicitation && !props.isUpdate)
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
          {props.vinculatedSolicitation ? (
            <>
              <Text mt={'5px'}>
                <b>Local:</b> {props.vinculatedSolicitation.building},{' '}
                {props.vinculatedSolicitation.classroom
                  ? props.vinculatedSolicitation.classroom
                  : 'Sala não informada'}
              </Text>
              <Text>
                <b>Horários:</b>{' '}
                {props.vinculatedSolicitation.start_time
                  ? props.vinculatedSolicitation.start_time.substring(0, 5)
                  : 'Não informado'}{' '}
                às{' '}
                {props.vinculatedSolicitation.end_time
                  ? props.vinculatedSolicitation.end_time.substring(0, 5)
                  : 'Não informado'}
              </Text>
              <Text>
                <b>Datas:</b>{' '}
                {props.vinculatedSolicitation.dates
                  ? props.vinculatedSolicitation.dates
                      .map((date) => moment(date).format('DD/MM/YYYY'))
                      .join(', ')
                  : 'Não informado'}
              </Text>
              <Text hidden={props.vinculatedSolicitation === undefined}>
                *O local e os horários da reserva vão depender da solicitação
              </Text>
            </>
          ) : undefined}
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ReservationModalFirstStep;
