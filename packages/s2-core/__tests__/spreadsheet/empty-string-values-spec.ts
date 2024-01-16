import { getContainer } from 'tests/util/helpers';
import { LayoutWidthType, type S2DataConfig, type S2Options } from '@/common';
import { PivotSheet, SpreadSheet } from '@/sheet-type';

const s2Options: S2Options = {
  debug: true,
  width: 600,
  height: 400,
  hierarchyType: 'grid',
  style: {
    layoutWidthType: LayoutWidthType.Adaptive,
    dataCell: {
      height: 30,
    },
  },
};

const testDataCfg: S2DataConfig = {
  meta: [
    {
      field: 'first',
      name: '一级维度',
    },
    {
      field: 'second',
      name: '二级维度',
    },
    {
      field: 'number',
      name: '数值',
    },
  ],
  fields: {
    rows: ['first', 'second'],
    columns: [],
    values: ['number'],
    valueInCols: true,
  },
  data: [
    {
      first: '',
      second: '维值1',
      number: 100,
    },
    {
      first: '',
      second: '维值2',
      number: 200,
    },
    {
      first: null,
      second: '维值3',
      number: 300,
    },
    {
      first: null,
      second: '维值4',
      number: 400,
    },
    {
      first: '非空维度',
      second: '维值5',
      number: 500,
    },
    {
      first: '非空维度',
      second: '维值6',
      number: 600,
    },
  ],
};

describe('Empty String Values Tests', () => {
  let s2: SpreadSheet;

  beforeEach(() => {
    s2 = new PivotSheet(getContainer(), testDataCfg, s2Options);
    s2.render();
  });

  test('should get correctly first dimension values', () => {
    const values = s2.dataSet.getDimensionValues('first');

    expect(values).toEqual(['', 'null', '非空维度']);
  });

  test('should get correctly second dimension values', () => {
    const values = s2.dataSet.getDimensionValues('second');

    expect(values).toEqual([
      '维值1',
      '维值2',
      '维值3',
      '维值4',
      '维值5',
      '维值6',
    ]);
  });

  test('should get correctly second dimension values by specific query', () => {
    let values = s2.dataSet.getDimensionValues('second', { first: '' });

    expect(values).toEqual(['维值1', '维值2']);

    values = s2.dataSet.getDimensionValues('second', { first: 'null' });
    expect(values).toEqual(['维值3', '维值4']);

    values = s2.dataSet.getDimensionValues('second', { first: '非空维度' });
    expect(values).toEqual(['维值5', '维值6']);
  });

  test('should get correctly layout result', () => {
    const nodes = s2.facet.getLayoutResult().rowLeafNodes;

    expect(nodes.map((node) => node.id)).toEqual([
      'root[&][&]维值1',
      'root[&][&]维值2',
      'root[&]null[&]维值3',
      'root[&]null[&]维值4',
      'root[&]非空维度[&]维值5',
      'root[&]非空维度[&]维值6',
    ]);
  });
});
