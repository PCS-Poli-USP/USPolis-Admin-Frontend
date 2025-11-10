import {
  Box,
  HStack,
  useColorMode,
  useRadio,
  useRadioGroup,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

interface RadioButtonProps {
  options: { value: string; label: string }[];
  name: string;
  colors?: string[];
  defaultValue?: string;
  isInvalid?: boolean;
  onChange?: (nextValue: string) => void;
  wrap?: boolean;
}

// 1. Create a component that consumes the `useRadio` hook
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RadioCard(props: any) {
  const { colorMode } = useColorMode();
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <WrapItem>
      <Box as='label'>
        <input {...input} />
        <Box
          {...checkbox}
          cursor='pointer'
          borderWidth='1px'
          borderRadius='md'
          boxShadow='md'
          _checked={{
            bg: props.color,
            color: colorMode == 'dark' ? 'uspolis.text' : 'uspolis.white',
            borderColor: props.color,
          }}
          _focus={{
            boxShadow: 'outline',
          }}
          borderColor={props.isInvalid ? 'uspolis.red' : 'uspolis.blue'}
          px={5}
          py={3}
        >
          {props.children}
        </Box>
      </Box>
    </WrapItem>
  );
}

export function RadioButton(props: RadioButtonProps) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: props.name,
    defaultValue: props.defaultValue,
    onChange: props.onChange,
  });

  const group = getRootProps();

  return (
    <>
      {props.wrap ? (
        <Wrap {...group} flexWrap={props.wrap ? 'wrap' : 'nowrap'}>
          {props.options.map((opt, i) => {
            const radio = getRadioProps({ value: opt.value });
            return (
              <RadioCard
                key={opt.value}
                {...radio}
                color={props.colors ? props.colors[i] : 'uspolis.blue'}
                isInvalid={props.isInvalid}
              >
                {opt.label}
              </RadioCard>
            );
          })}
        </Wrap>
      ) : (
        <HStack {...group} flexWrap={props.wrap ? 'wrap' : 'nowrap'}>
          {props.options.map((opt, i) => {
            const radio = getRadioProps({ value: opt.value });
            return (
              <RadioCard
                key={opt.value}
                {...radio}
                color={props.colors ? props.colors[i] : 'uspolis.blue'}
                isInvalid={props.isInvalid}
              >
                {opt.label}
              </RadioCard>
            );
          })}
        </HStack>
      )}
    </>
  );
}
