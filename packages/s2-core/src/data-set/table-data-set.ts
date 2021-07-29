import { S2DataConfig } from '@/common/interface';
import { BaseDataSet } from 'src/data-set';
import { DataType, CellDataParams } from './interface';

export class TableDataSet extends BaseDataSet {
  public processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    return dataCfg;
  }

  public getDimensionValues(field: string, query?: DataType): string[] {
    return [];
  }

  public getCellData(params: CellDataParams): DataType {
    const { query } = params;
    return this.originData[query.rowIndex][query.col];
  }

  public getMultiData(query: DataType, isTotals?: boolean): DataType[] {
    return this.originData;
  }
}
