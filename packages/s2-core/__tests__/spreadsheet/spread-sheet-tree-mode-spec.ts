import * as mockDataConfig from 'tests/data/simple-data.json';
import { createPivotSheet, getContainer } from 'tests/util/helpers';
import type { S2DataConfig, S2Options } from '@/common';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hierarchyType: 'tree',
};

describe('SpreadSheet Tree Mode Tests', () => {
  let container: HTMLElement;

  beforeAll(() => {
    container = getContainer();
  });

  afterAll(() => {
    container?.remove();
  });

  describe('Facet Tests', () => {
    test('should re-calc row header width', () => {
      const s2 = createPivotSheet(s2Options);

      s2.render();

      const rowsHierarchyWidth = s2.facet.layoutResult.rowsHierarchy.width;

      expect(Math.round(rowsHierarchyWidth)).toEqual(120);

      // 行头维度均更改为较长的 name
      const newDataCfg: S2DataConfig = {
        ...mockDataConfig,
        meta: [
          {
            field: 'province',
            name: '省1234567890份',
          },
          {
            field: 'city',
            name: '城1234567890市',
          },
        ],
      };

      s2.setDataCfg(newDataCfg);
      s2.render();

      expect(s2.facet.layoutResult.rowsHierarchy.width).not.toEqual(
        rowsHierarchyWidth,
      );
    });
  });
});
