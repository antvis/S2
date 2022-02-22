import { find, get } from 'lodash';
import { Group } from '@antv/g-canvas';
import { ColCell } from '@/cell/col-cell';
import {
  HORIZONTAL_RESIZE_AREA_KEY_PRE,
  KEY_GROUP_FROZEN_COL_RESIZE_AREA,
} from '@/common/constant';
import { FormatResult, SortParam } from '@/common/interface';
import { isFrozenCol, isFrozenTrailingCol } from '@/facet/utils';
import { getContentArea } from '@/utils/cell/cell';
import { getExtraPaddingForExpandIcon } from '@/utils/cell/table-col-cell';
import { renderRect } from '@/utils/g-renders';
import { getOrCreateResizeAreaGroupById } from '@/utils/interaction/resize';
import { getSortTypeIcon } from '@/utils/sort-action';

export class TableColCell extends ColCell {
  protected handleRestOptions(...[headerConfig]) {
    this.headerConfig = { ...headerConfig };
    const { field } = this.meta;
    const sortParams = this.spreadsheet.dataCfg.sortParams;
    const sortParam: SortParam = find(
      sortParams,
      (item) => item?.sortFieldId === field,
    );

    const type = getSortTypeIcon(sortParam, true);
    this.headerConfig.sortParam = {
      ...this.headerConfig.sortParam,
      ...(sortParam || {}),
      type,
    };
  }

  protected isFrozenCell() {
    const { frozenColCount, frozenTrailingColCount } = this.spreadsheet.options;
    const { colIndex } = this.meta;
    const colLeafNodes = this.spreadsheet.facet.layoutResult.colLeafNodes;

    return (
      isFrozenCol(colIndex, frozenColCount) ||
      isFrozenTrailingCol(colIndex, frozenTrailingColCount, colLeafNodes.length)
    );
  }

  protected getColResizeArea() {
    const isFrozenCell = this.isFrozenCell();

    if (!isFrozenCell) {
      return super.getColResizeArea();
    }
    return getOrCreateResizeAreaGroupById(
      this.spreadsheet,
      KEY_GROUP_FROZEN_COL_RESIZE_AREA,
    ) as Group;
  }

  protected isSortCell() {
    return true;
  }

  protected showSortIcon() {
    return this.spreadsheet.options.showDefaultHeaderActionIcon;
  }

  protected getTextStyle() {
    const style = this.getStyle();
    return get(style, 'bolderText');
  }

  public getContentArea() {
    const { padding } = this.getStyle()?.cell || this.theme.dataCell.cell;
    const newPadding = { ...padding };
    const extraPadding = getExtraPaddingForExpandIcon(
      this.spreadsheet,
      this.meta.field,
      this.getStyle(),
    );

    if (extraPadding.left) {
      newPadding.left = (newPadding.left || 0) + extraPadding.left;
    }
    if (extraPadding.right) {
      newPadding.right = (newPadding.right || 0) + extraPadding.right;
    }

    return getContentArea(this.getCellArea(), newPadding);
  }

  protected getHorizontalResizeAreaName() {
    return `${HORIZONTAL_RESIZE_AREA_KEY_PRE}${'table-col-cell'}`;
  }

  protected drawBackgroundShape() {
    const { backgroundColor } = this.getStyle().cell;
    this.backgroundShape = renderRect(this, {
      ...this.getCellArea(),
      fill: backgroundColor,
    });
  }
}
