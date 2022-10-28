import { find } from 'lodash';
import type { Group } from '@antv/g-canvas';
import { ColCell } from '../cell/col-cell';
import {
  HORIZONTAL_RESIZE_AREA_KEY_PRE,
  KEY_GROUP_FROZEN_COL_RESIZE_AREA,
} from '../common/constant';
import type { FormatResult, SortParam } from '../common/interface';
import { isFrozenCol, isFrozenTrailingCol } from '../facet/utils';
import { renderRect } from '../utils/g-renders';
import {
  getOrCreateResizeAreaGroupById,
  shouldAddResizeArea,
} from '../utils/interaction/resize';
import { getSortTypeIcon } from '../utils/sort-action';
import { formattedFieldValue } from '../utils/cell/header-cell';
import type { TableColHeader } from '../facet/header/table-col';

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

    const { x, y, width, height } = this.getBBoxByType();
    const { scrollX, scrollY } = this.headerConfig;

    const resizeStyle = this.getResizeAreaStyle();

    const resizeAreaBBox = {
      x: x + width - resizeStyle.size,
      y,
      width: resizeStyle.size,
      height,
    };

    return shouldAddResizeArea(
      resizeAreaBBox,
      (
        this.spreadsheet.facet.columnHeader as TableColHeader
      ).getScrollGroupClipBBox(),
      {
        scrollX,
        scrollY,
      },
    );
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

  protected getHorizontalResizeAreaName() {
    return `${HORIZONTAL_RESIZE_AREA_KEY_PRE}${'table-col-cell'}`;
  }

  protected drawBackgroundShape() {
    const { backgroundColor } = this.getStyle().cell;
    this.backgroundShape = renderRect(this, {
      ...this.getBBoxByType(),
      fill: backgroundColor,
    });
  }
}
