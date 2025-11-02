import { Tooltip, useColorMode, useTheme } from '@chakra-ui/react';
import Select, {
  components as SelectComponents,
  type Props as SelectProps,
  type OptionProps,
  type GroupBase,
  SelectInstance,
  StylesConfig,
} from 'react-select';

export type Option = {
  label: string;
  value: string | number;
  tooltip?: string;
};

const CustomOption = <IsMulti extends boolean = false>(
  props: OptionProps<Option, IsMulti, GroupBase<Option>>,
) => {
  const { tooltip } = props.data;
  return (
    <Tooltip label={tooltip} placement='right' isDisabled={!tooltip}>
      <div>
        <SelectComponents.Option {...props} />
      </div>
    </Tooltip>
  );
};

type TooltipSelectProps<IsMulti extends boolean> = SelectProps<
  Option,
  IsMulti,
  GroupBase<Option>
> & {
  ref?: React.Ref<SelectInstance<Option, IsMulti, GroupBase<Option>>>;
};

function TooltipSelect<IsMulti extends boolean = false>(
  props: TooltipSelectProps<IsMulti>,
) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const theme = useTheme();
  const uspolis = theme.colors.uspolis as Record<string, string>;

  const defaultStyles: StylesConfig<Option, IsMulti, GroupBase<Option>> = {
    input: (base, state) => ({
      ...base,
      color: state.isDisabled
        ? isDark
          ? uspolis.gray
          : uspolis.lightGray
        : isDark
          ? uspolis.white
          : uspolis.black,
      cursor: state.isDisabled ? 'not-allowed' : 'text',
    }),

    placeholder: (base, state) => ({
      ...base,
      color: state.isDisabled
        ? isDark
          ? uspolis.gray
          : uspolis.lightGray
        : isDark
          ? uspolis.white
          : uspolis.black,
    }),

    singleValue: (base, state) => ({
      ...base,
      color: state.isDisabled
        ? isDark
          ? uspolis.gray
          : uspolis.lightGray
        : isDark
          ? uspolis.white
          : uspolis.black,
      cursor: state.isDisabled ? 'not-allowed' : 'default',
    }),

    multiValue: (base, state) => ({
      ...base,
      backgroundColor: isDark ? uspolis.darkBlue : uspolis.blue,
      opacity: state.isDisabled ? 0.6 : 1,
      cursor: state.isDisabled ? 'not-allowed' : 'default',
    }),

    multiValueLabel: (base, state) => ({
      ...base,
      color: isDark ? uspolis.white : uspolis.black,
      opacity: state.isDisabled ? 0.6 : 1,
      cursor: state.isDisabled ? 'not-allowed' : 'default',
    }),

    multiValueRemove: (base, state) => ({
      ...base,
      color: isDark ? uspolis.white : uspolis.black,
      cursor: state.isDisabled ? 'not-allowed' : 'pointer',
      ':hover': !state.isDisabled
        ? {
            backgroundColor: isDark ? uspolis.darkRed : uspolis.red,
            color: uspolis.white,
          }
        : undefined,
    }),

    control: (base, state) => ({
      ...base,
      backgroundColor: isDark ? uspolis.black : uspolis.white,
      borderColor: state.isDisabled
        ? isDark
          ? uspolis.gray
          : uspolis.lightGray
        : state.isFocused
          ? isDark
            ? uspolis.darkBlue
            : uspolis.blue
          : isDark
            ? uspolis.white
            : uspolis.blue,
      color: isDark ? uspolis.white : uspolis.black,
      opacity: state.isDisabled ? 0.6 : 1,
      cursor: state.isDisabled ? 'not-allowed' : 'default',
    }),

    valueContainer: (base, state) => ({
      ...base,
      cursor: state.isDisabled ? 'not-allowed' : 'default',
    }),

    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? uspolis.black : uspolis.white,
      color: isDark ? uspolis.white : uspolis.blue,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isDisabled
        ? isDark
          ? uspolis.black
          : uspolis.white
        : state.isFocused || state.isSelected
          ? isDark
            ? uspolis.darkBlue
            : uspolis.lightBlue
          : isDark
            ? uspolis.black
            : uspolis.white,
      color: state.isDisabled
        ? isDark
          ? uspolis.gray
          : uspolis.lightGray
        : isDark
          ? uspolis.white
          : uspolis.blue,
      cursor: state.isDisabled
        ? 'not-allowed'
        : state.isSelected
          ? 'default'
          : 'pointer',
      pointerEvents: state.isDisabled ? 'none' : 'auto',
      opacity: state.isDisabled ? 0.5 : 1,
    }),
  };

  const customStyles = props.styles;

  // merge: customStyles sobrescreve default apenas onde definido
  const mergedStyles: StylesConfig<Option, IsMulti, GroupBase<Option>> = {
    ...defaultStyles,
    ...customStyles,
    control: (base, state) => ({
      ...(defaultStyles.control ? defaultStyles.control(base, state) : {}),
      ...(customStyles?.control ? customStyles.control(base, state) : {}),
    }),
    menu: (base, state) => ({
      ...(defaultStyles.menu ? defaultStyles.menu(base, state) : {}),
      ...(customStyles?.menu ? customStyles.menu(base, state) : {}),
    }),
    option: (base, state) => ({
      ...(defaultStyles.option ? defaultStyles.option(base, state) : {}),
      ...(customStyles?.option ? customStyles.option(base, state) : {}),
    }),
  };

  return (
    <Select
      {...props}
      components={{
        Option: CustomOption,
      }}
      styles={mergedStyles}
    />
  );
}
export default TooltipSelect;
