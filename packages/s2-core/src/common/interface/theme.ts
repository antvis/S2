export interface StyleConfig {
  // --------- color -----------
  brandColor?: string;
  neutralColor?: string;
  backgroundColor?: string;
  paletteSemanticRed?: string;
  paletteSemanticGreen?: string;

  // --------- text -------------
  fontSize?: {
    h1?: number;
    h2?: number;
    h3?: number;
  };
  fontOpacity?: {
    h1?: number;
    h2?: number;
    h3?: number;
  };
  textIndnt?: number;

  // ---------- border ----------
  borderWidth?: {
    h1?: number;
    h2?: number;
    h3?: number;
  };
  borderOpacity?: {
    h1?: number;
    h2?: number;
    h3?: number;
  };

  // ---------- icon --------------
  iconSize?: {
    h1?: number;
    h2?: number;
  };
  iconMargin?: {
    left?: number;
    top?: number;
    right?: number;
    down?: number;
  };

  // ----------- cell ------------
  padding?: {
    left?: number;
    top?: number;
    right?: number;
    down?: number;
  };

 [key: string]: any;
}

export interface CellTheme {
  // cell's border color [horizontal, vertical]
  borderColor?: [string, string];
  // cell's border width [horizontal, vertical]
  borderWidth?: [number, number];
  // 行按照奇偶数来绘制背景（偶数行颜色）
  crossColor?: string;
  // dataCell 单元格背景色
  backgroundColor?: string;
  // row cell 单元格背景色
  rowBackgroundColor?: string;
  // col cell 单元格背景色
  colBackgroundColor?: string;
  // corner header背景色
  cornerBackgroundColor?: string;
  // 单元格交互色
  interactiveBgColor?: string;
  // interactive bg opacity[default, selected]
  // 交互色在选择和非选中时的颜色饱和度
  interactiveFillOpacity?: [number, number];
  // cell的padding = top,right,bottom,left
  padding?: [number, number, number, number];
  // 文本在树形行头的的缩进值
  textIndent?: number;
  // 矩形条件格式的高度
  intervalBgHeight?: number;
  [key: string]: any;
}

export interface TextTheme {
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  textBaseline?: string;
  fontWeight?: string;
  textAlign?: string;
  // text opacity[default, selected]
  fillOpacity?: [number, number];
}

export interface IconTheme {
  radius?: number;
}

export interface ScrollBarTheme {
  trackColor?: string;
  thumbHoverColor?: string;
  thumbColor?: string;
  size?: number;
}

export interface HeaderTheme {
  cell?: CellTheme;
  text?: TextTheme;
  bolderText?: TextTheme;
  icon?: IconTheme;
  seriesNumberWidth?: number;
}

export interface DerivedMeasureTextTheme {
  mainUp?: string;
  mainDown?: string;
  minorUp?: string;
  minorDown?: string;
}

export interface ViewTheme {
  minorText?: TextTheme;
  derivedMeasureText?: DerivedMeasureTextTheme;
  text?: TextTheme;
  bolderText?: TextTheme;
  cell?: CellTheme;
}

export interface CenterTheme {
  verticalBorderColor?: string;
  verticalBorderWidth?: number;
  horizontalBorderColor?: string;
  horizontalBorderWidth?: number;
  showCenterRightShadow?: boolean;
  centerRightShadowWidth?: number;
  [key: string]: any;
}

export interface SpreadSheetTheme {
  fontFamily?: string;
  header?: HeaderTheme;
  view?: ViewTheme;
  scrollBar?: ScrollBarTheme;
  center?: CenterTheme;
  [key: string]: any;
}
