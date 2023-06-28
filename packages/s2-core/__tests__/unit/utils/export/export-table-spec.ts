import { slice } from 'lodash';
import { data as originData } from 'tests/data/mock-dataset.json';
import { assembleDataCfg, assembleOptions } from '../../../util';
import { getContainer } from '../../../util/helpers';
import { TableSheet } from '@/sheet-type';
import { asyncGetAllPlainData, copyData } from '@/utils';
import { NewTab, NewLine } from '@/common';
import { CopyMIMEType } from '@/utils/export/interface';

describe('TableSheet Export Test', () => {
  let tableSheet: TableSheet;

  beforeEach(() => {
    tableSheet = new TableSheet(
      getContainer(),
      assembleDataCfg({
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions(),
    );
    tableSheet.render();
  });

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
        data: originData,
      }),
      assembleOptions({
        showSeriesNumber: true,
      }),
    );

    s2.render();

    function testCase(data: string): void {
      const rows = data.split(NewLine);
      const headers = rows[0].split(NewTab);

      expect(slice(rows, 0, 5)).toMatchInlineSnapshot(`
      Array [
        "序号	province	city	产品类型	sub_type	number",
        "1	浙江省	杭州市	家具	桌子	7789",
        "2	浙江省	绍兴市	家具	桌子	2367",
        "3	浙江省	宁波市	家具	桌子	3877",
        "4	浙江省	舟山市	家具	桌子	4342",
      ]
    `);

      // 33行数据 包括一行列头
      expect(rows).toHaveLength(33);
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

    const data = copyData({
      sheetInstance: s2,
      split: NewTab,
      formatOptions: {
        isFormatHeader: true,
      },
    });

    testCase(data);

    const asyncData = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: NewTab,
      formatOptions: {
        isFormatHeader: true,
      },
      isAsyncExport: true,
    });

    testCase(asyncData);
  });

  it('should export correct data with no series number', () => {
    const s2 = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
        data: originData,
      }),
      assembleOptions({
        showSeriesNumber: false,
      }),
    );

    s2.render();
    const data = copyData({
      sheetInstance: s2,
      split: NewTab,
    });
    const rows = data.split(NewLine);
    const headers = rows[0].split(NewTab);

    // 33行数据 包括一行列头
    expect(rows).toHaveLength(33);
    // 5列数据 包括序列号
    rows.forEach((e) => {
      expect(e.split(NewTab)).toHaveLength(5);
    });
    expect(headers).toEqual(['province', 'city', 'type', 'sub_type', 'number']);
  });

  it('should export correct data with totals', () => {
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
        showSeriesNumber: false,
      }),
    );

    s2.render();
    const data = copyData({
      sheetInstance: s2,
      split: NewTab,
      formatOptions: true,
    });

    expect(data).toMatchInlineSnapshot(`
      "province	type	sub_type	number
      浙江省-province	家具-type	桌子	7789
      浙江省-province	家具-type	桌子	2367
      浙江省-province	家具-type	桌子	3877
      浙江省-province	家具-type	桌子	4342
      浙江省-province	家具-type	沙发	5343"
    `);
  });
  it('should support custom export matrix transformer', () => {
    const s2 = new TableSheet(
      getContainer(),
      assembleDataCfg({
        data: slice(originData, 0, 5),
        fields: {
          columns: ['province', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        showSeriesNumber: false,
      }),
    );

    s2.render();
    const data = copyData({
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
  it('should export correct data When the split separator is configured', () => {
    const data = copyData({
      sheetInstance: tableSheet,
      split: ',',
    });
    // 只取前10行数据
    const result = slice(data.split(NewLine), 0, 5);

    expect(result).toMatchInlineSnapshot(`
      Array [
        "province,city,type,sub_type,number",
        "浙江省,杭州市,家具,桌子,7789",
        "浙江省,绍兴市,家具,桌子,2367",
        "浙江省,宁波市,家具,桌子,3877",
        "浙江省,舟山市,家具,桌子,4342",
      ]
    `);
  });
});
