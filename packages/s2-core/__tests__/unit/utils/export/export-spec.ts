import { assembleDataCfg, assembleOptions } from '../../../util';
import { getContainer } from '../../../util/helpers';
import { PivotSheet, TableSheet } from '@/sheet-type';
import { copyData } from '@/utils';

describe('TableSheet Export Test', () => {
  it('should export correct data with series number', () => {
    const s2 = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: 'type',
            name: '产品类型',
            formatter: (type) => `${type}产品`,
          },
        ],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        showSeriesNumber: true,
      }),
    );
    s2.render();
    const data = copyData(s2, '\t', {
      isFormatHeader: true,
    });
    const rows = data.split('\n');
    const headers = rows[0].split('\t');
    // 33行数据 包括一行列头
    expect(rows).toHaveLength(33);
    // 6列数据 包括序列号
    rows.forEach((e) => {
      expect(e.split('\t')).toHaveLength(6);
    });
    expect(headers.map((e) => JSON.parse(e))).toEqual([
      '序号',
      'province',
      'city',
      '产品类型',
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
    expect(rows).toHaveLength(33);
    // 5列数据 包括序列号
    rows.forEach((e) => {
      expect(e.split('\t')).toHaveLength(5);
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
    expect(rows).toHaveLength(14);
    expect(rows[0].split('\t')[1]).toEqual('"province"');
    expect(rows[1].split('\t')[1]).toEqual('"city"');

    rows.forEach((e) => {
      expect(e.split('\t')).toHaveLength(34);
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
    expect(rows).toHaveLength(16);
    expect(rows[0].split('\t')[1]).toEqual('"province"');
    expect(rows[1].split('\t')[1]).toEqual('"city"');
    rows.forEach((e) => {
      expect(e.split('\t')).toHaveLength(34);
    });
  });

  // 因为导出的数据单测，很难看出问题，所以提供图片 + 代码的模式查看：
  // https://gw.alipayobjects.com/zos/antfincdn/AU83KF1Sq/6fb3f3e6-0064-4ef8-a5c3-b1333fb59adf.png
  it('should export correct data in tree mode and hierarchyCollapse is true', () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg(),
      assembleOptions({
        hierarchyType: 'tree',
        style: {
          hierarchyCollapse: true,
        },
      }),
    );
    s2.render();
    const data = copyData(s2, '\t');
    const rows = data.split('\n');

    expect(rows).toHaveLength(5);
    expect(rows[0].split('\t').length).toEqual(5);
    expect(rows[0].split('\t')[0]).toEqual('"类别"');
    expect(rows[0].split('\t')[1]).toEqual('"家具"');
    expect(rows[1].split('\t')[0]).toEqual('"子类别"');
    expect(rows[1].split('\t')[1]).toEqual('"桌子"');
    expect(rows[2].split('\t')[0]).toEqual('"省份"');
    expect(rows[2].split('\t')[1]).toEqual('"数量"');
  });

  // https://gw.alipayobjects.com/zos/antfincdn/PyrWwocNf/56d0914b-159a-4293-8615-6c1308bf4b3a.png
  it('should export correct data in tree mode and hierarchyCollapse is false', () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg(),
      assembleOptions({
        hierarchyType: 'tree',
        style: {
          hierarchyCollapse: false,
        },
      }),
    );
    s2.render();
    const data = copyData(s2, '\t');
    const rows = data.split('\n');

    expect(rows).toHaveLength(13);
    expect(rows[0].split('\t').length).toEqual(6);
    expect(rows[0].split('\t')[1]).toEqual('"类别"');
    expect(rows[0].split('\t')[2]).toEqual('"家具"');
    expect(rows[1].split('\t')[1]).toEqual('"子类别"');
    expect(rows[1].split('\t')[2]).toEqual('"桌子"');
    expect(rows[2].split('\t')[0]).toEqual('"省份"');
    expect(rows[2].split('\t')[1]).toEqual('"城市"');
    expect(rows[2].split('\t')[2]).toEqual('"数量"');
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
    expect(rows).toHaveLength(13);
    rows.forEach((e) => {
      expect(e.split('\t')).toHaveLength(35);
    });
  });

  it('should export correct data in grid mode with totals in col', () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        fields: {
          valueInCols: true,
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        hierarchyType: 'grid',
        totals: {
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['province'],
          },
          col: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['type'],
          },
        },
      }),
    );
    s2.render();
    const data = copyData(s2, '\t');
    const rows = data.split('\n');
    expect(rows).toHaveLength(17);
    rows.forEach((e) => {
      expect(e.split('\t')).toHaveLength(53);
    });
  });

  it('should export correct data in grid mode with grouped totals in col', () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        fields: {
          valueInCols: true,
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        hierarchyType: 'grid',
        totals: {
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['province'],
          },
          col: {
            totalsGroupDimensions: ['city', 'type'],
            subTotalsGroupDimensions: ['sub_type'],
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['type'],
          },
        },
      }),
    );
    s2.render();
    const data = copyData(s2, '\t');
    const rows = data.split('\n');
    expect(rows).toHaveLength(17);
    rows.forEach((e) => {
      expect(e.split('\t')).toHaveLength(60);
    });
  });

  it('should export correct data in grid mode with grouped totals in row', () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        fields: {
          valueInCols: false,
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        hierarchyType: 'grid',
        totals: {
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['province'],
          },
          col: {
            totalsGroupDimensions: ['city', 'sub_type', 'province'],
            subTotalsGroupDimensions: ['sub_type'],
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['type'],
          },
        },
      }),
    );
    s2.render();
    const data = copyData(s2, '\t');
    const rows = data.split('\n');
    expect(rows).toHaveLength(16);
    rows.forEach((e) => {
      expect(e.split('\t')).toHaveLength(63);
    });
  });
  it('should export correct data in grid mode with totals in row', () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        fields: {
          valueInCols: false,
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        hierarchyType: 'grid',
        totals: {
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['province'],
          },
          col: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['type'],
          },
        },
      }),
    );
    s2.render();
    const data = copyData(s2, '\t');
    const rows = data.split('\n');
    expect(rows).toHaveLength(16);
    rows.forEach((e) => {
      expect(e.split('\t')).toHaveLength(54);
    });
  });

  it('should export correct data when isFormat: {isFormatHeader: true}', () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: 'province',
            formatter: (value) => {
              return `${value}-province`;
            },
          },
          {
            field: 'type',
            formatter: (value) => {
              return `${value}-type`;
            },
          },
        ],
        fields: {
          valueInCols: true,
          columns: ['province', 'city'],
          rows: ['type', 'sub_type'],
          values: ['number'],
        },
      }),
      assembleOptions({}),
    );
    s2.render();
    const data = copyData(s2, '\t', { isFormatHeader: true });
    const rows = data.split('\n');
    expect(rows).toHaveLength(7);
    expect(rows[0].split('\t')[1]).toEqual('"province"');
    expect(rows[0].split('\t')[2]).toEqual('"浙江省-province"');
    expect(rows[1].split('\t')[1]).toEqual('"city"');
    expect(rows[3].split('\t')[0]).toEqual('"家具-type"');
  });
});
