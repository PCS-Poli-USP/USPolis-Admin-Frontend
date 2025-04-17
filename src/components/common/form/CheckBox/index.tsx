import {
  Checkbox as ChakraCheckBox,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { FieldPropsBase } from '../form.interface';

interface CheckBoxProps extends FieldPropsBase {
  text?: string;
  label?: string;
  onChange?: (value: boolean) => void;
}

export function CheckBox({
  label,
  name,
  text = undefined,
  disabled = false,
  hidden = false,
  mt = undefined,
  mb = undefined,
  mr = undefined,
  ml = undefined,
  onChange = undefined,
}: CheckBoxProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl
      w={'auto'}
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
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ChakraCheckBox
            {...field}
            id={name}
            w={'auto'}
            isChecked={field.value}
            isDisabled={disabled}
            onChange={(event) => {
              if (onChange) onChange(event.target.checked);
              field.onChange(event);
            }}
          >
            {text}
          </ChakraCheckBox>
        )}
      />
      <FormErrorMessage>{errors[name]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  );
}
