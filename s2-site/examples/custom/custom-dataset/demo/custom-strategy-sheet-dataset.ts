/* eslint-disable no-console */
/* eslint-disable max-classes-per-file */
import {
  CustomTreePivotDataSet,
  DataCell,
  EMPTY_EXTRA_FIELD_PLACEHOLDER,
  EXTRA_COLUMN_FIELD,
  EXTRA_FIELD,
  GetCellDataParams,
  GetCellMultiDataParams,
  Meta,
  PivotSheet,
  RawData,
  S2DataConfig,
  S2Options,
  drawCustomContent,
  i18n,
} from '@antv/s2';
import { isEmpty, isObject, keys, size } from 'lodash';

class CustomDataSet extends CustomTreePivotDataSet {
  // 自定义单个数据查询逻辑
  getCellData(params: GetCellDataParams) {
    console.log('getCellData:', params);

    if (params?.rowNode?.rowIndex <= 2) {
      return null;
    }

    return super.getCellData(params);
  }

  getExistValuesByDataItem(data: RawData) {
    const result = keys(data).filter((key) => isObject(data[key]));

    if (isEmpty(result)) {
      result.push(EMPTY_EXTRA_FIELD_PLACEHOLDER);
    }

    return result;
  }

  // 自定义多个数据查询逻辑
  getCellMultiData(params: GetCellMultiDataParams) {
    return super.getCellMultiData(params);
  }

  // 自定义数据配置处理
  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    const updatedDataCfg = super.processDataCfg(dataCfg);
    // 多指标数值挂行头，单指标挂列头
    const valueInCols = size(updatedDataCfg?.fields?.values) <= 1;

    const newMeta: Meta[] = this.processMeta(dataCfg.meta, i18n('指标'));

    return {
      ...updatedDataCfg,
      meta: newMeta,
      fields: {
        ...updatedDataCfg.fields,
        rows: [...(dataCfg.fields.rows || []), EXTRA_FIELD],
        valueInCols,
      },
    };
  }
}

/**
 * 自定义 DataCell
 * 查看更多方法 https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/data-cell.ts
 */
class CustomDataCell extends DataCell {
  drawTextShape() {
    if (this.isMultiData()) {
      return drawCustomContent(this);
    }

    super.drawTextShape();
  }
}

function process(children) {
  return children.map((item) => {
    return {
      ...item,
      field: item.key,
      children: process(item.children),
    };
  });
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/3c2009ce-8c2a-451d-b29a-619a796c7903.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      ...dataCfg,
      fields: {
        ...dataCfg.fields,
        rows: process(dataCfg.fields.customTreeItems),
      },
      meta: [
        // 日期列头 格式化
        {
          field: 'date',
          name: '时间',
          formatter: (value) => `${value}年`,
        },
        // 同环比名称(虚拟列头) 格式化
        {
          field: EXTRA_COLUMN_FIELD,
          formatter: (value, data, meta) => {
            console.log(value, data, meta);

            return JSON.parse(value).join(' | ');
          },
        },
      ],
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      hierarchyType: 'tree',
      dataSet: (spreadsheet) => new CustomDataSet(spreadsheet),
      dataCell: (viewMeta) =>
        new CustomDataCell(viewMeta, viewMeta.spreadsheet),
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
