export interface FieldPropsBase {
  name: string;
  placeholder?: string;
  disabled?: boolean;
  hidden?: boolean;
  mt?: string | number;
  ml?: string | number;
  mr?: string | number;
  mb?: string | number;
  w?: string | number;
}

export interface FieldProps extends FieldPropsBase {
  label: string;
  isLoading?: boolean;
  
}
