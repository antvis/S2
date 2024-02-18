import { NewLine, NewTab, PivotSheet, asyncGetAllPlainData } from '@antv/s2';
import { map, omit } from 'lodash';
import { data as originData } from 'tests/data/mock-dataset.json';
import { assembleDataCfg, assembleOptions } from 'tests/util';
import { getContainer } from 'tests/util/helpers';
import { CopyMIMEType } from '@/common/interface/export';

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
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({ hierarchyType: 'grid' }),
    );

    function testData(data: string) {
      const rows = data.split(NewLine);

      expect(rows).toHaveLength(14);
      expect(rows[0].split(NewTab)[1]).toEqual('province');
      expect(rows[1].split(NewTab)[1]).toEqual('city');
      rows.forEach((row) => {
        expect(row.split(NewTab)).toHaveLength(34);
      });
    }

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: NewTab,
    });

    testData(data);

    const asyncData = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: NewTab,
      isAsyncExport: true,
    });

    testData(asyncData);
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

    function testCase(data: string): void {
      const rows = data.split(NewLine);

      expect(rows).toHaveLength(16);
      expect(rows[0].split(NewTab)[1]).toEqual('province');
      expect(rows[1].split(NewTab)[1]).toEqual('city');
      rows.forEach((e) => {
        expect(e.split(NewTab)).toHaveLength(34);
      });
    }

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
    });

    testCase(data);

    const asyncData = await asyncGetAllPlainData({
      sheetInstance: s2,
      isAsyncExport: true,
    });

    testCase(asyncData);
  });

  /*
   * 因为导出的数据单测，很难看出问题，所以提供图片 + 代码的模式查看：
   * https://gw.alipayobjects.com/zos/antfincdn/AU83KF1Sq/6fb3f3e6-0064-4ef8-a5c3-b1333fb59adf.png
   */
  it('should export correct data in tree mode and collapseAll is true -get', async () => {
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

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: NewTab,
      formatOptions: true,
    });
    const rows = data.split(NewLine);

    expect(rows).toMatchInlineSnapshot(`
      Array [
        "类别	家具	家具	办公用品	办公用品",
        "子类别	桌子	沙发	笔	纸张",
        "省份	数量	数量	数量	数量",
        "浙江省	18375	14043	4826	5854",
        "四川省	7818	9473	7495	10984",
      ]
    `);
    expect(rows).toHaveLength(5);
    expect(rows[0].split(NewTab).length).toEqual(5);
    expect(rows[1].split(NewTab)[0]).toEqual('子类别');
    expect(rows[1].split(NewTab)[1]).toEqual('桌子');
    expect(rows[2].split(NewTab)[0]).toEqual('省份');
    expect(rows[2].split(NewTab)[1]).toEqual('数量');
  });

  // https://gw.alipayobjects.com/zos/antfincdn/PyrWwocNf/56d0914b-159a-4293-8615-6c1308bf4b3a.png
  it('should export correct data in tree mode and collapseAll is false -get', async () => {
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
      split: NewTab,
      formatOptions: true,
    });
    const rows = data.split(NewLine);

    expect(rows).toMatchInlineSnapshot(`
      Array [
        "	类别	家具	家具	办公用品	办公用品",
        "	子类别	桌子	沙发	笔	纸张",
        "省份	城市	数量	数量	数量	数量",
        "浙江省		18375	14043	4826	5854",
        "浙江省	杭州市	7789	5343	945	1343",
        "浙江省	绍兴市	2367	632	1304	1354",
        "浙江省	宁波市	3877	7234	1145	1523",
        "浙江省	舟山市	4342	834	1432	1634",
        "四川省		7818	9473	7495	10984",
        "四川省	成都市	1723	2451	2335	4004",
        "四川省	绵阳市	1822	2244	245	3077",
        "四川省	南充市	1943	2333	2457	3551",
        "四川省	乐山市	2330	2445	2458	352",
      ]
    `);
    expect(rows).toHaveLength(13);
    expect(rows[0].split(NewTab).length).toEqual(6);
    expect(rows[1].split(NewTab)[1]).toEqual('子类别');
    expect(rows[2].split(NewTab)[1]).toEqual('城市');
    expect(rows[2].split(NewTab)[2]).toEqual('数量');
  });

  it('should export correct data in grid mode with valueInCols is false - get', async () => {
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
      split: NewTab,
    });

    const rows = data.split(NewLine);

    expect(rows).toHaveLength(13);
    rows.forEach((e) => {
      expect(e.split(NewTab)).toHaveLength(35);
    });
  });

  it('should export correct data in grid mode with totals in col - get', async () => {
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
      split: NewTab,
    });

    const rows = data.split(NewLine);

    expect(rows).toHaveLength(17);
    rows.forEach((e) => {
      expect(e.split(NewTab)).toHaveLength(53);
    });
  });

  it('should export correct data in grid mode with totals in row - get', async () => {
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
      split: NewTab,
    });
    const rows = data.split(NewLine);

    expect(rows).toHaveLength(16);
    rows.forEach((e) => {
      expect(e.split(NewTab)).toHaveLength(54);
    });
  });

  it('should export correct data when isFormat: {formatHeader: true}', async () => {
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
        fields: {
          valueInCols: true,
          columns: ['province', 'city'],
          rows: ['type', 'sub_type'],
          values: ['number'],
        },
      }),
      assembleOptions({
        interaction: {
          copy: { enable: true, withHeader: true, withFormat: true },
        },
      }),
    );

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: NewTab,
      formatOptions: { formatHeader: true },
    });

    const rows = data.split('\n');

    expect(rows).toHaveLength(7);
    expect(rows[0].split(NewTab)[1]).toEqual('province');
    expect(rows[0].split(NewTab)[2]).toEqual('浙江省-province');
    expect(rows[1].split(NewTab)[1]).toEqual('city');
    expect(rows[3].split(NewTab)[0]).toEqual('家具-type');
  });

  it('should export correct data when isFormat: {formatData: true}', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: 'number',
            formatter: (value) => `${value}%`,
          },
        ],
      }),
      assembleOptions({
        interaction: {
          copy: { enable: true, withFormat: true },
        },
      }),
    );

    await s2.render();

    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: NewTab,
      formatOptions: { formatData: true },
    });

    expect(data).toMatchInlineSnapshot(`
      "	type	家具	家具	办公用品	办公用品
      	sub_type	桌子	沙发	笔	纸张
      province	city	number	number	number	number
      浙江省	杭州市	7789%	5343%	945%	1343%
      浙江省	绍兴市	2367%	632%	1304%	1354%
      浙江省	宁波市	3877%	7234%	1145%	1523%
      浙江省	舟山市	4342%	834%	1432%	1634%
      四川省	成都市	1723%	2451%	2335%	4004%
      四川省	绵阳市	1822%	2244%	245%	3077%
      四川省	南充市	1943%	2333%	2457%	3551%
      四川省	乐山市	2330%	2445%	2458%	352%"
    `);
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

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: NewTab,
    });

    expect(data).toMatchSnapshot();
  });

  it('should export correct data when series number', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        fields: {
          valueInCols: true,
          columns: ['province', 'city'],
          rows: ['type', 'sub_type'],
          values: ['number'],
        },
      }),
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

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: NewTab,
    });

    expect(data).toMatchInlineSnapshot(`
      "	province	浙江省	浙江省	浙江省	浙江省	四川省	四川省	四川省	四川省
      	city	杭州市	绍兴市	宁波市	舟山市	成都市	绵阳市	南充市	乐山市
      type	sub_type	number	number	number	number	number	number	number	number
      家具	桌子	7789	2367	3877	4342	1723	1822	1943	2330
      家具	沙发	5343	632	7234	834	2451	2244	2333	2445
      办公用品	笔	945	1304	1145	1432	2335	245	2457	2458
      办公用品	纸张	1343	1354	1523	1634	4004	3077	3551	352"
    `);

    const rows = data.split(NewLine);

    expect(rows[0].split(NewTab)[1]).toEqual('province');
    expect(rows[1].split(NewTab)[1]).toEqual('city');
  });

  it('should export correct data with formatter', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [{ field: 'number', name: '数值' }],
        fields: {
          valueInCols: true,
          columns: ['province', 'city'],
          rows: ['type', 'sub_type'],
          values: ['number'],
        },
      }),
      assembleOptions({
        hierarchyType: 'grid',
        interaction: { copy: { enable: true, withHeader: true } },
      }),
    );

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: NewTab,
    });

    expect(data).toMatchSnapshot();

    const rows = data.split(NewLine);

    expect(rows[0].split(NewTab)[1]).toEqual('province');
    expect(rows[1].split(NewTab)[1]).toEqual('city');
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
      split: NewTab,
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
      split: ',',
      formatOptions: {
        formatHeader: true,
      },
    });

    expect(data).toMatchInlineSnapshot(`
      ",类别,家具,家具,办公用品,办公用品
      ,子类别,桌子,沙发,笔,纸张
      省份,城市,数量,数量,数量,数量
      浙江省,杭州市,7789,5343,945,1343
      浙江省,绍兴市,2367,632,1304,1354
      浙江省,宁波市,3877,7234,1145,1523
      浙江省,舟山市,4342,834,1432,1634
      四川省,成都市,1723,2451,2335,4004
      四川省,绵阳市,1822,2244,245,3077
      四川省,南充市,1943,2333,2457,3551
      四川省,乐山市,2330,2445,2458,352"
    `);
  });
});
