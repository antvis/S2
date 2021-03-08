import { Event } from '@antv/g-canvas';
import * as _ from 'lodash';
import { KEY_JUMP_HREF } from '../common/constant';
import { BaseInteraction } from './base';
import { S2Event} from './events/types';



/**
 * Row header click navigation interaction
 */
export class RowHeaderTextClick extends BaseInteraction {
  protected bindEvents() {
    this.bindClick();
  }

  private bindClick() {
    this.spreadsheet.on(S2Event.ROWCELL_CLICK, (ev: Event) => {
      const appendInfo = _.get(ev.target, 'attrs.appendInfo', {});
      if (appendInfo.isRowHeaderText) {
        // 行头内的文本
        const cellData = _.get(ev.target, 'attrs.appendInfo.cellData');
        const key = cellData.key;
        // 从当前节点出发往上遍历树拿到数据，如点中的是西湖区，则需要拿到 { 省份: 浙江省, 城市: 杭州市, 区县: 西湖区 }
        let node = cellData;
        const record = {};
        while (node.parent) {
          record[node.key] = node.value;
          node = node.parent;
        }
        // 透传本行所有数据，供跳转时解析参数
        const currentRowData = _.find(
          this.spreadsheet.dataCfg.data,
          (d) => d[key] === cellData.value,
        );
        if (!_.isEmpty(currentRowData)) {
          _.each(currentRowData, (v, k) => {
            record[k] = v;
          });
        }
        // 明细表需要增加rowIndex透出
        if (!_.get(this, 'spreadsheet.options.spreadsheetType')) {
          _.set(record, 'rowIndex', cellData.rowIndex);
        }
        this.spreadsheet.emit(KEY_JUMP_HREF, {
          key,
          record,
        });
      }
    })
  }
}
