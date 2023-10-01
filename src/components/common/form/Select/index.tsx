import { Flex, FormLabel, Select as ChakraSelect } from '@chakra-ui/react';
import { FieldProps } from 'models/interfaces';
import { useFormContext } from 'react-hook-form';

type Option = {
  label: string;
  value: string;
};

interface SelectProps extends FieldProps {
  options: Option[];
}

export function Select({ label, name, options }: SelectProps) {
  const { register } = useFormContext();

  return (
    <Flex direction='column' w='100%'>
      <FormLabel alignSelf='flex-start'>{label}</FormLabel>
      <ChakraSelect {...register(name)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </ChakraSelect>
    </Flex>
  );
}
