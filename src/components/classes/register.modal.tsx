import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Heading,
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
} from '@chakra-ui/react';

import { Building } from 'models/building.model';

import { CreateClassEvents } from 'models/class.model';

import { useEffect, useState } from 'react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData?: CreateClassEvents;
  buildings?: Array<Building>;
  isUpdate?: boolean;
  onSave: (data: CreateClassEvents) => void;
}

export default function RegisterModal(props: RegisterModalProps) {
  const initialForm: CreateClassEvents= {
    class_code: '',
    subject_code: '',
    subject_name: '',
    professor: '',
    start_period: '',
    end_period: '',
    start_time: '',
    end_time: '',
    week_day: '',
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

  function isEmpty(value: string) {
    return value.length <= 0;
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
          <VStack spacing='20px'>

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
              <FormLabel>Código</FormLabel>
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

            <FormControl isInvalid={isEmpty(form.professor)}>
              <FormLabel>Professor</FormLabel>
              <Input
                placeholder='Insira o nome dos professor'
                type='text'
                value={form.professor}
                onChange={(event) => setForm((prev) => ({...prev, professor: event.target.value}))}
              />
            </FormControl>

            <FormControl isInvalid={isEmpty(form.start_period)}>
              <FormLabel>Data de início</FormLabel>
              <Input
                placeholder='Data de início da disciplina'
                type="date"
                value={form.start_period}
                onChange={(event) => setForm((prev) => ({ ...prev, start_period: event.target.value }))}
              />
            </FormControl>

            <FormControl isInvalid={isInvalidEndPeriod(form.end_period)}>
              <FormLabel>Data de enceramento</FormLabel>
              <Input
                placeholder='Data de encerramento da disciplina'
                type="date"
                value={form.end_period}
                onChange={(event) => setForm((prev) => ({ ...prev, end_period: event.target.value }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Horário de Início</FormLabel>
              <Input
                type='time'
                value={form.start_time}
                onChange={(event) => setForm((prev) => ({...prev, start_time: event.target.value }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Horário de Fim</FormLabel>
              <Input
                type='time'
                value={form.end_time}
                onChange={(event) => setForm((prev) => ({...prev, end_time: event.target.value }))}
              />
            </FormControl>

            <FormControl isInvalid={isEmpty(form.week_day)}>
              <FormLabel>Dia da semana</FormLabel>
              <Select 
                placeholder='Escolha o dia da semana'
                onChange={(event) => setForm((prev) => ({ ...prev, week_day: event.target.value }))}
                >
                <option value='seg'>Segunda</option>
                <option value='ter'>Terça</option>
                <option value='qua'>Quarta</option>
                <option value='qui'>Quinta</option>
                <option value='sex'>Sexta</option>
              </Select>
            </FormControl>

            <FormControl isInvalid={form.vacancies <= 0}>
              <FormLabel>Vagas</FormLabel>
              <NumberInput 
                defaultValue={props.isUpdate? Number(props.formData?.vacancies) : 0} 
                min={0} 
                max={150} 
                placeholder='Quantidade de vagas da turma'
                onChange={(valueAsString, valueAsNumber) => setForm((prev) => ({...prev, vacancies: valueAsNumber }))}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isInvalid={form.subscribers <= 0}>
              <FormLabel>Inscritos</FormLabel>
              <NumberInput 
                defaultValue={0}
                min={0} 
                max={150} 
                placeholder='Quantidade de alunos inscritos'
                onChange={(valueAsString, valueAsNumber) => setForm((prev) => ({...prev, subscribers: valueAsNumber }))}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
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

            <ModalHeader>Preferências</ModalHeader>

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
