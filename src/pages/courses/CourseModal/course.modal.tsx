import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { CourseModalProps, CourseForm } from './course.modal.interface';
import { defaultValues, schema } from './course.modal.form';
import { Input, SelectInput } from '../../../components/common';

import useCoursesService from '../../../hooks/API/services/useCoursesService';
import { CoursePeriodType } from '../../../utils/enums/coursePeriodType.enum';

export default function CourseModal(props: CourseModalProps) {
  const form = useForm<CourseForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { trigger, reset, getValues, clearErrors } = form;

  const { create, update } = useCoursesService();

  useEffect(() => {
    if (props.selectedCourse) {
        reset(props.selectedCourse);
    } else {
        reset({
        name: '',
        ideal_duration: undefined,
        minimal_duration: undefined,
        maximal_duration: undefined,
        period: CoursePeriodType.INTEGRAL,
        });
    }
    }, [props.selectedCourse, reset]);

  async function handleSave() {
    const isValid = await trigger();
    if (!isValid) return;

    const values = getValues();

    if (props.isUpdate && props.selectedCourse) {
      await update(props.selectedCourse.id, values);
    } else {
      await create(values);
    }

    props.refetch();
    handleClose();
  }

  function handleClose() {
    reset(defaultValues);
    clearErrors();
    props.onClose();
  }

  return (
    <Modal isOpen={props.isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {props.isUpdate ? 'Editar Curso' : 'Cadastrar Curso'}
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <FormProvider {...form}>
            <Input name="name" label="Nome" />

            <Input name="ideal_duration" label="Duração Ideal" type="number" placeholder="0"/>

            <Input name="minimal_duration" label="Duração Mínima" type="number" placeholder="0" />

            <Input name="maximal_duration" label="Duração Máxima" type="number" placeholder="0" />

            <SelectInput
                name="period"
                label="Período"
                options={[
                    { label: 'Integral', value: CoursePeriodType.INTEGRAL },
                    { label: 'Matutino', value: CoursePeriodType.MORNING },
                    { label: 'Vespertino', value: CoursePeriodType.AFTERNOON},
                    { label: 'Noturno', value: CoursePeriodType.EVENING },
                ]}
                />
          </FormProvider>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} colorScheme="red" onClick={handleClose}>
            Cancelar
          </Button>

          <Button colorScheme="blue" onClick={handleSave}>
            {props.isUpdate ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}