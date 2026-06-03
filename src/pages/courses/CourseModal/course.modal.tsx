import {
  Button,
  FormControl,
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
import useCustomToast from '../../../hooks/useCustomToast';

export default function CourseModal(props: CourseModalProps) {
  const form = useForm<CourseForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { trigger, reset, getValues, clearErrors } = form;

  const { create, update } = useCoursesService();

  const showToast = useCustomToast();

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

    const values = {
      ...getValues(),
      name: getValues().name.trim(),
    };

    try {
      if (props.isUpdate && props.selectedCourse) {
        await update(props.selectedCourse.id, values);

        showToast(
          'Curso atualizado',
          'O curso foi atualizado com sucesso.',
          'success',
        );
      } else {
        await create(values);

        showToast(
          'Curso criado',
          'O curso foi criado com sucesso.',
          'success',
        );
      }

      props.refetch();

      handleClose();
    } catch (error) {
      console.error('Erro ao salvar curso:', error);

      const err = error as any;

      showToast(
        'Erro',
        err?.response?.data?.detail ??
          (
            props.isUpdate
              ? 'Não foi possível atualizar o curso.'
              : 'Não foi possível criar o curso.'
          ),
        'error',
      );
    }
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
          {props.isUpdate
            ? 'Editar Curso'
            : 'Cadastrar Curso'}
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <FormProvider {...form}>
            <FormControl mb={3}> 
            <Input
              name='name'
              label='Nome'
              placeholder='Ex: Engenharia Ambiental'
            />
            </FormControl>

            <FormControl mb={3}> 
            <Input
              name='ideal_duration'
              label='Duração Ideal (em semestres)'
              type='number'
              placeholder='0'
            />
            </FormControl>
            

            <FormControl mb={3}> 
            <Input
              name='minimal_duration'
              label='Duração Mínima (em semestres)'
              type='number'
              placeholder='0'
            />
            </FormControl>

            <FormControl mb={3}> 
            <Input
              name='maximal_duration'
              label='Duração Máxima (em semestres)'
              type='number'
              placeholder='0'
            />
            </FormControl>

            <FormControl mb={3}> 
            <SelectInput
              name='period'
              label='Período'
              options={[
                {
                  label: 'Integral',
                  value:
                    CoursePeriodType.INTEGRAL,
                },
                {
                  label: 'Matutino',
                  value:
                    CoursePeriodType.MORNING,
                },
                {
                  label: 'Vespertino',
                  value:
                    CoursePeriodType.AFTERNOON,
                },
                {
                  label: 'Noturno',
                  value:
                    CoursePeriodType.EVENING,
                },
              ]}
            />
            </FormControl>
          </FormProvider>
        </ModalBody>

        <ModalFooter>
          <Button
            mr={3}
            colorScheme='red'
            onClick={handleClose}
          >
            Cancelar
          </Button>

          <Button
            colorScheme='blue'
            onClick={handleSave}
          >
            {props.isUpdate
              ? 'Atualizar'
              : 'Cadastrar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}