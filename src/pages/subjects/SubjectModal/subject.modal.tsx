import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input as ChakraInput,
  IconButton,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import SubjectValidator from 'utils/subjects/subjects.validator';

import { useEffect, useState } from 'react';
import {
  BsFillPenFill,
  BsFillTrashFill,
  BsPersonCheckFill,
} from 'react-icons/bs';
import { SubjectsTypes } from 'utils/enums/subjects.enum';
import { SubjectForm, SubjectModalProps } from './subject.modal.interface';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { defaultValues, schema } from './subject.modal.form';
import { sortProfessors } from 'utils/subjects/subjects.sorter';
import { Input, Select } from 'components/common';
import { CreateSubject } from 'models/http/requests/subject.request.models';
import useSubjects from 'hooks/useSubjetcts';

export default function SubjectModal(props: SubjectModalProps) {
  const form = useForm<SubjectForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const { trigger, getValues, reset, clearErrors } = form;
  const { createSubject, updateSubject } = useSubjects();

  const [professor, setProfessor] = useState<string>('');
  const [hasProfessorError, setHasProfessorError] = useState(false);
  const [professors, setProfessors] = useState<string[]>([]);
  const [isEditingProfessor, setIsEditingProfessor] = useState(false);
  const [editProfessorIndex, setEditProfessorIndex] = useState(0);

  function formatFormData(data: SubjectForm): CreateSubject {
    const formated_data: CreateSubject = { ...data, professors };
    return formated_data;
  }

  useEffect(() => {
    if (props.selectedSubject) {
      reset({ ...props.selectedSubject });
    }
  }, [props.selectedSubject, reset]);

  async function handleSaveClick() {
    const isValid = await trigger();
    if (!isValid) return;

    if (professors.length === 0) return;

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
    setProfessor('');
    setProfessors([]);
    props.onClose();
  }

  const handleProfessorButton = () => {
    if (SubjectValidator.isInvalidProfessor(professor)) {
      setHasProfessorError(true);
      return;
    } else setHasProfessorError(false);

    const names: string[] = [...professors];
    if (!isEditingProfessor) {
      names.push(professor);
    } else {
      names[editProfessorIndex] = professor;
    }
    setProfessors(names.sort(sortProfessors));
    setProfessor('');
    setIsEditingProfessor(false);
  };

  function handleProfessorInputKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === 'Enter') handleProfessorButton();
  }

  function handleEditProfessorButton(index: number) {
    setIsEditingProfessor(true);
    setEditProfessorIndex(index);
    setProfessor(professors[index]);
  }

  function handleDeleteProfessorButton(index: number) {
    const newProfessors = [...professors];
    newProfessors.splice(index, 1);
    setProfessors(newProfessors);
  }

  return (
    <Modal isOpen={props.isOpen} onClose={handleCloseModal} size={'2xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {props.isUpdate
            ? 'Editar informações da disciplina'
            : 'Cadastrar uma disciplina'}
        </ModalHeader>
        <ModalCloseButton />
        <FormProvider {...form}>
          <form>
            <ModalBody pb={6}>
              <VStack spacing={5} alignItems={'flex-start'}>
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
                  value={
                    props.selectedSubject
                      ? props.selectedSubject.type
                      : undefined
                  }
                  options={[
                    { label: 'Semestral', value: SubjectsTypes.BIANNUAL },
                    {
                      label: 'Quadrimestral',
                      value: SubjectsTypes.FOUR_MONTHLY,
                    },
                    { label: 'Outro', value: SubjectsTypes.OTHER },
                  ]}
                />

                <HStack spacing={4} w={'full'}>
                  <Input
                    label={'Créditos Aula'}
                    name={'class_credit'}
                    type={'number'}
                    value={
                      props.selectedSubject
                        ? props.selectedSubject.class_credit
                        : undefined
                    }
                    placeholder='Quantidade de créditos aula'
                  />

                  <Input
                    label={'Créditos Trabalho'}
                    name={'work_credit'}
                    type={'number'}
                    value={
                      props.selectedSubject
                        ? props.selectedSubject.work_credit
                        : undefined
                    }
                    placeholder='Quantidade de créditos trabalho'
                  />
                </HStack>

                <HStack spacing={4} w={'full'}>
                  <Input
                    label={'Ativação'}
                    name={'activation'}
                    placeholder={'Data de ativação'}
                    type={'datetime-local'}
                    value={
                      props.selectedSubject
                        ? props.selectedSubject.activation
                        : undefined
                    }
                  />
                  <Input
                    label={'Desativação (Opcional)'}
                    name={'desactivation'}
                    placeholder={'Data de ativação'}
                    type={'datetime-local'}
                    value={
                      props.selectedSubject
                        ? props.selectedSubject.desactivation
                        : undefined
                    }
                  />
                </HStack>

                <FormControl isInvalid={hasProfessorError}>
                  <FormLabel>Professor</FormLabel>
                  <ChakraInput
                    placeholder='Insira o nome do professor'
                    type='text'
                    value={professor}
                    onChange={(event) => {
                      setProfessor(event.target.value);
                      if (event.target.value) setHasProfessorError(false);
                    }}
                    onKeyDown={handleProfessorInputKeyDown}
                  />
                  {hasProfessorError ? (
                    <FormErrorMessage>
                      Nome de professor inválido, tamanho mínimo de 3 letras.
                    </FormErrorMessage>
                  ) : undefined}
                </FormControl>

                <Button onClick={handleProfessorButton}>
                  {isEditingProfessor
                    ? 'Editar professor'
                    : 'Adicionar professor'}
                </Button>

                <Text as='b' fontSize='lg'>
                  Professores adicionados:
                </Text>
                {professors.length > 0 ? (
                  <List spacing={3}>
                    {professors.map((professor, index) => (
                      <ListItem key={index}>
                        <HStack>
                          <BsPersonCheckFill />
                          <Text>{professor}</Text>

                          <Tooltip label='Editar'>
                            <IconButton
                              colorScheme='yellow'
                              size='sm'
                              variant='ghost'
                              aria-label='editar-professor'
                              icon={<BsFillPenFill />}
                              onClick={() => handleEditProfessorButton(index)}
                            />
                          </Tooltip>

                          <Tooltip label='Remover'>
                            <IconButton
                              colorScheme='red'
                              size='sm'
                              variant='ghost'
                              aria-label='remover-professor'
                              icon={<BsFillTrashFill />}
                              onClick={() => handleDeleteProfessorButton(index)}
                            />
                          </Tooltip>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Alert status='error' fontSize='sm' mb={4}>
                    <AlertIcon />
                    Nenhum professor adicionado
                  </Alert>
                )}
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
