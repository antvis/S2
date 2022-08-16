import { get } from 'lodash';
import { CellTypes } from '../../common/constant';
import type { DefaultCellTheme, IconTheme } from '../../common/interface/theme';
import type { Node } from '../../facet/layout/node';
import type { SpreadSheet } from '../../sheet-type';
import { getActionIconConfig } from './header-cell';

export const getTableColIconsWidth = (
  s2: SpreadSheet,
  meta: Node,
  cellType: CellTypes,
  iconStyle: IconTheme,
) => {
  const iconSize = get(iconStyle, 'size');
  const iconMargin = get(iconStyle, 'margin');

  let iconNums = 0;
  if (s2.options.showDefaultHeaderActionIcon) {
    iconNums = 1;
  } else {
    iconNums =
      getActionIconConfig(s2.options.headerActionIcons, meta, cellType)
        ?.iconNames.length ?? 0;
  }

  return (
    iconNums * (iconSize + iconMargin.left) +
    (iconNums > 0 ? iconMargin.right : 0)
  );
};

export const getExtraPaddingForExpandIcon = (
  s2: SpreadSheet,
  field: string,
  style: DefaultCellTheme,
) => {
  const iconMarginLeft = style.icon.margin?.left || 0;
  const iconMarginRight = style.icon.margin?.right || 0;
  const hiddenColumnsDetail = s2.store.get('hiddenColumnsDetail', []);

  let hasPrevSiblingCell = false;
  let hasNextSiblingCell = false;
  hiddenColumnsDetail.forEach((column) => {
    if (column?.displaySiblingNode?.prev?.field === field) {
      hasPrevSiblingCell = true;
    }
    if (column?.displaySiblingNode?.next?.field === field) {
      hasNextSiblingCell = true;
    }
  });
  const iconSize = get(style, 'icon.size');

  // 图标本身宽度 + 主题配置的 icon margin
  return {
    left: hasNextSiblingCell ? iconSize + iconMarginRight : 0,
    right: hasPrevSiblingCell ? iconSize + iconMarginLeft : 0,
  };
};

export const getOccupiedWidthForTableCol = (
  s2: SpreadSheet,
  meta: Node,
  style: DefaultCellTheme,
) => {
  const padding = get(style, 'cell.padding');
  const expandIconPadding = getExtraPaddingForExpandIcon(s2, meta.field, style);

  return (
    padding.left +
    padding.right +
    getTableColIconsWidth(s2, meta, CellTypes.COL_CELL, get(style, 'icon')) +
    expandIconPadding.left +
    expandIconPadding.right
  );
};
