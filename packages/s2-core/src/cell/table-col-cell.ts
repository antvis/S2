import { difference, isEmpty } from 'lodash';
import { Event as CanvasEvent } from '@antv/g-canvas';
import { EXTRA_FIELD } from '@/common/constant';
import { renderDetailTypeSortIcon } from '@/utils/layout/add-detail-type-sort-icon';
import { getEllipsisText, getTextPosition } from '@/utils/text';
import { renderText } from '@/utils/g-renders';
import { ColCell } from '@/cell/col-cell';
import { CellBoxCfg } from '@/common/interface';
import { GuiIcon } from '@/common/icons';
import { Node } from '@/facet/layout/node';

export class TableColCell extends ColCell {
  protected getStyle() {
    return this.theme.colCell;
  }

  protected drawTextShape() {
    const { spreadsheet } = this.headerConfig;
    const {
      label,
      x,
      y,
      width: cellWidth,
      height: cellHeight,
      key,
    } = this.meta;
    const content = label;

    const style = this.getStyle();
    const textStyle = style.bolderText;
    const { textAlign, textBaseline } = textStyle;
    const padding = style.cell?.padding;
    const iconSize = style.icon?.size;
    const rightPadding = padding?.right + iconSize;
    const leftPadding = padding?.left;

    const cellBoxCfg: CellBoxCfg = {
      x,
      y,
      width: cellWidth,
      height: cellHeight,
      textAlign,
      textBaseline,
      padding: {
        left: leftPadding,
        right: rightPadding,
      },
    };
    const position = getTextPosition(cellBoxCfg);

    const textX = position.x;
    const textY = position.y;

    const text = getEllipsisText(
      content,
      cellWidth - leftPadding - rightPadding,
      textStyle,
    );

    this.textShape = renderText(
      this,
      [this.textShape],
      textX,
      textY,
      text,
      {
        textAlign,
        ...textStyle,
      },
      { cursor: 'pointer' },
    );

    renderDetailTypeSortIcon(
      this,
      spreadsheet,
      x + cellWidth - iconSize,
      textY,
      key,
    );
  }

  protected getColResizeAreaKey(): string {
    return EXTRA_FIELD;
  }

  protected initCell() {
    super.initCell();
    this.addExpandColumnIcon();
  }

  private hasHiddenColumnCell() {
    const { hideColumnFields = [] } = this.spreadsheet.options;
    if (isEmpty(hideColumnFields)) {
      return false;
    }
    const hiddenColumnDetail = this.spreadsheet.store.get(
      'hiddenColumnDetail',
      [],
    );
    return !!hiddenColumnDetail.find(
      ({ displaySiblingNode }) => displaySiblingNode.field === this.meta.field,
    );
  }

  private addExpandColumnTipsLine() {
    const { x, y, height } = this.meta;
    this.addShape('line', {
      attrs: {
        x1: x,
        y1: y,
        x2: x,
        y2: y + height,
        stroke: '#000000',
        lineWidth: 1,
        strokeOpacity: 0.45,
      },
    });
  }

  private addExpandColumnIcon() {
    if (!this.hasHiddenColumnCell()) {
      return;
    }

    this.addExpandColumnTipsLine();

    const { x, y, height } = this.meta;
    const size = 24;
    const icon = new GuiIcon({
      type: 'ExpandColIcon',
      x: x - size / 2,
      y: y + height / 2 - size / 4,
      width: size,
      height: size / 2,
      cursor: 'pointer',
    });
    icon.on('click', this.handleExpandIconClick(this.meta));
    this.spreadsheet.foregroundGroup.add(icon);
  }

  private handleExpandIconClick(node: Node) {
    return (e: CanvasEvent) => {
      e.stopPropagation();

      const { hideColumnFields: lastHideColumnFields } =
        this.spreadsheet.options;
      const hiddenColumnDetail =
        this.spreadsheet.store.get('hiddenColumnDetail');
      const { hideColumnFields } = hiddenColumnDetail.find(
        ({ displaySiblingNode }) => displaySiblingNode.field === node.field,
      );
      this.spreadsheet.setOptions({
        hideColumnFields: difference(lastHideColumnFields, hideColumnFields),
      });
      this.spreadsheet.store.set(
        'hiddenColumnDetail',
        hiddenColumnDetail.filter(
          ({ displaySiblingNode }) => displaySiblingNode.field !== node.field,
        ),
      );
      this.spreadsheet.interaction.reset();
      this.spreadsheet.render(false);
    };
  }
}
