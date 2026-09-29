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
import { FieldProps } from '../form.interface';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface NumberInputProps extends FieldProps {
  value?: string | number | undefined;
  min?: number | undefined;
  max?: number | undefined;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (valueAsNumber: number) => void;
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
  mt = undefined,
  mb = undefined,
  mr = undefined,
  ml = undefined,
  onFocus = undefined,
  onBlur = undefined,
  onChange = undefined,
}: NumberInputProps) {
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext();

  const [inputValue, setInputValue] = useState<string | number | undefined>(
    value,
  );

  useEffect(() => {
    const formValue = getValues(name);
    const normalizedValue =
      formValue === undefined || Number.isNaN(formValue) ? '' : formValue;
    setInputValue(normalizedValue ?? value ?? undefined);
  }, [getValues, name, value]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormControl
          isInvalid={!!errors[name]}
          hidden={hidden}
          mt={mt}
          mb={mb}
          ml={ml}
          mr={mr}
        >
          <FormLabel alignSelf='flex-start'>{label}</FormLabel>
          <ChakraNumberInput
            value={inputValue ?? getValues(name) ?? ''}
            hidden={hidden}
            min={min}
            max={max}
            onChange={(_, valueAsNumber) => {
              const normalizedValue = Number.isNaN(valueAsNumber)
                ? undefined
                : valueAsNumber;

              field.onChange(normalizedValue);
              if (onChange && normalizedValue !== undefined) {
                onChange(normalizedValue);
              }
              setInputValue(normalizedValue ?? '');
            }}
            onFocus={onFocus}
            onBlur={onBlur}
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
