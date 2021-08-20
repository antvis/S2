import { Group } from '@antv/g-canvas';
import * as _ from 'lodash';
import { GuiIcon } from '../../../common/icons';
import { DEFAULT_PADDING, KEY_LIST_SORT } from '../../../common/constant';
import { SpreadSheet } from '../../..';

// 排序按钮的宽度
export const SORT_ICON_SIZE = 8;

export const getIconType = (key: string, spreadsheet: SpreadSheet) => {
  /*
  currentSortKey 存储的点击的某个field对应的升序还是降序
  currentSortKey = {
   [field]: up/down
  }
   */
  const currentSortKey = spreadsheet.store.get('currentSortKey', {});
  let upIconType = 'SortUp';
  let downIconType = 'SortDown';
  if (currentSortKey && _.has(currentSortKey, key)) {
    // 有配置,当前点击的过的key(某个维度)
    if (_.get(currentSortKey, key) === 'up') {
      // 点击过此维度的up
      upIconType = 'SortUpSelected';
    } else {
      // 点击过此维度的down
      downIconType = 'SortDownSelected';
    }
  }

  return {
    upIconType,
    downIconType,
  };
};

export const renderIcon = (
  parent: Group,
  spreadsheet: SpreadSheet,
  x: number,
  y: number,
  type: string,
  key: string,
  sortKeyVal: string,
  sortType: string,
) => {
  const icon = new GuiIcon({
    type,
    x,
    y,
    width: SORT_ICON_SIZE,
    height: SORT_ICON_SIZE,
  });

  icon.on('click', () => {
    const selected = icon.get('selected');
    let currentSortKey = {};
    if (!selected) {
      currentSortKey = {
        [key]: sortKeyVal,
      };
    }
    spreadsheet.store.set('currentSortKey', currentSortKey);
    icon.set('selected', !selected);
    spreadsheet.emit(KEY_LIST_SORT, {
      sortFieldId: key,
      sortMethod: selected ? '' : sortType,
    });
    spreadsheet.render(false);
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
    'up',
    'ASC',
  );
  renderIcon(
    parent,
    spreadsheet,
    textX,
    textY - DEFAULT_PADDING / 2,
    iconType.downIconType,
    key,
    'down',
    'DESC',
  );
};
