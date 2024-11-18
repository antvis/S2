import type { S2Options, S2Theme } from '@antv/s2';
import type { SheetThemeColorType, SheetThemeType } from '../../common';
import type { BaseComponentProps } from '../../common/interface/components';

export interface ThemePanelOptions {
  hierarchyType: S2Options['hierarchyType'];
  themeType: (typeof SheetThemeType)[keyof typeof SheetThemeType];
  colorType: (typeof SheetThemeColorType)[keyof typeof SheetThemeColorType];
}

export interface ThemePanelProps extends BaseComponentProps<ThemePanelOptions> {
  /**
   * 历史自定义颜色记录上限
   * @default 5
   */
  maxHistoryColorCount?: number;

  /**
   * 禁用自定义颜色选择器
   * @default false
   */
  disableCustomPrimaryColorPicker?: boolean;

  /**
   * 选择
   */
  onChange?: (options: ThemePanelOptions, theme: S2Theme) => void;

  /**
   * 重置
   */
  onReset?: (
    options: ThemePanelOptions,
    prevOptions: ThemePanelOptions,
    theme: S2Theme,
  ) => void;
}
