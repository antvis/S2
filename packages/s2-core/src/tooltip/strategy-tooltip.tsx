/**
 * Create By Bruce Too
 * On 2020-05-29
 */
import * as _ from 'lodash';
import { SummaryProps, TooltipOptions, Aggregation, ListItem } from '../index';
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
      const rowQuery = options?.rowQuery || {};
      const rightField = getRightFieldInQuery(rowQuery, this.getRowFields());
      const valueField = _.get(rowQuery, rightField, '');
      const formatter = this.getFieldFormatter(valueField);
      const name = this.getFieldName(valueField);
      const value = formatter(hoverData[valueField]);
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

  protected getDetailList(
    hoverData: Record<string, any>,
    options: TooltipOptions,
  ): ListItem[] {
    if (hoverData) {
      const rowFields = this.getRowFields() || [];
      const rowQuery = options?.rowQuery || {};
      const rightField = getRightFieldInQuery(rowQuery, rowFields);
      const valueField = _.get(rowQuery, rightField, '');
      const index = rowFields.indexOf(rightField);
      const rows = [...rowFields];
      if (index !== -1) {
        rows.splice(index + 1);
      }
      const colRowFields = _.filter(
        _.concat([], this.getColumnFields(), rows),
        (field) => hoverData[field],
      );
      // 衍生指标全部显示，无论是否有值
      colRowFields.push(...this.getDerivedValues(valueField));
      return _.map(
        colRowFields,
        (field: string): ListItem => {
          let name;
          let formatter;
          let value;
          let icon = null;
          if (_.isEqual(field, rightField)) {
            // 度量维度的值单独取
            const measure = hoverData[field];
            name = this.getFieldName(measure);
            formatter = this.getFieldFormatter(measure);
            value = formatter(hoverData[measure]);
          } else {
            name = this.getFieldName(field);
            formatter = this.getFieldFormatter(field);
            value = formatter(hoverData[field]);
            if (this.spreadsheet.isDerivedValue(field) && hoverData[field]) {
              if (hoverData[field] < 0) {
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
        },
      );
    }
  }
}
