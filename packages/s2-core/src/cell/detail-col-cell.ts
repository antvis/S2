import { ColCell } from '@/cell/col-cell';
import { get } from 'lodash';
import { Node } from '@/index';
import { SpreadSheet } from '../sheet-type';
import { getEllipsisText, getTextPosition } from '../utils/text';
import { EXTRA_FIELD, KEY_LIST_SORT } from '../common/constant';
import {
  renderDetailTypeSortIcon,
  getIconType,
} from '../facet/layout/util/add-detail-type-sort-icon';
import { GuiIcon } from '@/common/icons';

export class DetailColCell extends ColCell {
  private upIcon: GuiIcon;

  private downIcon: GuiIcon;

  private onSort: () => void;

  public constructor(
    meta: Node,
    spreadsheet: SpreadSheet,
    ...restOptions: unknown[]
  ) {
    super(meta, spreadsheet, ...restOptions);
  }

  protected drawCellText() {
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

    const textStyle = get(this, 'theme.colCell.bolderText');
    const padding = get(this, 'theme.colCell.cell.padding');
    const iconSize = get(this, 'theme.colCell.icon.size');
    const rightPadding = padding?.right + iconSize;
    const leftPadding = padding?.left;

    const textAlign = get(textStyle, 'textAlign');
    const textBaseline = get(textStyle, 'textBaseline');

    const cellBoxCfg = {
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

    this.addShape('text', {
      attrs: {
        x: textX,
        y: textY,
        text,
        textAlign,
        ...textStyle,
        cursor: 'pointer',
      },
    });

    const icons = renderDetailTypeSortIcon(
      this,
      spreadsheet,
      x + cellWidth - iconSize,
      textY,
      key,
    );

    this.upIcon = icons.upIcon;
    this.downIcon = icons.downIcon;

    this.onSort = () => {
      console.log('onSort');
      const { spreadsheet } = this.headerConfig;
      const { key } = this.meta;

      const iconTypes = getIconType(key, spreadsheet);
      console.log(key, iconTypes);
      this.upIcon.set('type', iconTypes.upIconType);
      this.downIcon.set('type', iconTypes.downIconType);
      this.upIcon.render();
      this.downIcon.render();
    };

    spreadsheet.on(KEY_LIST_SORT, this.onSort);
  }

  public destroy() {
    const { spreadsheet } = this.headerConfig;
    super.destroy();
    spreadsheet.off(KEY_LIST_SORT, this.onSort);
  }

  protected getColHotSpotKey(): string {
    return EXTRA_FIELD;
  }
}
