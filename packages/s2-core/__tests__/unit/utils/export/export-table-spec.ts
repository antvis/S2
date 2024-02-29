import { slice } from 'lodash';
import { data as originData } from 'tests/data/mock-dataset.json';
import { assembleDataCfg, assembleOptions } from '../../../util';
import { getContainer } from '../../../util/helpers';
import { TableSheet } from '@/sheet-type';
import { asyncGetAllPlainData } from '@/utils';
import { NewTab, NewLine } from '@/common';
import { CopyMIMEType } from '@/common/interface/export';

describe('TableSheet Export Test', () => {
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
      const rows = data.split(NewLine);
      const headers = rows[0].split(NewTab);

      expect(slice(rows, 0, 5)).toMatchSnapshot();

      // 33行数据 包括一行列头
      expect(rows).toHaveLength(11);

      // 6列数据 包括序列号
      rows.forEach((e) => {
        expect(e.split(NewTab)).toHaveLength(6);
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
      split: NewTab,
      formatOptions: {
        formatHeader: true,
      },
    });

    testCase(data);

    const asyncData = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: NewTab,
      formatOptions: {
        formatHeader: true,
      },
      isAsyncExport: true,
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
      split: NewTab,
    });
    const rows = data.split(NewLine);
    const headers = rows[0].split(NewTab);

    // 33行数据 包括一行列头
    expect(rows).toHaveLength(11);
    // 5列数据 包括序列号
    rows.forEach((e) => {
      expect(e.split(NewTab)).toHaveLength(5);
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
      split: NewTab,
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
      split: NewTab,
      formatOptions: true,
      customTransformer: () => {
        return {
          [CopyMIMEType.PLAIN]: () => {
            return { type: CopyMIMEType.PLAIN, content: 'custom data' };
          },
        };
      },
    });

    expect(data).toMatchInlineSnapshot(`"custom data"`);
    expect(data).toEqual('custom data');
  });

  // https://github.com/antvis/S2/issues/2236
  it('should export correct data When the split separator is configured', async () => {
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
      split: ',',
    });
    // 只取前10行数据
    const result = slice(data.split(NewLine), 0, 5);

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
      split: ',',
      formatOptions: {
        formatHeader: true,
      },
    });

    expect(data.split(NewLine)).toMatchSnapshot();
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
      split: ',',
      formatOptions: {
        formatHeader: true,
      },
    });

    expect(data.split(NewLine)).toMatchSnapshot();
  });
});
