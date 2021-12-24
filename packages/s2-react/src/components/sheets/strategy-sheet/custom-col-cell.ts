import {
  CellTypes,
  ColCell,
  DataCell,
  InteractionStateName,
  Node,
  SpreadSheet,
  updateShapeAttr,
} from '@antv/s2';
import { ColHeaderConfig } from '@antv/s2/esm/facet/header/col';
import { get, isEmpty } from 'lodash';

// hover时 指标名与单元格原始文字间隔
const CELL_TEXT_ACTIVE_MARGIN = {
  top: 8,
  bottom: 10,
};

/**
 * Cell for StrategySheet
 * -------------------------------------
 * |          date           |
 * | label1 label2  label3 |
 * --------------------------------------
 */
export class CustomColCell extends ColCell {
  constructor(
    meta: Node,
    spreadsheet: SpreadSheet,
    headerConfig: ColHeaderConfig,
  ) {
    super(meta, spreadsheet, headerConfig);
  }

  protected initCell() {
    super.initCell();
    this.drawIndicatorLabels();
  }

  // 拿到当前列对应的有数据的 data cell, 目的是获取实际渲染的 text shape 的坐标
  private getCurrentColumnDataCell(): DataCell {
    return this.spreadsheet.interaction
      .getPanelGroupAllDataCells()
      .find((dataCell) => {
        const dataCellMeta = dataCell.getMeta();
        return (
          dataCellMeta.colIndex === this.meta.colIndex &&
          !isEmpty(dataCellMeta.data)
        );
      });
  }

  private getCurrentColumnDataCellTextShapes() {
    const dataCell = this.getCurrentColumnDataCell();
    const shapes = dataCell?.getChildren() || [];
    return shapes.filter((shape) => shape?.get('type') === 'text');
  }

  private drawIndicatorLabels() {
    const { y, height } = this.meta;
    const indicatorLabelDetail = this.getIndicatorLabelDetail();
    if (isEmpty(indicatorLabelDetail)) {
      return;
    }
    const dataCellStyle = this.getStyle(CellTypes.DATA_CELL);
    const colCellStyle = this.getStyle(CellTypes.COL_CELL);

    // 初次渲染时, 将指标文本绘制在单元格里, 默认隐藏, 后面 hover 只需要改变 visible 即可
    const group = this.addGroup({
      id: this.meta.id,
      visible: false,
      capture: false,
    });

    indicatorLabelDetail.forEach((field) => {
      const dataCellTextX = field.x + dataCellStyle.cell.padding.left;
      const colCellTextY = y + height - CELL_TEXT_ACTIVE_MARGIN.bottom;
      group.addShape('text', {
        attrs: {
          ...colCellStyle.text,
          x: dataCellTextX,
          y: colCellTextY,
          text: field.label,
          opacity: 0.45,
        },
      });
    });
  }

  private getIndicatorLabelDetail(): Array<{
    label: string;
    x: number;
    y: number;
  }> {
    const { fieldLabels = [] } =
      this.spreadsheet.options.style?.cellCfg?.valuesCfg || {};
    if (isEmpty(fieldLabels)) {
      return [];
    }

    const dataCellTextShapes = this.getCurrentColumnDataCellTextShapes();
    return dataCellTextShapes.map((shape, i) => {
      return {
        label: get(fieldLabels, [0, i]),
        x: shape.attr('x'),
        y: shape.attr('y'),
      };
    });
  }

  private toggleDisplayIndicatorLabel(visible: boolean) {
    this.toggleIndicatorLabelGroup(visible);
  }

  private toggleOriginalColumnTextPosition(visible: boolean) {
    const textPosition = this.getTextPosition();
    const textY = visible
      ? textPosition.y - CELL_TEXT_ACTIVE_MARGIN.top
      : textPosition.y;
    updateShapeAttr(this.textShape, 'y', textY);
  }

  private toggleIndicatorLabelGroup(visible: boolean) {
    const indicatorLabelGroup = this.findById(this.meta.id);

    // 配置了 label, 才显示 label shape, 并且把原始列头文字上移
    if (indicatorLabelGroup) {
      indicatorLabelGroup?.set('visible', visible);
      this.toggleOriginalColumnTextPosition(visible);
    }
  }

  public updateByState(name: InteractionStateName) {
    super.updateByState(name);

    if (name === InteractionStateName.HOVER) {
      this.toggleDisplayIndicatorLabel(true);
    }
  }

  public hideInteractionShape() {
    super.hideInteractionShape();
    this.toggleDisplayIndicatorLabel(false);
  }
}
