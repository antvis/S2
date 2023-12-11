import { get } from 'lodash';
import { DebuggerUtil, DEBUG_TRANSFORM_DATA } from '../common/debug';
import { EXTRA_FIELD, TOTAL_VALUE } from '../common/constant';
import { i18n } from '../common/i18n';
import type { Meta, S2DataConfig } from '../common/interface';
import {
  getDataPath,
  getDataPathPrefix,
  transformDimensionsValues,
  transformIndexesData,
} from '../utils/dataset/pivot-data-set';
import { DataHandler } from '../utils/dataset/proxy-handler';
import type { CellDataParams, DataType } from './interface';
import { PivotDataSet } from './pivot-data-set';

export class CustomTreePivotDataSet extends PivotDataSet {
  protected transformDimensionsValues(
    record: DataType = {},
    dimensions: string[] = [],
    placeholder = TOTAL_VALUE,
  ) {
    return transformDimensionsValues(record, dimensions, {
      placeholder,
      excludeExtra: true,
    });
  }

  protected transformIndexesData(data: DataType[], rows: string[]) {
    const { columns, valueInCols } = this.fields;

    let result;
    DebuggerUtil.getInstance().debugCallback(DEBUG_TRANSFORM_DATA, () => {
      result = transformIndexesData({
        rows,
        columns: columns as string[],
        values: [],
        valueInCols,
        data,
        indexesData: this.indexesData,
        sortedDimensionValues: this.sortedDimensionValues,
        rowPivotMeta: this.rowPivotMeta,
        colPivotMeta: this.colPivotMeta,
        shouldFlatten: false,
      });
      this.indexesData = result.indexesData;
      this.rowPivotMeta = result.rowPivotMeta;
      this.colPivotMeta = result.colPivotMeta;
      this.sortedDimensionValues = result.sortedDimensionValues;
    });
    return result;
  }

  getCellData(params: CellDataParams): DataType {
    const { query } = params;
    const { rows, columns } = this.fields;
    const rowDimensionValues = this.transformDimensionsValues(query, rows);
    // 透视表下columns只支持简单结构
    const colDimensionValues = this.transformDimensionsValues(
      query,
      columns as string[],
    );

    const path = getDataPath({
      rowDimensionValues,
      colDimensionValues,
      rowPivotMeta: this.rowPivotMeta,
      colPivotMeta: this.colPivotMeta,
      rowFields: rows,
      colFields: columns as string[],
      prefix: getDataPathPrefix(rows, columns as string[]),
    });
    const data = get(this.indexesData, path);
    if (data) {
      return DataHandler.createProxyData(data, query[EXTRA_FIELD]);
    }
    return data;
  }

  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    const { meta } = dataCfg;

    const newMeta: Meta[] = this.processMeta(meta, i18n('指标'));

    return {
      ...dataCfg,
      meta: newMeta,
      fields: {
        ...dataCfg.fields,
        // 1、rows配置必须是空，需要额外添加 $$extra$$ 定位数据（标记指标的id）
        rows: [EXTRA_FIELD],
        valueInCols: false,
      },
    };
  }
}
