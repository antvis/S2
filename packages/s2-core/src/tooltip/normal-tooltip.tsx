import * as React from 'react';
import {
  isNil,
  size,
  filter,
  concat,
  compact,
  map,
  isEqual,
  forEach,
  get,
  isArray,
  isObject,
} from 'lodash';
import { BaseTooltip } from '../common/tooltip';
import { i18n } from '../common/i18n';
import { EXTRA_FIELD, TOTAL_VALUE, VALUE_FIELD } from '../common/constant';
import SimpleTips from '../common/tooltip/components/simple-tips';
import {
  getAggregationValue,
  shouldShowSummary,
  getPosition,
  getFriendlyVal,
  manageContainerStyle,
  getSelectedValueFields,
} from '../utils/tooltip';
import { ListItem, SummaryProps, DataItem, TooltipOptions, HeadInfo } from '..';
import { ShowProps } from '../common/tooltip/interface';

export class NormalTooltip extends BaseTooltip {
  show(showOptions: ShowProps) {
    const { options } = showOptions;
    super.show(showOptions);
    if (options) {
      const { singleTips } = options;
      if (singleTips) {
        const { x, y, tipHeight } = getPosition(this.position, this.container);
        manageContainerStyle(this.container, {
          left: `${x - 100}px`,
          top: `${y - tipHeight * 1.7}px`,
        });
      }
    }
  }

  protected getSummaryProps(
    hoverData: DataItem,
    options: TooltipOptions,
  ): SummaryProps {
    const selectedData = this.getSelectedData();
    const valueFields = getSelectedValueFields(selectedData, EXTRA_FIELD);

    if (
      shouldShowSummary(hoverData, selectedData, options) &&
      size(valueFields) > 0
    ) {
      const firstField = valueFields[0];
      const firstFormatter = this.getFieldFormatter(firstField);
      const name = this.getSummaryName(valueFields, firstField, hoverData);
      let aggregationValue = getAggregationValue(
        selectedData,
        VALUE_FIELD,
        this.aggregation,
      );
      aggregationValue = parseFloat(aggregationValue.toPrecision(12)); // solve accuracy problems
      const value = firstFormatter(aggregationValue);
      return {
        selectedData,
        name,
        value,
      };
    }
    return null;
  }

  protected renderContent(
    data?: Record<string, any>,
    options?: TooltipOptions,
  ): any {
    if (options) {
      const { singleTips } = options;
      if (singleTips) {
        return <SimpleTips tips={data.tips} />;
      } else {
        return super.renderContent(data, options);
      }
    } else {
      return super.renderContent(data, options);
    }
  }

  protected getFieldList(fields: string[], hoverData: DataItem): ListItem[] {
    const currFields = filter(
      concat([], fields),
      (field) => field !== EXTRA_FIELD && hoverData[field],
    );
    const fieldList = map(
      currFields,
      (field: string): ListItem => {
        return this.getListItem(hoverData, field);
      },
    );
    return fieldList;
  }

  protected getHeadInfo(hoverData: DataItem): HeadInfo {
    if (hoverData) {
      const colList = this.getFieldList(this.getColumnFields(), hoverData);
      const rowList = this.getFieldList(this.getRowFields(), hoverData);

      return { cols: colList, rows: rowList };
    }

    return { cols: [], rows: [] };
  }

  protected getDetailList(
    hoverData: DataItem,
    options: TooltipOptions,
  ): ListItem[] {
    if (hoverData) {
      const { isTotals } = options;

      let valItem = [];
      if (isTotals) {
        // total/subtotal
        valItem.push(
          this.getListItem(hoverData, TOTAL_VALUE, get(hoverData, VALUE_FIELD)),
        );
      } else {
        const field = hoverData[EXTRA_FIELD];
        if (hoverData[field]) {
          // filter empty
          valItem.push(this.getListItem(hoverData, field));
        }
        const derivedValue = this.spreadsheet.getDerivedValue(field);
        if (this.spreadsheet.isValueInCols()) {
          // the value hangs at the head of the column, match the displayed fields according to the metric itself
          // 1、multiple derivative indicators
          // 2、only one column scene
          // 3、the clicked cell belongs to the derived index column
          // tooltip need to show all derivative indicators
          if (
            derivedValue.derivedValueField.length > 1 &&
            !isEqual(
              derivedValue.derivedValueField,
              derivedValue.displayDerivedValueField,
            ) &&
            this.spreadsheet.isDerivedValue(field)
          ) {
            valItem = this.getDerivedItemList(valItem, derivedValue, hoverData);
          }
        } else {
          // the value hangs at the head of the row，need to show all derivative indicators
          if (derivedValue.derivedValueField.length > 0) {
            valItem = this.getDerivedItemList(valItem, derivedValue, hoverData);
          }
        }
      }

      return compact(concat([], [...valItem]));
    }
  }

  private getDerivedItemList(valItem, derivedValue, hoverData: DataItem) {
    // replace old valItem
    valItem = map(derivedValue.derivedValueField, (value: any) => {
      return this.getListItem(hoverData, value);
    });
    // add main indicator -- not empty
    if (hoverData[derivedValue.valueField]) {
      valItem.unshift(this.getListItem(hoverData, derivedValue.valueField));
    }
    return valItem;
  }

  protected getListItem(
    data: DataItem,
    field: string,
    valueField?: string,
  ): ListItem {
    const name = this.getFieldName(field);
    const formatter = this.getFieldFormatter(field);
    const value = formatter(valueField ? valueField : data[field]);
    let icon;
    if (this.spreadsheet.isDerivedValue(field)) {
      if (data[field]) {
        if (data[field] < 0) {
          icon = 'CellDown';
        } else {
          icon = 'CellUp';
        }
      }
    }
    return {
      name,
      value,
      icon,
    };
  }

  protected getColumnFields(): string[] {
    return get(this.spreadsheet.dataSet.fields, 'columns', []);
  }

  // tslint:disable-next-line:ban-types
  protected getFieldFormatter(field: string): Function {
    const formatter = this.spreadsheet.dataSet.getFieldFormatter(field);

    return (v: any) => {
      return getFriendlyVal(formatter(v));
    };
  }

  protected getFieldName(field: string): string {
    return this.spreadsheet.dataSet.getFieldName(field);
  }

  protected getRowFields(): string[] {
    return get(this.spreadsheet.dataSet.fields, 'rows', []);
  }

  private getSelectedData(): DataItem[] {
    const layoutResult = this.spreadsheet.facet.layoutResult;

    const selectedCellIndexes = this.getSelectedCellIndexes(layoutResult);

    const selectedData = [];

    forEach(selectedCellIndexes, ([i, j]) => {
      const viewMeta = layoutResult.getViewMeta(i, j);

      const data = get(viewMeta, 'data[0]');

      if (!isNil(data)) {
        selectedData.push(data);
      }
    });

    return selectedData;
  }

  private getSelectedCellIndexes(layoutResult) {
    const { rowLeafNodes, colLeafNodes } = layoutResult;

    const selected = this.spreadsheet.store.get('selected');

    if (isObject(selected)) {
      // @ts-ignore
      const { type, indexes } = selected;
      let [ii, jj] = indexes;
      if (type === 'brush' || type === 'cell') {
        const selectedIds = [];
        ii = isArray(ii) ? ii : [ii, ii];
        jj = isArray(jj) ? jj : [jj, jj];

        for (let i = ii[0]; i <= ii[1]; i++) {
          for (let j = jj[0]; j <= jj[1]; j++) {
            selectedIds.push([i, j]);
          }
        }
        return selectedIds;
      }
      // select row or coll
      const selectedIndexes = [];
      const leftNodes = type === 'row' ? colLeafNodes : rowLeafNodes;
      let indexs = type === 'row' ? ii : jj;

      map(leftNodes, (row, idx) => {
        indexs = isArray(indexs) ? indexs : [indexs, indexs];
        for (let i = indexs[0]; i <= indexs[1]; i++) {
          selectedIndexes.push([i, idx]);
        }
      });
      return selectedIndexes;
    }

    return [];
  }

  private getSummaryName(valueFields, firstField, hoverData): string {
    // total or subtotal
    return size(valueFields) !== 1
      ? i18n('度量')
      : get(hoverData, 'isGrandTotals')
      ? i18n('总计')
      : this.getFieldName(firstField);
  }
}
