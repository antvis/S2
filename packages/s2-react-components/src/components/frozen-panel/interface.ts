import type { BaseComponentProps } from '../../common/interface/components';
import type { FrozenInputNumberProps } from './frozen-input-number/interface';

export interface FrozenPanelOptions {
  frozenRowHeader?: boolean;
  frozenRow: [number?, number?];
  frozenCol: [number?, number?];
}

export interface FrozenPanelProps
  extends BaseComponentProps<FrozenPanelOptions> {
  /**
   * <InputNumber /> 透传参数
   */
  inputNumberProps?: Partial<FrozenInputNumberProps>;

  /**
   * 是否开启 [冻结行头]
   */
  showFrozenRowHeader?: boolean;

  /**
   * 是否开启 [冻结行]
   */
  showFrozenRow?: boolean;

  /**
   * 是否开启 [冻结列]
   */
  showFrozenCol?: boolean;

  /**
   * 选择
   */
  onChange?: (options: FrozenPanelOptions) => void;

  /**
   * 重置
   */
  onReset?: (
    options: FrozenPanelOptions,
    prevOptions: FrozenPanelOptions,
  ) => void;
}
