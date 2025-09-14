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
    input: (base) => ({
      ...base,
      color: isDark ? uspolis.white : uspolis.black,
    }),
    placeholder: (base) => ({
      ...base,
      color: isDark ? uspolis.white : uspolis.black,
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? uspolis.white : uspolis.black,
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: isDark ? uspolis.darkBlue : uspolis.blue,
      color: isDark ? uspolis.white : uspolis.black,
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: isDark ? uspolis.white : uspolis.black,
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: isDark ? uspolis.white : uspolis.black,
      ':hover': {
        backgroundColor: isDark ? uspolis.darkRed : uspolis.red,
        color: uspolis.white,
      },
    }),
    control: (base, state) => ({
      ...base,
      backgroundColor: isDark ? uspolis.black : uspolis.white,
      borderColor: state.isFocused
        ? isDark
          ? uspolis.darkBlue
          : uspolis.blue
        : isDark
          ? uspolis.white
          : uspolis.blue,
      color: isDark ? uspolis.white : uspolis.black,
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? uspolis.black : uspolis.white,
      color: isDark ? uspolis.white : uspolis.blue,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor:
        state.isFocused || state.isSelected
          ? isDark
            ? uspolis.darkBlue // hover dark
            : uspolis.lightBlue // hover light
          : isDark
            ? uspolis.black // normal dark
            : uspolis.white, // normal light
      color: isDark ? uspolis.white : uspolis.blue,
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
      // theme={(reactSelectTheme) => ({
      //   ...reactSelectTheme,
      //   colors: {
      //     ...reactSelectTheme.colors,
      //     primary: isDark ? uspolis.darkBlue : uspolis.blue,
      //     primary25: isDark ? uspolis.darkBlue : uspolis.blue,
      //     neutral0: isDark ? uspolis.black : uspolis.white, // background
      //     neutral80: isDark ? uspolis.darkBlue : uspolis.blue, // texto
      //   },
      // })}
    />
  );
}
export default TooltipSelect;
