import { Group } from '@antv/g-canvas';
import { GuiIcon } from '@/common/icons';
import { S2Event, DEFAULT_PADDING, SortMethodType } from '@/common/constant';
import { SpreadSheet } from '@/.';

export const getSortParam = (key: string, spreadsheet: SpreadSheet) => {
  return spreadsheet.dataCfg.sortParams?.find((e) => e.sortFieldId === key);
};

export const getIcon = (key: string, spreadsheet: SpreadSheet) => {
  const sortParam = getSortParam(key, spreadsheet);
  let upIcon = 'SortUp';
  let downIcon = 'SortDown';
  if (sortParam?.sortMethod) {
    // 有配置,当前点击的过的key(某个维度)
    if (sortParam.sortMethod === SortMethodType.ASC) {
      // 点击过此维度的up
      upIcon = 'SortUpSelected';
    } else {
      // 点击过此维度的down
      downIcon = 'SortDownSelected';
    }
  }

  return {
    upIcon,
    downIcon,
  };
};

export const renderIcon = (
  parent: Group,
  spreadsheet: SpreadSheet,
  x: number,
  y: number,
  name: string,
  key: string,
  sortType: SortMethodType,
) => {
  const iconSiz = spreadsheet.theme.colCell.icon.size;
  const icon = new GuiIcon({
    name,
    x,
    y,
    width: iconSiz,
    height: iconSiz,
  });

  icon.on('click', () => {
    const sortParam = getSortParam(key, spreadsheet);
    // Do nothing when sortType is not changed.
    if (sortParam?.sortMethod === sortType) {
      return;
    }
    spreadsheet.emit(S2Event.RANGE_SORT, {
      sortKey: key,
      sortMethod: sortType,
    });
  });

  parent.add(icon);
};

export const renderDetailTypeSortIcon = (
  parent: Group,
  spreadsheet: SpreadSheet,
  textX: number,
  textY,
  key,
) => {
  const icons = getIcon(key, spreadsheet);
  renderIcon(
    parent,
    spreadsheet,
    textX,
    textY - DEFAULT_PADDING * 2,
    icons.upIcon,
    key,
    SortMethodType.ASC,
  );
  renderIcon(
    parent,
    spreadsheet,
    textX,
    textY - DEFAULT_PADDING / 2,
    icons.downIcon,
    key,
    SortMethodType.DESC,
  );
};
