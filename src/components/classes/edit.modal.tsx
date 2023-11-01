import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
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
  VStack,
} from '@chakra-ui/react';
import { BsPersonCheckFill } from 'react-icons/bs';
import { useEffect, useState } from 'react';

import Class, { EditedClass } from 'models/class.model';
import { Capitalize } from 'utils/formatters';
import * as validator from 'utils/classes/classes.validator';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData?: Class;
  onSave: (data: EditedClass) => void;
}

export default function EditModal({ isOpen, onClose, formData, onSave }: EditModalProps) {
  const initialForm: EditedClass = {
    class_code: '',
    subject_code: '',
    subject_name: '',
    professors: [],
    start_period: '',
    end_period: '',
    start_times_id: [],
    start_time: [],
    end_time: [],
    week_days_id: [],
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
  };

  const [form, setForm] = useState<EditedClass>(initialForm);
  const [professor, setProfessor] = useState('');
  const [isEditingProfessor, setIsEditingProfessor] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [hasProfessorError, setHasProfessorError] = useState(false);
  const [hasOferingError, setHasOferingError] = useState(false);
  const [timeErrorsMap, setTimeErrosMap] = useState<boolean[]>([]);
  const [hasErrors, setHasErrors] = useState(false);

  useEffect(() => {
    if (formData) {
      setForm({...formData, week_days_id: [...formData.week_days], start_times_id: [...formData.start_time]});
      setTimeErrosMap(formData.start_time.map(() => false));
    };
  }, [formData]);

  function handleSaveClick() {
    if (isInvalidForm()) {
      setHasErrors(true);
      return;
    }
    setHasErrors(false);
    onSave(form);
    onClose();
  }

  const handleProfessorButton = () => {
    if (validator.isInvalidProfessor(professor)) {
      setHasProfessorError(true);
      return;
    }
    else setHasProfessorError(false);

    const names: string[] = [...form.professors];
    if (!isEditingProfessor) {
      names.push(professor);
    } else {
      names[editIndex] = professor;
    }
    setForm((prev) => ({...prev, professors: names}));
    setProfessor('');
    setIsEditingProfessor(false);
  }

  function handleProfessorInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') handleProfessorButton();
  }

  function handleDeleteButton(index: number) {
    const newProfessors = form.professors;
    newProfessors.splice(index, 1);
    setForm((prev) => ({...prev, professors: newProfessors}));
  }

  function handleEditButton(index: number) {
    setIsEditingProfessor(true);
    setEditIndex(index);
    setProfessor(form.professors[index]);
  }

  function isInvalidForm() {
    let hasError = false;

    if (validator.isInvalidOfering(form.pendings, form.subscribers)) {
      setHasOferingError(true);
      hasError = true;
    }

    if (validator.isInvalidProfessorList(form.professors)) {
      hasError = true;
    }

    const indexes = validator.isInvalidEditedTimeList(form.start_time, form.end_time);
    if (indexes.length !== 0) {
      const newTimeErrorsMap: boolean[] = [...timeErrorsMap];
      for(let i = 0; i < indexes.length; i++) newTimeErrorsMap[indexes[i]] = true;
      setTimeErrosMap(newTimeErrorsMap);
      hasError = true;
    }

    return hasError;
  }

  function cleanTimeErrorAt(index: number) {
    const newTimeErrorsMap = [...timeErrorsMap];
    newTimeErrorsMap[index] = false;
    setTimeErrosMap(newTimeErrorsMap);
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
          {formData?.subject_code} - {formData?.class_code}
          <Text fontSize='md' fontWeight='normal'>
            {formData?.subject_name}
          </Text>
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <FormControl isInvalid={hasOferingError} mb={4}>
            <FormLabel>Oferecimento da disciplina</FormLabel>
            <HStack spacing='8px' >
            <FormLabel>Vagas</FormLabel>
              <NumberInput 
                defaultValue={formData?.vacancies ? formData?.vacancies : form.vacancies} 
                min={0} 
                max={99999} 
                placeholder='Quantidade de vagas da turma'
                onChange={(valueAsString, valueAsNumber) => {
                    setForm((prev) => ({...prev, vacancies: valueAsNumber }));
                    if(valueAsNumber) setHasOferingError(false);
                  }}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <FormLabel>Inscritos</FormLabel>
              <NumberInput 
                defaultValue={formData?.subscribers ? formData?.subscribers : form.subscribers}
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
                defaultValue={formData?.pendings ? formData?.pendings : form.pendings}
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

          <FormControl isInvalid={hasProfessorError} mb={4}>
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
              {hasProfessorError ? (<FormErrorMessage>Nome de professor inválido.</FormErrorMessage>) : (undefined)}
          </FormControl>

          <Button onClick={handleProfessorButton} mb={4}>{isEditingProfessor ? 'Editar professor' : 'Adicionar professor'}</Button>
          
          <FormControl mb={4}>
            <VStack alignItems='start'>
              <Text as='b' fontSize='lg'>Professores da turma:</Text>
              {form.professors.length > 0 ? (
                <List spacing={3} mt={4}>
                {form.professors.map((professor, index) => (
                  <ListItem key={index}>
                    <HStack>
                      <BsPersonCheckFill />
                      <Text>{professor}</Text>
                      <Button
                        colorScheme='yellow'
                        size='xs'
                        variant='ghost'
                        onClick={() => handleEditButton(index)}
                      >
                        Editar
                      </Button>
                      <Button  
                        colorScheme='red' 
                        size='xs' 
                        variant='ghost' 
                        onClick={() => handleDeleteButton(index)}
                      >
                        Remover
                      </Button>
                    </HStack>
                  </ListItem>
                ))}
              </List>
              ) : (
                <Text as='b' colorScheme='red' color='red.500'>Nenhum professor adicionado</Text>
              )}
            </VStack>
          </FormControl>
          
          <Text as='b' fontSize='lg'>Horários da turma:</Text>
          <Accordion allowMultiple defaultIndex={[0]} mt={4}>
            {formData?.start_time?.map((value, index) => (
              <AccordionItem key={index}>
                <AccordionButton bg='uspolis.blue' _hover={{ bg: 'uspolis.blue' }} color='white'>
                  <Box flex='1' textAlign='left'>
                    <Text color={timeErrorsMap[index] ? 'red.600' : undefined}>
                    {form.week_days[index] ? Capitalize(form.week_days[index]) : ''} - {form.start_time[index]} - {form.end_time[index]}
                    {timeErrorsMap[index] ? ' *Horário Inválido' : ''}
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel>
                  <FormControl mt={4}>
                    <FormLabel>Dia</FormLabel>
                    <Select
                      value={form.week_days[index] ?? ''}
                      onChange={(event) => {
                          const newWeekDays = [...form.week_days];
                          newWeekDays[index] = event.target.value;
                          setForm((prev) => ({...prev, week_days: newWeekDays}));
                        }
                      }
                    >
                      <option value='seg'>Segunda</option>
                      <option value='ter'>Terça</option>
                      <option value='qua'>Quarta</option>
                      <option value='qui'>Quinta</option>
                      <option value='sex'>Sexta</option>
                      <option value='sab'>Sábado</option>
                      <option value='dom'>Domingo</option>
                    </Select>
                  </FormControl>

                  <FormControl mt={4} mb={4} display='flex' alignItems='center'>
                    <FormLabel>Início</FormLabel>
                    <Input
                      type='time'
                      value={form.start_time[index] ?? ''}
                      onChange={(event) => {
                          const newStartTime = [...form.start_time];
                          newStartTime[index] = event.target.value;
                          setForm((prev) => ({...prev, start_time: newStartTime}));
                          cleanTimeErrorAt(index);
                        }
                      }
                    />

                    <FormLabel ml={4}>Fim</FormLabel>
                    <Input
                      type='time'
                      value={form.end_time[index] ?? ''}
                      onChange={(event) => {
                        const newEndTime = [...form.end_time];
                        newEndTime[index] = event.target.value;
                        setForm((prev) => ({...prev, end_time: newEndTime}));
                        cleanTimeErrorAt(index);
                      }
                    }
                    />
                  </FormControl>
                  
                  {/* {timeErrorsMap[index] ? (<Text as='b' color='red.500' mt={4} >Horário Inválido</Text>):  (undefined)} */}

                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </ModalBody>

        <ModalFooter>
        <HStack spacing='10px'>
            {hasErrors ? <Text colorScheme='red' color='red.600'>Fomulário inválido, corrija os campos inválidos</Text> : (undefined) }
            <Button colorScheme='blue' mr={3} onClick={handleSaveClick}>
              Salvar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
