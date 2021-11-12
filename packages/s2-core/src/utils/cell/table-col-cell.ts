import { get } from 'lodash';
import { DefaultCellTheme } from 'src/common/interface/theme';
import { SpreadSheet } from 'src/sheet-type';

const getExpandIconMargin = (
  ss: SpreadSheet,
  field: string,
  style: DefaultCellTheme,
) => {
  const iconMarginLeft = style.icon.margin?.left || 0;
  const hiddenColumnsDetail = ss.store.get('hiddenColumnsDetail', []);
  const expandIconPrevSiblingCell = hiddenColumnsDetail.find(
    (column) => column?.displaySiblingNode?.prev?.field === field,
  );
  const iconSize = get(style, 'icon.size');

  // 图标本身宽度 + 主题配置的 icon margin
  return expandIconPrevSiblingCell ? iconSize / 2 + iconMarginLeft : 0;
};

export const getOccupiedWidthForTableCol = (
  ss: SpreadSheet,
  field: string,
  style: DefaultCellTheme,
) => {
  const padding = get(style, 'cell.padding');
  const iconSize = get(style, 'icon.size');
  const iconMargin = get(style, 'icon.margin');
  const expandIconMargin = getExpandIconMargin(ss, field, style);

  return (
    padding.left +
    padding.right +
    iconSize +
    iconMargin.left +
    iconMargin.right +
    expandIconMargin
  );
};
