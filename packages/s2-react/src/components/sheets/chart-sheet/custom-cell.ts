import { DataCell } from '@antv/s2';

export class CustomCell extends DataCell {
  protected drawTextShape() {
    // TODO 暂时留下个扩展位，不知道后面会有什么需求
    return null;
  }
}
