import { CornerCell } from '@/cell';

// 文本内容的水平对齐方式, 默认 left
export type TextAlign = 'left' | 'center' | 'right';

// 绘制文本时的基线, 对应垂直方向对齐方式 默认 bottom
export type TextBaseline = 'top' | 'middle' | 'bottom';
export interface Palette {
  /* brand colors */
  brandColors: string[];
  /* neutral colors */
  grayColors: string[];
  /* semantic colors */
  semanticColors?: {
    red?: string;
    green?: string;
  };
}

export interface Padding {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface Margin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface TextTheme {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fill?: string;
  opacity?: number;
  textAlign?: TextAlign;
  textBaseline?: TextBaseline;
}

export interface CellTheme {
  /* 偶数行单元格背景色 */
  crossBackgroundColor?: string;
  /* 单元格背景色 */
  backgroundColor?: string;
  /* 单元格背景色透明度 */
  backgroundColorOpacity?: number;
  /* hover 态单元格背景色 */
  hoverBackgroundColor?: string;
  /* hover 十字器背景色 */
  hoverLinkageBackgroundColor?: string;
  /* 选中态单元格背景色 */
  selectedBackgroundColor?: string;
  /* 单元格水平边线颜色 */
  horizontalBorderColor?: string;
  /* 单元格水平边线颜色透明度 */
  horizontalBorderColorOpacity?: number;
  /* 单元格垂直边线颜色 */
  verticalBorderColor?: string;
  /* 单元格垂直边线颜色透明度 */
  verticalBorderColorOpacity?: number;
  /* hover 态单元格边线颜色 */
  hoverBorderColor?: string;
  /* 选中态单元格边线颜色 */
  selectedBorderColor?: string;
  /* 预选中态单元格边线 */
  prepareSelectBorderColor?: string;
  /* 单元格水平边线宽度 */
  horizontalBorderWidth?: number;
  /* 单元格垂直边线宽度 */
  verticalBorderWidth?: number;
  /* hover 态单元格边线宽度 */
  hoverBorderWidth?: number;
  /* 选中态单元格边线宽度 */
  selectedBorderWidth?: number;
  /* 单元格内边距 */
  padding: Padding;
  /* 单元格内条件格式-迷你条形图高度 */
  miniBarChartHeight?: number;
  /* 额外属性字段 */
  [key: string]: any;
}

export interface IconTheme {
  /* icon 填充色 */
  fill?: string;
  /* icon 圆角 */
  radius?: number;
  /* icon  大小 */
  size?: number;
  /* icon 外边距 */
  margin?: Margin;
  /* icon 内边距 */
  padding?: Padding;
}

export interface ScrollBarTheme {
  /* 滚动条轨道颜色 */
  trackColor?: string;
  /* 滚动条 hover 态颜色 */
  thumbHoverColor?: string;
  /* 滚动条颜色 */
  thumbColor?: string;
  /* 滚动条尺寸 */
  size?: number;
  /* 滚动条 hover 态尺寸 */
  hoverSize?: number;
}

export interface SplitLine {
  /* 水平分割线颜色 */
  horizontalBorderColor?: string;
  /* 水平分割线颜色透明度 */
  horizontalBorderColorOpacity?: number;
  /* 水平分割线宽度 */
  horizontalBorderWidth?: number;
  /* 垂直分割线颜色 */
  verticalBorderColor?: string;
  /* 垂直分割线颜色透明度 */
  verticalBorderColorOpacity?: number;
  /* 垂直分割线宽度 */
  verticalBorderWidth?: number;
  /* 分割线是否显示右侧外阴影 */
  showRightShadow?: boolean;
  /* 阴影宽度 */
  shadowWidth?: number;
  /* 阴影线性渐变色，第一个为起始颜色，第二个为结束颜色 */
  shadowColors?: [string, string];
}
export interface DefaultCellTheme {
  /* 粗体文本样式 */
  bolderText?: TextTheme;
  /* 文本样式 */
  text?: TextTheme;
  /* 单元格样式 */
  cell?: CellTheme;
  /* 图标样式 */
  icon?: IconTheme;
}

export interface SpreadSheetTheme {
  /* 角头样式 */
  corner?: DefaultCellTheme;
  /* 行头样式 */
  rowHeader?: DefaultCellTheme;
  /* 列头样式 */
  colHeader?: DefaultCellTheme;
  /* 交叉单于格样式 */
  dataCell?: DefaultCellTheme;
  /* 滚动条样式 */
  scrollBar?: ScrollBarTheme;
  /* 分割线样式 */
  splitLine?: SplitLine;
  /* 额外属性字段 */
  [key: string]: any;
}
