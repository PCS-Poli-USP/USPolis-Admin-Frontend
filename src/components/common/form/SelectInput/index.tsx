import { FormLabel, FormControl, FormErrorMessage } from '@chakra-ui/react';
import { FieldProps } from '../form.interface';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import { useEffect, useState } from 'react';

type Option = {
  label: string;
  value: string | number;
};

interface SelectProps extends FieldProps {
  options: Option[];
  onChange?: (value: Option | undefined) => void;
  validator?: (value: string | number) => boolean;
}

export function SelectInput({
  label,
  name,
  options,
  disabled = false,
  placeholder = undefined,
  hidden = false,
  isLoading = false,
  mt = undefined,
  mb = undefined,
  mr = undefined,
  ml = undefined,
  w = undefined,
  validator = undefined,
  onChange = undefined,
}: SelectProps) {
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext();

  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const isValidValue = (val: number | string) => {
    if (validator) return validator(val);
    return !!val;
  };

  useEffect(() => {
    const current: string | number = getValues(name);
    if (isValidValue(current)) {
      const option = options.find((option) => option.value === current);
      setSelectedOption(option ? option : null);
    } else setSelectedOption(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, options]);

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
          <Select
            {...field}
            id={name}
            value={selectedOption}
            isLoading={isLoading}
            isDisabled={disabled || isLoading}
            placeholder={placeholder ? placeholder : 'Selecione uma opção'}
            isMulti={false}
            isClearable={true}
            closeMenuOnSelect={true}
            onChange={(option: Option | null) => {
              if (onChange) onChange(option ? option : undefined);
              setValue(name, option ? option.value : '');
              const newOption = options.find(
                (opt) => opt.value === option?.value,
              );
              setSelectedOption(newOption ? newOption : null);
            }}
            options={options}
            classNames={{
              control: (state: any) =>
                state.isFocused ? 'border-red-600' : 'border-grey-300',
            }}
          />
        )}
      />
      <FormErrorMessage>{errors[name]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  );
}
