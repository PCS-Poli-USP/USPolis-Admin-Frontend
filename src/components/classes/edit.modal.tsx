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
  Select,
  Text,
  List,
  ListItem,
} from '@chakra-ui/react';
import { BsPersonCheckFill } from 'react-icons/bs';
import { useEffect, useState } from 'react';

import Class, { EditedClass } from 'models/class.model';
import { WeekDays } from 'models/enums/weekDays.enum';
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

  useEffect(() => {
    if (formData) setForm({...formData, week_days_id: [...formData.week_days], start_times_id: [...formData.start_time]});
  }, [formData]);

  function handleSaveClick() {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
          <FormControl mb={4}>
            <FormLabel>Quantidade de alunos</FormLabel>
            <NumberInput
              placeholder='Alunos inscritos'
              min={0}
              value={form.subscribers}
              onChange={(valueAsString, valueAsNumber) => {
                setForm((prev) => ({...prev, subscribers: valueAsNumber }));
              }}
            >
              <NumberInputField />
            </NumberInput>
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
          </FormControl>
          
          <Text as='b' fontSize='lg'>Horários da turma:</Text>
          <Accordion allowMultiple defaultIndex={[0]} mt={4}>
            {formData?.start_time?.map((value, index) => (
              <AccordionItem key={index}>
                <AccordionButton bg='uspolis.blue' _hover={{ bg: 'uspolis.blue' }} color='white'>
                  <Box flex='1' textAlign='left'>
                    {form.week_days[index] ? Capitalize(form.week_days[index]) : ''} - {form.start_time[index]} - {form.end_time[index]}
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

                  <FormControl mt={4} display='flex' alignItems='center'>
                    <FormLabel>Início</FormLabel>
                    <Input
                      type='time'
                      value={form.start_time[index] ?? ''}
                      onChange={(event) => {
                          const newStartTime = [...form.start_time];
                          newStartTime[index] = event.target.value;
                          setForm((prev) => ({...prev, start_time: newStartTime}));
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
                      }
                    }
                    />
                  </FormControl>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleSaveClick}>
            Salvar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
