import { render } from '@testing-library/vue';
import PivotSheet from '../src/PivotSheet.vue';

describe('pivot sheet test for scratch', () => {
  test('demo', () => {
    const dataCfg = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
        valueInCols: true,
      },
      meta: [
        {
          field: 'number',
          name: '数量',
        },
        {
          field: 'province',
          name: '省份',
        },
        {
          field: 'city',
          name: '城市',
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
      data: [
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
      ],
    };
    const options = {
      debug: true,
      width: 600,
      height: 400,
      hierarchyCollapse: false,
    };
    const { container } = render(PivotSheet, {
      props: { dataCfg, options },
    });
    expect(container.querySelector('.container')).toBeDefined();
  });
});
