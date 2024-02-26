import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  HStack,
  Input,
  IconButton,
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
  List,
  ListItem,
  VStack,
} from '@chakra-ui/react';
import {
  BsPersonCheckFill,
  BsFillPenFill,
  BsFillTrashFill,
} from 'react-icons/bs';
import { CalendarIcon, CloseIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';

import Class from 'models/class.model';
import { Building } from 'models/building.model';
import { weekDaysFormatter } from 'utils/classes/classes.formatter';
import * as validator from 'utils/classes/classes.validator';
import { FormatData } from 'utils/formatters';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData?: Class;
  onSave: (data: Class) => void;
  buildings?: Array<Building>;
}

export default function EditModal({
  isOpen,
  onClose,
  formData,
  onSave,
  buildings,
}: EditModalProps) {
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

  const [form, setForm] = useState<Class>(initialForm);

  // ClassInfo variables
  const [isEditingClassInfo, setIsEditingClassInfo] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [startPeriod, setStartPeriod] = useState('');
  const [endPeriod, setEndPeriod] = useState('');
  const [buildingID, setBuildingID] = useState('');

  // Allocation variables
  const [professor, setProfessor] = useState('');
  const [isEditingProfessor, setIsEditingProfessor] = useState(false);
  const [editProfessorIndex, setEditProfessorIndex] = useState(0);
  const [week_day, setWeekDay] = useState('');
  const [start_time, setStartTime] = useState('');
  const [end_time, setEndTime] = useState('');
  const [editDateIndex, setEditDateIndex] = useState(0);
  const [isEditingDate, setIsEditingDate] = useState(false);

  const [hasClassCodeError, setHasClassCodeError] = useState(false);
  const [hasSubjectCodeError, setHasSubjectCodeError] = useState(false);
  const [hasSubjectNameError, setHasSubjectNameError] = useState(false);
  const [hasPeriodError, setHasPeriodError] = useState(false);
  const [hasProfessorError, setHasProfessorError] = useState(false);
  const [hasOferingError, setHasOferingError] = useState(false);
  const [hasTimeError, setHasTimeError] = useState(false);
  const [hasDayError, setHasDayError] = useState(false);
  const [hasBuildingError, setHasBuildingError] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  useEffect(() => {
    if (formData) {
      setForm(formData);
      setClassInfo(formData);
    }
  }, [formData]);

  function setClassInfo(form: Class) {
    setClassCode(form.class_code);
    setSubjectCode(form.subject_code);
    setSubjectName(form.subject_name);
    setStartPeriod(form.start_period);
    setEndPeriod(form.end_period);
    setBuildingID(form.preferences.building_id);
  }

  function handleSaveClick() {
    if (isInvalidForm()) {
      setHasErrors(true);
      return;
    }
    onSave(form);
    clearForm();
    onClose();
  }

  function handleCloseModal() {
    clearForm();
    onClose();
  }

  function handleEditClassInfo() {
    setIsEditingClassInfo(true);
  }

  function handleSaveClassInfo() {
    if (isInvalidClassInfo()) return;
    setForm((prev) => ({
      ...prev,
      class_code: classCode,
      subject_code: subjectCode,
      subject_name: subjectName,
      start_period: startPeriod,
      end_period: endPeriod,
      preferences: { ...prev.preferences, building_id: buildingID },
    }));
    setIsEditingClassInfo(false);
  }

  function handleCancelClassInfo() {
    setIsEditingClassInfo(false);
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

  function handleDeleteProfessorButton(index: number) {
    const newProfessors = form.professors;
    newProfessors.splice(index, 1);
    setForm((prev) => ({ ...prev, professors: newProfessors }));
  }

  function handleEditProfessorButton(index: number) {
    setIsEditingProfessor(true);
    setEditProfessorIndex(index);
    setProfessor(form.professors[index]);
  }

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setWeekDay(event.target.value);
    setHasDayError(false);
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

  function isInvalidClassInfo(): boolean {
    let hasError = false;
    if (validator.isInvalidClassCode(classCode)) {
      setHasClassCodeError(true);
      hasError = true;
    }
    if (validator.isInvalidSubjectCode(subjectCode)) {
      setHasSubjectCodeError(true);
      hasError = true;
    }
    if (validator.isInvalidSubjectName(subjectName)) {
      setHasSubjectNameError(true);
      hasError = true;
    }
    if (validator.isInvalidPeriod(startPeriod, endPeriod)) {
      setHasPeriodError(true);
      hasError = true;
    }
    if (validator.isEmpty(buildingID)) {
      setHasBuildingError(true);
      hasError = true;
    }
    return hasError;
  }

  function isInvalidForm() {
    let hasError = false;

    if (validator.isInvalidProfessorList(form.professors)) {
      hasError = true;
    }

    if (validator.isInvalidTimeList(form.start_time, form.end_time)) {
      hasError = true;
    }

    return hasError;
  }

  function clearForm() {
    clearProfessorInput();
    clearDateInputs();
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

  function clearErrors() {
    setHasOferingError(false);
    setHasProfessorError(false);
    setHasTimeError(false);
    setHasDayError(false);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      motionPreset='slideInBottom'
      size='2xl'
      scrollBehavior='outside'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {form.subject_code} - {form.class_code}
          <Text fontSize={'md'} fontWeight={'normal'}>
            {form.subject_name}
          </Text>
          <Text fontSize={'md'} fontWeight={'normal'}>
            Período: {FormatData(form.start_period)} até{' '}
            {FormatData(form.end_period)}
          </Text>
          <Text fontSize={'md'} fontWeight={'normal'}>
            Prédio:{' '}
            {
              buildings?.find(
                (build) => build.id === form.preferences.building_id,
              )?.name
            }
          </Text>
          <Button
            size={'xs'}
            rightIcon={<BsFillPenFill />}
            onClick={handleEditClassInfo}
            colorScheme={'yellow'}
            variant={'outline'}
          >
            Editar
          </Button>
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <VStack alignItems='start' spacing='15px'>
            {isEditingClassInfo ? (
              <>
                <Text as='b' fontSize={'xl'}>
                  Informações da turma:
                </Text>

                <FormControl isInvalid={hasClassCodeError}>
                  <FormLabel>Código da turma</FormLabel>
                  <Input //Input do tipo number está aceitando um 'e' ou 'E'
                    placeholder='Código da turma'
                    value={classCode}
                    errorBorderColor='crimson'
                    onChange={(event) => {
                      const charValue = event.target.value.charCodeAt(
                        event.target.value.length - 1,
                      );
                      if (charValue < 48 || charValue > 57) return;
                      setClassCode(event.target.value);
                      if (event.target.value) setHasClassCodeError(false);
                    }}
                  />
                  {hasClassCodeError ? (
                    <FormErrorMessage>
                      Código de turma inválido, tamanho mínimo de 7 números.
                    </FormErrorMessage>
                  ) : undefined}
                </FormControl>

                <FormControl isInvalid={hasSubjectCodeError}>
                  <FormLabel>Código da disciplina</FormLabel>
                  <Input
                    placeholder='Código da disciplina'
                    value={subjectCode}
                    errorBorderColor='crimson'
                    onChange={(event) => {
                      setSubjectCode(event.target.value);
                      if (event.target.value) setHasSubjectCodeError(false);
                    }}
                  />
                  {hasSubjectCodeError ? (
                    <FormErrorMessage>
                      Código de disciplina inválido, tamanho mínimo de 7
                      caracteres.
                    </FormErrorMessage>
                  ) : undefined}
                </FormControl>

                <FormControl isInvalid={hasSubjectNameError}>
                  <FormLabel>Nome da disciplina</FormLabel>
                  <Input
                    placeholder='Nome da disciplina'
                    value={subjectName}
                    errorBorderColor='crimson'
                    onChange={(event) => {
                      setSubjectName(event.target.value);
                      if (event.target.value) setHasSubjectNameError(false);
                    }}
                  />
                  {hasSubjectNameError ? (
                    <FormErrorMessage>
                      Nome da disciplina inválido.
                    </FormErrorMessage>
                  ) : undefined}
                </FormControl>

                <FormControl isInvalid={hasPeriodError}>
                  <FormLabel>Período da disciplina</FormLabel>
                  <HStack spacing='5px'>
                    <FormLabel>Início</FormLabel>
                    <Input
                      placeholder='Data de início da disciplina'
                      type='date'
                      value={startPeriod}
                      onChange={(event) => {
                        setStartPeriod(event.target.value);
                        if (event.target.value) setHasPeriodError(false);
                      }}
                    />

                    <FormLabel>Fim</FormLabel>
                    <Input
                      placeholder='Data de encerramento da disciplina'
                      type='date'
                      value={endPeriod}
                      onChange={(event) => {
                        setEndPeriod(event.target.value);
                        if (event.target.value) setHasPeriodError(false);
                      }}
                    />
                  </HStack>
                  {hasPeriodError ? (
                    <FormErrorMessage>Periodo inválido</FormErrorMessage>
                  ) : undefined}
                </FormControl>

                <FormControl isInvalid={hasBuildingError}>
                  <FormLabel>Prédio</FormLabel>
                  <Select
                    defaultValue={
                      formData ? formData.preferences.building_id : undefined
                    }
                    placeholder='Escolha o prédio da turma'
                    value={buildingID}
                    onChange={(event) => {
                      setBuildingID(event.target.value);
                      if (event.target.value) setHasBuildingError(false);
                    }}
                  >
                    {buildings?.map((it, index) => (
                      <option key={index} value={it.id}>
                        {it.name}
                      </option>
                    ))}
                  </Select>
                  {hasBuildingError ? (
                    <FormErrorMessage>Escolha um prédio.</FormErrorMessage>
                  ) : undefined}
                </FormControl>

                <HStack>
                  <Button
                    variant={'outline'}
                    rightIcon={<BsFillPenFill />}
                    onClick={handleSaveClassInfo}
                  >
                    Editar
                  </Button>
                  <Button
                    colorScheme={'red'}
                    variant={'outline'}
                    rightIcon={<CloseIcon />}
                    onClick={handleCancelClassInfo}
                  >
                    Cancelar
                  </Button>
                </HStack>
              </>
            ) : undefined}

            <Text as='b' fontSize={'xl'}>
              Oferecimento e horários:
            </Text>

            <FormControl isInvalid={hasOferingError}>
              <FormLabel>Oferecimento da disciplina</FormLabel>
              <HStack spacing='8px'>
                <FormLabel>Vagas</FormLabel>
                <NumberInput
                  defaultValue={
                    formData?.vacancies ? formData?.vacancies : form.vacancies
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
                  defaultValue={
                    formData?.subscribers
                      ? formData?.subscribers
                      : form.subscribers
                  }
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
                  defaultValue={
                    formData?.pendings ? formData?.pendings : form.pendings
                  }
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

            <FormControl isInvalid={hasProfessorError}>
              <FormLabel>Professor</FormLabel>
              <Input
                placeholder='Adicione um professor'
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

            <Text as='b' fontSize='lg' mt={4}>
              Professores da turma:
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

            <Text as='b' fontSize='lg' mt={4}>
              Horários da turma:
            </Text>

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

            {isEditingClassInfo ? (
              <Alert status='warning' fontSize='sm'>
                <AlertIcon />
                Você não editou as informações da turma
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
