import { getEllipsisText } from '../utils/text';
import { get } from 'lodash';
import { isMobile } from '../utils/is-mobile';
import { RowCell } from 'src/cell/row-cell';

export class DetailRowCell extends RowCell {
  /**
   * ListSheet has no text indent
   */
  protected getTextIndent(): number | number {
    return 0;
  }

  protected isTreeType(): boolean {
    return false;
  }

  protected getRowTextStyle(level, isTotals) {
    return level !== 0 && !isTotals
      ? get(this.headerConfig, 'spreadsheet.theme.header.text')
      : get(this.headerConfig, 'spreadsheet.theme.header.bolderText');
  }

  protected drawCellText() {
    const { linkFieldIds = [] } = this.headerConfig;
    const {
      label,
      x,
      y,
      width: cellWidth,
      height: cellHeight,
      level,
      isTotals,
      isCustom,
    } = this.meta;

    const textStyle = this.getRowTextStyle(level, isTotals || isCustom);
    const text = getEllipsisText(
      this.getFormattedValue(label),
      cellWidth,
      textStyle,
    );

    const textAlign = 'start';
    const textX = x;
    const textShape = this.addShape('text', {
      attrs: {
        x: textX,
        y: y + cellHeight / 2,
        textAlign,
        text,
        ...textStyle,
        cursor: 'pointer',
      },
    });
    // handle link nodes
    if (linkFieldIds.includes(this.meta.key)) {
      const device = get(this.headerConfig, 'spreadsheet.options.style.device');
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

    return textX;
  }
}
