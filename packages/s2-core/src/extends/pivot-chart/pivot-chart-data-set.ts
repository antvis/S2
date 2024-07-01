import { PivotDataSet } from '@antv/s2';

export class PivotChartDataset extends PivotDataSet {
  getChartDataList() {}

  // public getValueRangeByField(field: string): ValueRange {
  //   const cacheRange = getValueRangeState(this.spreadsheet, field);

  //   if (cacheRange) {
  //     return cacheRange;
  //   }

  //   const fieldValues = compact(
  //     map(this.originData, (item) => {
  //       const value = item[field] as string;

  //       return isNil(value) ? null : Number.parseFloat(value);
  //     }),
  //   );
  //   const range = {
  //     maxValue: max(fieldValues),
  //     minValue: min(fieldValues),
  //   };

  //   setValueRangeState(this.spreadsheet, {
  //     [field]: range,
  //   });

  //   return range;
  // }
}
