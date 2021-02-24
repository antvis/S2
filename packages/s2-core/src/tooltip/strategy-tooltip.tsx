/**
 * Create By Bruce Too
 * On 2020-05-29
 */
import { get, map, isEqual } from 'lodash';
import {
  SummaryProps,
  TooltipOptions,
  Aggregation,
  ListItem,
  DataItem,
  HeadInfo,
} from '..';
import { EXTRA_FIELD } from '../common/constant';
import { NormalTooltip } from '../tooltip';
import { BaseSpreadSheet } from '../sheet-type';
import getRightFieldInQuery from '../facet/layout/util/get-right-field-in-query';

export class StrategyTooltip extends NormalTooltip {
  constructor(plot: BaseSpreadSheet, aggregation: Aggregation = 'SUM') {
    super(plot, aggregation);
  }

  protected getSummaryProps(
    hoverData: Record<string, any>,
    options: TooltipOptions,
  ): SummaryProps {
    if (hoverData) {
      const { valueField } = this.getRightAndValueField(options);
      const { name, value } = this.getListItem(hoverData, valueField);

      return {
        selectedData: [hoverData],
        name,
        value,
      };
    }
    return null;
  }

  protected getDerivedValues(valueField: string): string[] {
    const derivedValue = this.spreadsheet.getDerivedValue(valueField);
    if (derivedValue) {
      return derivedValue.derivedValueField;
    }
    return [];
  }

  protected getHeadInfo(
    hoverData: DataItem,
    options?: TooltipOptions,
  ): HeadInfo {
    const rowFields = this.getRowFields() || [];
    // 如果是有rows，values是数值时，直接用normal-tooltip
    if (rowFields.find((item) => item === EXTRA_FIELD)) {
      return super.getHeadInfo(hoverData);
    }
    // 以下是数值挂行头
    const { rightField } = this.getRightAndValueField(options);
    const index = rowFields.indexOf(rightField);
    const rows = [...rowFields];
    if (index !== -1) {
      rows.splice(index + 1);
    }
    if (hoverData) {
      const colList = this.getFieldList(this.getColumnFields(), hoverData);
      const rowList = this.getFieldList(rows, hoverData);

      return { cols: colList, rows: rowList };
    }

    return { cols: [], rows: [] };
  }

  protected getRightAndValueField(
    options: TooltipOptions,
  ): { rightField: string; valueField: string } {
    const rowFields = this.getRowFields() || [];
    const rowQuery = options?.rowQuery || {};
    const rightField = getRightFieldInQuery(rowQuery, rowFields);
    const valueField = get(rowQuery, rightField, '');

    return { rightField, valueField };
  }

  protected getDetailList(
    hoverData: Record<string, any>,
    options: TooltipOptions,
  ): ListItem[] {
    if (hoverData) {
      const rowFields = this.getRowFields() || [];
      // 如果是有rows，values是数值时，直接用normal-tooltip
      if (rowFields.find((item) => item === EXTRA_FIELD)) {
        return super.getDetailList(hoverData, options);
      }
      // 以下是数值挂行头
      const { rightField, valueField } = this.getRightAndValueField(options);
      // 衍生指标全部显示，无论是否有值
      const valuesField = [rightField, ...this.getDerivedValues(valueField)];

      return map(
        valuesField,
        (field: string): ListItem => {
          if (isEqual(field, rightField)) {
            // 度量维度的值单独取
            return this.getListItem(hoverData, hoverData[field]);
          } else {
            return this.getListItem(hoverData, field);
          }
        },
      );
    }
  }
}
