import { FormLabel, FormControl, FormErrorMessage } from '@chakra-ui/react';
import { FieldProps } from '../form.interface';
import { useEffect, useState } from 'react';
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
  onChange?: () => void;
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
  onChange = undefined,
}: MultiSelectProps) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [selectedOptions, setSelectedOptions] = useState<Option[] | undefined>(
    undefined,
  );

  useEffect(() => {
    if (value) {
      setValue(
        name,
        value.map((val) => val.value),
      );
      setSelectedOptions(value);
    }
  }, [value, name, setValue]);

  return (
    <Controller
      control={control}
      name={name}
      render={() => (
        <FormControl isInvalid={!!errors[name]} mt={mt} mb={mb} ml={ml} mr={mr}>
          <FormLabel alignSelf='flex-start'>{label}</FormLabel>
          <Select
            value={selectedOptions}
            isLoading={loading}
            isDisabled={disabled}
            placeholder={placeholder}
            isMulti={true}
            onChange={(selectedOption) => {
              const values = selectedOption.map(
                (option: Option) => option.value,
              );
              setValue(name, values);
              setSelectedOptions(selectedOption as Option[]);
              if (onChange) {
                onChange()
              }
              return
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
