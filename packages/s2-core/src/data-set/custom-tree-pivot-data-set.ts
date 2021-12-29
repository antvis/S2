import { get } from 'lodash';
import { PivotDataSet } from '@/data-set/pivot-data-set';
import { CellDataParams, DataType } from '@/data-set/interface';
import { getDataPath, getQueryDimValues } from '@/utils/dataset/pivot-data-set';

export class CustomTreePivotDataSet extends PivotDataSet {
  getCellData(params: CellDataParams): DataType {
    const { query } = params;
    const { columns, rows } = this.fields;
    const rowDimensionValues = getQueryDimValues(rows, query);
    const colDimensionValues = getQueryDimValues(columns, query);
    const path = getDataPath({
      rowDimensionValues,
      colDimensionValues,
      rowPivotMeta: this.rowPivotMeta,
      colPivotMeta: this.colPivotMeta,
      isFirstCreate: true,
      careUndefined: true,
      rowFields: rows,
      colFields: columns,
    });
    const data = get(this.indexesData, path);
    return data;
  }
}
