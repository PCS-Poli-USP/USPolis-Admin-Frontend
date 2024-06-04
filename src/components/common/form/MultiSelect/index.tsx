import { FormLabel, FormControl, FormErrorMessage } from '@chakra-ui/react';
import { FieldProps } from 'models/interfaces';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

type Option = {
  label: string;
  value: string | number;
};

interface MultiSelectProps extends FieldProps {
  options: Option[];
  value?: Option[];
  loading?: boolean;
}

export function MultiSelect({
  label,
  name,
  options,
  disabled = false,
  loading = false,
  value = undefined,
  placeholder = undefined,
}: MultiSelectProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormControl isInvalid={!!errors[name]}>
          <FormLabel alignSelf='flex-start'>{label}</FormLabel>
          <Select
            value={value}
            isLoading={loading}
            isDisabled={disabled}
            placeholder={placeholder}
            isMulti={true}
            onChange={(selectedOption) => {
              const values = selectedOption.map(
                (option: Option) => option.value,
              );
              field.onChange(values);
              return;
            }}
            options={options}
          />
          <FormErrorMessage>
            {errors[name]?.message?.toString()}
          </FormErrorMessage>
        </FormControl>
      )}
    />
  );
}
