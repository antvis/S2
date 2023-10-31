import { get } from 'lodash';
import { CellType } from '../../common/constant';
import type { DefaultCellTheme, IconTheme } from '../../common/interface/theme';
import type { Node } from '../../facet/layout/node';
import type { SpreadSheet } from '../../sheet-type';
import { getActionIconConfig } from './header-cell';

export const getTableColIconsWidth = (
  s2: SpreadSheet,
  meta: Node,
  cellType: CellType,
  iconStyle: IconTheme,
) => {
  const iconSize = iconStyle?.size!;
  const iconMargin = iconStyle?.margin!;

  let iconCount = 0;

  if (s2.options.showDefaultHeaderActionIcon) {
    iconCount = 1;
  } else {
    iconCount =
      getActionIconConfig(s2.options.headerActionIcons!, meta, cellType)?.icons
        .length ?? 0;
  }

  return (
    iconCount * (iconSize + iconMargin.left!) +
    (iconCount > 0 ? iconMargin.right! : 0)
  );
};

export const getExtraPaddingForExpandIcon = (
  s2: SpreadSheet,
  field: string,
  style: DefaultCellTheme,
) => {
  const iconMarginLeft = style.icon?.margin?.left || 0;
  const iconMarginRight = style.icon?.margin?.right || 0;
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
  const iconSize = get(style, 'icon.size') as number;

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
  const horizontalBorderWidth = style?.cell?.horizontalBorderWidth ?? 1;
  const expandIconPadding = getExtraPaddingForExpandIcon(s2, meta.field, style);
  const iconsWidth = getTableColIconsWidth(
    s2,
    meta,
    CellType.COL_CELL,
    style?.icon!,
  );

  return (
    padding!.left! +
    padding!.right! +
    iconsWidth +
    expandIconPadding.left +
    expandIconPadding.right +
    horizontalBorderWidth
  );
};
