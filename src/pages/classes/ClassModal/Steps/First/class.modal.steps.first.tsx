import {
  Box,
  FormLabel,
  HStack,
  Input as ChakraInput,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Button,
  List,
  ListItem,
  Text,
  Tooltip,
  IconButton,
  Alert,
  AlertIcon,
  VStack,
  Center,
  Flex,
  Container,
} from '@chakra-ui/react';
import { ClassModalStepsProps } from './class.modal.steps.first.interface';
import { SubjectResponse } from 'models/http/responses/subject.response.models';
import { FormProvider, useForm } from 'react-hook-form';
import { ClassForm } from '../../class.modal.interface';
import { classDefaultValues, classSchema } from '../../class.modal.form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, Select } from 'components/common';
import { ClassResponse } from 'models/http/responses/class.response.models';
import { ClassType } from 'utils/enums/classes.enum';
import { useState } from 'react';
import {
  BsFillPenFill,
  BsFillTrashFill,
  BsPersonCheckFill,
} from 'react-icons/bs';
import { NumberInput } from 'components/common/form/NumberInput';
import { ClassValidator } from 'utils/classes/classes.validator';
import { FormControl } from '@mui/material';

interface ClassModalFirstStepProps extends ClassModalStepsProps {
  subjects: SubjectResponse[];
  selectedClass?: ClassResponse;
}

function ClassModalFirstStep(props: ClassModalFirstStepProps) {
  const classForm = useForm<ClassForm>({
    defaultValues: classDefaultValues,
    resolver: yupResolver(classSchema),
  });

  const [professor, setProfessor] = useState('');
  const [hasProfessorError, setHasProfessorError] = useState(false);
  const [professors, setProfessors] = useState<string[]>([]);
  const [isEditingProfessor, setIsEditingProfessor] = useState(false);
  const [editProfessorIndex, setEditProfessorIndex] = useState(0);

  const handleProfessorButton = () => {
    if (ClassValidator.isInvalidProfessor(professor)) {
      setHasProfessorError(true);
      return;
    } else setHasProfessorError(false);

    const names: string[] = [...professors];
    if (!isEditingProfessor) {
      names.push(professor);
    } else {
      names[editProfessorIndex] = professor;
    }
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
    <VStack w={'full'} mt={5}>
      <FormProvider {...classForm}>
        <form>
          <Select
            label={'Disciplina'}
            name={'subject_id'}
            placeholder={'Selecione uma disciplina'}
            value={
              props.selectedClass ? props.selectedClass.subject_id : undefined
            }
            options={props.subjects.map((subject) => ({
              value: subject.id,
              label: `${subject.code} - ${subject.name}`,
            }))}
          />

          <Input
            label={'Código da turma'}
            name={'code'}
            placeholder='Código da turma'
            mt={4}
          />

          <HStack spacing='8px' mt={4}>
            <NumberInput
              label={'Vagas'}
              name={'vacancies'}
              placeholder={'Quantidade de vagas'}
              value={
                props.selectedClass ? props.selectedClass.vacancies : undefined
              }
              min={0}
              max={99999}
            />
            <NumberInput
              label={'Inscritos'}
              name={'subscribers'}
              placeholder={'Quantidade de inscritos'}
              value={
                props.selectedClass
                  ? props.selectedClass.subscribers
                  : undefined
              }
              min={0}
              max={99999}
            />
            <NumberInput
              label={'Pendentes'}
              name={'pendings'}
              placeholder={'Quantidade de pendentes'}
              value={
                props.selectedClass ? props.selectedClass.pendings : undefined
              }
              min={0}
              max={99999}
            />
          </HStack>

          <Select
            label={'Tipo de turma'}
            name={'type'}
            mt={4}
            value={props.selectedClass ? props.selectedClass.type : undefined}
            placeholder={'Escolha o tipo da turma'}
            options={[
              { label: 'Prática', value: ClassType.PRACTIC },
              { label: 'Teórica', value: ClassType.THEORIC },
              {
                label: 'Prática Vinculada',
                value: ClassType.VINCULATED_PRACTIC,
              },
              {
                label: 'Teórica Vinculada',
                value: ClassType.VINCULATED_THEORIC,
              },
            ]}
          />

          <VStack alignItems={'start'} mt={4}>
            <FormLabel>Professores</FormLabel>
            <HStack w={'full'} spacing={4}>
              <FormControl>
                <ChakraInput
                  placeholder='Insira o nomes do professor'
                  type='text'
                  value={professor}
                  onChange={(event) => {
                    setProfessor(event.target.value);
                    if (event.target.value) setHasProfessorError(false);
                  }}
                  w={'max-content'}
                  onKeyDown={handleProfessorInputKeyDown}
                />
              </FormControl>

              <Button onClick={handleProfessorButton} colorScheme={'teal'} variant={'outline'}>
                {isEditingProfessor
                  ? 'Editar professor'
                  : 'Adicionar professor'}
              </Button>
            </HStack>

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
              <Alert status='warning' fontSize='sm' mb={4}>
                <AlertIcon />
                Nenhum professor adicionado
              </Alert>
            )}
          </VStack>

          {/* <Text as='b' fontSize='xl'>
            Horários e datas da turma
          </Text>

          <FormLabel>Período da disciplina</FormLabel>
          <HStack spacing='5px'>
            <Input
              label={'Início'}
              name={'start_date'}
              placeholder='Data de início da disciplina'
              type='date'
              value={
                props.selectedClass ? props.selectedClass.start_date : undefined
              }
            />
            <Input
              label={'Fim'}
              name={'end_date'}
              placeholder='Data de encerramento da disciplina'
              type='date'
              value={
                props.selectedClass ? props.selectedClass.end_date : undefined
              }
            />
          </HStack> */}
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ClassModalFirstStep;
