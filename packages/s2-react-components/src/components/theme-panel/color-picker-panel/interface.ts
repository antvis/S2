export interface ColorPickerPanelProps {
  /**
   * 自定义主色系颜色
   */
  primaryColor?: string;

  /**
   * 历史自定义颜色记录上限
   */
  maxHistoryColorCount?: number;

  /**
   * 颜色选择回调
   */
  onChange?: (color: string) => void;
}
