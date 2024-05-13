import { find } from 'lodash';
import { ColCell } from '../cell/col-cell';
import {
  FrozenGroupPosition,
  HORIZONTAL_RESIZE_AREA_KEY_PRE,
} from '../common/constant';
import type { FormatResult } from '../common/interface';
import type { AreaRange } from '../common/interface/scroll';
import type { SimpleBBox } from '../engine';
import type { BaseHeaderConfig } from '../facet/header';
import { formattedFieldValue } from '../utils/cell/header-cell';
import { renderRect } from '../utils/g-renders';
import { shouldAddResizeArea } from '../utils/interaction/resize';
import { getSortTypeIcon } from '../utils/sort-action';
import type { FrozenFacet } from '../facet/frozen-facet';

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

  protected getFormattedFieldValue(): FormatResult {
    return formattedFieldValue(
      this.meta,
      this.spreadsheet.dataSet.getFieldName(this.meta.field),
    );
  }

  protected shouldAddVerticalResizeArea() {
    if (this.getMeta().isFrozen) {
      return true;
    }

    const {
      scrollX,
      scrollY,
      width: headerWidth,
      height: headerHeight,
      spreadsheet,
    } = this.getHeaderConfig();
    const { x, y, width, height } = this.getBBoxByType();
    const resizeStyle = this.getResizeAreaStyle();

    const resizeAreaBBox: SimpleBBox = {
      x: x + width - resizeStyle.size!,
      y,
      width: resizeStyle.size!,
      height,
    };

    const frozenGroupInfo = (spreadsheet.facet as FrozenFacet)
      .frozenGroupPositions;
    const colWidth = frozenGroupInfo[FrozenGroupPosition.Col].width;
    const trailingColWidth =
      frozenGroupInfo[FrozenGroupPosition.TrailingCol].width;

    const resizeClipAreaBBox: SimpleBBox = {
      x: colWidth,
      y: 0,
      width: headerWidth - colWidth - trailingColWidth,
      height: headerHeight,
    };

    return shouldAddResizeArea(resizeAreaBBox, resizeClipAreaBBox, {
      scrollX,
      scrollY,
    });
  }

  protected getVerticalResizeAreaOffset() {
    const { x, y } = this.meta;
    const {
      scrollX = 0,
      position,
      spreadsheet,
      viewportWidth,
    } = this.getHeaderConfig();

    const frozenGroupInfo = (spreadsheet.facet as FrozenFacet)
      .frozenGroupPositions;

    const frozenColGroup = frozenGroupInfo[FrozenGroupPosition.Col];
    const frozenTrailingColGroup =
      frozenGroupInfo[FrozenGroupPosition.TrailingCol];
    let offsetX = position?.x;

    if (this.getMeta().isFrozenHead) {
      offsetX += x - frozenColGroup.x;
    } else if (this.getMeta().isFrozenTrailing) {
      offsetX +=
        x -
        frozenTrailingColGroup.x +
        viewportWidth -
        frozenTrailingColGroup.width;
    } else {
      offsetX += x - scrollX;
    }

    return {
      x: offsetX,
      y: position?.y + y,
    };
  }

  protected isSortCell() {
    return true;
  }

  protected showSortIcon() {
    return this.spreadsheet.options.showDefaultHeaderActionIcon;
  }

  protected getTextStyle() {
    const textOverflowStyle = this.getCellTextWordWrapStyle();
    const style = this.getStyle()?.bolderText!;

    return {
      ...textOverflowStyle,
      ...style,
    };
  }

  protected getHorizontalResizeAreaName() {
    return `${HORIZONTAL_RESIZE_AREA_KEY_PRE}${this.meta.id}`;
  }

  protected drawBackgroundShape() {
    const { backgroundColor, backgroundColorOpacity } =
      this.getStyle()!.cell! || {};

    this.backgroundShape = renderRect(this, {
      ...this.getBBoxByType(),
      fill: backgroundColor,
      fillOpacity: backgroundColorOpacity,
    });
  }

  protected handleViewport(): AreaRange {
    const viewport = super.handleViewport();

    if (this.getMeta().isFrozen) {
      viewport.start = 0;
      viewport.size = Number.POSITIVE_INFINITY;
    }

    return viewport;
  }
}
