/**
 * custom-tree mode.
 */
import { customTreeNodes } from 'tests/data/custom-tree-nodes';
import { CustomTreeData } from 'tests/data/data-custom-tree';
import { getContainer } from 'tests/util/helpers';
import type { S2DataConfig } from '@/common/interface';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import { type S2Options } from '@/index';

describe('test for corner text', () => {
  const values: string[] = [
    'measure-a',
    'measure-b',
    'measure-c',
    'measure-d',
    'measure-e',
    'measure-f',
  ];

  const dataCfg: S2DataConfig = {
    meta: [],
    data: CustomTreeData,
    fields: {
      rows: customTreeNodes,
      columns: ['type', 'sub_type'],
      values,
      valueInCols: false,
    },
  };

  const options: S2Options = {
    width: 600,
    height: 480,
    hierarchyType: 'tree',
  };

  let mockSheet: SpreadSheet;

  beforeAll(async () => {
    mockSheet = new PivotSheet(getContainer(), dataCfg, options);
    await mockSheet.render();
  });

  test('get correct default corner text when the corner label is empty', () => {
    const cornerCells = mockSheet.facet.getCornerCells();

    expect(cornerCells[0].getActualText()).toEqual('自定义节点A/指标E/数值');
    expect(cornerCells[1].getActualText()).toEqual('type');
  });

  test('get correct default corner text when set the cornerText.', async () => {
    mockSheet.setOptions({ ...options, cornerText: 'test' });
    await mockSheet.render();

    const cornerCells = mockSheet.facet.getCornerCells();

    expect(cornerCells[0].getActualText()).toEqual('test');
    expect(cornerCells[1].getActualText()).toEqual('type');
  });
});
