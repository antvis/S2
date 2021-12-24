import { get, isEmpty, find } from 'lodash';
import { isFrozenCol, isFrozenTrailingCol } from 'src/facet/utils';
import { getExtraPaddingForExpandIcon } from 'src/utils/cell/table-col-cell';
import { getContentArea } from 'src/utils/cell/cell';
import { getSortTypeIcon } from 'src/utils/sort-action';
import { Group } from '@antv/g-canvas';
import { shouldAddResizeArea } from './../utils/interaction/resize';
import { isLastColumnAfterHidden } from '@/utils/hide-columns';
import { S2Event, HORIZONTAL_RESIZE_AREA_KEY_PRE } from '@/common/constant';
import { renderIcon, renderLine, renderRect } from '@/utils/g-renders';
import { ColCell } from '@/cell/col-cell';
import {
  DefaultCellTheme,
  FormatResult,
  IconTheme,
  SortParam,
} from '@/common/interface';
import { KEY_GROUP_FROZEN_COL_RESIZE_AREA } from '@/common/constant';
import { getOrCreateResizeAreaGroupById } from '@/utils/interaction/resize';
import { TableColHeader } from '@/facet/header/table-col';

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

  protected initCell() {
    super.initCell();
    this.addExpandColumnIconShapes();
  }

  private hasHiddenColumnCell() {
    const {
      interaction: { hiddenColumnFields = [] },
      tooltip: { operation },
    } = this.spreadsheet.options;

    if (isEmpty(hiddenColumnFields) || !operation.hiddenColumns) {
      return false;
    }
    const hiddenColumnsDetail = this.spreadsheet.store.get(
      'hiddenColumnsDetail',
      [],
    );
    return !!hiddenColumnsDetail.find((column) => {
      const { prev, next } = column?.displaySiblingNode || {};
      const hiddenSiblingNode = next || prev;
      return hiddenSiblingNode?.field === this.meta?.field;
    });
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

  private getExpandIconTheme(): IconTheme {
    const themeCfg = this.getStyle() as DefaultCellTheme;
    return themeCfg.icon;
  }

  private addExpandColumnSplitLine() {
    const { x, y, width, height } = this.meta;
    const {
      horizontalBorderColor,
      horizontalBorderWidth,
      horizontalBorderColorOpacity,
    } = this.theme.splitLine;
    const lineX = this.isLastColumn() ? x + width - horizontalBorderWidth : x;

    renderLine(
      this,
      {
        x1: lineX,
        y1: y,
        x2: lineX,
        y2: y + height,
      },
      {
        stroke: horizontalBorderColor,
        lineWidth: horizontalBorderWidth,
        strokeOpacity: horizontalBorderColorOpacity,
      },
    );
  }

  protected getVerticalResizeAreaOffset() {
    const { x, y } = this.meta;
    const { scrollX, position } = this.headerConfig;

    return {
      x: position.x + x - (this.isFrozenCell() ? 0 : scrollX),
      y: position.y + y,
    };
  }

  protected shouldAddVerticalResizeArea() {
    if (this.isFrozenCell()) {
      return true;
    }

    const { x, y, width, height } = this.meta;
    const { scrollX, scrollY } = this.headerConfig;

    const headerInstance = this.headerConfig.spreadsheet.facet
      .columnHeader as TableColHeader;

    const resizeStyle = this.getResizeAreaStyle();
    const resizeAreaBBox = {
      x: x + width - resizeStyle.size / 2,
      y,
      width: resizeStyle.size,
      height,
    };
    const scrollGroupBBox = headerInstance.getScrollGroupClipBBox();
    const resizeClipAreaBBox = {
      ...scrollGroupBBox,
      x: scrollGroupBBox.x - scrollX,
    };

    return shouldAddResizeArea(resizeAreaBBox, resizeClipAreaBBox, {
      scrollX,
      scrollY,
    });
  }

  private addExpandColumnIconShapes() {
    if (!this.hasHiddenColumnCell()) {
      return;
    }
    this.addExpandColumnSplitLine();
    this.addExpandColumnIcon();
  }

  private addExpandColumnIcon() {
    const iconConfig = this.getExpandColumnIconConfig();
    const icon = renderIcon(this, {
      ...iconConfig,
      name: 'ExpandColIcon',
      cursor: 'pointer',
    });
    icon.on('click', () => {
      this.spreadsheet.emit(S2Event.LAYOUT_TABLE_COL_EXPANDED, this.meta);
    });
  }

  // 在隐藏的下一个兄弟节点的起始坐标显示隐藏提示线和展开按钮, 如果是尾元素, 则显示在前一个兄弟节点的结束坐标
  private getExpandColumnIconConfig() {
    const { size } = this.getExpandIconTheme();
    const { x, y, width, height } = this.getCellArea();

    const baseIconX = x - size;
    const iconX = this.isLastColumn() ? baseIconX + width : baseIconX;
    const iconY = y + height / 2 - size / 2;

    return {
      x: iconX,
      y: iconY,
      width: size * 2,
      height: size,
    };
  }

  private isLastColumn() {
    return isLastColumnAfterHidden(this.spreadsheet, this.meta.field);
  }

  protected getHorizontalResizeAreaName() {
    return `${HORIZONTAL_RESIZE_AREA_KEY_PRE}${'table-col-cell'}`;
  }

  // 明细表列头不应该格式化 https://github.com/antvis/S2/issues/840
  protected getFormattedFieldValue(): FormatResult {
    const { label } = this.meta;
    return {
      formattedValue: label,
      value: label,
    };
  }

  protected drawBackgroundShape() {
    const { backgroundColor } = this.getStyle().cell;
    this.backgroundShape = renderRect(this, {
      ...this.getCellArea(),
      fill: backgroundColor,
    });
  }
}
