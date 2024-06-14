import {
  FormLabel,
  FormControl,
  FormErrorMessage,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { FieldProps } from 'models/interfaces';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export type Option = {
  label: string;
  value: string | number;
};

interface MultiSelectProps extends FieldProps {
  value?: string | number | undefined;
  min?: number | undefined;
  max?: number | undefined;
}

export function NumberInput({
  label,
  name,
  disabled = false,
  hidden = false,
  placeholder = undefined,
  value = undefined,
  min = undefined,
  max = undefined,
}: MultiSelectProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [inputValue, setInputValue] = useState(value);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormControl isInvalid={!!errors[name]}>
          <FormLabel alignSelf='flex-start'>{label}</FormLabel>
          <ChakraNumberInput
            value={inputValue}
            hidden={hidden}
            min={min}
            max={max}
            onChange={(valueAsString, valueAsNumber) => {
              field.onChange(valueAsNumber);
              setInputValue(valueAsNumber);
            }}
          >
            <NumberInputField disabled={disabled} placeholder={placeholder} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </ChakraNumberInput>
          <FormErrorMessage>
            {errors[name]?.message?.toString()}
          </FormErrorMessage>
        </FormControl>
      )}
    />
  );
}