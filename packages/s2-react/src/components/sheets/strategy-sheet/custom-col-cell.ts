import {
  ColCell,
  InteractionStateName,
  Node,
  SpreadSheet,
  updateShapeAttr,
} from '@antv/s2';
import { ColHeaderConfig } from '@antv/s2/esm/facet/header/col';

// hover时 指标名与单元格原始文字间隔
const CELL_TEXT_ACTIVE_MARGIN = {
  top: 8,
  bottom: 10,
};

// 每个指标名之间的间隔
const INDICATOR_LABEL_MARGIN = 10;

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

  private drawIndicatorLabels() {
    const { x, y, width, height } = this.meta;
    const indicatorFieldLabels = this.getIndicatorLabels();
    const textStyle = this.spreadsheet?.theme?.colCell?.text;

    // 初次渲染时, 将指标文本绘制在单元格里, 默认隐藏, 后面 hover 只需要改变 visible 即可
    this.addShape('text', {
      id: this.meta.id,
      visible: false,
      attrs: {
        ...textStyle,
        x: x + width / 2,
        y: y + height - CELL_TEXT_ACTIVE_MARGIN.bottom,
        text: indicatorFieldLabels,
        opacity: 0.45,
      },
    });
  }

  private getIndicatorLabels() {
    const { fieldLabels } = this.spreadsheet.options.style.cellCfg.valuesCfg;
    const whiteSpace = ' '.repeat(INDICATOR_LABEL_MARGIN);
    return fieldLabels?.[0]?.map((label) => label).join(whiteSpace);
  }

  private toggleDisplayIndicatorLabel(visible: boolean) {
    const indicatorLabelShape = this.findById(this.meta.id);
    indicatorLabelShape?.set('visible', visible);
    const textPosition = this.getTextPosition();
    const textY = visible
      ? textPosition.y - CELL_TEXT_ACTIVE_MARGIN.top
      : textPosition.y;
    updateShapeAttr(this.textShape, 'y', textY);
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
