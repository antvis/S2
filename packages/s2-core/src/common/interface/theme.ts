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
  semanticColors: {
    red?: string;
    green?: string;
    /* 额外颜色字段 */
    [key: string]: string;
  };
}

export interface Padding {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}
export interface InteractionStateTheme {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  opacity?: string | number;
}

export type Margin = Padding;

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
  /* 奇数行单元格背景色 */
  crossBackgroundColor?: string;
  /* 单元格背景色 */
  backgroundColor?: string;
  /* 单元格背景色透明度 */
  backgroundColorOpacity?: number;
  /* 单元格水平边线颜色 */
  horizontalBorderColor?: string;
  /* 单元格水平边线颜色透明度 */
  horizontalBorderColorOpacity?: number;
  /* 单元格垂直边线颜色 */
  verticalBorderColor?: string;
  /* 单元格垂直边线颜色透明度 */
  verticalBorderColorOpacity?: number;
  /* 单元格水平边线宽度 */
  horizontalBorderWidth?: number;
  /* 单元格垂直边线宽度 */
  verticalBorderWidth?: number;
  /* 单元格内边距 */
  padding: Padding;
  /* hover 单元格状态 */
  hover?: InteractionStateTheme;
  /* hover 焦点单元格 */
  hoverFocus?: InteractionStateTheme;
  /* 选中态 */
  selected?: InteractionStateTheme;
  /* 预选中态 */
  prepareSelect?: InteractionStateTheme;
  /* 单元格内条件格式-迷你条形图高度 */
  miniBarChartHeight?: number;
  /* 聚光灯之外的单元格 */
  outOfTheSpotlight?: InteractionStateTheme;
  /* 额外属性字段 */
  [key: string]: any;
}

export interface IconTheme {
  /* icon 填充色 */
  fill?: string;
  /* 下跌 icon 填充色 */
  downIconColor?: string;
  /* 上涨 icon 填充色 */
  upIconColor?: string;
  /* icon 圆角 */
  radius?: number;
  /* icon  大小 */
  size?: number;
  /* icon 外边距 */
  margin?: Margin;
}

export interface ScrollBarTheme {
  /* 滚动条轨道颜色 */
  trackColor?: string;
  /* 滚动条 hover 态颜色 */
  thumbHoverColor?: string;
  /* 滚动条颜色 */
  thumbColor?: string;
  mobileThumbColor?: string;
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
  /* 阴影线性渐变色 */
  shadowColors?: {
    /* 线性变化左侧颜色 */
    left: string;
    /* 线性变化右侧颜色 */
    right: string;
  };
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
  seriesNumberWidth?: number;
}

export interface SpreadSheetTheme {
  /* 角头样式 */
  cornerCell?: DefaultCellTheme;
  /* 行头样式 */
  rowCell?: DefaultCellTheme;
  /* 列头样式 */
  colCell?: DefaultCellTheme;
  /* 交叉单于格样式 */
  dataCell?: DefaultCellTheme;
  /* 滚动条样式 */
  scrollBar?: ScrollBarTheme;
  /* 分割线样式 */
  splitLine?: SplitLine;
  /* 额外属性字段 */
  [key: string]: any;
}

export type ThemeName = 'default' | 'simple' | 'colorful';

export interface ThemeCfg {
  /* 主题 */
  theme?: SpreadSheetTheme;
  /* 色板 */
  palette?: Palette;
  /* 主题名 */
  name?: ThemeName;
  /* 是否色板转置 */
  hueInvert?: boolean;
}
