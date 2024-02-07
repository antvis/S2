import { getContainer } from 'tests/util/helpers';
import { pickMap } from '../util/fp';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import type { S2DataConfig, S2Options } from '@/common/interface';

const s2Options: S2Options = {
  width: 600,
  height: 400,
  hierarchyType: 'grid',
};

const s2DataCfg: S2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
    valueInCols: true,
    customValueOrder: 1,
  },
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
    {
      field: 'area',
      name: '地区',
      description: '地区说明。。',
    },
    {
      field: 'money',
      name: '金额',
      description: '金额说明。。',
    },
  ],
  data: [
    {
      number: 7789,
      province: '浙江省',
      city: '杭州市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 2367,
      province: '浙江省',
      city: '绍兴市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 3877,
      province: '浙江省',
      city: '宁波市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 4342,
      province: '浙江省',
      city: '舟山市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 5343,
      province: '浙江省',
      city: '杭州市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 632,
      province: '浙江省',
      city: '绍兴市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 7234,
      province: '浙江省',
      city: '宁波市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 834,
      province: '浙江省',
      city: '舟山市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 945,
      province: '浙江省',
      city: '杭州市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 1304,
      province: '浙江省',
      city: '绍兴市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 1145,
      province: '浙江省',
      city: '宁波市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 1432,
      province: '浙江省',
      city: '舟山市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 1343,
      province: '浙江省',
      city: '杭州市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 1354,
      province: '浙江省',
      city: '绍兴市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 1523,
      province: '浙江省',
      city: '宁波市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 1634,
      province: '浙江省',
      city: '舟山市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 1723,
      province: '四川省',
      city: '成都市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 1822,
      province: '四川省',
      city: '绵阳市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 1943,
      province: '四川省',
      city: '南充市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 2330,
      province: '四川省',
      city: '乐山市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 2451,
      province: '四川省',
      city: '成都市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 2244,
      province: '四川省',
      city: '绵阳市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 2333,
      province: '四川省',
      city: '南充市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 2445,
      province: '四川省',
      city: '乐山市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 2335,
      province: '四川省',
      city: '成都市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 245,
      province: '四川省',
      city: '绵阳市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 2457,
      province: '四川省',
      city: '南充市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 2458,
      province: '四川省',
      city: '乐山市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 4004,
      province: '四川省',
      city: '成都市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 3077,
      province: '四川省',
      city: '绵阳市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 3551,
      province: '四川省',
      city: '南充市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 352,
      province: '四川省',
      city: '乐山市',
      type: '办公用品',
      sub_type: '纸张',
    },
  ],
};

describe('SpreadSheet Custom Value Order Tests', () => {
  let s2: SpreadSheet;

  beforeEach(async () => {
    s2 = new PivotSheet(getContainer(), s2DataCfg, s2Options);
    await s2.render();
  });

  afterEach(() => {
    s2.destroy();
  });

  test('should use custom grid pivot dataSet', () => {
    const { colLeafNodes } = s2.facet.getLayoutResult();

    const actual = pickMap(['id', 'value', 'query'])(colLeafNodes);

    expect(actual).toHaveLength(4);
    expect(actual).toMatchSnapshot();
  });
});
