import { FormLabel, FormControl, FormErrorMessage } from '@chakra-ui/react';
import { FieldProps } from 'models/interfaces';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

export type Option = {
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
  mt = undefined,
  mb = undefined,
  mr = undefined,
  ml = undefined,
}: MultiSelectProps) {
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext();

  const [selectValue, setSelectValue] = useState(value);

  function getSelectedOptions(values: (string | number)[]) {
    return options.filter((option) => values.includes(option.value));
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormControl isInvalid={!!errors[name]} mt={mt} mb={mb} ml={ml} mr={mr}>
          <FormLabel alignSelf='flex-start'>{label}</FormLabel>
          <Select
            value={
              selectValue ? selectValue : getSelectedOptions(getValues(name))
            }
            isLoading={loading}
            isDisabled={disabled}
            placeholder={placeholder}
            isMulti={true}
            onChange={(selectedOption) => {
              const values = selectedOption.map(
                (option: Option) => option.value,
              );
              field.onChange(values);
              setSelectValue(selectedOption as Option[]);
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
