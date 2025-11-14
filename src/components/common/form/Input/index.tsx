import {
  FormLabel,
  Input as ChakraInput,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FieldProps } from '../form.interface';

interface InputProps extends FieldProps {
  type?: React.HTMLInputTypeAttribute;
  value?: string | number | readonly string[] | undefined;
  min?: string | number | undefined;
  max?: string | number | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  icon?: React.ReactNode;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export function Input({
  label,
  name,
  type = 'text',
  disabled = false,
  hidden = false,
  placeholder = undefined,
  min = undefined,
  max = undefined,
  w = undefined,
  mt = undefined,
  mb = undefined,
  mr = undefined,
  ml = undefined,
  onChange = undefined,
  icon = undefined,
  onFocus = undefined,
  onBlur = undefined,
}: InputProps) {
  const {
    control,
    // register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl
      isInvalid={!!errors[name]}
      hidden={hidden}
      mt={mt}
      mb={mb}
      ml={ml}
      mr={mr}
      w={w}
    >
      <FormLabel alignSelf='flex-start'>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InputGroup>
            {icon && (
              <InputLeftElement pointerEvents='none'>{icon}</InputLeftElement>
            )}
            <ChakraInput
              {...field}
              id={name}
              type={type}
              disabled={disabled}
              placeholder={placeholder}
              value={field.value || field.value === 0 ? field.value : ''}
              hidden={hidden}
              min={min}
              max={max}
              onChange={(event) => {
                if (max && event.target.value.length > Number(max)) return;
                if (onChange) onChange(event);
                field.onChange(event.target.value);
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </InputGroup>
        )}
      />
      {/* <ChakraInput
        {...register(name)}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        hidden={hidden}
        min={min}
        max={max}
        onChange={onChange}
      /> */}
      <FormErrorMessage>{errors[name]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  );
}
