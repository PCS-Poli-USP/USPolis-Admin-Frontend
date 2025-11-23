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
import useClasses from '../../../../../hooks/classes/useClasses';
import { useEffect } from 'react';

function ReservationModalFirstStep(props: ReservationModalFirstStepProps) {
  const { watch, resetField } = props.form;
  const { loading, classes, getClassesBySubject } = useClasses(false);

  const reservationType = watch('type');
  const is_solicitation = watch('is_solicitation');
  const subjectId = watch('subject_id');

  useEffect(() => {
    if (reservationType == ReservationType.EXAM && subjectId) {
      getClassesBySubject(subjectId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationType, subjectId]);

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

          <Input
            mt={'10px'}
            label={'Título'}
            name={'title'}
            onFocus={(el) =>
              props.focusMobile.onFocusInput(el, props.container)
            }
            onBlur={() => props.focusMobile.onBlur(props.container)}
          />

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
              props.setDates([]);
              props.setSelectedDays([]);
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
            onFocus={(el) =>
              props.focusMobile.onFocusInput(el, props.container)
            }
            onBlur={() => props.focusMobile.onBlur(props.container)}
          />

          {is_solicitation && (
            <NumberInput
              label='Quantidade de pessoas'
              name='capacity'
              mt={'10px'}
              onFocus={(el) =>
                props.focusMobile.onFocusInput(el, props.container)
              }
              onBlur={() => props.focusMobile.onBlur(props.container)}
            />
          )}

          <TextareaInput
            mt={4}
            label='Motivo (Opcional)'
            name='reason'
            onFocus={(el) =>
              props.focusMobile.onFocusTextArea(el, props.container)
            }
            onBlur={() => props.focusMobile.onBlur(props.container)}
          />
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
                  props.focusMobile.markIgnoreNextBlur()
                  if (!option) {
                    resetField('class_ids');
                  }
                }}
                placeholder='Selecione a disciplina'
                onFocus={(el) =>
                  props.focusMobile.onFocusInput(el, props.container, 600)
                }
                onBlur={() => props.focusMobile.onBlur(props.container)}
              />
              <MultiSelectInput
                name='class_ids'
                label='Turmas'
                placeholder={
                  subjectId
                    ? 'Selecione as turmas'
                    : 'Selecione primeiro a disciplina'
                }
                isLoading={loading}
                options={
                  subjectId
                    ? classes.map((cls) => ({
                        value: cls.id,
                        label: `${cls.subject_code} - T${classNumberFromClassCode(cls.code)}`,
                      }))
                    : []
                }
                onFocus={(el) =>
                  props.focusMobile.onFocusInput(el, props.container, 600)
                }
                onBlur={() => props.focusMobile.onBlur(props.container)}
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
              onFocus={(el) =>
                props.focusMobile.onFocusInput(el, props.container)
              }
              onBlur={() => props.focusMobile.onBlur(props.container)}
            />
          )}

          {reservationType && reservationType !== ReservationType.EXAM && (
            <Input
              label='Link (Opcional)'
              name='link'
              icon={<LinkIcon />}
              mt={'10px'}
              onFocus={(el) =>
                props.focusMobile.onFocusInput(el, props.container)
              }
              onBlur={() => props.focusMobile.onBlur(props.container)}
            />
          )}
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ReservationModalFirstStep;
