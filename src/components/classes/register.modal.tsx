import {
  Alert,
  AlertIcon,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Text,
  Tooltip,
} from '@chakra-ui/react';

import {
  BsPersonCheckFill,
  BsFillPenFill,
  BsFillTrashFill,
} from 'react-icons/bs';
import { CalendarIcon } from '@chakra-ui/icons';

import { Building } from 'models/building.model';

import Class from 'models/class.model';

import { useEffect, useState } from 'react';
import { weekDaysFormatter } from 'utils/classes/classes.formatter';
import * as validator from 'utils/classes/classes.validator';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData?: Class;
  buildings?: Array<Building>;
  isUpdate?: boolean;
  onSave: (data: Class) => void;
}

export default function RegisterModal(props: RegisterModalProps) {
  const initialForm: Class = {
    class_code: '',
    subject_code: '',
    subject_name: '',
    professors: [],
    start_period: '',
    end_period: '',
    start_time: [],
    end_time: [],
    week_days: [],
    class_type: '',
    vacancies: 0,
    subscribers: 0,
    pendings: 0,
    preferences: {
      building_id: '',
      air_conditioning: false,
      projector: false,
      accessibility: false,
    },
    has_to_be_allocated: true,
    events_ids: [],
  };

  const [form, setForm] = useState(initialForm);
  const [professor, setProfessor] = useState('');
  const [isEditingProfessor, setIsEditingProfessor] = useState(false);
  const [editProfessorIndex, setEditProfessorIndex] = useState(0);
  const [week_day, setWeekDay] = useState('');
  const [start_time, setStartTime] = useState('');
  const [end_time, setEndTime] = useState('');
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editDateIndex, setEditDateIndex] = useState(0);
  const [buildingName, setBuildingName] = useState('');

  // Errors flags for inputs validation:
  const [hasClassCodeError, setHasClassCodeError] = useState(false);
  const [hasSubjectCodeError, setHasSubjectCodeError] = useState(false);
  const [hasSubjectNameError, setHasSubjectNameError] = useState(false);
  const [hasOferingError, setHasOferingError] = useState(false);
  const [hasClassTypeError, setHasClassTypeError] = useState(false);
  const [hasProfessorError, setHasProfessorError] = useState(false);
  const [hasPeriodError, setHasPeriodError] = useState(false);
  const [hasTimeError, setHasTimeError] = useState(false);
  const [hasDayError, setHasDayError] = useState(false);
  const [hasBuildingError, setHasBuildingError] = useState(false);
  const [hasErrors, setHasErros] = useState(false);

  useEffect(() => {
    if (props.formData) setForm(props.formData);
    else setForm(initialForm);
    // eslint-disable-next-line
  }, [props.formData]);

  function handleSaveClick() {
    if (isInvalidForm()) {
      setHasErros(true);
      return;
    } else setHasErros(false);

    props.onSave(form);
    setForm(initialForm);
    clearForm();
    props.onClose();
  }

  function handleCloseModal() {
    setForm(initialForm);
    clearForm();
    props.onClose();
  }

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setWeekDay(event.target.value);
    setHasDayError(false);
  }

  const handleProfessorButton = () => {
    if (validator.isInvalidProfessor(professor)) {
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

  function handleDateButton() {
    if (validator.isInvalidTime(start_time, end_time)) {
      setHasTimeError(true);
    } else setHasTimeError(false);

    if (validator.isEmpty(week_day)) {
      setHasDayError(true);
    } else setHasDayError(false);

    if (
      validator.isInvalidTime(start_time, end_time) ||
      validator.isEmpty(week_day)
    )
      return;

    const newWeekDays = [...form.week_days];
    const newStarTime = [...form.start_time];
    const newEndTime = [...form.end_time];

    if (isEditingDate) {
      newWeekDays[editDateIndex] = week_day;
      newStarTime[editDateIndex] = start_time;
      newEndTime[editDateIndex] = end_time;
    } else {
      newWeekDays.push(week_day);
      newStarTime.push(start_time);
      newEndTime.push(end_time);
    }
    setForm((prev) => ({
      ...prev,
      week_days: newWeekDays,
      start_time: newStarTime,
      end_time: newEndTime,
    }));
    clearDateInputs();
    setIsEditingDate(false);
  }

  function handleEditDateButton(index: number): void {
    setStartTime(form.start_time[index]);
    setEndTime(form.end_time[index]);
    setWeekDay(form.week_days[index]);
    setEditDateIndex(index);
    setIsEditingDate(true);
  }

  function handleDeleteDateButton(index: number): void {
    const newWeekDays = [...form.week_days];
    newWeekDays.splice(index, 1);

    const newStartTime = [...form.start_time];
    newStartTime.splice(index, 1);

    const newEndtime = [...form.end_time];
    newEndtime.splice(index, 1);

    setForm((prev) => ({
      ...prev,
      week_days: newWeekDays,
      start_time: newStartTime,
      end_time: newEndtime,
    }));
  }

  function clearForm() {
    clearProfessorInput();
    clearDateInputs();
    clearBuildingInput();
    clearErrors();
  }

  function clearProfessorInput() {
    setProfessor('');
    setEditProfessorIndex(0);
  }

  function clearDateInputs() {
    setWeekDay('');
    setStartTime('');
    setEndTime('');
    setEditDateIndex(0);
  }

  function clearBuildingInput() {
    setBuildingName('');
  }

  function clearErrors() {
    setHasClassCodeError(false);
    setHasSubjectCodeError(false);
    setHasSubjectNameError(false);
    setHasOferingError(false);
    setHasClassTypeError(false);
    setHasProfessorError(false);
    setHasPeriodError(false);
    setHasTimeError(false);
    setHasDayError(false);
    setHasBuildingError(false);
    setHasErros(false);
  }

  function isInvalidClass(): boolean {
    let hasError = false;
    if (validator.isInvalidClassCode(form.class_code)) {
      setHasClassCodeError(true);
      hasError = true;
    }
    if (validator.isInvalidSubjectCode(form.subject_code)) {
      setHasSubjectCodeError(true);
      hasError = true;
    }
    if (validator.isInvalidSubjectName(form.subject_name)) {
      setHasSubjectNameError(true);
      hasError = true;
    }
    return hasError;
  }

  function isInvalidForm() {
    let hasError = false;
    if (isInvalidClass()) {
      hasError = true;
    }

    if (validator.isInvalidClassType(form.class_type)) {
      setHasClassTypeError(true);
      hasError = true;
    }

    if (validator.isInvalidPeriod(form.start_period, form.end_period)) {
      setHasPeriodError(true);
      hasError = true;
    }

    if (validator.isInvalidProfessorList(form.professors)) {
      hasError = true;
    }

    if (validator.isInvalidTimeList(form.start_time, form.end_time)) {
      hasError = true;
    }

    if (validator.isEmpty(form.preferences.building_id)) {
      setHasBuildingError(true);
      hasError = true;
    }

    return hasError;
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={handleCloseModal}
      closeOnOverlayClick={false}
      motionPreset='slideInBottom'
      size={'3xl'}
      scrollBehavior='outside'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cadastrar uma turma</ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={10}>
          <Text as='b' fontSize='xl'>
            Informações gerais
          </Text>

          <VStack spacing='20px' alignItems='start'>
            <FormControl isInvalid={hasClassCodeError}>
              <FormLabel>Código da turma</FormLabel>
              <Input //Input do tipo number está aceitando um 'e' ou 'E'
                placeholder='Código da turma'
                value={form.class_code}
                errorBorderColor='crimson'
                onChange={(event) => {
                  const charValue = event.target.value.charCodeAt(
                    event.target.value.length - 1,
                  );
                  if (charValue < 48 || charValue > 57) return;
                  setForm((prev) => ({
                    ...prev,
                    class_code: event.target.value,
                  }));
                  if (event.target.value) setHasClassCodeError(false);
                }}
              />
              {hasClassCodeError ? (
                <FormErrorMessage>Código de turma inválido.</FormErrorMessage>
              ) : undefined}
            </FormControl>

            <FormControl isInvalid={hasSubjectCodeError}>
              <FormLabel>Código da disciplina</FormLabel>
              <Input
                placeholder='Código da disciplina'
                value={form.subject_code}
                errorBorderColor='crimson'
                onChange={(event) => {
                  setForm((prev) => ({
                    ...prev,
                    subject_code: event.target.value,
                  }));
                  if (event.target.value) setHasSubjectCodeError(false);
                }}
              />
              {hasSubjectCodeError ? (
                <FormErrorMessage>
                  Código de disciplina inválido.
                </FormErrorMessage>
              ) : undefined}
            </FormControl>

            <FormControl isInvalid={hasSubjectNameError}>
              <FormLabel>Nome da disciplina</FormLabel>
              <Input
                placeholder='Nome da disciplina'
                value={form.subject_name}
                errorBorderColor='crimson'
                onChange={(event) => {
                  setForm((prev) => ({
                    ...prev,
                    subject_name: event.target.value,
                  }));
                  if (event.target.value) setHasSubjectNameError(false);
                }}
              />
              {hasSubjectNameError ? (
                <FormErrorMessage>
                  Nome da disciplina inválido.
                </FormErrorMessage>
              ) : undefined}
            </FormControl>

            <FormControl isInvalid={hasOferingError}>
              <FormLabel>Oferecimento da disciplina</FormLabel>
              <HStack spacing='8px'>
                <FormLabel>Vagas</FormLabel>
                <NumberInput
                  defaultValue={
                    props.isUpdate ? Number(props.formData?.vacancies) : 0
                  }
                  min={0}
                  max={99999}
                  placeholder='Quantidade de vagas da turma'
                  onChange={(valueAsString, valueAsNumber) => {
                    setForm((prev) => ({ ...prev, vacancies: valueAsNumber }));
                    if (valueAsNumber) setHasOferingError(false);
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <FormLabel>Inscritos</FormLabel>
                <NumberInput
                  defaultValue={0}
                  min={0}
                  max={99999}
                  placeholder='Quantidade de alunos inscritos'
                  onChange={(valueAsString, valueAsNumber) => {
                    setForm((prev) => ({
                      ...prev,
                      subscribers: valueAsNumber,
                    }));
                    if (valueAsNumber) setHasOferingError(false);
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <FormLabel>Pendentes</FormLabel>
                <NumberInput
                  defaultValue={0}
                  min={0}
                  max={99999}
                  placeholder='Quantidade de alunos pendentes'
                  onChange={(valueAsString, valueAsNumber) => {
                    setForm((prev) => ({ ...prev, pendings: valueAsNumber }));
                    if (valueAsNumber) setHasOferingError(false);
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </HStack>
              {hasOferingError ? (
                <FormErrorMessage>Oferecimento inválido.</FormErrorMessage>
              ) : undefined}
            </FormControl>

            <FormControl isInvalid={hasClassTypeError}>
              <FormLabel>Tipo de turma</FormLabel>
              <Select
                defaultValue={
                  props.formData ? props.formData.class_type : undefined
                }
                placeholder='Escolha o tipo da turma'
                onChange={(event) => {
                  setForm((prev) => ({
                    ...prev,
                    class_type: event.target.value,
                  }));
                  if (event.target.value) setHasClassTypeError(false);
                }}
              >
                <option value='Prática'>Prática</option>
                <option value='Teórica'>Teórica</option>
              </Select>
              {hasClassTypeError ? (
                <FormErrorMessage>Escolha um tipo de turma.</FormErrorMessage>
              ) : undefined}
            </FormControl>

            <FormControl isInvalid={hasProfessorError}>
              <FormLabel>Professores</FormLabel>
              <Input
                placeholder='Insira os nomes dos professores'
                type='text'
                value={professor}
                onChange={(event) => {
                  setProfessor(event.target.value);
                  if (event.target.value) setHasProfessorError(false);
                }}
                onKeyDown={handleProfessorInputKeyDown}
              />
              {hasProfessorError ? (
                <FormErrorMessage>Nome de professor inválido.</FormErrorMessage>
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
              <Alert status='warning' fontSize='sm' mb={4}>
                <AlertIcon />
                Nenhum professor adicionado
              </Alert>
            )}

            <Text as='b' fontSize='xl'>
              Horários e datas da turma
            </Text>

            <FormControl isInvalid={hasPeriodError}>
              <FormLabel>Período da disciplina</FormLabel>
              <HStack spacing='5px'>
                <FormLabel>Início</FormLabel>
                <Input
                  placeholder='Data de início da disciplina'
                  type='date'
                  value={form.start_period}
                  onChange={(event) => {
                    setForm((prev) => ({
                      ...prev,
                      start_period: event.target.value,
                    }));
                    if (event.target.value) setHasPeriodError(false);
                  }}
                />

                <FormLabel>Fim</FormLabel>
                <Input
                  placeholder='Data de encerramento da disciplina'
                  type='date'
                  value={form.end_period}
                  onChange={(event) => {
                    setForm((prev) => ({
                      ...prev,
                      end_period: event.target.value,
                    }));
                    if (event.target.value) setHasPeriodError(false);
                  }}
                />
              </HStack>
              {hasPeriodError ? (
                <FormErrorMessage>Periodo inválido</FormErrorMessage>
              ) : undefined}
            </FormControl>

            <FormControl isInvalid={hasDayError}>
              <FormLabel>Dia da semana</FormLabel>
              <Select
                placeholder='Escolha o dia da semana'
                value={week_day}
                onChange={handleSelectChange}
              >
                <option value='seg'>Segunda</option>
                <option value='ter'>Terça</option>
                <option value='qua'>Quarta</option>
                <option value='qui'>Quinta</option>
                <option value='sex'>Sexta</option>
                <option value='sab'>Sábado</option>
                <option value='dom'>Domingo</option>
              </Select>
              {hasDayError ? (
                <FormErrorMessage>Selecione um dia</FormErrorMessage>
              ) : undefined}
            </FormControl>

            <FormControl isInvalid={hasTimeError}>
              <FormLabel>Horário da aula</FormLabel>
              <HStack spacing='5px'>
                <FormLabel>Início</FormLabel>
                <Input
                  placeholder='Horario de início da disciplina'
                  type='time'
                  value={start_time}
                  onChange={(event) => {
                    setStartTime(event.target.value);
                    if (event.target.value) setHasTimeError(false);
                  }}
                />
                <FormLabel>Fim</FormLabel>
                <Input
                  placeholder='Horário de encerramento da disciplina'
                  type='time'
                  value={end_time}
                  onChange={(event) => {
                    setEndTime(event.target.value);
                    if (event.target.value) setHasTimeError(false);
                  }}
                />
              </HStack>
              {hasTimeError ? (
                <FormErrorMessage>Horários inválidos.</FormErrorMessage>
              ) : undefined}
            </FormControl>

            <FormControl>
              <Button type='submit' onClick={handleDateButton}>
                {isEditingDate ? 'Editar Horário' : 'Adicionar horário'}
              </Button>
            </FormControl>

            <Text as='b' fontSize='lg'>
              Horários adicionados:
            </Text>
            {form.week_days.length > 0 ? (
              <List spacing={3}>
                {form.week_days.map((week_day, index) => (
                  <HStack key={index}>
                    <CalendarIcon />
                    <Text>
                      {` ${weekDaysFormatter(week_day)}, ${
                        form.start_time[index]
                      } às ${form.end_time[index]}`}{' '}
                    </Text>
                    <Tooltip label='Editar'>
                      <IconButton
                        colorScheme='yellow'
                        size='sm'
                        variant='ghost'
                        aria-label='editar-data'
                        icon={<BsFillPenFill />}
                        onClick={() => handleEditDateButton(index)}
                      />
                    </Tooltip>

                    <Tooltip label='Remover'>
                      <IconButton
                        colorScheme='red'
                        size='sm'
                        variant='ghost'
                        aria-label='remover-data'
                        icon={<BsFillTrashFill />}
                        onClick={() => handleDeleteDateButton(index)}
                      />
                    </Tooltip>
                  </HStack>
                ))}
              </List>
            ) : (
              <Alert status='error' fontSize='sm' mb={4}>
                <AlertIcon />
                Nenhum horário adicionado
              </Alert>
            )}

            <Text as='b' fontSize='xl'>
              Preferências
            </Text>

            <FormControl isInvalid={hasBuildingError}>
              <FormLabel>Prédio</FormLabel>
              <Select
                defaultValue={
                  props.formData
                    ? props.formData.preferences.building_id
                    : undefined
                }
                placeholder='Escolha o prédio da turma'
                value={buildingName}
                onChange={(event) => {
                  setForm((prev) => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      building_id: event.target.value,
                    },
                  }));
                  setBuildingName(event.target.value);
                  if (event.target.value) setHasBuildingError(false);
                }}
              >
                {props.buildings?.map((it, index) => (
                  <option key={index} value={it.id}>
                    {it.name}
                  </option>
                ))}
              </Select>
              {hasBuildingError ? (
                <FormErrorMessage>Escolha um prédio.</FormErrorMessage>
              ) : undefined}
            </FormControl>

            <FormControl mt={4}>
              <HStack>
                <Checkbox
                  isChecked={form.preferences.accessibility}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        accessibility: event.target.checked,
                      },
                    }))
                  }
                >
                  Acessibilidade
                </Checkbox>
                <Checkbox
                  isChecked={form.preferences.air_conditioning}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        air_conditioning: event.target.checked,
                      },
                    }))
                  }
                >
                  Ar Condicionado
                </Checkbox>
                <Checkbox
                  isChecked={form.preferences.projector}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        projector: event.target.checked,
                      },
                    }))
                  }
                >
                  Projetor
                </Checkbox>
              </HStack>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <VStack width={'full'}>
            {hasErrors ? (
              <Alert status='error' fontSize='sm'>
                <AlertIcon />
                Fomulário inválido, corrija os campos inválidos
              </Alert>
            ) : undefined}
            <HStack spacing='10px' alignSelf={'flex-end'}>
              <Button colorScheme='blue' mr={3} onClick={handleSaveClick}>
                Salvar
              </Button>
              <Button onClick={handleCloseModal}>Cancelar</Button>
            </HStack>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
