import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  HStack,
  Input,
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
  List,
} from '@chakra-ui/react';

import { BsPersonCheckFill } from 'react-icons/bs';
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
      building: '',
      air_conditioning: false,
      projector: false,
      accessibility: false,
    },
    has_to_be_allocated: true,
  };

  const [form, setForm] = useState(initialForm);
  const [professor, setProfessor] = useState("");
  const [week_day, setWeekDay] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");

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
    }
    else setHasErros(false);

    props.onSave(form);
    setForm(initialForm);
    props.onClose();
  }

  function handleCloseModal() {
    setForm(initialForm);
    props.onClose();
  }

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setWeekDay(event.target.value);
    setHasDayError(false);
  }

  function handleProfessorButton() {
    if (validator.isInvalidProfessor(professor)) {
      setHasProfessorError(true);
      return;
    }
    else setHasProfessorError(false);
    const names: string[] = [...form.professors];
    names.push(professor);
    setForm((prev) => ({...prev, professors: names}));
    setProfessor('');
  }

  function handleProfessorInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') handleProfessorButton();
  }

  function handleDateButton() {
    if (validator.isInvalidTime(start_time, end_time)) {
      setHasTimeError(true);
    }
    else setHasTimeError(false);

    if (validator.isEmpty(week_day)) {
      setHasDayError(true);
    }
    else setHasDayError(false);

    if (validator.isInvalidTime(start_time, end_time) || validator.isEmpty(week_day)) return;

    setForm((prev) => (
      {
        ...prev, 
        week_days: [...prev.week_days, week_day],
        start_time: [...prev.start_time, start_time],
        end_time: [...prev.end_time, end_time],
      }));
    clearInputs();
  }

  function clearInputs() {
    setWeekDay("");
    setStartTime("");
    setEndTime("");
  }

  function isInvalidClass(): boolean {
    if (validator.isInvalidClassCode(form.class_code)) {
      setHasClassCodeError(true);
    }
    if (validator.isInvalidSubjectCode(form.subject_code)) {
      setHasSubjectCodeError(true);
    }
    if (validator.isInvalidSubjectName(form.subject_name)) {
      setHasSubjectNameError(true);
    }
    return hasClassCodeError || hasSubjectNameError || hasSubjectCodeError;
  }

  function isInvalidForm() {
    let hasError = false;
    if (isInvalidClass()) {
      hasError = true;
    }

    if (validator.isInvalidOfering(form.pendings, form.subscribers)) {
      setHasOferingError(true);
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

    if (validator.isEmpty(form.preferences.building)) {
      setHasBuildingError(true);
      hasError = true;
    }

    if (validator.isInvalidProfessorList(form.professors)) {
      hasError = true;
    }

    if (validator.isInvalidTimeList(form.start_time, form.end_time)) {
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
          <Text as='b' fontSize='xl'>Informações gerais</Text>

          <VStack spacing='20px' alignItems='start'>

            <FormControl isInvalid={hasClassCodeError}>
              <FormLabel>Código da turma</FormLabel>
              <Input
                type='number'
                placeholder='Código da turma'
                value={form.class_code}
                errorBorderColor='crimson'
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, class_code: event.target.value }));
                  if (event.target.value) setHasClassCodeError(false);
                }}
              />
              {hasClassCodeError ? (<FormErrorMessage>Código de turma inválido.</FormErrorMessage>) : (undefined)}
            </FormControl>

            <FormControl isInvalid={hasSubjectCodeError}>
              <FormLabel>Código da disciplina</FormLabel>
              <Input
                placeholder='Código da disciplina'
                value={form.subject_code}
                errorBorderColor='crimson'
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, subject_code: event.target.value }));
                  if (event.target.value) setHasSubjectCodeError(false);
                }}
              />
              {hasSubjectCodeError ? (<FormErrorMessage>Código de disciplina inválido.</FormErrorMessage>) : (undefined)}
            </FormControl>
            
            <FormControl isInvalid={hasSubjectNameError}>
              <FormLabel>Nome da disciplina</FormLabel>
              <Input
                placeholder='Nome da disciplina'
                value={form.subject_name}
                errorBorderColor='crimson'
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, subject_name: event.target.value }));
                  if (event.target.value) setHasSubjectNameError(false);
                }}
              />
              {hasSubjectNameError ? (<FormErrorMessage>Nome da disciplina inválido.</FormErrorMessage>) : (undefined)}
            </FormControl>

            <FormControl isInvalid={hasOferingError}>
              <FormLabel>Oferecimento da disciplina</FormLabel>
              <HStack spacing='8px' >
              <FormLabel>Vagas</FormLabel>
                <NumberInput 
                  defaultValue={props.isUpdate? Number(props.formData?.vacancies) : 0} 
                  min={0} 
                  max={99999} 
                  placeholder='Quantidade de vagas da turma'
                  onChange={(valueAsString, valueAsNumber) => setForm((prev) => ({...prev, vacancies: valueAsNumber }))}>
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
                      setForm((prev) => ({...prev, subscribers: valueAsNumber }));
                      if(valueAsNumber) setHasOferingError(false);
                    }}>
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
                      setForm((prev) => ({...prev, pendings: valueAsNumber }));
                      if(valueAsNumber) setHasOferingError(false);
                    }}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </HStack>
              {hasOferingError ? (<FormErrorMessage>Oferecimento inválido.</FormErrorMessage>) : (undefined)}
            </FormControl>
            
            <FormControl isInvalid={hasClassTypeError}>
              <FormLabel>Tipo de turma</FormLabel>
              <Select 
                defaultValue={props.formData? props.formData.class_type : undefined}
                placeholder='Escolha o tipo da turma'
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, class_type: event.target.value }));
                  if (event.target.value) setHasClassTypeError(false);
                }}
                >
                <option value='Prática'>Prática</option>
                <option value='Teórica'>Teórica</option>
              </Select>
              {hasClassTypeError ? (<FormErrorMessage>Escolha um tipo de turma.</FormErrorMessage>) : (undefined)}
            </FormControl>

            <FormControl isInvalid={hasProfessorError} >
              <FormLabel>Professores</FormLabel>
                <Input
                  placeholder='Insira os nomes dos professores'
                  type='text'
                  value={professor}
                  onChange={(event) => {
                    setProfessor(event.target.value);
                    if (!professor) setHasProfessorError(false);
                  }}
                  onKeyDown={handleProfessorInputKeyDown}
                />
              {hasProfessorError ? (<FormErrorMessage>Nome de professor inválido.</FormErrorMessage>) : (undefined)}
            </FormControl>

            <Button onClick={handleProfessorButton}>Adicionar professor</Button>

            <Text as='b' fontSize='lg'>Professores adicionados:</Text>
            {form.professors.length > 0 ? (
              <List spacing={3}>
              {form.professors.map((professor, index) => (
                <HStack key={index}>
                  <BsPersonCheckFill />
                  <Text>{professor}</Text>
                  <Button  
                    colorScheme='red' 
                    size='xs' 
                    variant='ghost' 
                    onClick={() => {
                      const newProfessors = form.professors;
                      newProfessors.splice(index, 1);
                      setForm((prev) => ({...prev, professors: newProfessors}));
                    }}
                  >
                    Remover
                  </Button>
                </HStack>
              ))}
            </List>
            ) : (
              <Text as='b' colorScheme='red' color='red.500'>Nenhum professor adicionado</Text>
            )}

            <Text as='b' fontSize='xl'>Horários e datas da turma</Text>
            
            <FormControl isInvalid={hasPeriodError} >
              <FormLabel>Período da disciplina</FormLabel>
              <HStack spacing='5px'>
                <FormLabel>Início</FormLabel>
                <Input
                  placeholder='Data de início da disciplina'
                  type="date"
                  value={form.start_period}
                  onChange={(event) => {
                    setForm((prev) => ({ ...prev, start_period: event.target.value }));
                    if (event.target.value) setHasPeriodError(false);
                  }}
                />
                <FormLabel>Fim</FormLabel>
                <Input
                  placeholder='Data de encerramento da disciplina'
                  type="date"
                  value={form.end_period}
                  onChange={(event) => {
                    setForm((prev) => ({ ...prev, end_period: event.target.value }));
                    if (event.target.value) setHasPeriodError(false);
                  }}
                />
              </HStack>
              {hasPeriodError ? (<FormErrorMessage>Periodo inválido</FormErrorMessage>) : (undefined)}
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
              {hasDayError ? (<FormErrorMessage>Selecione um dia</FormErrorMessage>) : (undefined)}
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
                    if (!(validator.isEmpty(end_time))) setHasTimeError(false);
                  }}
                />
                <FormLabel>Fim</FormLabel>
                <Input
                  placeholder='Horário de encerramento da disciplina'
                  type='time'
                  value={end_time}
                  onChange={(event) => {
                    setEndTime(event.target.value);
                    if (!(validator.isEmpty(start_time))) setHasTimeError(false);
                  }}
                />
              </HStack>
              {hasTimeError ? <FormErrorMessage>Horários inválidos.</FormErrorMessage> : (undefined)}
            </FormControl>
            
            <FormControl>
              <Button type='submit' onClick={handleDateButton}>Adicionar horário</Button>
            </FormControl>

            <Text as='b' fontSize='lg'>Horários adicionados:</Text>
            {form.week_days.length > 0 ? (
              <List spacing={3}>
                {form.week_days.map((week_day, index) => (
                  <HStack key={index}>
                    <CalendarIcon /> 
                    <Text>{` ${weekDaysFormatter(week_day)}, ${form.start_time[index]} às ${form.end_time[index]}`} </Text>
                    <Button  
                      colorScheme='red' 
                      size='xs' 
                      variant='ghost' 
                      onClick={() => {
                        const newWeekDays = form.week_days;
                        newWeekDays.splice(index, 1);
                        setForm((prev) => ({...prev, week_days: newWeekDays}));
                      }}
                    >
                      Remover
                    </Button>
                  </HStack>
                ))}
              </List>
            ) : (
              <Text as='b' colorScheme='red' color='red.500'>Nenhum horário adicionado</Text>
            )}

            <Text as='b' fontSize='xl'>Preferências</Text>

            <FormControl isInvalid={hasBuildingError}>
              <FormLabel>Prédio</FormLabel>
              <Select
                defaultValue={props.formData? props.formData.preferences.building : undefined}
                placeholder='Escolha o prédio da turma'
                value={form.preferences.building}
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, preferences: {...prev.preferences, building: event.target.value} }));
                  if (event.target.value) setHasBuildingError(false);
                }}
              >
                {props.buildings?.map((it) => (
                  <option key={it.name} value={it.name}>
                    {it.name}
                  </option>
                ))}
              </Select>
              {hasBuildingError? <FormErrorMessage>Escolha um prédio.</FormErrorMessage> : (undefined)}
            </FormControl>

            <FormControl mt={4}>
              <HStack>
                <Checkbox
                  isChecked={form.preferences.accessibility}
                  onChange={(event) => setForm((prev) => (
                    {...prev, preferences: {...prev.preferences, accessibility: event.target.checked }}))}
                >
                  Acessibilidade
                </Checkbox>
                <Checkbox
                  isChecked={form.preferences.air_conditioning}
                  onChange={(event) => setForm((prev) => (
                    {...prev, preferences: {...prev.preferences, air_conditioning: event.target.checked }}))}
                >
                  Ar Condicionado
                </Checkbox>
                <Checkbox
                  isChecked={form.preferences.projector}
                  onChange={(event) => setForm((prev) => (
                    {...prev, preferences: {...prev.preferences, projector: event.target.checked }}))}
                >
                  Projetor
                </Checkbox>
              </HStack>
            </FormControl>

          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing='10px'>
            {hasErrors ? <Text colorScheme='red' color='red.900'>Fomulário inválido, corrija os campos inválidos</Text> : (undefined) }
            <Button colorScheme='blue' mr={3} onClick={handleSaveClick}>
              Salvar
            </Button>
            <Button onClick={handleCloseModal}>Cancelar</Button>
          </HStack>
        </ModalFooter>

      </ModalContent>
    </Modal>
  );
}