import type { S2DataConfig, SpreadSheet } from '../../../../src';
import { asyncGetAllPlainData } from '../../../../src/utils';
import { customRowGridSimpleFields } from '../../../data/custom-grid-simple-fields';
import { CustomGridData } from '../../../data/data-custom-grid';
import { assembleDataCfg, assembleOptions } from '../../../util';
import { getContainer } from '../../../util/helpers';
import { PivotSheet, TableSheet } from '@/sheet-type';

describe('TableSheet Export Test', () => {
  it('should export correct data with series number', async () => {
    const s2 = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: 'type',
            name: '产品类型',
            formatter: (type) => (type ? `${type}产品` : ''),
          },
        ],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        seriesNumber: {
          enable: true,
        },
      }),
    );

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: '\t',
      formatOptions: {
        formatHeader: true,
      },
    });

    const rows = data.split('\n');
    const headers = rows[0].split('\t');

    expect(rows).toHaveLength(78);
    expect(rows).toMatchSnapshot();

    // 6列数据 包括序列号
    rows.forEach((row) => {
      expect(row.split('\t')).toHaveLength(6);
    });

    expect(headers).toMatchSnapshot();
  });

  it('should export correct data with no series number', async () => {
    const s2 = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        seriesNumber: {
          enable: false,
        },
      }),
    );

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: '\t',
    });
    const rows = data.split('\n');
    const headers = rows[0].split('\t');

    expect(rows).toHaveLength(78);
    expect(rows).toMatchSnapshot();

    // 5列数据 不包括序列号
    rows.forEach((e) => {
      expect(e.split('\t')).toHaveLength(5);
    });
    expect(headers).toMatchSnapshot();
  });
});

describe('PivotSheet Export Test', () => {
  it('should export correct data in grid mode', async () => {
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

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: '\t',
    });
    const rows = data.split('\n');

    expect(rows).toHaveLength(14);
    expect(rows[0].split('\t')[1]).toEqual('province');
    expect(rows[1].split('\t')[1]).toEqual('city');

    rows.forEach((e) => {
      expect(e.split('\t')).toHaveLength(34);
    });
  });

  it('should export correct data in tree mode', async () => {
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

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: '\t',
    });
    const rows = data.split('\n');

    expect(rows).toHaveLength(16);
    expect(rows[0].split('\t')[1]).toEqual('province');
    expect(rows[1].split('\t')[1]).toEqual('city');

    rows.forEach((e) => {
      expect(e.split('\t')).toHaveLength(34);
    });
  });

  // 因为导出的数据单测，很难看出问题，所以提供图片 + 代码的模式查看：
  // https://gw.alipayobjects.com/zos/antfincdn/AU83KF1Sq/6fb3f3e6-0064-4ef8-a5c3-b1333fb59adf.png
  it('should export correct data in tree mode and row collapseAll is true', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg(),
      assembleOptions({
        hierarchyType: 'tree',
        style: {
          rowCell: {
            collapseAll: true,
          },
        },
      }),
    );

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: '\t',
    });
    const rows = data.split('\n');

    expect(rows).toHaveLength(5);
    expect(rows[0].split('\t').length).toEqual(5);
    expect(rows[0].split('\t')[0]).toEqual('类别');
    expect(rows[0].split('\t')[1]).toEqual('家具');
    expect(rows[1].split('\t')[0]).toEqual('子类别');
    expect(rows[1].split('\t')[1]).toEqual('桌子');
    expect(rows[2].split('\t')[0]).toEqual('省份');
    expect(rows[2].split('\t')[1]).toEqual('数量');
  });

  // https://gw.alipayobjects.com/zos/antfincdn/PyrWwocNf/56d0914b-159a-4293-8615-6c1308bf4b3a.png
  it('should export correct data in tree mode and hierarchyCollapse is false', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg(),
      assembleOptions({
        hierarchyType: 'tree',
        style: {
          rowCell: {
            collapseAll: false,
          },
        },
      }),
    );

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: '\t',
    });
    const rows = data.split('\n');

    expect(rows).toHaveLength(13);
    expect(rows[0].split('\t').length).toEqual(6);
    expect(rows[0].split('\t')[1]).toEqual('类别');
    expect(rows[0].split('\t')[2]).toEqual('家具');
    expect(rows[1].split('\t')[1]).toEqual('子类别');
    expect(rows[1].split('\t')[2]).toEqual('桌子');
    expect(rows[2].split('\t')[0]).toEqual('省份');
    expect(rows[2].split('\t')[1]).toEqual('城市');
    expect(rows[2].split('\t')[2]).toEqual('数量');
  });

  it('should export correct data in grid mode with valueInCols is false', async () => {
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

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: '\t',
    });
    const rows = data.split('\n');

    expect(rows).toHaveLength(13);
    rows.forEach((e) => {
      expect(e.split('\t')).toHaveLength(35);
    });
  });

  it('should export correct data in grid mode with totals in col', async () => {
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

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: '\t',
    });
    const rows = data.split('\n');

    expect(rows).toHaveLength(17);
    rows.forEach((e) => {
      expect(e.split('\t')).toHaveLength(53);
    });
  });

  it('should export correct data in grid mode with grouped totals in col', async () => {
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
            grandTotalsGroupDimensions: ['city', 'type'],
            subTotalsGroupDimensions: ['sub_type'],
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['type'],
          },
        },
      }),
    );

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: '\t',
    });
    const rows = data.split('\n');

    expect(rows).toHaveLength(17);
    rows.forEach((e) => {
      expect(e.split('\t')).toHaveLength(60);
    });
  });

  it('should export correct data in grid mode with grouped totals in row', async () => {
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
            grandTotalsGroupDimensions: ['city', 'sub_type', 'province'],
            subTotalsGroupDimensions: ['sub_type'],
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['type'],
          },
        },
      }),
    );

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: '\t',
    });
    const rows = data.split('\n');

    expect(rows).toHaveLength(16);
    rows.forEach((e) => {
      expect(e.split('\t')).toHaveLength(63);
    });
  });
  it('should export correct data in grid mode with totals in row', async () => {
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

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: '\t',
    });
    const rows = data.split('\n');

    expect(rows).toHaveLength(16);
    rows.forEach((e) => {
      expect(e.split('\t')).toHaveLength(54);
    });
  });

  it('should export correct data when isFormat: {formatHeader: true}', async () => {
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

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: '\t',
      formatOptions: {
        formatHeader: true,
      },
    });
    const rows = data.split('\n');

    expect(rows).toHaveLength(7);
    expect(rows[0].split('\t')[1]).toEqual('province');
    expect(rows[0].split('\t')[2]).toEqual('浙江省-province');
    expect(rows[1].split('\t')[1]).toEqual('city');
    expect(rows[3].split('\t')[0]).toEqual('家具-type');
  });

  it('should export correct $$extra$$ field name', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: 'number',
            name: '数值',
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

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: '\t',
      formatOptions: false,
    });
    const rows = data.split('\n');
    const headers = rows[2].split('\t');

    expect(headers).toMatchSnapshot();
  });

  describe('Custom Tree Export Test', () => {
    let s2: SpreadSheet;

    const getResult = async () => {
      const data = await asyncGetAllPlainData({
        sheetInstance: s2,
        split: '\t',
      });

      return data.split('\n');
    };

    beforeEach(async () => {
      const customRowDataCfg: S2DataConfig = {
        data: CustomGridData,
        meta: [
          {
            field: 'type',
            name: '类型',
          },
          {
            field: 'sub_type',
            name: '子类型',
          },
          {
            field: 'a-1',
            name: '层级1',
          },
          {
            field: 'a-2',
            name: '层级2',
          },
        ],
        fields: customRowGridSimpleFields,
      };

      s2 = new PivotSheet(getContainer(), customRowDataCfg, assembleOptions());

      await s2.render();
    });

    it('should export correct data in grid mode for custom row cell', async () => {
      s2.setOptions({ hierarchyType: 'grid' });
      await s2.render(false);

      const rows = await getResult();

      expect(rows).toMatchSnapshot();
    });

    it('should export correct data in tree mode for custom row cell', async () => {
      s2.setOptions({ hierarchyType: 'tree' });
      await s2.render(false);

      const rows = await getResult();

      expect(rows).toMatchSnapshot();
    });

    it('should export correct data in tree mode for custom row cell and custom corner text', async () => {
      s2.setOptions({ hierarchyType: 'tree', cornerText: '自定义' });
      await s2.render(false);

      const rows = await getResult();

      expect(rows).toMatchSnapshot();
    });
  });
});
