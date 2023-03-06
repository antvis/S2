import { map, omit, slice } from 'lodash';
import { data as originData } from 'tests/data/mock-dataset.json';
import { assembleDataCfg, assembleOptions } from '../../../util';
import { getContainer } from '../../../util/helpers';
import { PivotSheet, TableSheet } from '@/sheet-type';
import { copyData } from '@/utils';
import { NewTab, NewLine } from '@/common';

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
        data: originData,
      }),
      assembleOptions({
        showSeriesNumber: true,
      }),
    );

    s2.render();
    const data = copyData(s2, NewTab, {
      isFormatHeader: true,
    });
    const rows = data.split(NewLine);
    const headers = rows[0].split(NewTab);

    // 33行数据 包括一行列头
    expect(rows).toHaveLength(33);
    expect(slice(rows, 0, 5)).toMatchInlineSnapshot(`
      Array [
        "\\"序号\\"	\\"province\\"	\\"city\\"	\\"产品类型\\"	\\"sub_type\\"	\\"number\\"
      ",
        "\\"1\\"	\\"浙江省\\"	\\"杭州市\\"	\\"家具\\"	\\"桌子\\"	\\"7789\\"
      ",
        "\\"2\\"	\\"浙江省\\"	\\"绍兴市\\"	\\"家具\\"	\\"桌子\\"	\\"2367\\"
      ",
        "\\"3\\"	\\"浙江省\\"	\\"宁波市\\"	\\"家具\\"	\\"桌子\\"	\\"3877\\"
      ",
        "\\"4\\"	\\"浙江省\\"	\\"舟山市\\"	\\"家具\\"	\\"桌子\\"	\\"4342\\"
      ",
      ]
    `);
    // 6列数据 包括序列号
    rows.forEach((e) => {
      expect(e.split(NewTab)).toHaveLength(6);
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
        data: originData,
      }),
      assembleOptions({
        showSeriesNumber: false,
      }),
    );

    s2.render();
    const data = copyData(s2, NewTab);
    const rows = data.split(NewLine);
    const headers = rows[0].split(NewTab);

    // 33行数据 包括一行列头
    expect(rows).toHaveLength(33);
    // 5列数据 包括序列号
    rows.forEach((e) => {
      expect(e.split(NewTab)).toHaveLength(5);
    });
    expect(headers.map((e) => JSON.parse(e))).toEqual([
      'province',
      'city',
      'type',
      'sub_type',
      'number',
    ]);
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
    const data = copyData(s2, NewTab, true);

    expect(data).toMatchInlineSnapshot(`
      "\\"province\\"	\\"type\\"	\\"sub_type\\"	\\"number\\"
      \\"浙江省-province\\"	\\"家具-type\\"	\\"桌子\\"	\\"7789\\"
      \\"浙江省-province\\"	\\"家具-type\\"	\\"桌子\\"	\\"2367\\"
      \\"浙江省-province\\"	\\"家具-type\\"	\\"桌子\\"	\\"3877\\"
      \\"浙江省-province\\"	\\"家具-type\\"	\\"桌子\\"	\\"4342\\"
      \\"浙江省-province\\"	\\"家具-type\\"	\\"沙发\\"	\\"5343\\""
    `);
  });
});

describe('PivotSheet Export Test', () => {
  it('should export correct data in grid mode - get', () => {
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
    const data = copyData(s2, NewTab);
    const rows = data.split(NewLine);

    expect(rows).toHaveLength(14);
    expect(rows[0].split(NewTab)[1]).toEqual('province');
    expect(rows[1].split(NewTab)[1]).toEqual('city');

    rows.forEach((e) => {
      expect(e.split(NewTab)).toHaveLength(34);
    });
  });
  it('should export correct data in tree mode - get', () => {
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
    const data = copyData(s2, NewTab);
    const rows = data.split(NewLine);

    expect(rows).toHaveLength(16);
    expect(rows[0].split(NewTab)[1]).toEqual('province');
    expect(rows[1].split(NewTab)[1]).toEqual('city');
    rows.forEach((e) => {
      expect(e.split(NewTab)).toHaveLength(34);
    });
  });

  /*
   * 因为导出的数据单测，很难看出问题，所以提供图片 + 代码的模式查看：
   * https://gw.alipayobjects.com/zos/antfincdn/AU83KF1Sq/6fb3f3e6-0064-4ef8-a5c3-b1333fb59adf.png
   */
  it('should export correct data in tree mode and collapseAll is true -get', () => {
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

    s2.render();
    const data = copyData(s2, NewTab);
    const rows = data.split(NewLine);

    expect(rows).toMatchInlineSnapshot(`
      Array [
        "类别	家具	家具	办公用品	办公用品",
        "子类别	桌子	沙发	笔	纸张",
        "省份	number	number	number	number",
        "浙江省	18375	14043	4826	5854",
        "四川省	7818	9473	7495	10984",
      ]
    `);
    expect(rows).toHaveLength(5);
    expect(rows[0].split(NewTab).length).toEqual(5);
    expect(rows[0].split(NewTab)[0]).toEqual('类别');
    expect(rows[0].split(NewTab)[1]).toEqual('家具');
    expect(rows[1].split(NewTab)[0]).toEqual('子类别');
    expect(rows[1].split(NewTab)[1]).toEqual('桌子');
    expect(rows[2].split(NewTab)[0]).toEqual('省份');
    /*
     * todo-zc: 还未进行格式化处理
     * expect(rows[2].split(NewTab)[1]).toEqual('数量');
     */
  });

  // https://gw.alipayobjects.com/zos/antfincdn/PyrWwocNf/56d0914b-159a-4293-8615-6c1308bf4b3a.png
  it.skip('should export correct data in tree mode and collapseAll is false', () => {
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

    s2.render();
    const data = copyData(s2, NewTab);
    const rows = data.split(NewLine);

    expect(rows).toHaveLength(13);
    expect(rows[0].split(NewTab).length).toEqual(6);
    expect(rows[0].split(NewTab)[1]).toEqual('类别');
    expect(rows[0].split(NewTab)[2]).toEqual('家具');
    expect(rows[1].split(NewTab)[1]).toEqual('子类别');
    expect(rows[1].split(NewTab)[2]).toEqual('桌子');
    expect(rows[2].split(NewTab)[0]).toEqual('省份');
    expect(rows[2].split(NewTab)[1]).toEqual('城市');
    expect(rows[2].split(NewTab)[2]).toEqual('数量');
  });

  it('should export correct data in grid mode with valueInCols is false - get', () => {
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
    const data = copyData(s2, NewTab);
    const rows = data.split(NewLine);

    expect(rows).toHaveLength(13);
    rows.forEach((e) => {
      expect(e.split(NewTab)).toHaveLength(35);
    });
  });

  it('should export correct data in grid mode with totals in col - get', () => {
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
    const data = copyData(s2, NewTab);
    const rows = data.split(NewLine);

    expect(rows).toHaveLength(17);
    rows.forEach((e) => {
      expect(e.split(NewTab)).toHaveLength(53);
    });
  });

  it('should export correct data in grid mode with totals in row - get', () => {
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
    const data = copyData(s2, NewTab);
    const rows = data.split(NewLine);

    expect(rows).toHaveLength(16);
    rows.forEach((e) => {
      expect(e.split(NewTab)).toHaveLength(54);
    });
  });

  it('should export correct data when isFormat: {isFormatHeader: true}', () => {
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
      assembleOptions({}),
    );

    s2.render();
    const data = copyData(s2, NewTab, { isFormatHeader: true });

    const rows = data.split(NewLine);

    expect(rows).toHaveLength(7);
    expect(rows[0].split(NewTab)[1]).toEqual('province');
    expect(rows[0].split(NewTab)[2]).toEqual('浙江省-province');
    expect(rows[1].split(NewTab)[1]).toEqual('city');
    expect(rows[3].split(NewTab)[0]).toEqual('家具-type');
  });

  it('should export correct data when data is incomplete', () => {
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

    s2.render();
    const data = copyData(s2, NewTab);

    expect(data).toMatchInlineSnapshot(`
      "	\\"province\\"	\\"浙江省\\"	\\"浙江省\\"	\\"浙江省\\"	\\"浙江省\\"	\\"四川省\\"	\\"四川省\\"	\\"四川省\\"	\\"四川省\\"
      	\\"city\\"	\\"杭州市\\"	\\"绍兴市\\"	\\"宁波市\\"	\\"舟山市\\"	\\"成都市\\"	\\"绵阳市\\"	\\"南充市\\"	\\"乐山市\\"
      \\"type\\"	\\"sub_type\\"	\\"number\\"	\\"number\\"	\\"number\\"	\\"number\\"	\\"number\\"	\\"number\\"	\\"number\\"	\\"number\\"
      \\"家具\\"		\\"null\\"	\\"null\\"	\\"null\\"	\\"null\\"	\\"null\\"	\\"null\\"	\\"null\\"	\\"null\\"
      \\"家具\\"	\\"桌子\\"	\\"null\\"	\\"2367\\"	\\"3877\\"	\\"4342\\"	\\"1723\\"	\\"1822\\"	\\"1943\\"	\\"2330\\"
      \\"家具\\"	\\"沙发\\"	\\"null\\"	\\"632\\"	\\"7234\\"	\\"834\\"	\\"2451\\"	\\"2244\\"	\\"2333\\"	\\"2445\\"
      \\"办公用品\\"		\\"null\\"	\\"null\\"	\\"null\\"	\\"null\\"	\\"null\\"	\\"null\\"	\\"null\\"	\\"null\\"
      \\"办公用品\\"	\\"笔\\"	\\"null\\"	\\"null\\"	\\"null\\"	\\"null\\"	\\"null\\"	\\"null\\"	\\"null\\"	\\"null\\"
      \\"办公用品\\"	\\"纸张\\"	\\"null\\"	\\"1354\\"	\\"1523\\"	\\"1634\\"	\\"4004\\"	\\"3077\\"	\\"3551\\"	\\"352\\""
    `);
  });

  it('should export correct data when series number', () => {
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
      assembleOptions({ hierarchyType: 'grid', showSeriesNumber: true }),
    );

    s2.render();

    const data = copyData(s2, NewTab);

    expect(data).toMatchInlineSnapshot(`
      "	\\"province\\"	\\"浙江省\\"	\\"浙江省\\"	\\"浙江省\\"	\\"浙江省\\"	\\"四川省\\"	\\"四川省\\"	\\"四川省\\"	\\"四川省\\"
      	\\"city\\"	\\"杭州市\\"	\\"绍兴市\\"	\\"宁波市\\"	\\"舟山市\\"	\\"成都市\\"	\\"绵阳市\\"	\\"南充市\\"	\\"乐山市\\"
      \\"type\\"	\\"sub_type\\"	\\"number\\"	\\"number\\"	\\"number\\"	\\"number\\"	\\"number\\"	\\"number\\"	\\"number\\"	\\"number\\"
      \\"家具\\"	\\"桌子\\"	\\"7789\\"	\\"2367\\"	\\"3877\\"	\\"4342\\"	\\"1723\\"	\\"1822\\"	\\"1943\\"	\\"2330\\"
      \\"家具\\"	\\"沙发\\"	\\"5343\\"	\\"632\\"	\\"7234\\"	\\"834\\"	\\"2451\\"	\\"2244\\"	\\"2333\\"	\\"2445\\"
      \\"办公用品\\"	\\"笔\\"	\\"945\\"	\\"1304\\"	\\"1145\\"	\\"1432\\"	\\"2335\\"	\\"245\\"	\\"2457\\"	\\"2458\\"
      \\"办公用品\\"	\\"纸张\\"	\\"1343\\"	\\"1354\\"	\\"1523\\"	\\"1634\\"	\\"4004\\"	\\"3077\\"	\\"3551\\"	\\"352\\""
    `);
    const rows = data.split(NewLine);

    expect(rows[0].split(NewTab)[1]).toEqual('province');
    expect(rows[1].split(NewTab)[1]).toEqual('city');
  });
});
