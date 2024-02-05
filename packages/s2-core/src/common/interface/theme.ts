import type { LineStyleProps, TextStyleProps } from '@antv/g';
import type { CellType } from '../../common/constant/interaction';
import type { InteractionStateName } from '../constant';
import type { PALETTE_MAP } from '../constant/theme';
import type { DeepRequired } from './type-utils';

// 文本内容的水平对齐方式, 默认 left
export type TextAlign = 'left' | 'center' | 'right';

// 绘制文本时的基线, 对应垂直方向对齐方式 默认 bottom
export type TextBaseline = 'top' | 'middle' | 'bottom';

export interface PaletteMeta {
  /** 主题色 */
  brandColor: string;

  /**
   * basicColors 与标准色卡 standardColors 数组下标的对应关系
   * @see generateStandardColors
   */
  basicColorRelations: Array<{
    basicColorIndex: number;
    standardColorIndex: number;
  }>;

  /** 语义色值 */
  semanticColors: {
    red: string;
    green: string;
    yellow: string;
    [key: string]: string;
  };

  /** 补充色值 */
  others?: {
    results: string;
    highlight: string;
    [key: string]: string;
  };
}

export interface Palette extends PaletteMeta {
  /**
   * 基础色值（共15个）
   *
   * 1. 角头字体、列头字体
   * 2. 行头背景、数据格背景(斑马纹)
   * 3. 行头&数据格交互(hover、选中、十字)
   * 4. 角头背景、列头背景
   * 5. 列头交互(hover、选中)
   * 6. 刷选遮罩
   * 7. 行头 link
   * 8. mini bar、resize 交互(参考线等)
   * 9. 数据格背景(非斑马纹)、整体表底色(建议白色)
   * 10. 行头边框、数据格边框
   * 11. 角头边框、列头边框
   * 12. 竖向大分割线
   * 13. 横向大分割线
   * 14. 数据格字体
   * 15. 行头字体、数据格交互色(hover)
   */
  basicColors: string[];
}

export interface Padding {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface Background {
  opacity?: number;
  color?: string;
}

export interface InteractionStateTheme {
  /** 背景透明度 */
  backgroundOpacity?: number;

  /** 背景填充色 */
  backgroundColor?: string;

  /** 文本透明度 */
  textOpacity?: number;

  /** 边线颜色 */
  borderColor?: string;

  /** 边线宽度 */
  borderWidth?: number;

  /** 边线透明度 */
  borderOpacity?: number;

  /** 透明度 */
  opacity?: number;
}

export type InteractionState = {
  [K in InteractionStateName]?: InteractionStateTheme;
};

export type Margin = Padding;

export interface TextAlignStyle {
  textAlign?: TextAlign;
  textBaseline?: TextBaseline;
}

export interface TextTheme
  extends TextAlignStyle,
    Pick<
      TextStyleProps,
      | 'fontFamily'
      | 'fontSize'
      | 'fontWeight'
      | 'fill'
      | 'opacity'
      | 'lineHeight'
      | 'fontStyle'
      | 'fontVariant'
    > {
  /** 字体大小 */
  fontSize?: number;

  /** 字体颜色 */
  fill?: string;

  /** 链接文本颜色 */
  linkTextFill?: string;
}

export interface CellTheme {
  /** 奇数行单元格背景色 */
  crossBackgroundColor?: string;

  /** 单元格背景色 */
  backgroundColor?: string;

  /** 单元格背景色透明度 */
  backgroundColorOpacity?: number;

  /** 单元格水平边线颜色 */
  horizontalBorderColor?: string;

  /** 单元格水平边线颜色透明度 */
  horizontalBorderColorOpacity?: number;

  /** 单元格垂直边线颜色 */
  verticalBorderColor?: string;

  /** 单元格垂直边线颜色透明度 */
  verticalBorderColorOpacity?: number;

  /** 单元格水平边线宽度 */
  horizontalBorderWidth?: number;

  /** 单元格垂直边线宽度 */
  verticalBorderWidth?: number;

  /** 单元格内边距 */
  padding?: Padding;

  /** 交互态 */
  interactionState?: InteractionState;

  /** 单元格边线虚线 */
  borderDash?: LineStyleProps['lineDash'];
}

export interface IconTheme {
  /** icon 填充色 */
  fill?: string;

  /** icon  大小 */
  size?: number;

  /** icon 外边距 */
  margin?: Margin;
}

export interface ResizeArea {
  /** 热区尺寸 */
  size?: number;

  /** 热区背景色 */
  background?: string;

  /** 参考线颜色 */
  guideLineColor?: string;

  /** 参考线不可用颜色 */
  guideLineDisableColor?: string;

  /** 参考线间隔 */
  guideLineDash?: number[];

  /** 热区背景色透明度 */
  backgroundOpacity?: number;

  /** 交互态 */
  interactionState?: InteractionState;
}

export interface ScrollBarTheme {
  /** 滚动条轨道颜色 */
  trackColor?: string;

  /** 滚动条 hover 态颜色 */
  thumbHoverColor?: string;

  /** 滚动条颜色 */
  thumbColor?: string;

  /** 滚动条水平最小尺寸 */
  thumbHorizontalMinSize?: number;

  /** 滚动条垂直最小尺寸 */
  thumbVerticalMinSize?: number;

  /** 滚动条尺寸 */
  size?: number;

  /** 滚动条 hover 态尺寸 */
  hoverSize?: number;

  /** 指定如何绘制每一条线段末端，lineCap?: 'butt' | 'round' | 'square'; */
  lineCap?: LineStyleProps['lineCap'];
}

export interface SplitLine {
  /** 水平分割线颜色 */
  horizontalBorderColor?: string;

  /** 水平分割线颜色透明度 */
  horizontalBorderColorOpacity?: number;

  /** 水平分割线宽度 */
  horizontalBorderWidth?: number;

  /** 垂直分割线颜色 */
  verticalBorderColor?: string;

  /** 垂直分割线颜色透明度 */
  verticalBorderColorOpacity?: number;

  /** 垂直分割线宽度 */
  verticalBorderWidth?: number;

  /** 分割线是否显示外阴影 */
  showShadow?: boolean;

  /** 阴影宽度 */
  shadowWidth?: number;

  /** 阴影线性渐变色 */
  shadowColors?: {
    /** 线性变化左侧颜色 */
    left: string;

    /** 线性变化右侧颜色 */
    right: string;
  };
  /** 分割线虚线 */
  borderDash?: LineStyleProps['lineDash'];
}
export interface DefaultCellTheme extends GridAnalysisCellTheme {
  /** 粗体文本样式 */
  bolderText?: TextTheme;

  /** 文本样式 */
  text?: TextTheme;

  /** 序号样式 */
  seriesText?: TextTheme;

  /** 度量值文本样式 */
  measureText?: TextTheme;

  /** 单元格样式 */
  cell?: CellTheme;

  /** 图标样式 */
  icon?: IconTheme;

  /** mini 图样式配置 */
  miniChart?: MiniChartTheme;

  /** 序号列宽 */
  seriesNumberWidth?: number;
}

export interface GridAnalysisCellTheme {
  /** 次级文本，如副指标 */
  minorText?: TextTheme;
  /** 衍生指标 */
  derivedMeasureText?: {
    mainUp: string;
    mainDown: string;
    minorUp: string;
    minorDown: string;
  };
}

export type CellThemes = {
  [K in CellType]?: DefaultCellTheme;
};

export interface S2Theme extends CellThemes {
  /** 列宽行高调整热区 */
  resizeArea?: ResizeArea;

  /** 滚动条样式 */
  scrollBar?: ScrollBarTheme;

  /** 分割线样式 */
  splitLine?: SplitLine;

  /** 刷选遮罩 */
  prepareSelectMask?: InteractionStateTheme;

  /** 画布背景底色 */
  background?: Background;
}

export type ThemeName = keyof typeof PALETTE_MAP;

export interface ThemeCfg {
  /** 主题 */
  theme?: S2Theme;

  /** 色板 */
  palette?: Pick<Palette, 'basicColors' | 'semanticColors' | 'others'>;

  /** 主题名 */
  name?: ThemeName;
}

/** 子弹图状态颜色 */
export interface RangeColors {
  /** 满意 */
  good: string;

  /** 良好 */
  satisfactory: string;

  /** 不符合预期 */
  bad: string;
}

/** 子弹图样式配置 */
export interface BulletTheme {
  /** 进度条 */
  progressBar: {
    /** 子弹图宽度相对单元格 content 占比，小数 */
    widthPercent: number;
    height: number;

    /** 内高度 */
    innerHeight: number;
  };

  /** 测量标记线 */
  comparativeMeasure: {
    width: number;
    height: number;
    fill?: string;
    opacity?: number;
  };

  /** 子弹图状态颜色 */
  rangeColors: RangeColors;

  /** 子弹图背景色 */
  backgroundColor: string;
}

/** 折线图样式配置 */
export interface LineTheme {
  /** 点 */
  point?: {
    // 半径
    size: number;
    fill?: string;
    opacity?: number;
  };

  /** 线 */
  linkLine?: {
    size: number;
    fill?: string;
    opacity?: number;
  };
}

/** 柱状图样式配置 */
export interface BarTheme {
  // 柱状图之间的间隔距离
  intervalPadding?: number;
  fill?: string;
  opacity?: number;
}

/** 条件格式柱图样式配置 */

export interface IntervalTheme {
  height: number;
  fill: string;
}

/** 迷你图样式 */
export interface MiniChartTheme {
  line?: LineTheme;
  bar?: BarTheme;
  bullet?: BulletTheme;
  interval?: IntervalTheme;
}

export type InternalFullyCellTheme = DeepRequired<DefaultCellTheme>;
export type InternalFullyTheme = DeepRequired<S2Theme>;
