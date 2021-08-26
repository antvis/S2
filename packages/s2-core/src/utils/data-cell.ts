import {
  CellBoxCfg,
  FilterDataItemCallback,
  IconCfg,
  MappingDataItemCallback,
  S2CellType,
  TextTheme,
  ViewMeta,
} from '@/common/interface';
import { SimpleBBox } from '@antv/g-canvas';
import { EXTRA_FIELD, VALUE_FIELD } from 'src/common/constant';
import { Data } from './../common/interface/s2DataConfig';
import { TextBaseline } from './../common/interface/theme';

export const getContentArea = (cellBoxCfg: CellBoxCfg) => {
  const { x, y, width, height, padding } = cellBoxCfg;

  const contentWidth: number = width - padding?.left - padding?.right;
  const contentHeight: number = height - padding?.top - padding?.bottom;

  return {
    x: x + padding?.left,
    y: y + padding?.top,
    width: contentWidth,
    height: contentHeight,
  };
};

export const getTextAndIconArea = (
  content: SimpleBBox,
  iconCfg?: IconCfg,
): { text: SimpleBBox; icon: SimpleBBox } => {
  if (!iconCfg) {
    return {
      text: content,
      icon: { x: content.x, y: content.y, width: 0, height: 0 },
    };
  }

  const iconWidthWithMargin =
    iconCfg.size +
    (iconCfg.iconPosition === 'right'
      ? iconCfg.margin.left
      : iconCfg.margin.right);

  const textWidth = content.width - iconWidthWithMargin;

  const textX =
    iconCfg.iconPosition === 'right'
      ? content.x
      : content.x + iconWidthWithMargin;

  const iconX =
    iconCfg.iconPosition === 'right'
      ? content.x + textWidth + iconCfg.margin.left
      : content.x;

  return {
    text: {
      x: textX,
      y: content.y,
      width: textWidth,
      height: content.height,
    },
    icon: {
      x: iconX,
      y: content.y,
      width: iconCfg.size,
      height: content.height,
    },
  };
};

export const getTextPosition = (
  bbox: CellBoxCfg,
  alignCfg: Pick<TextTheme, 'textAlign' | 'textBaseline'>,
) => {
  const { x, y, width, height } = bbox;
  const { textAlign, textBaseline } = alignCfg;

  let textX: number;
  let textY: number;

  switch (textAlign) {
    case 'right':
      textX = x + width;
      break;
    case 'center':
      textX = x + width / 2;
      break;
    default:
      textX = x;
      break;
  }

  switch (textBaseline) {
    case 'top':
      textY = y;
      break;
    case 'middle':
      textY = y + height / 2;
      break;
    default:
      textY = y + height;
      break;
  }

  return {
    x: textX,
    y: textY,
  };
};

export const getIconPosition = (
  bbox: CellBoxCfg,
  iconSize: number,
  textBaseline: TextBaseline,
) => {
  const { x, y, height } = bbox;
  let iconY: number;
  switch (textBaseline) {
    case 'top':
      iconY = y;
      break;
    case 'middle':
      iconY = y + height / 2 - iconSize / 2;
      break;
    default:
      iconY = y + height - iconSize;
      break;
  }

  return {
    x,
    y: iconY,
  };
};

export const handleDataItem = (
  data: Data,
  callback?: FilterDataItemCallback | MappingDataItemCallback,
) => {
  return callback
    ? callback(data[EXTRA_FIELD] as string, data[VALUE_FIELD])
    : data[VALUE_FIELD];
};

/**
 * @description  Determine if the current cell belongs to Cells
 * @param cells active cells
 * @param meta the meta information of current cell
 */
export const ifIncludeCell = (cells: S2CellType[], meta: ViewMeta) => {
  return cells.some((cell) => {
    const cellMeta = cell.getMeta();
    return cellMeta.colId === meta.colId && cellMeta.rowId === meta.rowId;
  });
};
