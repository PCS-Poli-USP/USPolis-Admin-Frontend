import {
  Checkbox as ChakraCheckBox,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FieldPropsBase } from '../form.interface';

interface CheckBoxProps extends FieldPropsBase {
  text?: string;
  label?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function CheckBox({
  label,
  name,
  text = undefined,
  disabled = false,
  hidden = false,
  placeholder = undefined,
  mt = undefined,
  mb = undefined,
  mr = undefined,
  ml = undefined,
  onChange = undefined,
}: CheckBoxProps) {
  const {
    register,
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
    >
      <FormLabel alignSelf='flex-start' hidden={label ? false : true}>
        {label}
      </FormLabel>
      <ChakraCheckBox
        {...register(name)}
        disabled={disabled}
        placeholder={placeholder}
        hidden={hidden}
        onChange={onChange}
      >
        {text}
      </ChakraCheckBox>
      <FormErrorMessage>{errors[name]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  );
}
