import {
  FormLabel,
  FormControl,
  FormErrorMessage,
  Input as ChakraInput,
  VStack,
  HStack,
  Button,
  Text,
  List,
  ListItem,
  Tooltip,
  IconButton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FieldProps } from '../form.interface';
import { useState } from 'react';
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from 'react-hook-form';
import {
  BsFillPenFill,
  BsFillTrashFill,
  BsPersonCheckFill,
} from 'react-icons/bs';

interface ListInputProps extends FieldProps {
  listLabel: string;
  valueErrorMessage: string;
  isInvalid: (value: string) => boolean; // Retorna true => invalido
  sorter?: (a: string, b: string) => -1 | 1 | 0;
  value?: string;
  values?: string[];
}

export function ListInput({
  listLabel,
  valueErrorMessage,
  label,
  name,
  isInvalid,
  sorter = undefined,
  disabled = false,
  value = undefined,
  values = undefined,
  placeholder = undefined,
  mt = undefined,
  mb = undefined,
  mr = undefined,
  ml = undefined,
}: ListInputProps) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [currentValue, setCurrentValue] = useState(value ? value : '');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(0);
  const [hasValueError, setHasValueError] = useState(false);

  const listValues: string[] = watch(name);
  if (values) {
    if (sorter) values.sort(sorter);
    setValue(name, values);
  }

  function handleEditValueButton(index: number) {
    setIsEditing(true);
    setEditingIndex(index);
    setCurrentValue(listValues[index]);
  }

  function handleDeleteValueButton(
    index: number,
    field: ControllerRenderProps<FieldValues, string>,
  ) {
    if (index === editingIndex) {
      setIsEditing(false);
      setHasValueError(false);
      setCurrentValue('');
    }
    const newListValues = [...listValues];
    newListValues.splice(index, 1);
    if (sorter) newListValues.sort(sorter);
    setValue(name, newListValues);
    field.onChange(newListValues);
    setEditingIndex(0);
  }

  function handleValueButtonClick(
    field: ControllerRenderProps<FieldValues, string>,
  ) {
    if (!currentValue) return;
    if (isInvalid(currentValue)) {
      setHasValueError(true);
      return;
    } else setHasValueError(false);
    const newListValues = [...listValues];
    if (!isEditing) {
      newListValues.push(currentValue);
    } else {
      newListValues[editingIndex] = currentValue;
    }
    if (sorter) newListValues.sort(sorter);
    setCurrentValue('');
    setIsEditing(false);
    setValue(name, newListValues);
    field.onChange(newListValues);
  }

  function handleInputKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>,
  ) {
    if (event.key === 'Enter') handleValueButtonClick(field);
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <VStack align={'strech'} mt={mt} mb={mb} ml={ml} mr={mr} w={'full'}>
          <FormControl isInvalid={hasValueError}>
            <FormLabel alignSelf='flex-start'>{label}</FormLabel>
            <HStack>
              <ChakraInput
                value={currentValue}
                isDisabled={disabled}
                placeholder={placeholder}
                onChange={(event) => {
                  setCurrentValue(event.target.value);
                  if (event.target.value) setHasValueError(false);
                }}
                onKeyDown={(event) => handleInputKeyDown(event, field)}
              />
              <Button
                onClick={() => handleValueButtonClick(field)}
                colorScheme={'teal'}
                variant={'outline'}
                isDisabled={disabled}
              >
                {isEditing ? 'Editar' : 'Adicionar'}
              </Button>
            </HStack>
            <FormErrorMessage>{`${valueErrorMessage}`}</FormErrorMessage>
          </FormControl>

          <Text as='b' fontSize='lg' mt={4}>
            {`${listLabel}`}
          </Text>
          {listValues.length > 0 ? (
            <List spacing={3}>
              {listValues.map((val, index) => (
                <ListItem key={index}>
                  <HStack>
                    <BsPersonCheckFill />
                    <Text>{val}</Text>

                    <Tooltip label='Editar'>
                      <IconButton
                        colorScheme='yellow'
                        size='sm'
                        variant='ghost'
                        aria-label='editar-valor'
                        icon={<BsFillPenFill />}
                        onClick={() => handleEditValueButton(index)}
                      />
                    </Tooltip>

                    <Tooltip label='Remover'>
                      <IconButton
                        colorScheme='red'
                        size='sm'
                        variant='ghost'
                        aria-label='remover-valor'
                        icon={<BsFillTrashFill />}
                        onClick={() => handleDeleteValueButton(index, field)}
                      />
                    </Tooltip>
                  </HStack>
                </ListItem>
              ))}
            </List>
          ) : errors[name] ? (
            <Alert status='error' fontSize={'sm'} mb={4}>
              <AlertIcon />
              {errors[name]?.message?.toString()}
            </Alert>
          ) : (
            <Alert status='warning' fontSize='sm' mb={4}>
              <AlertIcon />
              Nenhum valor adicionado
            </Alert>
          )}
        </VStack>
      )}
    />
  );
}

export default ListInput;
