import { EXTRA_COLUMN_FIELD, type Data, type S2DataConfig } from '@antv/s2';
import {
  KpiType,
  KPI_TYPES_CONFIG,
} from '../../src/components/sheets/strategy-sheet/constants/config';

const getKPIMockData = (kpiType: KpiType): Data => {
  const config = KPI_TYPES_CONFIG[kpiType];
  const date = `2021${config.name}`;

  if (kpiType === KpiType.NetAddedProgress) {
    return {
      'measure-a': {
        originalValues: {
          measure: 0.75,
          target: 0.8,
        },
        values: {
          measure: '0.75',
          target: '0.8',
        },
      },
      'measure-b': {
        originalValues: {
          measure: 0.25,
          target: 0.8,
        },
        values: {
          measure: '0.25',
          target: '0.8',
        },
      },
      'measure-c': {
        originalValues: {
          measure: 1,
          target: 0.3,
        },
        values: {
          measure: '1',
          target: '0.3',
        },
      },
      'measure-d': {
        originalValues: {
          measure: 0.5,
          target: 0.3,
        },
        values: {
          measure: '0.5',
          target: '0.3',
        },
      },
      'measure-e': {
        originalValues: {
          measure: 0.68,
          target: 0.8,
        },
        values: {
          measure: '0.68',
          target: '0.8',
        },
      },
      'measure-f': {
        originalValues: {
          measure: 0.25,
          target: 0.9,
        },
        values: {
          measure: '0.25',
          target: '0.9',
        },
      },
      date: '2021年净增完成度',
      [EXTRA_COLUMN_FIELD]: KPI_TYPES_CONFIG[KpiType.NetAddedProgress].name,
    };
  }

  return {
    'measure-a': {
      originalValues: [[110000]],
      values: [['11万']],
      kpiType,
    },
    'measure-b': {
      originalValues: [[220000]],
      values: [['22万']],
      kpiType,
    },
    'measure-c': {
      originalValues: [[330000]],
      values: [['33万']],
      kpiType,
    },
    'measure-d': {
      originalValues: [[440000]],
      values: [['44万']],
      kpiType,
    },
    'measure-e': {
      originalValues: [[550000]],
      values: [['55万']],
      kpiType,
    },
    'measure-f': {
      originalValues: [[660000]],
      values: [['66万']],
      kpiType,
    },
    date,
    [EXTRA_COLUMN_FIELD]: config.name,
  };
};

export const StrategySheetDataConfig: S2DataConfig = {
  data: [
    // 普通数值+同环比数据
    {
      'measure-a': {
        originalValues: [[3877, 4324, 0.42]],
        values: [[3877, 4324, '42%']],
      },
      'measure-b': {
        originalValues: [[377, 324, -0.02]],
        values: [[377, 324, '-0.02']],
      },
      'measure-c': {
        originalValues: [[377, 0, null]],
        values: [[377, 0, null]],
      },
      'measure-d': {
        originalValues: [[377, 324, 0.02]],
        values: [[377, 324, '0.02']],
      },
      'measure-e': {
        originalValues: [[377, 324, 0.02]],
        values: [[377, 324, '0.02']],
      },
      'measure-f': {
        originalValues: [[377, 324, 0.02]],
        values: [[377, 324, '0.02']],
      },
      date: '2021',
      [EXTRA_COLUMN_FIELD]: JSON.stringify(['数值', '环比', '同比']),
    },
    // 净增目标完成度子弹图数据
    getKPIMockData(KpiType.NetAddedProgress),
    getKPIMockData(KpiType.TargetValue),
    getKPIMockData(KpiType.ReferenceValue),
    getKPIMockData(KpiType.NetAddedValue),
    getKPIMockData(KpiType.TargetNetAddedValue),
    {
      'measure-a': {
        originalValues: [[377, '', 0.02]],
        values: [[377, '', '0.02']],
      },
      'measure-b': {
        originalValues: [[377, 324, 0.02]],
        values: [[377, 324, '0.02']],
      },
      'measure-c': {
        originalValues: [[null, 324, 0.02]],
        values: [[null, 324, '0.02']],
      },
      'measure-d': {
        originalValues: [[377, 324, 0.02]],
        values: [[377, 324, '0.02']],
      },
      'measure-f': {
        originalValues: [[377, 324, 0.02]],
        values: [[377, 324, '0.02']],
      },
      date: '2022',
      [EXTRA_COLUMN_FIELD]: JSON.stringify(['数值', '环比', '同比']),
    },
  ],
  meta: [
    {
      field: 'date',
      name: '时间',
    },
  ],
  fields: {
    columns: ['date', EXTRA_COLUMN_FIELD],
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
              {
                key: 'measure-d',
                title: '指标D',
                description: '指标D描述',
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
