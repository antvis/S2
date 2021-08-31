import { Group } from '@antv/g-canvas';
import { has, get } from 'lodash';
import { GuiIcon } from '@/common/icons';
import { DEFAULT_PADDING, S2Event, SortMethodType } from '@/common/constant';
import { SpreadSheet } from '@/.';

// 排序按钮的宽度
export const SORT_ICON_SIZE = 8;

export const getIconType = (key: string, spreadsheet: SpreadSheet) => {
  /*
  currentSortKey 存储的点击的某个field对应的升序还是降序
  currentSortKey = {
   [field]: SortMethodType
  }
   */
  let upSelected = false;
  let downSelected = false;
  const currentSortKey = spreadsheet.store.get('currentSortKey', {});
  let upIconType = 'SortUp';
  let downIconType = 'SortDown';
  if (currentSortKey && has(currentSortKey, key)) {
    // 有配置,当前点击的过的key(某个维度)
    if (get(currentSortKey, key) === SortMethodType.ASC) {
      // 点击过此维度的up
      upSelected = true;
      upIconType = 'SortUpSelected';
    } else {
      // 点击过此维度的down
      downSelected = true;
      downIconType = 'SortDownSelected';
    }
  }

  return {
    upIconType,
    downIconType,
    upSelected,
    downSelected,
  };
};

export const renderIcon = (
  parent: Group,
  spreadsheet: SpreadSheet,
  x: number,
  y: number,
  type: string,
  key: string,
  sortType: SortMethodType,
  selected: boolean,
) => {
  const icon = new GuiIcon({
    type,
    x,
    y,
    width: SORT_ICON_SIZE,
    height: SORT_ICON_SIZE,
  });

  icon.on('click', () => {
    let currentSortKey = {};
    if (!selected) {
      currentSortKey = {
        [key]: sortType,
      };
    }
    // Do nothing when sortType is not changed.
    if (spreadsheet.store.get('currentSortKey')?.[key] === sortType) {
      return;
    }
    spreadsheet.store.set('currentSortKey', currentSortKey);
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
  const iconType = getIconType(key, spreadsheet);
  renderIcon(
    parent,
    spreadsheet,
    textX,
    textY - DEFAULT_PADDING * 2,
    iconType.upIconType,
    key,
    SortMethodType.ASC,
    iconType.upSelected,
  );
  renderIcon(
    parent,
    spreadsheet,
    textX,
    textY - DEFAULT_PADDING / 2,
    iconType.downIconType,
    key,
    SortMethodType.DESC,
    iconType.downSelected,
  );
};
