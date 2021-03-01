import { Event, Point } from '@antv/g-canvas';
import * as _ from 'lodash';
import { isMobile } from '../utils/is-mobile';
import { KEY_JUMP_HREF } from '../common/constant';
import { HoverInteraction } from './hover-interaction';
import { Data, ViewMeta } from '../common/interface';

/**
 * Row header click navigation interaction
 */
export class RowHeaderTextClick extends HoverInteraction {
  private targetPoint: Point;

  protected getStarEvent(): string {
    return isMobile() ? 'touchstart' : 'mousedown';
  }

  protected getEndEvent(): string {
    return isMobile() ? 'touchend' : 'mouseup';
  }

  protected start(ev: Event) {
    this.targetPoint = _.get(ev, 'target.cfg.startPoint');
  }

  protected end(ev: Event) {
    if (this.targetPoint !== _.get(ev, 'target.cfg.startPoint')) {
      return;
    }
    const appendInfo = _.get(ev.target, 'attrs.appendInfo', {}) as {
      isRowHeaderText: boolean;
      cellData: ViewMeta;
    };
    if (appendInfo.isRowHeaderText) {
      // 行头内的文本
      const { cellData } = appendInfo;
      const key = cellData.key;
      // 从当前节点出发往上遍历树拿到数据，如点中的是西湖区，则需要拿到 { 省份: 浙江省, 城市: 杭州市, 区县: 西湖区 }
      let node = cellData;
      const record = {};
      while (node.parent) {
        record[node.key] = node.value;
        node = node.parent;
      }
      // 聚合模式-字段全在行头的情况下获取不到rowIndex, 只能用坐标去算
      const rowIndex =
        cellData.rowIndex ?? Math.floor(cellData.y / cellData.height);
      // 透传本行所有数据，供跳转时解析参数
      const currentRowData = _.find(
        this.spreadsheet.dataCfg.data,
        (row: Data, index: number) =>
          row[key] === cellData.value && index === rowIndex,
      );
      if (!_.isEmpty(currentRowData)) {
        _.each(currentRowData, (v, k) => {
          record[k] = v;
        });
      }
      // 明细表需要增加rowIndex透出
      if (!_.get(this, 'spreadsheet.options.spreadsheetType')) {
        _.set(record, 'rowIndex', rowIndex);
      }
      this.spreadsheet.emit(KEY_JUMP_HREF, {
        key,
        record,
      });
    }
  }
}
