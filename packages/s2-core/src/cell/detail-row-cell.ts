import { getEllipsisText, getTextPosition } from '../utils/text';
import { get } from 'lodash';
import { DataCell } from 'src/cell/data-cell';
import { isMobile } from '../utils/is-mobile';
import { renderText } from '../utils/g-renders';
export class DetailRowCell extends DataCell {
  protected drawTextShape() {
    const { x, y, height, width } = this.getLeftAreaBBox();
    const { formattedValue: text } = this.getData();
    const textStyle = this.theme.rowHeader?.bolderText
    const padding = this.theme.rowHeader?.cell?.padding

    const ellipsisText = getEllipsisText(
      `${text || '-'}`,
      width - padding?.left  - padding?.right,
      textStyle,
    );
    const cellBoxCfg = {
      x,
      y,
      height,
      width,
      textAlign: textStyle.textAlign,
      textBaseline: textStyle.textBaseline,
      padding,
    };
    const position = getTextPosition(cellBoxCfg);
    this.textShape = renderText(
      [this.textShape],
      position.x,
      position.y,
      ellipsisText,
      textStyle,
      this,
    );


    const linkFieldIds = get(this.spreadsheet, 'options.linkFieldIds');

    // handle link nodes
    if (linkFieldIds.includes(this.meta.key) && this.textShape) {
      const device = get(this.spreadsheet, 'options.style.device');
      // 配置了链接跳转
      if (!isMobile(device)) {
        const textBBox = this.textShape.getBBox();
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
        this.textShape.attr({
          appendInfo: {
            isRowHeaderText: true, // 标记为行头文本，方便做链接跳转直接识别
            cellData: this.meta,
          },
        });
      } else {
        this.textShape.attr({
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
