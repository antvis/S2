import type { S2Options } from '@antv/s2';
import type { SheetThemeColorType, SheetThemeType } from '../../common-extra';

export interface ThemePanelOptions {
  hierarchyType: S2Options['hierarchyType'];
  themeType: (typeof SheetThemeType)[keyof typeof SheetThemeType];
  colorType: (typeof SheetThemeColorType)[keyof typeof SheetThemeColorType];
}
