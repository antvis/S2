import { find } from 'lodash';
import type { Group } from '@antv/g-canvas';
import { ColCell } from '../cell/col-cell';
import {
  HORIZONTAL_RESIZE_AREA_KEY_PRE,
  KEY_GROUP_FROZEN_COL_RESIZE_AREA,
} from '../common/constant';
import type { AreaRange } from '../common/interface/scroll';
import type { FormatResult, SortParam } from '../common/interface';
import {
  isFrozenCol,
  isFrozenTrailingCol,
  isTopLevelNode,
  getNodeRoot,
} from '../facet/utils';
import { getContentArea } from '../utils/cell/cell';
import { getExtraPaddingForExpandIcon } from '../utils/cell/table-col-cell';
import { renderRect } from '../utils/g-renders';
import { getOrCreateResizeAreaGroupById } from '../utils/interaction/resize';
import { getSortTypeIcon } from '../utils/sort-action';
import { formattedFieldValue } from '../utils/cell/header-cell';

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
    const colNodes = this.spreadsheet.facet.layoutResult.colNodes.filter(
      (node) => {
        return isTopLevelNode(node);
      },
    );
    const { colIndex } = getNodeRoot(this.meta);

    return (
      isFrozenCol(colIndex, frozenColCount) ||
      isFrozenTrailingCol(colIndex, frozenTrailingColCount, colNodes.length)
    );
  }

  protected getFormattedFieldValue(): FormatResult {
    return formattedFieldValue(
      this.meta,
      this.spreadsheet.dataSet.getFieldName(this.meta.label),
    );
  }

  protected shouldAddVerticalResizeArea() {
    if (this.isFrozenCell()) {
      return true;
    }
    return super.shouldAddVerticalResizeArea();
  }

  protected getVerticalResizeAreaOffset() {
    const { x, y } = this.meta;
    const { scrollX, position } = this.headerConfig;

    if (this.isFrozenCell()) {
      return {
        x,
        y,
      };
    }
    return {
      x: position.x + x - scrollX,
      y: position.y + y,
    };
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
    return style?.bolderText;
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
