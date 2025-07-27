import { FormLabel, FormControl, FormErrorMessage } from '@chakra-ui/react';
import { FieldProps } from '../form.interface';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MultiValue } from 'react-select';
import TooltipSelect from '../../TooltipSelect';

export type Option = {
  label: string;
  value: string | number;
};

interface MultiSelectProps extends FieldProps {
  options: Option[];
  isLoading?: boolean;
  onChange?: (options: Option[]) => void;
}

export function MultiSelect({
  label,
  name,
  options,
  disabled = false,
  isLoading = false,
  hidden = false,
  placeholder = 'Selecione uma ou mais opções',
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
    const current: (string | number)[] = getValues(name);
    if (current) {
      setSelectedOptions(
        options.filter((option) => current.includes(option.value)),
      );
    } else setSelectedOptions([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, options]);

  return (
    <FormControl
      isInvalid={!!errors[name]}
      mt={mt}
      mb={mb}
      ml={ml}
      mr={mr}
      hidden={hidden}
    >
      <FormLabel alignSelf='flex-start'>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TooltipSelect
            {...field}
            id={name}
            value={selectedOptions}
            isLoading={isLoading}
            isDisabled={disabled || isLoading}
            placeholder={placeholder}
            isMulti={true}
            isClearable={true}
            closeMenuOnSelect={false}
            onChange={(selectedOption: MultiValue<Option>) => {
              if (onChange) {
                onChange(selectedOption as Option[]);
              }
              const values = (selectedOption || []).map(
                (option) => option.value,
              );
              setValue(name, values);
              setSelectedOptions(selectedOption as Option[]);
            }}
            options={options}
          />
        )}
      />
      <FormErrorMessage>{errors[name]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  );
}
