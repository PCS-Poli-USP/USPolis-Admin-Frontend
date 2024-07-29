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
  value?: string | number;
  onChange?: (value: Option | undefined) => void;
}

export function SelectInput({
  label,
  name,
  options,
  disabled = false,
  placeholder = undefined,
  isLoading = false,
  mt = undefined,
  mb = undefined,
  mr = undefined,
  ml = undefined,
  onChange = undefined,
}: SelectProps) {
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext();

  const [selectedOption, setSelectedOption] = useState<Option>();

  useEffect(() => {
    const current: string | number = getValues(name);
    if (current) {
      setSelectedOption(options.find((option) => option.value === current));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, options]);

  return (
    <FormControl isInvalid={!!errors[name]} mt={mt} mb={mb} ml={ml} mr={mr}>
      <FormLabel alignSelf='flex-start'>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            id={name}
            value={selectedOption}
            isDisabled={disabled || isLoading}
            placeholder={placeholder ? placeholder : 'Selecione uma opção'}
            isClearable={true}
            // icon={isLoading ? <Spinner /> : <ChevronDownIcon />}
            onChange={(option) => {
              if (onChange) onChange(option ? option : undefined);
              setValue(name, option ? option.value : undefined);
              setSelectedOption(
                options.find((opt) => opt.value === option?.value),
              );
            }}
            options={options}
            classNames={{
              control: (state) =>
                state.isFocused ? 'border-red-600' : 'border-grey-300',
            }}
          />
        )}
      />
      {/* <ChakraSelect
        {...register(name)}
        disabled={disabled || isLoading}
        value={value}
        placeholder={placeholder}
        icon={isLoading ? <Spinner /> : <ChevronDownIcon />}
        onChange={onChange}
      >
        {placeholder ? (
          undefined
        ) : (
          <option value={undefined}>Selecione uma opção</option>
        )}
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </ChakraSelect> */}
      <FormErrorMessage>{errors[name]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  );
}
