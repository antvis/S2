import { isEmpty } from 'lodash';
import { EXTRA_FIELD, S2Event } from '@/common/constant';
import { renderDetailTypeSortIcon } from '@/utils/layout/add-detail-type-sort-icon';
import { getEllipsisText, getTextPosition } from '@/utils/text';
import { renderText } from '@/utils/g-renders';
import { ColCell } from '@/cell/col-cell';
import { CellBoxCfg } from '@/common/interface';
import { GuiIcon } from '@/common/icons';

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
    const padding = style.cell.padding;
    const { size: iconSize, margin: iconMargin } = style.icon;
    const iconMarginRight = iconMargin.right;
    const rightPadding = padding.right + iconSize;
    const leftPadding = padding.left;

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
      x + cellWidth - iconSize - iconMarginRight,
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
    const { hideColumnFields = [], enableHideColumnFields } =
      this.spreadsheet.options;

    if (isEmpty(hideColumnFields) || !enableHideColumnFields) {
      return false;
    }
    const hiddenColumnsDetail = this.spreadsheet.store.get(
      'hiddenColumnsDetail',
      [],
    );
    return !!hiddenColumnsDetail.find(
      ({ displaySiblingNode }) => displaySiblingNode?.field === this.meta.field,
    );
  }

  private getExpandIconTheme() {
    const cellTheme = this.getStyle();
    return cellTheme.cell.expandIcon;
  }

  private addExpandColumnTipsLine() {
    const { x, y, height } = this.meta;
    const { tipsLine } = this.getExpandIconTheme();
    this.addShape('line', {
      attrs: {
        x1: x,
        y1: y,
        x2: x,
        y2: y + height,
        stroke: tipsLine.borderColor,
        lineWidth: tipsLine.borderWidth,
        strokeOpacity: tipsLine.borderOpacity,
      },
    });
  }

  private addExpandColumnIcon() {
    if (!this.hasHiddenColumnCell()) {
      return;
    }

    this.addExpandColumnTipsLine();
    const { size } = this.getExpandIconTheme();
    const { x, y, height } = this.meta;
    const icon = new GuiIcon({
      type: 'ExpandColIcon',
      x: x - size / 2,
      y: y + height / 2 - size / 4,
      width: size,
      height: size / 2,
      cursor: 'pointer',
    });
    icon.on('click', () => {
      this.spreadsheet.emit(S2Event.LAYOUT_TABLE_COL_EXPANDED, this.meta);
    });
    this.add(icon);
  }
}
