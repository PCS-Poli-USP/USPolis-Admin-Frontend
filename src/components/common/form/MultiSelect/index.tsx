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
  values?: Option[];
  loading?: boolean;
  onChange?: () => void;
}

export function MultiSelect({
  label,
  name,
  options,
  disabled = false,
  loading = false,
  values = undefined,
  placeholder = "Selecione uma ou mais opções",
  mt = undefined,
  mb = undefined,
  mr = undefined,
  ml = undefined,
  onChange = undefined,
}: MultiSelectProps) {
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const [selectedOptions, setSelectedOptions] = useState<Option[] | undefined>(
    undefined,
  );

  useEffect(() => {
    if (values) {
      setValue(
        name,
        values.map((val) => val.value),
      );
      setSelectedOptions(values);
    } else {
      const current: (string | number)[] = getValues(name);
      if (current) {
        setSelectedOptions(
          options.filter((option) => current.includes(option.value)),
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, name, options]);

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
            closeMenuOnSelect={false}
            onChange={(selectedOption) => {
              const values = (selectedOption || []).map(
                (option) => option.value,
              );
              setValue(name, values);
              setSelectedOptions(selectedOption as Option[]);
              if (onChange) {
                onChange();
              }
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
