import { Group } from '@antv/g-canvas';
import * as _ from 'lodash';
import { GuiIcon } from '../../../common/icons';
import { DEFAULT_PADDING, KEY_LIST_SORT } from '../../../common/constant';
import { SpreadSheet } from '../../..';

// 排序按钮的宽度
export const SORT_ICON_SIZE = 8;

// 明细表排序icon
export function addDetailTypeSortIcon(
  parent: Group,
  spreadsheet: SpreadSheet,
  textX,
  textY,
  key,
) {
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

  const upIcon = new GuiIcon({
    type: upIconType,
    x: textX,
    y: textY - DEFAULT_PADDING * 2,
    width: SORT_ICON_SIZE,
    height: SORT_ICON_SIZE,
  });
  const downIcon = new GuiIcon({
    type: downIconType,
    x: textX,
    y: textY - DEFAULT_PADDING / 2,
    width: SORT_ICON_SIZE,
    height: SORT_ICON_SIZE,
  });
  upIcon.on('click', () => {
    spreadsheet.store.set('currentSortKey', {
      [key]: 'up',
    });
    spreadsheet.emit(KEY_LIST_SORT, {
      sortFieldId: key,
      sortMethod: 'ASC',
    });
  });
  downIcon.on('click', () => {
    spreadsheet.store.set('currentSortKey', {
      [key]: 'down',
    });
    spreadsheet.emit(KEY_LIST_SORT, {
      sortFieldId: key,
      sortMethod: 'DESC',
    });
  });
  parent.add(upIcon);
  parent.add(downIcon);
}
