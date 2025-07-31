import { Tooltip } from '@chakra-ui/react';
import Select, {
  components as SelectComponents,
  type Props as SelectProps,
  type OptionProps,
  type GroupBase,
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
    <Tooltip
      label={tooltip}
      placement='right'
      isDisabled={!tooltip}
    >
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
>;

function TooltipSelect<IsMulti extends boolean = false>(
  props: TooltipSelectProps<IsMulti>,
) {
  return (
    <Select
      {...props}
      components={{
        Option: CustomOption,
      }}
    />
  );
}
export default TooltipSelect;
