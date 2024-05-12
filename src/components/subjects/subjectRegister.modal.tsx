import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { CreateSubject, UpdateSubject } from 'models/database/subject.models';
import SubjectValidator from 'utils/subjects/subjects.validator';

import { useEffect, useState } from 'react';
import {
  BsFillPenFill,
  BsFillTrashFill,
  BsPersonCheckFill,
} from 'react-icons/bs';

interface SubjectRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData?: CreateSubject | UpdateSubject;
  isUpdate?: boolean;
  onSave: (data: CreateSubject) => void;
}

export default function SubjectRegisterModal(props: SubjectRegisterModalProps) {
  const initialForm: CreateSubject | UpdateSubject = {
    code: '',
    name: '',
    professors: [],
    type: '',
    class_credit: 0,
    work_credit: 0,
    activation: '',
  };

  // Form data
  const [form, setForm] = useState(initialForm);
  const [professor, setProfessor] = useState<string>('');
  const [isEditingProfessor, setIsEditingProfessor] = useState(false);
  const [editProfessorIndex, setEditProfessorIndex] = useState(0);

  // Errors flags for inputs validation:
  const [hasSubjectCodeError, setHasSubjectCodeError] = useState(false);
  const [hasSubjectNameError, setHasSubjectNameError] = useState(false);
  const [hasSubjectCreditError, setHasSubjectCreditError] = useState(false);
  const [hasSubjectTypeError, setHasSubjectTypeError] = useState(false);
  const [hasProfessorError, setHasProfessorError] = useState(false);
  const [hasActivationError, setHasActivationError] = useState(false);

  useEffect(() => {
    if (props.formData) {
      props.formData.activation = props.formData.activation.substring(0, 19); // Remove Fuso horário
      setForm(props.formData);
    }
  }, [props.formData]);

  function handleSaveClick() {
    if (isInvalidForm()) return;
   
    props.onSave(form);
    setForm(initialForm);
    clearForm();
    props.onClose();
  }

  function handleCloseModal() {
    clearForm();
    props.onClose();
  }

  const handleProfessorButton = () => {
    if (SubjectValidator.isInvalidProfessor(professor)) {
      setHasProfessorError(true);
      return;
    } else setHasProfessorError(false);

    const names: string[] = [...form.professors];
    if (!isEditingProfessor) {
      names.push(professor);
    } else {
      names[editProfessorIndex] = professor;
    }
    setForm((prev) => ({ ...prev, professors: names }));
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
    setProfessor(form.professors[index]);
  }

  function handleDeleteProfessorButton(index: number) {
    const newProfessors = form.professors;
    newProfessors.splice(index, 1);
    setForm((prev) => ({ ...prev, professors: newProfessors }));
  }

  function isInvalidForm() {
    let hasError = false;

    if (SubjectValidator.isInvalidCode(form.code)) {
      setHasSubjectCodeError(true);
      hasError = true;
    }

    if (SubjectValidator.isInvalidName(form.name)) {
      setHasSubjectNameError(true);
      hasError = true;
    }

    if (SubjectValidator.isInvalidType(form.type)) {
      setHasSubjectTypeError(true);
      hasError = true;
    }

    if (SubjectValidator.isInvalidCredit(form.class_credit, form.work_credit)) {
      console.log('Aqui');
      setHasSubjectCreditError(true);
      hasError = true;
    }

    if (SubjectValidator.isInvalidDate(form.activation)) {
      setHasActivationError(true);
      hasError = true;
    }

    if (SubjectValidator.isInvalidProfessorList(form.professors)) {
      hasError = true;
    }

    return hasError;
  }

  function clearForm() {
    clearProfessorInput();
    clearErrors();
  }

  function clearProfessorInput() {
    setProfessor('');
    setEditProfessorIndex(0);
  }

  function clearErrors() {
    setHasSubjectCodeError(false);
    setHasSubjectNameError(false);
    setHasSubjectCreditError(false);
    setHasSubjectTypeError(false);
    setHasProfessorError(false);
    setHasActivationError(false);
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
        <ModalBody pb={6}>
          <VStack spacing={5} alignItems={'flex-start'}>
            <FormControl isInvalid={hasSubjectCodeError}>
              <FormLabel>Código da Disciplina</FormLabel>
              <Input
                disabled={props.isUpdate}
                placeholder='Código da disciplina'
                value={form.code}
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, code: event.target.value }));
                  setHasSubjectCodeError(false);
                }}
              />
              {hasSubjectCodeError ? (
                <FormErrorMessage>
                  Código de disciplina deve conter 7 caracteres
                </FormErrorMessage>
              ) : undefined}
            </FormControl>

            <FormControl isInvalid={hasSubjectNameError}>
              <FormLabel>Nome da Disciplina</FormLabel>
              <Input
                placeholder='Nome da disciplina'
                value={form.name}
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, name: event.target.value }));
                  setHasSubjectNameError(false);
                }}
              />
              {hasSubjectNameError ? (
                <FormErrorMessage>
                  Nome da disciplina não pode estar vazio
                </FormErrorMessage>
              ) : undefined}
            </FormControl>

            <FormControl isInvalid={hasSubjectTypeError}>
              <FormLabel>Tipo de turma</FormLabel>
              <Select
                defaultValue={props.formData ? props.formData.type : undefined}
                placeholder='Escolha o tipo da disciplina'
                onChange={(event) => {
                  setForm((prev) => ({
                    ...prev,
                    type: event.target.value,
                  }));
                  if (event.target.value) setHasSubjectTypeError(false);
                }}
              >
                <option value='biannual'>Semestral</option>
                <option value='four_monthly'>Quadrimestral</option>
                <option value='other'>Outro</option>
              </Select>
              {hasSubjectTypeError ? (
                <FormErrorMessage>
                  Escolha um tipo de disciplina
                </FormErrorMessage>
              ) : undefined}
            </FormControl>

            <FormControl isInvalid={hasSubjectCreditError}>
              <HStack spacing={4}>
                <FormLabel>Créditos Aula</FormLabel>
                <NumberInput
                  defaultValue={
                    props.formData?.class_credit
                      ? props.formData?.class_credit
                      : 0
                  }
                  min={0}
                  max={99999}
                  placeholder='Quantidade de créditos aula'
                  onChange={(valueAsString, valueAsNumber) => {
                    setForm((prev) => ({
                      ...prev,
                      class_credit: valueAsNumber,
                    }));
                    if (valueAsNumber) setHasSubjectCreditError(false);
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <FormLabel>Créditos Trabalho</FormLabel>
                <NumberInput
                  defaultValue={0}
                  min={0}
                  max={99999}
                  placeholder='Quantidade de créditos trabalho'
                  onChange={(valueAsString, valueAsNumber) => {
                    setForm((prev) => ({
                      ...prev,
                      work_credit: valueAsNumber,
                    }));
                    if (valueAsNumber) setHasSubjectCreditError(false);
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </HStack>
              {hasSubjectCreditError ? (
                <FormErrorMessage>Créditos inválidos</FormErrorMessage>
              ) : undefined}
            </FormControl>

            <FormControl isInvalid={hasActivationError}>
              <HStack spacing={4} w={'full'}>
                <FormLabel>Ativação</FormLabel>
                <Input
                  placeholder={'Data de ativação'}
                  type={'datetime-local'}
                  value={form.activation ? form.activation : undefined}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      activation: event.target.value,
                    }))
                  }
                />
                <FormLabel>Desativação</FormLabel>
                <Input
                  placeholder={'Data de desativação'}
                  type={'datetime-local'}
                  value={form.desactivation ? form.desactivation : undefined}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      desactivation: event.target.value,
                    }))
                  }
                />
              </HStack>
              {hasSubjectCreditError ? (
                <FormErrorMessage>
                  Data de ativação obrigatória
                </FormErrorMessage>
              ) : undefined}
            </FormControl>

            <FormControl isInvalid={hasProfessorError}>
              <FormLabel>Professor</FormLabel>
              <Input
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
              {isEditingProfessor ? 'Editar professor' : 'Adicionar professor'}
            </Button>

            <Text as='b' fontSize='lg'>
              Professores adicionados:
            </Text>
            {form.professors.length > 0 ? (
              <List spacing={3}>
                {form.professors.map((professor, index) => (
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

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleSaveClick}>
            {props.isUpdate ? 'Salvar' : 'Cadastrar'}
          </Button>
          <Button onClick={props.onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
