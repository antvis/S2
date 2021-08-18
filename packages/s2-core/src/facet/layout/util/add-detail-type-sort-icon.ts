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
  let upSelected = false;
  let downSelected = false;
  const currentSortKey = spreadsheet.store.get('currentSortKey', {});
  let upIconType = 'SortUp';
  let downIconType = 'SortDown';
  if (currentSortKey && _.has(currentSortKey, key)) {
    // 有配置,当前点击的过的key(某个维度)
    if (_.get(currentSortKey, key) === 'up') {
      // 点击过此维度的up
      upIconType = 'SortUpSelected';
      upSelected = true;
    } else {
      // 点击过此维度的down
      downIconType = 'SortDownSelected';
      downSelected = true;
    }
  }

  return {
    upIconType,
    downIconType,
    upSelected,
    downSelected,
  };
};

export const renderDetailTypeSortIcon = (
  parent: Group,
  spreadsheet: SpreadSheet,
  textX: number,
  textY,
  key,
) => {
  const iconType = getIconType(key, spreadsheet);
  const upIcon = new GuiIcon({
    type: iconType.upIconType,
    x: textX,
    y: textY - DEFAULT_PADDING * 2,
    width: SORT_ICON_SIZE,
    height: SORT_ICON_SIZE,
    selected: false,
  });

  const downIcon = new GuiIcon({
    type: iconType.downIconType,
    x: textX,
    y: textY - DEFAULT_PADDING / 2,
    width: SORT_ICON_SIZE,
    height: SORT_ICON_SIZE,
    selected: false,
  });

  upIcon.on('click', () => {
    const selected = upIcon.get('selected');
    let currentSortKey = {};
    if (!selected) {
      currentSortKey = {
        [key]: 'up',
      };
    }
    spreadsheet.store.set('currentSortKey', currentSortKey);
    upIcon.set('selected', !selected);
    spreadsheet.emit(KEY_LIST_SORT, {
      sortFieldId: key,
      sortMethod: selected ? '' : 'ASC',
    });
  });
  downIcon.on('click', () => {
    const selected = downIcon.get('selected');
    let currentSortKey = {};
    if (!selected) {
      currentSortKey = {
        [key]: 'down',
      };
    }
    spreadsheet.store.set('currentSortKey', currentSortKey);
    downIcon.set('selected', !selected);
    spreadsheet.emit(KEY_LIST_SORT, {
      sortFieldId: key,
      sortMethod: selected ? '' : 'DESC',
    });
  });

  parent.add(upIcon);
  parent.add(downIcon);

  return {
    upIcon,
    downIcon,
  };
};
