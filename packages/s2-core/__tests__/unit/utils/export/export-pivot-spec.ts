/* eslint-disable jest/expect-expect */
import { CopyMIMEType } from '@/common/interface/export';
import { clone, map, omit } from 'lodash';
import { data as originData } from 'tests/data/mock-dataset.json';
import { assembleDataCfg, assembleOptions } from 'tests/util';
import { createPivotSheet, getContainer } from 'tests/util/helpers';
import {
  Aggregation,
  PivotSheet,
  asyncGetAllPlainData,
  type DataItem,
} from '../../../../src';
import {
  CSV_SEPARATOR,
  LINE_SEPARATOR,
  TAB_SEPARATOR,
} from '../../../../src/common/constant';
import {
  customColGridSimpleFields,
  customRowGridSimpleFields,
} from '../../../data/custom-grid-simple-fields';
import { CustomGridData } from '../../../data/data-custom-grid';
import { generateRawData } from '../../../util';
import { expectMatchSnapshot } from '../../../util/helpers';

describe('PivotSheet Export Test', () => {
  let pivotSheet: PivotSheet;

  beforeEach(async () => {
    pivotSheet = new PivotSheet(
      getContainer(),
      assembleDataCfg(),
      assembleOptions({
        hierarchyType: 'grid',
      }),
    );
    await pivotSheet.render();
  });

  it('should export correct data in grid mode', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        fields: {
          valueInCols: true,
        },
      }),
      assembleOptions({ hierarchyType: 'grid' }),
    );

    await s2.render();
    const syncData = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: TAB_SEPARATOR,
      formatOptions: true,
      async: false,
    });

    expect(syncData).toMatchSnapshot();

    const asyncData = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: TAB_SEPARATOR,
      formatOptions: true,
      async: true,
    });

    expect(asyncData).toMatchSnapshot();
  });

  it('should export correct data in tree mode', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        fields: {
          valueInCols: true,
        },
      }),
      assembleOptions({
        hierarchyType: 'tree',
      }),
    );

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: TAB_SEPARATOR,
      formatOptions: true,
    });

    expect(data).toMatchSnapshot();

    const asyncData = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: TAB_SEPARATOR,
      formatOptions: true,
      async: true,
    });

    expect(asyncData).toMatchSnapshot();
  });

  /*
   * 因为导出的数据单测，很难看出问题，所以提供图片 + 代码的模式查看：
   * https://gw.alipayobjects.com/zos/antfincdn/AU83KF1Sq/6fb3f3e6-0064-4ef8-a5c3-b1333fb59adf.png
   */
  it('should export correct data in tree mode and collapseAll is true', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg(),
      assembleOptions({
        hierarchyType: 'tree',
        totals: {
          row: {
            showSubTotals: true,
          },
        },
        style: {
          rowCell: {
            collapseAll: true,
          },
        },
      }),
    );

    await expectMatchSnapshot(s2);
  });

  // https://gw.alipayobjects.com/zos/antfincdn/PyrWwocNf/56d0914b-159a-4293-8615-6c1308bf4b3a.png
  it('should export correct data in tree mode and collapseAll is false', async () => {
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

    await expectMatchSnapshot(s2);
  });

  it('should export correct data in grid mode with valueInCols is false', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        fields: {
          valueInCols: false,
        },
      }),
      assembleOptions({
        hierarchyType: 'grid',
      }),
    );

    await expectMatchSnapshot(s2);
  });

  it('should export correct data in grid mode with totals in col', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        fields: {
          valueInCols: true,
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

    await expectMatchSnapshot(s2);
  });

  it('should export correct data in grid mode with totals in row', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        fields: {
          valueInCols: false,
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

    await expectMatchSnapshot(s2);
  });

  it('should export correct data when by {formatHeader: true}', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: 'province',
            formatter: (value) => `${value}-province`,
          },
          {
            field: 'type',
            formatter: (value) => `${value}-type`,
          },
        ],
      }),
      assembleOptions({
        interaction: {
          copy: { enable: true, withHeader: true, withFormat: true },
        },
      }),
    );

    await expectMatchSnapshot(s2, {
      formatHeader: true,
    });
  });

  it('should export correct data when by {formatData: true}', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: 'number',
            formatter: (value) => `${value}%`,
          },
          {
            field: 'type',
            name: '类别',
          },
          {
            field: 'type',
            name: '子类别',
          },
          {
            field: 'province',
            name: '省份',
          },
          {
            field: 'city',
            name: '城市',
          },
        ],
      }),
      assembleOptions({
        interaction: {
          copy: { enable: true, withHeader: true, withFormat: true },
        },
      }),
    );

    await expectMatchSnapshot(s2, {
      formatData: true,
    });
  });

  it('should export correct data when by {formatHeader: false, formatData: false}', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: 'number',
            formatter: (value) => `${value}%`,
          },
          {
            field: 'type',
            name: '类别',
          },
          {
            field: 'city',
            name: '城市',
          },
        ],
      }),
      assembleOptions({
        interaction: {
          copy: { enable: true, withHeader: true, withFormat: true },
        },
      }),
    );

    await expectMatchSnapshot(s2, {
      formatHeader: false,
      formatData: false,
    });
  });

  it('should export correct data when data is incomplete', async () => {
    const incompleteData = map(originData, (d) => {
      if (d.province === '浙江省' && d.city === '杭州市') {
        return omit(d, 'number');
      }

      if (d.type === '办公用品' && d.sub_type === '笔') {
        return omit(d, 'number');
      }

      return d;
    });

    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        data: incompleteData,
        fields: {
          valueInCols: true,
          columns: ['province', 'city'],
          rows: ['type', 'sub_type'],
          values: ['number'],
        },
      }),
      assembleOptions({ hierarchyType: 'tree' }),
    );

    await expectMatchSnapshot(s2, {
      formatData: true,
    });
  });

  it('should export correct data when series number', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg(),
      assembleOptions({
        hierarchyType: 'grid',
        seriesNumber: {
          enable: true,
        },
        interaction: {
          copy: {
            enable: true,
            withHeader: true,
          },
        },
      }),
    );

    await expectMatchSnapshot(s2);
  });

  it('should export correct data with formatter', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [{ field: 'number', name: '数值' }],
      }),
      assembleOptions({
        hierarchyType: 'grid',
        interaction: { copy: { enable: true, withHeader: true } },
      }),
    );

    await expectMatchSnapshot(s2);
  });

  it('should support custom export matrix transformer', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg(),
      assembleOptions({
        hierarchyType: 'grid',
      }),
    );

    await s2.render();

    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: TAB_SEPARATOR,
      customTransformer: () => {
        return {
          [CopyMIMEType.PLAIN]: () => {
            return { type: CopyMIMEType.PLAIN, content: 'custom data' };
          },
        };
      },
    });

    expect(data).toEqual('custom data');
  });

  // https://github.com/antvis/S2/issues/2236
  it('should export correct data When the split separator is configured', async () => {
    const data = await asyncGetAllPlainData({
      sheetInstance: pivotSheet,
      split: CSV_SEPARATOR,
      formatOptions: {
        formatHeader: true,
      },
    });

    expect(data).toMatchSnapshot();
  });

  it('should export correct data with formatter for custom row headers', async () => {
    const sheet = new PivotSheet(
      getContainer(),
      {
        data: CustomGridData,
        fields: customRowGridSimpleFields,
      },
      assembleOptions(),
    );

    await expectMatchSnapshot(sheet);
  });

  it('should export correct data with formatter for custom column headers', async () => {
    const sheet = new PivotSheet(
      getContainer(),
      {
        data: CustomGridData,
        fields: customColGridSimpleFields,
      },
      assembleOptions(),
    );

    await expectMatchSnapshot(sheet);
  });

  // https://github.com/antvis/S2/issues/2681
  it.each([{ async: false }, { async: true }])(
    'should export correctly data for single row data by %o',
    async (options) => {
      const sheet = createPivotSheet({ width: 600, height: 400 });

      sheet.setDataCfg({
        data: sheet.dataCfg.data.slice(0, 1),
      });

      await sheet.render();
      const data = await asyncGetAllPlainData({
        sheetInstance: sheet,
        split: TAB_SEPARATOR,
        ...options,
      });

      expect(data.split(LINE_SEPARATOR)).toMatchSnapshot();
    },
  );

  // https://github.com/antvis/S2/issues/2718
  it('should export the correct amount of data and have no duplicate data', async () => {
    const typeCount = 100;
    const subTypeCount = 100;

    const bigData = generateRawData(
      { province: 10, city: 1 },
      { type: typeCount, subType: subTypeCount },
    );

    const sheet = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        data: bigData,
        fields: {
          rows: ['type', 'subType'],
          columns: ['province', 'city'],
          values: ['number'],
        },
      }),
      assembleOptions({}),
    );

    await sheet.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: sheet,
      split: CSV_SEPARATOR,
      formatOptions: true,
    });

    // row header count + data count
    const count = typeCount * subTypeCount + 3;

    expect(data.split(LINE_SEPARATOR)).toHaveLength(count);
  });

  it('should export empty dimension values data', async () => {
    const data = clone<DataItem[]>(originData);

    data.unshift({
      number: 7789,
      province: null,
      city: null,
      type: null,
      sub_type: null,
    });

    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        data,
        fields: {
          valueInCols: true,
          columns: ['province', 'city'],
          rows: ['type', 'sub_type'],
          values: ['number'],
        },
      }),
      assembleOptions(),
    );

    await expectMatchSnapshot(s2, {
      formatHeader: false,
      formatData: false,
    });
  });

  // https://github.com/antvis/S2/issues/2808
  it('should export placeholder data', async () => {
    const data = clone<DataItem[]>(originData);

    data.unshift({
      number: 7789,
      province: null,
      city: null,
      type: null,
      sub_type: null,
    });

    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        data,
        fields: {
          valueInCols: true,
          columns: ['province', 'city'],
          rows: ['type', 'sub_type'],
          values: ['number'],
        },
      }),
      assembleOptions({
        hierarchyType: 'grid',
        placeholder: {
          cell: '占位符',
        },
      }),
    );

    await expectMatchSnapshot(s2, {
      formatHeader: true,
      formatData: true,
    });
  });

  it('should export correctly corner text for custom columns', async () => {
    const sheet = new PivotSheet(
      getContainer(),
      {
        data: CustomGridData,
        fields: customColGridSimpleFields,
      },
      assembleOptions(),
    );

    await expectMatchSnapshot(sheet);
  });

  // https://github.com/antvis/S2/issues/2844
  it('should export correctly corner text for custom columns and single rows', async () => {
    const sheet = new PivotSheet(
      getContainer(),
      {
        data: CustomGridData,
        fields: {
          ...customColGridSimpleFields,
          rows: ['type'],
        },
      },
      assembleOptions(),
    );

    await expectMatchSnapshot(sheet);
  });

  // https://github.com/antvis/S2/issues/2928
  it('should export correct data in grid mode by custom calc grand totals', async () => {
    const sheet = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        fields: {
          rows: ['province', 'city'],
          columns: [],
          values: ['number'],
          valueInCols: true,
        },
      }),
      assembleOptions({
        hierarchyType: 'grid',
        totals: {
          col: {
            showGrandTotals: true,
            showSubTotals: true,
            reverseGrandTotalsLayout: true,
            calcGrandTotals: {
              aggregation: Aggregation.SUM,
            },
          },
          row: {
            showGrandTotals: true,
            calcGrandTotals: {
              aggregation: Aggregation.AVG,
            },
          },
        },
      }),
    );

    await expectMatchSnapshot(sheet);
  });

  it.each([
    { formatHeader: true, formatBody: true },
    { formatHeader: true, formatBody: false },
    { formatHeader: false, formatBody: true },
    { formatHeader: false, formatBody: false },
  ])(
    'should ignore contains tab trimTabSeparator dimension value by %o',
    async (formatOptions) => {
      const data = clone<DataItem[]>(originData);

      data.unshift({
        number: 7789,
        province: '测试-province\t',
        city: '测试-city\t',
        type: '测试-type\t',
        sub_type: '测试-sub_type\t',
      });

      const s2 = new PivotSheet(
        getContainer(),
        assembleDataCfg({
          data,
          fields: {
            valueInCols: true,
            columns: ['province', 'city'],
            rows: ['type', 'sub_type'],
            values: ['number'],
          },
        }),
        assembleOptions(),
      );

      await s2.render();
      const result = await asyncGetAllPlainData({
        sheetInstance: s2,
        split: TAB_SEPARATOR,
        formatOptions,
      });

      expect(result).toContain(`"测试-province\t"`);
      expect(result).toContain(`"测试-city\t"`);
      expect(result).toContain(`"测试-type\t"`);
      expect(result).toContain(`"测试-sub_type\t"`);
    },
  );

  // https://github.com/antvis/S2/issues/2880
  it('should escape CSV Field', async () => {
    const data = clone<DataItem[]>(originData);

    data.unshift({
      number: 7789,
      province: 'ac, abs, moon',
      city: 'Venture "Extended Edition"',
      type: 'Venture "Extended Edition, Very Large"',
      sub_type: 'MUST SELL!\nair, moon roof, loaded',
    });

    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        data,
        fields: {
          valueInCols: true,
          columns: ['province', 'city'],
          rows: ['type', 'sub_type'],
          values: ['number'],
        },
        meta: [
          {
            field: 'number',
            name: '数,量',
            formatter: (value) => {
              return Number(value)
                .toFixed(3)
                .toString()
                .replace(/(\d)(?=(\d{3})+.)/g, '$1,');
            },
          },
          {
            field: 'province',
            name: '省份',
            formatter: (value) => `${value},`,
          },
          {
            field: 'city',
            name: '城市',
            formatter: (value) => `${value}\t`,
          },
          {
            field: 'type',
            name: '类别',
            formatter: (value) => {
              const valueString = String(value);

              return `${valueString.slice(0, valueString.length / 2)}\n${valueString.slice(valueString.length / 2)}`;
            },
          },
          {
            field: 'sub_type',
            name: '子类别',
            formatter: (value) => `${value}"`,
          },
        ],
      }),
      assembleOptions(),
    );

    await s2.render();
    const result = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: CSV_SEPARATOR,
      formatOptions: { formatHeader: true, formatData: true },
    });

    expect(result).toContain(`,"ac, abs, moon,",`);
    expect(result).toContain(`,"7,789.000",`);
    expect(result).toContain(`,"Venture ""Extended Edition""\t",`);
    expect(result).toContain(`"Venture ""Extended E\r\ndition, Very Large""",`);
  });
});
