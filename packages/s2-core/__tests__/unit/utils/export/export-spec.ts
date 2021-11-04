import { TableSheet, PivotSheet } from 'src/sheet-type';
import { assembleDataCfg, assembleOptions } from '../../../util/sheet-entry';
import { getContainer } from '../../../util/helpers';
import { copyData } from '@/utils';

describe('TableSheet Export Test', () => {
  it('should export correct data with series number', () => {
    const s2 = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        showSeriesNumber: true,
      }),
    );
    s2.render();
    const data = copyData(s2, '\t');
    const rows = data.split('\n');
    const headers = rows[0].split('\t');
    // 33行数据 包括一行列头
    expect(rows.length).toEqual(33);
    // 6列数据 包括序列号
    rows.forEach((e) => {
      expect(e.split('\t').length).toEqual(6);
    });
    expect(headers.map((e) => JSON.parse(e))).toEqual([
      '序号',
      'province',
      'city',
      'type',
      'sub_type',
      'number',
    ]);
  });
  it('should export correct data with no series number', () => {
    const s2 = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        showSeriesNumber: false,
      }),
    );
    s2.render();
    const data = copyData(s2, '\t');
    const rows = data.split('\n');
    const headers = rows[0].split('\t');
    // 33行数据 包括一行列头
    expect(rows.length).toEqual(33);
    // 5列数据 包括序列号
    rows.forEach((e) => {
      expect(e.split('\t').length).toEqual(5);
    });
    expect(headers.map((e) => JSON.parse(e))).toEqual([
      'province',
      'city',
      'type',
      'sub_type',
      'number',
    ]);
  });
});

describe('PivotSheet Export Test', () => {
  it('should export correct data in grid mode', () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        fields: {
          valueInCols: true,
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({ hierarchyType: 'grid' }),
    );
    s2.render();
    const data = copyData(s2, '\t');
    const rows = data.split('\n');
    expect(rows.length).toEqual(14);
    rows.forEach((e) => {
      expect(e.split('\t').length).toEqual(34);
    });
  });
  it('should export correct data in tree mode', () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        fields: {
          valueInCols: true,
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        hierarchyType: 'tree',
      }),
    );
    s2.render();
    const data = copyData(s2, '\t');
    const rows = data.split('\n');
    expect(rows.length).toEqual(16);
    rows.forEach((e) => {
      expect(e.split('\t').length).toEqual(34);
    });
  });
  it('should export correct data in grid mode with valueInCols is false', () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        fields: {
          valueInCols: false,
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        hierarchyType: 'grid',
      }),
    );
    s2.render();
    const data = copyData(s2, '\t');
    const rows = data.split('\n');
    expect(rows.length).toEqual(13);
    rows.forEach((e) => {
      expect(e.split('\t').length).toEqual(35);
    });
  });
});
