import * as mockDataConfig from 'tests/data/simple-data.json';
import { createPivotSheet, getContainer } from 'tests/util/helpers';
import { CornerNodeType, PivotSheet } from '../../src';
import type { S2DataConfig, S2Options } from '@/common';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hierarchyType: 'tree',
};

describe('SpreadSheet Tree Mode Tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = getContainer();
  });

  afterEach(() => {
    // container?.remove();
  });

  describe('Facet Tests', () => {
    test('should re-calc row header width', async () => {
      const s2 = createPivotSheet(s2Options);

      await s2.render();

      const rowsHierarchyWidth = s2.facet.getLayoutResult().rowsHierarchy.width;

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
      await s2.render();

      expect(s2.facet.getLayoutResult().rowsHierarchy.width).not.toEqual(
        rowsHierarchyWidth,
      );
    });

    // https://github.com/antvis/S2/issues/2389
    test('the corner should only have one line with action icon', async () => {
      // 行头维度更改为较长的 name
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

      // 添加 icon
      const newS2Options: S2Options = {
        ...s2Options,
        headerActionIcons: [
          {
            icons: ['SortDownSelected'],
            belongsCell: 'cornerCell',
          },
        ],
      };
      const s2 = new PivotSheet(container, newDataCfg, newS2Options);

      await s2.render();

      // 检查文本是否只有一行
      const cornerCell = s2.facet.getCornerCells()[0];

      expect(cornerCell.getTextShapes()).toHaveLength(1);
      expect(cornerCell.isMultiLineText()).toBeFalsy();
    });

    // https://github.com/antvis/S2/issues/2563
    test('should render correctly tree icon position in row cell', async () => {
      const s2 = createPivotSheet({
        ...s2Options,
        width: 300,
        seriesNumber: {
          enable: true,
        },
      });

      await s2.render();

      const [seriesNumberCell, rowCell] = s2.facet
        .getCornerCells()
        .filter((cell) => cell.getMeta().cornerType !== CornerNodeType.Col);

      expect(seriesNumberCell.getTreeIcon()).toBeFalsy();
      expect(rowCell.getTreeIcon()).toBeTruthy();
    });
  });
});
