import { get, type PropertyPath } from 'lodash';
import { EXTRA_FIELD } from '../common/constant';
import { i18n } from '../common/i18n';
import type { Meta, S2DataConfig } from '../common/interface';
import {
  getDataPath,
  getDataPathPrefix,
  transformDimensionsValues,
} from '../utils/dataset/pivot-data-set';
import { CellData } from './cell-data';
import type { GetCellDataParams } from './interface';
import { PivotDataSet } from './pivot-data-set';

export class CustomTreePivotDataSet extends PivotDataSet {
  getCellData(params: GetCellDataParams) {
    const { query = {} } = params || {};
    const { columns, rows } = this.fields;
    const rowDimensionValues = transformDimensionsValues(
      query,
      rows as string[],
    );
    const colDimensionValues = transformDimensionsValues(
      query,
      columns as string[],
    );
    const path = getDataPath({
      rowDimensionValues,
      colDimensionValues,
      rowPivotMeta: this.rowPivotMeta,
      colPivotMeta: this.colPivotMeta,
      rowFields: rows as string[],
      colFields: columns as string[],
      prefix: getDataPathPrefix(rows as string[], columns as string[]),
    });

    const rawData = get(this.indexesData, path as PropertyPath);

    if (rawData) {
      return CellData.getCellData(rawData, query[EXTRA_FIELD]);
    }
  }

  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    /**
     * 自定义行头有如下几个特点
     * 1、rows配置必须是空，需要额外添加 $$extra$$ 定位数据（标记指标的id）
     * 2、要有配置 fields.rowCustomTree(行头结构)
     * 3、values 不需要参与计算，默认就在行头结构中
     */

    const updatedDataCfg = super.processDataCfg(dataCfg);
    const newMeta: Meta[] = this.processMeta(dataCfg.meta, i18n('指标'));

    return {
      ...updatedDataCfg,
      meta: newMeta,
      fields: {
        ...updatedDataCfg.fields,
        rows: [EXTRA_FIELD],
        valueInCols: false,
      },
    };
  }
}
