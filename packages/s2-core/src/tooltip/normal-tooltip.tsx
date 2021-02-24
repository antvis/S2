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
  uniq,
} from 'lodash';
import { BaseTooltip } from '../common/tooltip';
import { i18n } from '../common/i18n';
import { EXTRA_FIELD, TOTAL_VALUE, VALUE_FIELD } from '../common/constant';
import { SimpleTips } from '../common/tooltip/components/simple-tips';
import {
  getAggregationValue,
  shouldShowSummary,
  getPosition,
  getFriendlyVal,
  manageContainerStyle,
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
    const valueFields = this.getSelectedValueFields(selectedData);

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
      aggregationValue = parseFloat(aggregationValue.toPrecision(12)); // 解决精度问题.
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
        // 小计总计
        valItem.push(
          this.getListItem(hoverData, TOTAL_VALUE, get(hoverData, VALUE_FIELD)),
        );
      } else {
        const field = hoverData[EXTRA_FIELD];
        if (hoverData[field]) {
          // 过滤掉为空的
          valItem.push(this.getListItem(hoverData, field));
        }
        const derivedValue = this.spreadsheet.getDerivedValue(field);
        if (this.spreadsheet.isValueInCols()) {
          // 数值挂在列头，按照度量自身来匹配展示的字段
          // 1、存在多个衍生指标
          // 2、只有单列的场景，
          // 3、点击的cell属于衍生指标列
          // tooltip需要显示所有的衍生指标值
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
          // 数值挂在行头，需要将所有的衍生指标展示
          if (derivedValue.derivedValueField.length > 0) {
            valItem = this.getDerivedItemList(valItem, derivedValue, hoverData);
          }
        }
      }

      return compact(concat([], [...valItem]));
    }
  }

  private getDerivedItemList(valItem, derivedValue, hoverData: DataItem) {
    // 替换掉之前的valItem
    valItem = map(derivedValue.derivedValueField, (value: any) => {
      // if (hoverData[derivedValue]) { //  -- 不为空
      return this.getListItem(hoverData, value);
      // }
    });
    // 将主指标加进去 -- 不为空
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
      // 选择行或者列
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

  private getSelectedValueFields(selectedData: DataItem[]): string[] {
    // return [ get(selectedData, [ 0, EXTRA_FIELD ]) ]; // 返回第一个的类型吗...
    return uniq(selectedData.map((d) => d[EXTRA_FIELD]));
  }
  private getSummaryName(valueFields, firstField, hoverData): string {
    // 总计/小计场景显示“总计、小计”；圈选多个时候显示“度量”
    return size(valueFields) !== 1
      ? i18n('度量')
      : get(hoverData, 'isGrandTotals')
      ? i18n('总计')
      : this.getFieldName(firstField);
  }
}
