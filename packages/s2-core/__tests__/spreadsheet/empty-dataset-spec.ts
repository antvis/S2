/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getContainer } from 'tests/util/helpers';
import type { S2DataConfig } from '../../src';
import { PivotSheet, TableSheet } from '@/sheet-type';
import type { S2Options } from '@/common/interface/s2Options';

const s2Options: S2Options = {
  width: 400,
  height: 400,
  hierarchyType: 'grid',
};

describe('Empty Dataset Structure Tests', () => {
  test('should generate placeholder for pivot mode with single dimension', async () => {
    const container = getContainer();

    const s2DataCfg: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price'],
        valueInCols: true,
      },
      data: [],
    };
    const s2 = new PivotSheet(container, s2DataCfg, s2Options);

    await s2.render();

    // @ts-ignore
    expect(s2.facet.panelScrollGroupIndexes).toEqual([0, 0, 0, 0]);
  });

  test('should generate placeholder for pivot mode with two dimensions', async () => {
    const container = getContainer();

    const s2DataCfg: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price', 'cost'],
        valueInCols: true,
      },
      data: [],
    };

    const s2 = new PivotSheet(container, s2DataCfg, s2Options);

    await s2.render();
    // @ts-ignore
    expect(s2.facet.panelScrollGroupIndexes).toEqual([0, 1, 0, 0]);
  });

  test(`shouldn't generate placeholder for table mode`, async () => {
    const container = getContainer();

    const s2DataCfg: S2DataConfig = {
      fields: {
        columns: ['province', 'city', 'type', 'price', 'cost'],
      },
      data: [],
    };
    const s2 = new TableSheet(container, s2DataCfg, s2Options);

    await s2.render();
    // @ts-ignore
    expect(s2.facet.panelScrollGroupIndexes).toEqual([]);
  });
});
