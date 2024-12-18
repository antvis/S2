import { find } from 'lodash';
import { ColCell } from '../cell/col-cell';
import { HORIZONTAL_RESIZE_AREA_KEY_PRE } from '../common/constant';
import type { FormatResult } from '../common/interface';
import type { BaseHeaderConfig } from '../facet/header';
import { formattedFieldValue } from '../utils/cell/header-cell';
import { renderRect } from '../utils/g-renders';
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

  protected getFormattedFieldValue(): FormatResult {
    return formattedFieldValue(
      this.meta,
      this.spreadsheet.dataSet.getFieldName(this.meta.field),
    );
  }

  protected isSortCell() {
    return true;
  }

  protected showSortIcon() {
    const { extra } = this.meta;
    const { options } = this.spreadsheet;
    const { showDefaultHeaderActionIcon } = options;

    if (!extra?.isCustomNode) {
      return showDefaultHeaderActionIcon;
    }

    // 自定义列头时, 只在叶子节点展示
    return showDefaultHeaderActionIcon && this.meta.isLeaf;
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
}
