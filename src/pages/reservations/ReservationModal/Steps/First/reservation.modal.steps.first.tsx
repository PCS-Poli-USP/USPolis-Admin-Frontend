import { Alert, AlertIcon, Flex, Text, VStack } from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import {
  Input,
  MultiSelectInput,
  NumberInput,
  SelectInput,
  TextareaInput,
} from '../../../../../components/common';
import { ReservationType } from '../../../../../utils/enums/reservations.enum';
import { ReservationModalFirstStepProps } from './reservation.modal.steps.first.interface';
import { classNumberFromClassCode } from '../../../../../utils/classes/classes.formatter';
import { LinkIcon } from '@chakra-ui/icons';
import { EventType } from '../../../../../utils/enums/eventTypes.enum';
import { secondDefaultValues } from '../Second/reservation.modal.steps.second.form';

function ReservationModalFirstStep(props: ReservationModalFirstStepProps) {
  const { watch, resetField } = props.form;

  const reservationType = watch('type');
  const is_solicitation = watch('is_solicitation');
  const subjectId = watch('subject_id');

  return (
    <VStack w={'full'} align={'stretch'} h={'full'}>
      <FormProvider {...props.form}>
        <form>
          <Text
            fontWeight={'bold'}
            fontSize={'xl'}
            color={'orange'}
            hidden={
              !(
                props.isUpdate &&
                props.selectedReservation &&
                props.selectedReservation.solicitation_id
              )
            }
          >
            A reserva possui uma solicitação vinculada (olhe a aba Solicitações)
          </Text>

          <Input mt={'10px'} label={'Título'} name={'title'} />

          <SelectInput
            mt={4}
            label={'Tipo'}
            name={'type'}
            options={ReservationType.getValues().map((value) => ({
              value: value,
              label: ReservationType.translate(value),
            }))}
            onChange={(option) => {
              if (!option) {
                resetField('subject_id');
                resetField('class_ids');
                resetField('link');
                resetField('event_type');
              }

              props.secondForm.reset({
                ...secondDefaultValues,
                is_solicitation: props.isSolicitation,
                required_classroom: props.isSolicitation ? false : undefined,
                optional_classroom: props.isSolicitation ? false : undefined,
              });

              if (option) {
                props.secondForm.setValue(
                  'type',
                  option.value as ReservationType,
                );
                if (option.value !== ReservationType.EXAM) {
                  resetField('subject_id');
                  resetField('class_ids');
                }
                if (option.value === ReservationType.EXAM) resetField('link');
                if (option.value !== ReservationType.EVENT)
                  resetField('event_type');
              }
            }}
          />

          {is_solicitation && (
            <NumberInput
              label='Quantidade de pessoas'
              name='capacity'
              mt={'10px'}
            />
          )}

          <TextareaInput mt={4} label='Motivo (Opcional)' name='reason' />
          {!reservationType && (
            <Alert status='error' mt={'20px'} borderRadius={'10px'}>
              <AlertIcon />
              Selecione um tipo de reserva
            </Alert>
          )}

          {reservationType && reservationType === ReservationType.EXAM && (
            <Flex direction={'column'} gap={'10px'} mt={4}>
              <SelectInput
                name='subject_id'
                label='Disciplina'
                options={props.subjects.map((subject) => ({
                  value: subject.id,
                  label: `${subject.code} - ${subject.name}`,
                }))}
                onChange={(option) => {
                  if (!option) {
                    resetField('class_ids');
                  }
                }}
                placeholder='Selecione a disciplina'
              />
              <MultiSelectInput
                name='class_ids'
                label='Turmas'
                placeholder={
                  subjectId
                    ? 'Selecione as turmas'
                    : 'Selecione primeiro a disciplina'
                }
                options={
                  subjectId
                    ? props.classes
                        .filter((cls) => cls.subject_id === subjectId)
                        .map((cls) => ({
                          value: cls.id,
                          label: `${cls.subject_code} - T${classNumberFromClassCode(cls.code)}`,
                        }))
                    : []
                }
              />
            </Flex>
          )}

          {reservationType && reservationType === ReservationType.EVENT && (
            <SelectInput
              label='Tipo de Evento'
              name='event_type'
              options={EventType.values().map((value) => ({
                value: value,
                label: EventType.translate(value),
              }))}
              mt={'10px'}
            />
          )}

          {reservationType && reservationType !== ReservationType.EXAM && (
            <Input
              label='Link (Opcional)'
              name='link'
              icon={<LinkIcon />}
              mt={'10px'}
            />
          )}
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ReservationModalFirstStep;
