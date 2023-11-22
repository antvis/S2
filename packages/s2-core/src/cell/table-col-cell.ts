import { find } from 'lodash';
import { ColCell } from '../cell/col-cell';
import {
  HORIZONTAL_RESIZE_AREA_KEY_PRE,
  KEY_GROUP_FROZEN_COL_RESIZE_AREA,
} from '../common/constant';
import type { FormatResult } from '../common/interface';
import type { AreaRange } from '../common/interface/scroll';
import type { SimpleBBox } from '../engine';
import type { BaseHeaderConfig } from '../facet/header';
import { getNodeRoot, isFrozenCol, isFrozenTrailingCol } from '../facet/utils';
import { formattedFieldValue } from '../utils/cell/header-cell';
import { renderRect } from '../utils/g-renders';
import {
  getOrCreateResizeAreaGroupById,
  shouldAddResizeArea,
} from '../utils/interaction/resize';
import { getFrozenColWidth } from '../utils/layout/frozen';
import { getSortTypeIcon } from '../utils/sort-action';

export class TableColCell extends ColCell {
  protected handleRestOptions(...[headerConfig]: [BaseHeaderConfig]) {
    this.headerConfig = { ...headerConfig };
    const { field } = this.meta;
    const sortParams = this.spreadsheet.dataCfg.sortParams;
    const sortParam = find(sortParams, (item) => item?.sortFieldId === field);
    const type = getSortTypeIcon(sortParam, true);

    this.headerConfig.sortParam = {
      ...this.headerConfig.sortParam!,
      ...(sortParam || {}),
      type,
    };
  }

  protected isFrozenCell() {
    const { colCount = 0, trailingColCount = 0 } =
      this.spreadsheet.options.frozen!;
    const colNodes = this.spreadsheet.facet?.getColNodes(0);
    const { colIndex } = getNodeRoot(this.meta);

    return (
      isFrozenCol(colIndex, colCount) ||
      isFrozenTrailingCol(colIndex, trailingColCount, colNodes?.length)
    );
  }

  protected getFormattedFieldValue(): FormatResult {
    return formattedFieldValue(
      this.meta,
      this.spreadsheet.dataSet.getFieldName(this.meta.field),
    );
  }

  protected shouldAddVerticalResizeArea() {
    if (this.isFrozenCell()) {
      return true;
    }

    const {
      scrollX,
      scrollY,
      width: headerWidth,
      height: headerHeight,
    } = this.getHeaderConfig();
    const { x, y, width, height } = this.getBBoxByType();
    const resizeStyle = this.getResizeAreaStyle();

    const resizeAreaBBox: SimpleBBox = {
      x: x + width - resizeStyle.size!,
      y,
      width: resizeStyle.size!,
      height,
    };

    const frozenWidth = getFrozenColWidth(
      this.spreadsheet.facet.getColLeafNodes(),
      this.spreadsheet.options.frozen!,
    );
    const resizeClipAreaBBox: SimpleBBox = {
      x: frozenWidth.frozenColWidth,
      y: 0,
      width:
        headerWidth -
        frozenWidth.frozenColWidth -
        frozenWidth.frozenTrailingColWidth,
      height: headerHeight,
    };

    return shouldAddResizeArea(resizeAreaBBox, resizeClipAreaBBox, {
      scrollX,
      scrollY,
    });
  }

  protected getVerticalResizeAreaOffset() {
    const { x, y } = this.meta;
    const { scrollX = 0, position } = this.getHeaderConfig();

    if (this.isFrozenCell()) {
      return {
        x: position?.x + x,
        y: position?.y + y,
      };
    }

    return {
      x: position?.x + x - scrollX,
      y: position?.y + y,
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
    );
  }

  protected isSortCell() {
    return true;
  }

  protected showSortIcon() {
    return this.spreadsheet.options.showDefaultHeaderActionIcon;
  }

  protected getTextStyle() {
    const style = this.getStyle();

    return style?.bolderText!;
  }

  protected getHorizontalResizeAreaName() {
    return `${HORIZONTAL_RESIZE_AREA_KEY_PRE}${this.meta.id}`;
  }

  protected drawBackgroundShape() {
    const { backgroundColor } = this.getStyle()!.cell!;

    this.backgroundShape = renderRect(this, {
      ...this.getBBoxByType(),
      fill: backgroundColor,
    });
  }

  protected handleViewport(viewport: AreaRange): AreaRange {
    if (this.isFrozenCell()) {
      viewport.start = 0;
    }

    return viewport;
  }
}
