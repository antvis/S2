import { getEllipsisText, getDerivedDataState } from 'src/utils/text';
import { isObject, get, merge, clone } from 'lodash';
import { renderText } from 'src/utils/g-renders';
import { DataCell } from 'src/cell/data-cell';
import { IShape } from '@antv/g-canvas';
import { PADDING_LEFT, PADDING_RIGHT } from './constants';

/**
 * Cell for panelGroup area
 * -------------------------------------
 * | label                              |
 * | measureLabel  |  measure | measure |
 * | measureLabel  |  measure | measure |
 * --------------------------------------
 */
export class CustomCell extends DataCell {
  /**
   * Render cell main text
   */

  // TODO 条件格式还是需要的，加上条件格式就可以实现用户增长的策略分析表
  protected drawTextShape() {
    const { x, y, height, width } = this.getLeftAreaBBox();
    const { formattedValue: text } = this.getData();
    const labelStyle = this.theme?.view?.bolderText;
    const textStyle = this.theme?.view?.text;
    const textFill = textStyle?.fill;

    if (isObject(text)) {
      // 对象多指标需要单独处理
      const padding = this.theme?.view?.cell?.padding;
      // 指标个数相同，任取其一即可
      const realWidth = width / (text?.values[0].length + 1);
      const realHeight = height / (text?.values.length + 1);
      this.add(
        renderText(
          this.textShape,
          this.calX(x, padding),
          y + realHeight / 2,
          getEllipsisText(
            text?.label || '-',
            width - padding[PADDING_LEFT],
            labelStyle,
          ),
          labelStyle,
          textFill,
          this,
        ),
      );

      const { values } = text;
      let curText: string | number;
      let curX: number;
      let curY: number = y + realHeight / 2;
      let curWidth: number;
      let totalWidth = 0;
      let curTextShape: IShape;
      // let curStyle: TextTheme;
      for (let i = 0; i < values.length; i += 1) {
        curY = y + realHeight / 2 + realHeight * (i + 1); // 加上label的高度
        totalWidth = 0;
        for (let j = 0; j < values[i].length; j += 1) {
          curText = values[i][j] || '-';
          const curStyle = this.getStyle(i, j, curText);
          curWidth = j === 0 ? realWidth * 2 : realWidth;
          curX = this.calX(x, padding, totalWidth);
          totalWidth += curWidth;
          curTextShape = renderText(
            this.textShape,
            curX,
            curY,
            getEllipsisText(`${curText}`, curWidth, curStyle),
            curStyle,
            curStyle?.fill,
            this,
          );
          this.add(curTextShape);
        }
      }
      return;
    }
    // 其他常态数据下的cell

    const padding = this.theme.view.cell.padding;
    this.textShape = renderText(
      this.textShape,
      x + padding[PADDING_LEFT],
      y + height / 2,
      getEllipsisText(
        `${text || '-'}`,
        width - padding[PADDING_LEFT],
        textStyle,
      ),
      textStyle,
      textFill,
      this,
    );
  }

  private calX(x: number, padding: number[], total?: number) {
    const extra = total || 0;
    return x + padding[PADDING_RIGHT] / 2 + extra;
  }

  private getStyle(rowIndex: number, colIndex: number, value: string | number) {
    const { options } = this.spreadsheet;
    const cellCfg = get(options, 'style.cellCfg', {});
    const derivedMeasureIndex = cellCfg?.firstDerivedMeasureRowIndex;
    const minorMeasureIndex = cellCfg?.minorMeasureRowIndex;
    const isMinor = rowIndex === minorMeasureIndex;
    const isDerivedMeasure = colIndex >= derivedMeasureIndex;
    const style = isMinor
      ? clone(this.theme?.view?.minorText)
      : clone(this.theme?.view?.text);
    const derivedMeasureText = this.theme?.view?.derivedMeasureText;
    const upFill = isMinor
      ? derivedMeasureText?.minorUp
      : derivedMeasureText?.mainUp || '#F46649';
    const downFill = isMinor
      ? derivedMeasureText?.minorDown
      : derivedMeasureText?.mainDown || '2AA491';
    if (isDerivedMeasure) {
      const isUp = getDerivedDataState(value);
      return merge(style, {
        fill: isUp ? upFill : downFill,
      });
    }
    return style;
  }
}
