import { EXTRA_FIELD } from '../common/constant';
import { i18n } from '../common/i18n';
import type { Meta, S2DataConfig } from '../common/interface';
import { PivotDataSet } from './pivot-data-set';

export class CustomTreePivotDataSet extends PivotDataSet {
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
