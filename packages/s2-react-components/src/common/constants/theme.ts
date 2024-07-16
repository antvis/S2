import { S2_PREFIX_CLS } from '@antv/s2';

/** 默认色板 */
export const DEFAULT_THEME_COLOR_LIST = [
  '#5B8FF9',
  '#BDD2FD',
  '#F6903D',
  '#FFD8B8',
  '#F08BB4',
  '#FFD6E7',
];

/**
 * 当 sheetThemeColorType=自选色 且 sheetThemeType=basic 时
 * 需要自定义色板取色规则
 * 详见 s2 底表内置 palette 的 basicColorRelations 字段
 * 未定义关系的 basicColorIndex，底表会赋值为 #ffffff
 */
export const BASIC_SHEET_THEME_TYPE_COLOR_RELATIONS = [
  {
    basicColorIndex: 2,
    standardColorIndex: 1,
  },
  {
    basicColorIndex: 4,
    standardColorIndex: 1,
  },
  {
    basicColorIndex: 5,
    standardColorIndex: 2,
  },
  {
    basicColorIndex: 6,
    standardColorIndex: 6,
  },
  {
    basicColorIndex: 7,
    standardColorIndex: 5,
  },
  {
    basicColorIndex: 9,
    standardColorIndex: 1,
  },
  {
    basicColorIndex: 10,
    standardColorIndex: 1,
  },
  {
    basicColorIndex: 11,
    standardColorIndex: 4,
  },
  {
    basicColorIndex: 12,
    standardColorIndex: 4,
  },
];

// 浅色主题映射关系，和 colorful 的区别在于：会使用加深的主题色作为边框颜色
export const SECONDARY_THEME_COLOR_TYPE_RELATIONS = [
  {
    basicColorIndex: 1,
    standardColorIndex: 2,
  },
  {
    basicColorIndex: 2,
    standardColorIndex: 4,
  },
  {
    basicColorIndex: 3,
    standardColorIndex: 5,
  },
  {
    basicColorIndex: 4,
    standardColorIndex: 6,
  },
  {
    basicColorIndex: 5,
    standardColorIndex: 6,
  },
  {
    basicColorIndex: 6,
    standardColorIndex: 6,
  },
  {
    basicColorIndex: 7,
    standardColorIndex: 5,
  },
  {
    basicColorIndex: 9,
    standardColorIndex: 6,
  },
  {
    basicColorIndex: 10,
    standardColorIndex: 6,
  },
  {
    basicColorIndex: 11,
    standardColorIndex: 6,
  },
  {
    basicColorIndex: 12,
    standardColorIndex: 6,
  },
];

export const HISTORY_COLOR_LIST_STORAGE_KEY = `${S2_PREFIX_CLS.toUpperCase()}_HISTORY_COLOR_LIST_STORAGE_KEY`;

export const HISTORY_COLOR_LIST_MAX_COUNT = 6;

/**
 * 主题色系类型
 */
export enum SheetThemeColorType {
  /** 深色主题（默认取值) */
  PRIMARY = 'primary',
  /** 浅色主题 */
  SECONDARY = 'secondary',
  /** 灰色 */
  GRAY = 'gray',
  /** 自定义 */
  CUSTOM = 'custom',
}

/**
 * 主题类型
 */
export enum SheetThemeType {
  /** 默认 (使用 S2 默认主题) */
  DEFAULT = 'default',
  /** 多彩 */
  COLORFUL = 'colorful',
  /** 简约 */
  NORMAL = 'normal',
  /** 极简 */
  BASIC = 'basic',
  /** 斑马纹 */
  ZEBRA = 'zebra',
}
