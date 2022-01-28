import type { S2DataConfig } from '@antv/s2';

export const singleMeasure: S2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['date'],
    values: ['number'],
  },
  meta: [
    {
      field: 'number',
      name: '数量',
      description: '我是数量(number)的字段描述',
    },
    {
      field: 'province',
      name: '省份',
      description: '我是省份(province)的字段描述',
    },
    {
      field: 'city',
      name: '城市',
      description: '我是城市(city)的字段描述',
    },
    {
      field: 'date',
      name: '日期',
      description: '我是日期(date)的字段描述',
    },
  ],
  data: [
    {
      number: {
        originalValue: [[3877, 234324, '+32%']],
        values: [[3877, 234324, '+32%']],
      },
      province: '浙江省',
      city: '宁波市',
      date: '2021-12',
    },
    {
      number: {
        originalValue: [[3877, -234324, '-32%']],
        values: [[3877, -234324, '-32%']],
      },
      province: '浙江省',
      city: '舟山市',
      date: '2021-12',
    },
    {
      number: {
        originalValue: [[5877, -4324, '+2%']],
        values: [[5877, -4324, '+2%']],
      },
      province: '浙江省',
      city: '杭州市',
      date: '2021-12',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '绍兴市',
      date: '2021-12',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '杭州市',
      date: '2021-8',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '绍兴市',
      date: '2021-8',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '宁波市',
      date: '2021-8',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '舟山市',
      date: '2021-8',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '杭州市',
      date: '2021-7',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '绍兴市',
      date: '2021-7',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '宁波市',
      date: '2021-7',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '舟山市',
      date: '2021-7',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '杭州市',
      date: '2021-5',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '绍兴市',
      date: '2021-5',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '宁波市',
      date: '2021-5',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '舟山市',
      date: '2021-5',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '成都市',
      date: '2021-12',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '绵阳市',
      date: '2021-12',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '南充市',
      date: '2021-12',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '乐山市',
      date: '2021-12',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '成都市',
      date: '2021-8',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '绵阳市',
      date: '2021-8',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '南充市',
      date: '2021-8',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '乐山市',
      date: '2021-8',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '成都市',
      date: '2021-7',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '绵阳市',
      date: '2021-7',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '南充市',
      date: '2021-7',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '乐山市',
      date: '2021-7',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '成都市',
      date: '2021-5',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '绵阳市',
      date: '2021-5',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '南充市',
      date: '2021-5',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '乐山市',
      date: '2021-5',
    },
  ],
};

export const multiMeasure: S2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['date'],
    values: ['number', 'price'],
  },
  meta: [
    {
      field: 'date',
      name: '时间',
    },
    {
      field: 'number',
      name: '数量',
      description: '我是数量(number)的字段描述',
    },
    {
      field: 'price',
      name: '单价',
      description: '我是单价(price)的字段描述',
    },
  ],
  data: [
    {
      price: 2323,
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '宁波市',
      date: '2021-12',
    },
    {
      price: 2323,
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '舟山市',
      date: '2021-12',
    },
    {
      price: 2323,
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '杭州市',
      date: '2021-12',
    },
    {
      price: 2323,
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '绍兴市',
      date: '2021-12',
    },
    {
      price: 2323,
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '杭州市',
      date: '2021-8',
    },
    {
      price: 2323,
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '绍兴市',
      date: '2021-8',
    },
    {
      price: 2323,
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '宁波市',
      date: '2021-8',
    },
    {
      price: 2323,
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '舟山市',
      date: '2021-8',
    },
    {
      price: 2323,
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '杭州市',
      date: '2021-7',
    },
    {
      price: 2323,
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '绍兴市',
      date: '2021-7',
    },
    {
      price: 2323,
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '宁波市',
      date: '2021-7',
    },
    {
      price: 2323,
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '舟山市',
      date: '2021-7',
    },
    {
      price: 2323,
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '杭州市',
      date: '2021-5',
    },
    {
      price: 2323,
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '绍兴市',
      date: '2021-5',
    },
    {
      price: 2323,
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '宁波市',
      date: '2021-5',
    },
    {
      price: 2323,
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '浙江省',
      city: '舟山市',
      date: '2021-5',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '成都市',
      date: '2021-12',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '绵阳市',
      date: '2021-12',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '南充市',
      date: '2021-12',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '乐山市',
      date: '2021-12',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '成都市',
      date: '2021-8',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '绵阳市',
      date: '2021-8',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '南充市',
      date: '2021-8',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '乐山市',
      date: '2021-8',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '成都市',
      date: '2021-7',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '绵阳市',
      date: '2021-7',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '南充市',
      date: '2021-7',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '乐山市',
      date: '2021-7',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '成都市',
      date: '2021-5',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '绵阳市',
      date: '2021-5',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '南充市',
      date: '2021-5',
    },
    {
      number: {
        originalValue: [[3877, 4324, '42%']],
        values: [[3877, 4324, '42%']],
      },
      province: '四川省',
      city: '乐山市',
      date: '2021-5',
    },
  ],
};

export const customTree: S2DataConfig = {
  data: [
    {
      'measure-a': {
        originalValue: [[3877, 4324, 0.42]],
        values: [[3877, 4324, '42%']],
      },
      'measure-b': {
        originalValue: [[377, 324, -0.02]],
        values: [[377, 324, '-0.02']],
      },
      'measure-c': {
        originalValue: [[377, 0, null]],
        values: [[377, 0, null]],
      },
      'measure-d': 4,
      'measure-e': 5,
      'measure-f': 6,
      date: '2021',
      sub_type: JSON.stringify(['数值', '环比', '同比']),
    },
    {
      'measure-a': 11,
      'measure-b': 22,
      'measure-c': 32,
      'measure-d': 43,
      'measure-e': 45,
      'measure-f': 65,
      date: '2022',
      sub_type: JSON.stringify(['数值', '环比', '同比']),
    },
  ],
  meta: [
    {
      field: 'date',
      name: '时间',
    },
  ],
  fields: {
    rows: [],
    columns: ['date', 'sub_type'],
    values: [
      'measure-a',
      'measure-b',
      'measure-c',
      'measure-d',
      'measure-e',
      'measure-f',
    ],
    customTreeItems: [
      {
        key: 'custom-node-1',
        title: '自定义节点A',
        description: '自定义节点A描述',
        children: [
          {
            key: 'measure-a',
            title: '指标A',
            description: '指标A描述',
            children: [
              {
                key: 'measure-b',
                title: '指标B',
                children: [],
                description: '指标B描述',
              },
              {
                key: 'custom-node-2',
                title: '自定义节点B',
                description: '自定义节点B描述',
                children: [],
              },
              {
                key: 'measure-c',
                title: '指标C',
                description: '指标C描述',
                children: [],
              },
            ],
          },
          {
            key: 'custom-node-5',
            title: '自定义节点E',
            description: '自定义节点E描述',
            children: [],
          },
        ],
      },
      {
        key: 'measure-e',
        title: '指标E',
        description: '指标E描述',
        children: [
          {
            key: 'custom-node-3',
            title: '自定义节点C',
            description: '自定义节点C描述',
            children: [],
          },
          {
            key: 'custom-node-4',
            title: '自定义节点D',
            description: '自定义节点D描述',
            children: [
              {
                key: 'measure-f',
                title: '指标F',
                description: '指标F描述',
                children: [],
              },
            ],
            collapsed: true,
          },
        ],
      },
    ],
  },
};
