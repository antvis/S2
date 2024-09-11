import type { S2Theme, TextAlign } from '@antv/s2';
import type { BaseComponentProps } from '../../common/interface/components';

export interface TextAlignPanelOptions {
  rowCellTextAlign?: TextAlign;
  colCellTextAlign?: TextAlign;
  dataCellTextAlign?: TextAlign;
}

export interface TextAlignPanelProps
  extends BaseComponentProps<TextAlignPanelOptions> {
  /**
   * 选择
   */
  onChange?: (options: TextAlignPanelOptions, theme: S2Theme) => void;

  /**
   * 重置
   */
  onReset?: (
    options: TextAlignPanelOptions,
    prevOptions: TextAlignPanelOptions,
    theme: S2Theme,
  ) => void;
}
