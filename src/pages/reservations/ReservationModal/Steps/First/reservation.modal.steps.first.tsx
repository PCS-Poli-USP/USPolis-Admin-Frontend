import { Alert, AlertIcon, Flex, Text, VStack } from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import {
  Input,
  MultiSelectInput,
  SelectInput,
  TextareaInput,
} from '../../../../../components/common';
import { ReservationType } from '../../../../../utils/enums/reservations.enum';
import { ReservationModalFirstStepProps } from './reservation.modal.steps.first.interface';
import { classNumberFromClassCode } from '../../../../../utils/classes/classes.formatter';

function ReservationModalFirstStep(props: ReservationModalFirstStepProps) {
  const { watch, resetField } = props.form;

  const reservationType = watch('type');
  const subjectId = watch('subject_id');

  return (
    <VStack w={'full'} align={'stretch'} h={'full'}>
      <FormProvider {...props.form}>
        <form>
          <Text
            hidden={
              !(
                props.isUpdate &&
                props.selectedReservation &&
                props.selectedReservation.solicitation_id
              )
            }
          >
            A reserva possui uma solicitação vinculada
          </Text>

          <Input mt={'10px'} label={'Título'} name={'title'} />
          <TextareaInput mt={4} label='Motivo (Opcional)' name='reason' />
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
              props.secondForm.reset();
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
          {!reservationType && (
            <Alert status='error' mt={'20px'}>
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
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ReservationModalFirstStep;
