import { Event } from '@antv/g-canvas';
import { get, isEmpty, set, each, find } from 'lodash';
import { KEY_JUMP_HREF } from '../../../common/constant';
import { S2Event, DefaultInterceptEventType } from '../types';
import { BaseEvent } from '../base-event';

/**
 * Row header click navigation interaction
 */
export class RowTextClick extends BaseEvent {
  protected bindEvents() {
    this.bindRowCellClick();
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROWCELL_CLICK, (ev: Event) => {
      if (
        this.spreadsheet.interceptEvent.has(
          DefaultInterceptEventType.CLICK,
        )
      ) {
        return;
      }
      const appendInfo = get(ev.target, 'attrs.appendInfo', {});
      if (appendInfo.isRowHeaderText) {
        // 行头内的文本
        const cellData = get(ev.target, 'attrs.appendInfo.cellData');
        const key = cellData.key;
        // 从当前节点出发往上遍历树拿到数据，如点中的是西湖区，则需要拿到 { 省份: 浙江省, 城市: 杭州市, 区县: 西湖区 }
        let node = cellData;
        const record = {};
        while (node.parent) {
          record[node.key] = node.value;
          node = node.parent;
        }
        // 透传本行所有数据，供跳转时解析参数
        const currentRowData = find(
          this.spreadsheet.dataCfg.data,
          (d) => d[key] === cellData.value,
        );
        if (!isEmpty(currentRowData)) {
          each(currentRowData, (v, k) => {
            record[k] = v;
          });
        }
        // 明细表需要增加rowIndex透出
        if (!get(this, 'spreadsheet.options.spreadsheetType')) {
          set(record, 'rowIndex', cellData.rowIndex);
        }
        this.spreadsheet.emit(KEY_JUMP_HREF, {
          key,
          record,
        });
      }
    });
  }
}
