import { S2DataConfig } from '@/common/interface';
import { Node } from '@/facet/layout/node';
import { BaseDataSet } from 'src/data-set';
import { DataType } from './interface';

export class DetailDataSet extends BaseDataSet {
  public processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    return dataCfg;
  }

  public getDimensionValues(field: string, query?: DataType): string[] {
    return [];
  }

  public getCellData(query: DataType, rowNode?: Node): DataType {
    return null;
  }

  public getMultiData(query: DataType, isTotals?: boolean): DataType[] {
    return [];
  }
}

// import { S2DataConfig } from '../common/interface';
// import { processIrregularData } from '../utils/get-irregular-data';
// import { EXTRA_FIELD } from '../common/constant';
// import { BaseDataSet, DetailPivot, PivotDataSet } from './index';
// import { DataType } from 'src/data-set/interface';
//
// /**
//  * 明细表的DataSet工具类
//  */
// export class DetailDataSet extends BaseDataSet {
//   /**
//    * 对数据集预处理
//    * 明细表需要在所有行末尾增加一列，代表当前行在原始数据里面的index
//    */
//   protected preProcess(dataCfg: S2DataConfig): S2DataConfig {
//     const newDataCfg = processIrregularData(dataCfg);
//     const { data, meta, fields, sortParams = [] } = newDataCfg;
//     const { columns } = fields;
//     // 1. 生成一个字段名称
//     // 固定死为 EXTRA_FIELD -- 记录每行的index
//
//     // 2. 新的维度字段放入到 columns 数组中
//     const newColumns = [...columns, EXTRA_FIELD];
//
//     const newData = [];
//     for (let i = 0; i < data.length; i++) {
//       newData.push({
//         ...data[i],
//         [EXTRA_FIELD]: i, // 新列的维度为index
//       });
//     }
//
//     // 返回新的结构
//     return {
//       data: newData,
//       meta,
//       fields: {
//         ...fields,
//         columns: newColumns,
//       },
//       sortParams,
//     };
//   }
//
//   protected createPivot() {
//     // 创建 pivot 需要的数据源实例
//     const { rows, columns, values } = this.fields;
//
//     return new DetailPivot({
//       cols: columns,
//       rows,
//       data: [],
//       values: values as string[],
//       sortParams: this.sortParams,
//       spreadsheet: this.spreadsheet,
//     });
//   }
//
//   getCellData(query: DataType): DataType[] {
//     return [];
//   }
//
//   getDimensionValues(field: string, query?: DataType): string[] {
//     return [];
//   }
//
//   processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
//     return undefined;
//   }
// }
