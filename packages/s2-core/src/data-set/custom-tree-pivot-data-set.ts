import { get } from 'lodash';
import { EXTRA_FIELD } from '../common/constant';
import { i18n } from '../common/i18n';
import type { Meta, S2DataConfig } from '../common/interface';
import {
  getDataPath,
  getDataPathPrefix,
  transformDimensionsValues,
} from '../utils/dataset/pivot-data-set';
import { DataHandler } from '../utils/dataset/proxy-handler';
import type { CellDataParams, DataType } from './interface';
import { PivotDataSet } from './pivot-data-set';

export class CustomTreePivotDataSet extends PivotDataSet {
  getCellData(params: CellDataParams): DataType {
    const { query } = params;
    const { rows, columns } = this.fields;
    const rowDimensionValues = transformDimensionsValues(query, rows);
    // 透视表下columns只支持简单结构
    const colDimensionValues = transformDimensionsValues(
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

  getValues() {
    // 交叉模式下，values 会被传入用于生成 pivotMeta 结构
    // 在 customTree 模式下， customTree 对应的 rows 只包含 extra，不需要像交叉模式那样从 一行数据里面获取对应 values 然后生成一对多的结构
    // 所以传入一个空的 values 结构即可
    return [];
  }
}
