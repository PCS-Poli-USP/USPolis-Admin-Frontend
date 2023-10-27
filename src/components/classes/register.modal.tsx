import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  FormHelperText,
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
  ListItem,
  ListIcon,
} from '@chakra-ui/react';

import { BsPersonCheckFill } from 'react-icons/bs';
import { CalendarIcon } from '@chakra-ui/icons';

import { Building } from 'models/building.model';

import Class from 'models/class.model';

import { useEffect, useState } from 'react';
import { weekDaysFormatter } from 'utils/classes.utils';

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

  // Errors flags for inputs:
  const [hasTimeError, setHasTimeError] = useState(false);
  const [hasDayError, setHasDayError] = useState(false);

  useEffect(() => {
    if (props.formData) setForm(props.formData);
    else setForm(initialForm);
    // eslint-disable-next-line
  }, [props.formData]);

  function handleSaveClick() {
    if (!validadeInputs()) return;
    if (isEmpty(form.subject_code)) return;
    if (isEmpty(form.subject_name)) return;
    if (isInvalidEndPeriod(form.end_period)) return;

    props.onSave(form);
    setForm(initialForm)
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
    if (professor.length < 3) return;
    const names: string[] = [...form.professors];
    names.push(professor);
    setForm((prev) => ({...prev, professors: names}));
    setProfessor('');
  }


  function handleDateButton() {
    if (isInvalidTime()) {
      setHasTimeError(true);
    }
    if (isEmpty(week_day)) {
      setHasDayError(true);
    }

    if (!isInvalidDate()) clearErrors();
    else return;

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

  function clearErrors() {
    setHasDayError(false);
    setHasTimeError(false);
  }

  function isEmpty(value: string): boolean {
    return value.length <= 0;
  }

  function isInvalidTime(): boolean {
    if (start_time.length === 0 || end_time.length === 0) return true;
    return false
  }

  function isInvalidDate(): boolean {
    return isInvalidTime() || isEmpty(week_day);
  }

  function isInvalidEndPeriod(value: string): boolean {
    return value.length < 0;
  }

  function validadeInputs() {
    // TODO
    return true;
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

            <FormControl isInvalid={isEmpty(form.subject_code)}>
              <FormLabel>Código da turma</FormLabel>
              <Input
                placeholder='Código da turma'
                value={form.class_code}
                errorBorderColor='crimson'
                onChange={(event) => setForm((prev) => ({ ...prev, class_code: event.target.value }))}
              />
            </FormControl>

            <FormControl isInvalid={isEmpty(form.subject_code)}>
              <FormLabel>Código da disciplina</FormLabel>
              <Input
                placeholder='Código da disciplina'
                value={form.subject_code}
                errorBorderColor='crimson'
                onChange={(event) => setForm((prev) => ({ ...prev, subject_code: event.target.value }))}
              />
            </FormControl>
            
            <FormControl isInvalid={isEmpty(form.subject_name)}>
              <FormLabel>Nome</FormLabel>
              <Input
                placeholder='Nome da disciplina'
                value={form.subject_name}
                errorBorderColor='crimson'
                onChange={(event) => setForm((prev) => ({ ...prev, subject_name: event.target.value }))}
              />
            </FormControl>

            <FormControl>
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
                  onChange={(valueAsString, valueAsNumber) => setForm((prev) => ({...prev, subscribers: valueAsNumber }))}>
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
                  onChange={(valueAsString, valueAsNumber) => setForm((prev) => ({...prev, pendings: valueAsNumber }))}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </HStack>
            </FormControl>
            
            <FormControl isInvalid={isEmpty(form.class_type)}>
              <FormLabel>Tipo de turma</FormLabel>
              <Select 
                defaultValue={props.formData? props.formData.class_type : undefined}
                placeholder='Escolha o tipo da disciplina'
                onChange={(event) => setForm((prev) => ({ ...prev, class_type: event.target.value }))}
                >
                <option value='Prática'>Prática</option>
                <option value='Teórica'>Teórica</option>
              </Select>
            </FormControl>

            <FormControl isInvalid={isEmpty(professor)} isReadOnly={true}>
              <FormLabel>Professores</FormLabel>
                <Input
                  placeholder='Insira os nomes dos professores'
                  type='text'
                  value={professor}
                  onChange={(event) => setProfessor(event.target.value)}
                />
            </FormControl>

            <Button onClick={handleProfessorButton}>Adicionar professor</Button>

            <Text as='b' fontSize='lg'>Professores adicionados:</Text>
            {form.professors.length > 0 ? (
              <List spacing={3}>
              {form.professors.map((professor, index) => (
                <ListItem key={index}>
                  <ListIcon as={BsPersonCheckFill} /> {professor}
                </ListItem>
              ))}
            </List>
            ) : (
              <Text as='b' >Nenhum professor adicionado</Text>
            )}
            {/* {!(hasDayError) ? (undefined) 
            : (
              <FormErrorMessage>Nome de professor inválido</FormErrorMessage>
            )} */}

            <Text as='b' fontSize='xl'>Horários e datas da turma</Text>
            
            <FormControl isInvalid={isEmpty(form.start_period) || isEmpty(form.end_period)} >
              <FormLabel>Período da disciplina</FormLabel>
              <HStack spacing='5px'>
                <FormLabel>Início</FormLabel>
                <Input
                  placeholder='Data de início da disciplina'
                  type="date"
                  value={form.start_period}
                  onChange={(event) => setForm((prev) => ({ ...prev, start_period: event.target.value }))}
                />
                <FormLabel>Fim</FormLabel>
                <Input
                  placeholder='Data de encerramento da disciplina'
                  type="date"
                  value={form.end_period}
                  onChange={(event) => setForm((prev) => ({ ...prev, end_period: event.target.value }))}
                />
              </HStack>
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
              {!(hasDayError) ? (undefined) 
              : (
                <FormErrorMessage>Selecione um dia</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={isEmpty(start_time) || isEmpty(end_time)} >
              <FormLabel>Horário da aula</FormLabel>
              <HStack spacing='5px'>
                <FormLabel>Início</FormLabel>
                <Input
                  placeholder='Horario de início da disciplina'
                  type='time'
                  value={start_time}
                  onChange={(event) => { 
                    setStartTime(event.target.value);
                    if (!(isEmpty(end_time))) setHasTimeError(false);
                  }}
                />
                <FormLabel>Fim</FormLabel>
                <Input
                  placeholder='Horário de encerramento da disciplina'
                  type='time'
                  value={end_time}
                  onChange={(event) => {
                    setEndTime(event.target.value);
                    if (!(isEmpty(start_time))) setHasTimeError(false);
                  }}
                />
              </HStack>
              {!(hasTimeError) ? (undefined) 
              : (
                <FormErrorMessage>Horários inválidos.</FormErrorMessage>
              )}
            </FormControl>
            
            <FormControl>
              <Button type='submit' onClick={handleDateButton}>Adicionar horário</Button>
            </FormControl>

            <Text as='b' fontSize='lg'>Horários adicionados:</Text>
            {form.week_days.length > 0 ? (
              <List spacing={3}>
                {form.week_days.map((week_day, index) => (
                  <ListItem key={index}>
                    <CalendarIcon /> 
                    {` ${weekDaysFormatter(week_day)}, ${form.start_time[index]} às ${form.end_time[index]}`}   
                  </ListItem>
                ))}
              </List>
            ) : (
              <Text as='b'>Nenhum horário adicionado</Text>
            )}

            <Text as='b' fontSize='xl'>Preferências</Text>

            <FormControl isInvalid={isEmpty(form.preferences.building)}>
              <FormLabel>Prédio</FormLabel>
              <Select
                defaultValue={props.formData? props.formData.preferences.building : undefined}
                placeholder='Escolha o prédio da turma'
                value={form.preferences.building}
                onChange={(event) => setForm((prev) => (
                  { ...prev, preferences: {...prev.preferences, building: event.target.value} }))}
              >
                {props.buildings?.map((it) => (
                  <option key={it.name} value={it.name}>
                    {it.name}
                  </option>
                ))}
              </Select>
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
          <Button colorScheme='blue' mr={3} onClick={handleSaveClick}>
            Salvar
          </Button>
          <Button onClick={handleCloseModal}>Cancelar</Button>
        </ModalFooter>

      </ModalContent>
    </Modal>
  );
}
