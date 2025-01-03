/* eslint-disable jest/expect-expect */
import { CopyMIMEType } from '@/common/interface/export';
import { TableSheet } from '@/sheet-type';
import { asyncGetAllPlainData } from '@/utils';
import { clone, slice } from 'lodash';
import { data as originData } from 'tests/data/mock-dataset.json';
import {
  CSV_SEPARATOR,
  FormatOptions,
  LINE_SEPARATOR,
  S2DataConfig,
  S2Options,
  TAB_SEPARATOR,
  type DataItem,
} from '../../../../src';
import { customColSimpleColumns } from '../../../data/custom-table-col-fields';
import {
  assembleDataCfg,
  assembleOptions,
  generateRawData,
} from '../../../util';
import {
  createTableSheet,
  expectMatchSnapshot,
  getContainer,
} from '../../../util/helpers';

describe('TableSheet Export Test', () => {
  const expectColumnsFormatterMatchSnapshot = async (
    dataCfg: S2DataConfig,
    formatOptions: FormatOptions,
  ) => {
    const s2Options: S2Options = {
      width: 800,
      height: 600,
    };

    const tableSheet = new TableSheet(getContainer(), dataCfg, s2Options);

    await expectMatchSnapshot(tableSheet, formatOptions);
  };

  const expectColumnsFormatterTest = async (formatOptions: FormatOptions) => {
    const s2DataCfg: S2DataConfig = {
      data: originData,
      fields: {
        columns: ['province', 'type', 'city', 'number'],
      },
      meta: [
        // 无 name 和 formatter 不做任何处理
        { field: 'province' },
        // name 只对列头生效, formatter 只对 数值生效
        { field: 'city', name: '城市-#', formatter: (v) => `${v}-@` },
        { field: 'number', name: '数值', formatter: (v) => `${v}-$` },
      ],
    };

    await expectColumnsFormatterMatchSnapshot(s2DataCfg, formatOptions);
  };

  const expectCustomColumnsFormatterTest = async (
    formatOptions: FormatOptions,
  ) => {
    const customColDataCfg: S2DataConfig = {
      data: originData,
      fields: {
        columns: customColSimpleColumns,
      },
      meta: [
        //  地区 name 有效, formatter 无效
        { field: 'area', formatter: (v) => `${v}-#` },
        // 自定义列头时, name 无效, 以 field.title 为准, formatter 只对 数值生效
        { field: 'city', formatter: (v) => `${v}-@` },
        { field: 'number', formatter: (v) => `${v}-$` },
      ],
    };

    await expectColumnsFormatterMatchSnapshot(customColDataCfg, formatOptions);
  };

  it('should export correct data with series number', async () => {
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
        data: slice(originData, 0, 10),
      }),
      assembleOptions({
        seriesNumber: {
          enable: true,
        },
      }),
    );

    await s2.render();

    function testCase(data: string): void {
      const rows = data.split(LINE_SEPARATOR);
      const headers = rows[0].split(TAB_SEPARATOR);

      expect(slice(rows, 0, 5)).toMatchSnapshot();

      // 33行数据 包括一行列头
      expect(rows).toHaveLength(11);

      // 6列数据 包括序列号
      rows.forEach((e) => {
        expect(e.split(TAB_SEPARATOR)).toHaveLength(6);
      });

      expect(headers).toEqual([
        '序号',
        'province',
        'city',
        '产品类型',
        'sub_type',
        'number',
      ]);
    }

    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: TAB_SEPARATOR,
      formatOptions: {
        formatHeader: true,
      },
    });

    testCase(data);

    const asyncData = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: TAB_SEPARATOR,
      formatOptions: {
        formatHeader: true,
      },
      async: true,
    });

    testCase(asyncData);
  });

  it('should export correct data with no series number', async () => {
    const s2 = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
        data: slice(originData, 0, 10),
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
      split: TAB_SEPARATOR,
    });
    const rows = data.split(LINE_SEPARATOR);
    const headers = rows[0].split(TAB_SEPARATOR);

    // 33行数据 包括一行列头
    expect(rows).toHaveLength(11);
    // 5列数据 包括序列号
    rows.forEach((e) => {
      expect(e.split(TAB_SEPARATOR)).toHaveLength(5);
    });
    expect(headers).toEqual(['province', 'city', 'type', 'sub_type', 'number']);
  });

  it('should export correct data with totals', async () => {
    const s2 = new TableSheet(
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
        data: slice(originData, 0, 5),
        fields: {
          columns: ['province', 'type', 'sub_type', 'number'],
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
      split: TAB_SEPARATOR,
      formatOptions: true,
    });

    expect(data).toMatchSnapshot();
  });

  it('should support custom export matrix transformer', async () => {
    const s2 = new TableSheet(
      getContainer(),
      assembleDataCfg({
        data: slice(originData, 0, 5),
        fields: {
          columns: ['province', 'type', 'sub_type', 'number'],
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
      split: TAB_SEPARATOR,
      formatOptions: true,
      customTransformer: () => {
        return {
          [CopyMIMEType.PLAIN]: () => {
            return { type: CopyMIMEType.PLAIN, content: 'custom data' };
          },
        };
      },
    });

    expect(data).toMatchSnapshot();
  });

  // https://github.com/antvis/S2/issues/2236
  it('should export correct data when the split separator is configured', async () => {
    const tableSheet = new TableSheet(
      getContainer(),
      assembleDataCfg({
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions(),
    );

    await tableSheet.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: tableSheet,
      split: CSV_SEPARATOR,
      formatOptions: true,
    });
    // 只取前10行数据
    const result = slice(data.split(LINE_SEPARATOR), 0, 5);

    expect(result).toMatchSnapshot();
  });

  it('should export correct data with formatter', async () => {
    const tableSheet = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: 'number',
            name: '数量',
            description: '数量说明。。',
          },
          {
            field: 'province',
            name: '省份',
            description: '省份说明。。',
          },
          {
            field: 'city',
            name: '城市',
            description: '城市说明。。',
          },
          {
            field: 'type',
            name: '类别',
            description: '类别说明。。',
          },
          {
            field: 'sub_type',
            name: '子类别',
            description: '子类别说明。。',
          },
        ],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions(),
    );

    await tableSheet.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: tableSheet,
      split: CSV_SEPARATOR,
      formatOptions: {
        formatHeader: true,
      },
    });

    expect(data.split(LINE_SEPARATOR)).toMatchSnapshot();
  });

  it('should export correct data with formatter if contain repeat column name', async () => {
    const tableSheet = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: 'number',
            name: '子类别',
          },
          {
            field: 'province',
            name: '省份',
          },
          {
            field: 'city',
            name: '子类别',
          },
          {
            field: 'type',
            name: '类别',
          },
          {
            field: 'sub_type',
            name: '子类别',
          },
        ],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions(),
    );

    await tableSheet.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: tableSheet,
      split: CSV_SEPARATOR,
      formatOptions: {
        formatHeader: true,
      },
    });

    expect(data.split(LINE_SEPARATOR)).toMatchSnapshot();
  });

  // https://github.com/antvis/S2/issues/2681
  it.each([{ async: false }, { async: true }])(
    'should export correctly data for single row data by %o',
    async (options) => {
      const tableSheet = createTableSheet({ width: 600, height: 400 });

      tableSheet.setDataCfg({
        fields: {
          columns: ['province', 'city', 'type', 'price', 'cost'],
        },
        data: [{ province: '浙江', city: '杭州', type: '笔', price: 1 }],
      });

      await tableSheet.render();
      const data = await asyncGetAllPlainData({
        sheetInstance: tableSheet,
        split: TAB_SEPARATOR,
        ...options,
      });

      expect(data.split(LINE_SEPARATOR)).toMatchSnapshot();
    },
  );

  it('should not apply formatter for col header by { formatHeader: false, formatData: true }', async () => {
    await expectColumnsFormatterTest({
      formatHeader: false,
      formatData: true,
    });
  });

  it('should apply formatter for col header by { formatHeader: true, formatData: true }', async () => {
    await expectColumnsFormatterTest({
      formatHeader: true,
      formatData: true,
    });
  });

  it('should not apply formatter for col header and data cells by { formatHeader: false, formatData: false }', async () => {
    await expectColumnsFormatterTest({
      formatHeader: false,
      formatData: false,
    });
  });

  it('should not apply formatter for custom col header by { formatHeader: false, formatData: true }', async () => {
    await expectCustomColumnsFormatterTest({
      formatHeader: false,
      formatData: true,
    });
  });

  // https://github.com/antvis/S2/issues/2688
  it('should apply formatter for custom col header by { formatHeader: true, formatData: true }', async () => {
    await expectCustomColumnsFormatterTest({
      formatHeader: true,
      formatData: true,
    });
  });

  it('should not apply formatter for custom col header and data cells by { formatHeader: false, formatData: false }', async () => {
    await expectCustomColumnsFormatterTest({
      formatHeader: false,
      formatData: false,
    });
  });

  // https://github.com/antvis/S2/issues/2718
  it('should export the correct amount of data and have no duplicate data', async () => {
    const bigData = generateRawData(
      { province: 10, city: 10 },
      { type: 10, sub_type: 10 },
    );

    const tableSheet = new TableSheet(
      getContainer(),
      assembleDataCfg({
        data: bigData,
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions(),
    );

    await tableSheet.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: tableSheet,
      split: CSV_SEPARATOR,
      formatOptions: true,
    });

    // The first line is the header, so the number of lines should be the same as the number of data plus one
    expect(data.split(LINE_SEPARATOR)).toHaveLength(bigData.length + 1);
  });

  it('should export correctly data for default series number text by { formatHeader: false }', async () => {
    const tableSheet = new TableSheet(
      getContainer(),
      assembleDataCfg({
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        seriesNumber: { enable: true },
      }),
    );

    await tableSheet.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: tableSheet,
      split: TAB_SEPARATOR,
      formatOptions: {
        formatHeader: false,
      },
    });

    expect(data).toMatchSnapshot();
  });

  // https://github.com/antvis/S2/issues/2755
  it('should export correctly data for custom series number text by { formatHeader: true }', async () => {
    const tableSheet = new TableSheet(
      getContainer(),
      assembleDataCfg({
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        seriesNumber: { enable: true, text: '测试' },
      }),
    );

    await tableSheet.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: tableSheet,
      split: TAB_SEPARATOR,
      formatOptions: {
        formatHeader: true,
      },
    });

    expect(data).toMatchSnapshot();
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

    const s2 = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        data,
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        placeholder: {
          cell: '占位符',
        },
      }),
    );

    await expectMatchSnapshot(s2, {
      formatData: true,
    });
  });
});
