import type { InputNumberProps } from 'antd';

export interface FrozenInputNumberProps
  extends Omit<InputNumberProps, 'value' | 'onChange'> {
  value: number | null;
  onChange?: (value: number) => void;
}
