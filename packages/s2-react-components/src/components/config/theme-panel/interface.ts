import type { S2Theme } from '@antv/s2';
import type { SheetComponentOptions } from '@antv/s2-react';
import type { SheetThemeColorType, SheetThemeType } from '../../../common';

export interface ThemePanelOptions {
  hierarchyType: SheetComponentOptions['hierarchyType'];
  themeType: (typeof SheetThemeType)[keyof typeof SheetThemeType];
  colorType: (typeof SheetThemeColorType)[keyof typeof SheetThemeColorType];
}

export interface ThemePanelProps {
  children?: React.ReactNode;

  /**
   * 标题
   * @default "主题风格"
   */
  title?: React.ReactNode;

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
   * 默认是否折叠
   * @default false
   */
  defaultCollapsed?: boolean;

  /**
   * 默认配置
   */
  defaultOptions?: Partial<ThemePanelOptions>;

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
