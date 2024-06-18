import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';

import { useEffect } from 'react';
import { SubjectType } from 'utils/enums/subjects.enum';
import { SubjectForm, SubjectModalProps } from './subject.modal.interface';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { defaultValues, schema } from './subject.modal.form';
import { Input, Select } from 'components/common';
import { CreateSubject } from 'models/http/requests/subject.request.models';
import useSubjects from 'hooks/useSubjetcts';
import { MultiSelect } from 'components/common/form/MultiSelect';
import ListInput from 'components/common/form/ListInput';
import { ClassValidator } from 'utils/classes/classes.validator';
import { sortProfessors } from 'utils/subjects/subjects.sorter';
import { SubjectResponse } from 'models/http/responses/subject.response.models';

export default function SubjectModal(props: SubjectModalProps) {
  const form = useForm<SubjectForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const { trigger, getValues, reset, clearErrors } = form;
  const { createSubject, updateSubject } = useSubjects();

  function formatFormData(data: SubjectForm): CreateSubject {
    const formated_data: CreateSubject = { ...data };
    return formated_data;
  }

  function formatSelectedSubject(data: SubjectResponse): SubjectResponse {
    const formated: SubjectResponse = {
      ...data,
      activation: data.activation.substring(0, 10),
      desactivation: data.desactivation
        ? data.desactivation.substring(0, 10)
        : undefined,
    };
    return formated;
  }

  useEffect(() => {
    if (props.selectedSubject) {
      reset({ ...formatSelectedSubject(props.selectedSubject) });
    }
  }, [props.selectedSubject, reset]);

  async function handleSaveClick() {
    const isValid = await trigger();
    if (!isValid) return;
    const values = getValues();
    if (values['desactivation'] === '') values['desactivation'] = undefined;
    if (props.isUpdate && props.selectedSubject) {
      await updateSubject(props.selectedSubject.id, formatFormData(values));
    } else {
      await createSubject(formatFormData(values));
    }
    props.refetch();
    handleCloseModal();
  }

  function handleCloseModal() {
    clearErrors();
    reset(defaultValues);
    props.onClose();
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={handleCloseModal}
      size={'2xl'}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {props.isUpdate
            ? 'Editar Disciplina'
            : 'Cadastrar Disciplina'}
        </ModalHeader>
        <ModalCloseButton />
        <FormProvider {...form}>
          <form>
            <ModalBody pb={6}>
              <VStack
                spacing={5}
                alignItems={'flex-start'}
                align={'stretch'}
                w={'full'}
              >
                <MultiSelect
                  label={'Prédios'}
                  name={'building_ids'}
                  value={
                    props.selectedSubject
                      ? props.selectedSubject.building_ids.map(
                          (val, index) => ({
                            value: val,
                            label: props.selectedSubject?.buildings[index]
                              .name as string,
                          }),
                        )
                      : undefined
                  }
                  options={props.buildings.map((building) => ({
                    value: building.id,
                    label: building.name,
                  }))}
                />
                <Input
                  label={'Código da Disciplina'}
                  name={'code'}
                  type={'text'}
                  disabled={props.isUpdate}
                  placeholder='Código da disciplina'
                />
                <Input
                  label={'Nome da Disciplina'}
                  name={'name'}
                  type={'text'}
                  placeholder='Código da disciplina'
                />

                <Select
                  label={'Tipo de turma'}
                  name={'type'}
                  options={[
                    { label: 'Semestral', value: SubjectType.BIANNUAL },
                    {
                      label: 'Quadrimestral',
                      value: SubjectType.FOUR_MONTHLY,
                    },
                    { label: 'Outro', value: SubjectType.OTHER },
                  ]}
                />

                <HStack spacing={4} w={'full'}>
                  <Input
                    label={'Créditos Aula'}
                    name={'class_credit'}
                    type={'number'}
                    placeholder='Quantidade de créditos aula'
                  />

                  <Input
                    label={'Créditos Trabalho'}
                    name={'work_credit'}
                    type={'number'}
                    placeholder='Quantidade de créditos trabalho'
                  />
                </HStack>

                <HStack spacing={4} w={'full'}>
                  <Input
                    label={'Ativação'}
                    name={'activation'}
                    placeholder={'Data de ativação'}
                    type={'date'}
                  />
                  <Input
                    label={'Desativação (Opcional)'}
                    name={'desactivation'}
                    placeholder={'Data de desativação'}
                    type={'date'}
                  />
                </HStack>

                <ListInput
                  listLabel={'Professores adicionados'}
                  valueErrorMessage={'Professor inválido'}
                  label={'Professores'}
                  name={'professors'}
                  sorter={sortProfessors}
                  isInvalid={ClassValidator.isInvalidProfessor}
                  placeholder={'Digite o nome do professor'}
                  mt={4}
                />
              </VStack>
            </ModalBody>
          </form>
        </FormProvider>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleSaveClick}>
            {props.isUpdate ? 'Salvar' : 'Cadastrar'}
          </Button>
          <Button onClick={handleCloseModal}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
