import { get } from 'lodash';
import { isMobile } from '../utils/is-mobile';
import { CellCondition } from './cell-condition';

export class TableDataCellCondition extends CellCondition {
  protected drawTextShape() {
    super.drawTextShape();
    const textStyle = this.theme.dataCell.text;

    const linkFieldIds = get(this.spreadsheet, 'options.linkFieldIds');

    const textShape = this.conditionShapes.get('text');
    // handle link nodes
    if (linkFieldIds.includes(this.meta.key) && textShape) {
      const device = get(this.spreadsheet, 'options.style.device');
      // 配置了链接跳转
      if (!isMobile(device)) {
        const textBBox = textShape.getBBox();
        this.addShape('line', {
          attrs: {
            x1: textBBox.bl.x,
            y1: textBBox.bl.y + 1,
            x2: textBBox.br.x,
            y2: textBBox.br.y + 1,
            stroke: textStyle.fill,
            lineWidth: 1,
          },
        });
        textShape.attr({
          appendInfo: {
            isRowHeaderText: true, // 标记为行头文本，方便做链接跳转直接识别
            cellData: this.meta,
          },
        });
      } else {
        textShape.attr({
          fill: '#0000ee',
          appendInfo: {
            isRowHeaderText: true, // 标记为行头文本，方便做链接跳转直接识别
            cellData: this.meta,
          },
        });
      }
    }
  }
}
