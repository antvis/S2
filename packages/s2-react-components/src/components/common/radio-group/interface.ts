import { type RadioGroupProps as AntdRadioGroupProps } from 'antd';

export interface RadioGroupProps extends AntdRadioGroupProps {
  label: React.ReactNode;
  onlyIcon?: boolean;
  extra?: React.ReactNode;
}
