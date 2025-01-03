import type { Node } from '@/facet/layout/node';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { createPivotSheet, getContainer, sleep } from 'tests/util/helpers';
import {
  CornerNodeType,
  type RowCellCollapsedParams,
  type S2DataConfig,
  type S2Options,
} from '../../src/common/interface';
import { customRowGridFields } from '../data/custom-grid-fields';
import { CustomGridData } from '../data/data-custom-grid';
import { S2Event } from './../../src/common/constant/events/basic';

describe('SpreadSheet Collapse/Expand Tests', () => {
  let container: HTMLElement;
  let s2: SpreadSheet;

  const s2Options: S2Options = {
    width: 600,
    height: 400,
    hierarchyType: 'tree',
    style: {
      rowCell: {
        expandDepth: undefined,
      },
    },
  };

  const mapNodes = (spreadsheet: SpreadSheet) =>
    spreadsheet.facet.getRowLeafNodes().map((node) => node.id);

  const expectCornerIconName = (spreadsheet: SpreadSheet, iconName: string) => {
    const cornerCell = spreadsheet.facet
      .getCornerCells()
      .find((cell) => cell.getMeta().cornerType === CornerNodeType.Row)!;

    const cornerIcon = cornerCell.getTreeIcon();

    expect(cornerIcon?.name).toEqual(iconName);
  };

  beforeEach(async () => {
    container = getContainer();
    s2 = new PivotSheet(
      container,
      {
        ...mockDataConfig,
        fields: {
          rows: ['province', 'city', 'type'],
          columns: [],
          values: ['price', 'cost'],
          valueInCols: true,
        },
      },
      s2Options,
    );
    await s2.render();
  });

  afterEach(() => {
    // s2.destroy();
  });

  describe('Tree Mode', () => {
    test('should init rows with expandDepth config', async () => {
      s2.setOptions({
        style: {
          rowCell: {
            expandDepth: 0,
          },
        },
      });
      await s2.render();

      const rowLeafNodes = s2.facet.getRowLeafNodes();

      expect(rowLeafNodes).toHaveLength(3);
      expect(mapNodes(s2)).toEqual([
        'root[&]浙江',
        'root[&]浙江[&]义乌',
        'root[&]浙江[&]杭州',
      ]);

      s2.setOptions({
        style: {
          rowCell: {
            expandDepth: 1,
          },
        },
      });
      await s2.render();

      expect(mapNodes(s2)).toEqual([
        'root[&]浙江',
        'root[&]浙江[&]义乌',
        'root[&]浙江[&]义乌[&]笔',
        'root[&]浙江[&]杭州',
        'root[&]浙江[&]杭州[&]笔',
      ]);
    });

    test('should collapse all row nodes', async () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapseAll: true,
          },
        },
      });

      await s2.render(false);

      expect(mapNodes(s2)).toEqual(['root[&]浙江']);
      expectCornerIconName(s2, 'Plus');
    });

    test('should collapse by field', async () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapseFields: {
              province: true,
            },
          },
        },
      });

      await s2.render(false);

      expect(mapNodes(s2)).toEqual(['root[&]浙江']);
      expectCornerIconName(s2, 'Plus');
    });

    test('should collapse by field id', async () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapseFields: {
              'root[&]浙江[&]义乌': true,
            },
          },
        },
      });

      await s2.render();

      expect(mapNodes(s2)).toEqual([
        'root[&]浙江',
        'root[&]浙江[&]义乌',
        'root[&]浙江[&]杭州',
        'root[&]浙江[&]杭州[&]笔',
      ]);
      expectCornerIconName(s2, 'Plus');
    });

    test('should collapse use collapseFields first', async () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapseAll: false,
            collapseFields: {
              city: true,
            },
          },
        },
      });

      await s2.render(false);

      expect(mapNodes(s2)).toEqual([
        'root[&]浙江',
        'root[&]浙江[&]义乌',
        'root[&]浙江[&]杭州',
      ]);
      expectCornerIconName(s2, 'Plus');
    });

    test('should collapse use expandDepth first', async () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapseAll: true,
            expandDepth: 1,
          },
        },
      });
      await s2.render(false);

      expect(mapNodes(s2)).toEqual([
        'root[&]浙江',
        'root[&]浙江[&]义乌',
        'root[&]浙江[&]义乌[&]笔',
        'root[&]浙江[&]杭州',
        'root[&]浙江[&]杭州[&]笔',
      ]);
      expectCornerIconName(s2, 'Minus');
    });

    test('should collapse use collapseFields first when contain collapseAll and expandDepth config', async () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapseAll: false,
            collapseFields: {
              'root[&]浙江[&]杭州': true,
            },
            expandDepth: null,
          },
        },
      });
      await s2.render(false);

      expect(mapNodes(s2)).toEqual([
        'root[&]浙江',
        'root[&]浙江[&]义乌',
        'root[&]浙江[&]义乌[&]笔',
        'root[&]浙江[&]杭州',
      ]);
      expectCornerIconName(s2, 'Plus');
    });

    test('should collapse use collapseFields by node id first', async () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapseFields: {
              province: false,
              'root[&]浙江': true,
            },
          },
        },
      });
      await s2.render(false);

      expect(mapNodes(s2)).toEqual(['root[&]浙江']);
      expectCornerIconName(s2, 'Plus');
    });

    test('should collapse all nodes if collapseAll is true and collapseFields is undefined', async () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapseAll: true,
            collapseFields: undefined,
          },
        },
      });
      await s2.render(false);

      expect(mapNodes(s2)).toEqual(['root[&]浙江']);
      expectCornerIconName(s2, 'Plus');
    });

    test('should emit collapse event', async () => {
      const onCollapsed = jest.fn();

      s2.on(S2Event.ROW_CELL_COLLAPSED, onCollapsed);

      const node = { id: 'testId' } as unknown as Node;
      const treeRowType: RowCellCollapsedParams = {
        isCollapsed: false,
        node,
      };

      const params: RowCellCollapsedParams = {
        isCollapsed: false,
        collapseFields: {
          [node.id]: false,
        },
        node,
      };

      s2.emit(S2Event.ROW_CELL_COLLAPSED__PRIVATE, treeRowType);

      await sleep(500);
      expect(onCollapsed).toHaveBeenCalledWith(params);
      expectCornerIconName(s2, 'Minus');
    });

    test('should emit collapse all event', async () => {
      const onCollapsed = jest.fn();

      s2.on(S2Event.ROW_CELL_ALL_COLLAPSED, onCollapsed);

      s2.emit(S2Event.ROW_CELL_ALL_COLLAPSED__PRIVATE, false);

      await sleep(500);
      expect(onCollapsed).toHaveBeenCalledWith(true);
      expectCornerIconName(s2, 'Plus');
    });

    // https://github.com/antvis/S2/issues/2607
    test('should only expand current group row nodes', async () => {
      s2 = createPivotSheet(
        {
          ...s2Options,
          style: {
            rowCell: {
              collapseAll: true,
            },
          },
        },
        { useSimpleData: false },
      );

      await s2.render();

      const rowNodes = s2.facet.getRowNodes(0);

      s2.emit(S2Event.ROW_CELL_COLLAPSED__PRIVATE, {
        isCollapsed: false,
        node: rowNodes[0],
      });

      await sleep(500);

      expectCornerIconName(s2, 'Minus');
      expect(s2.facet.getRowNodes().map(({ id }) => id)).toMatchSnapshot();
    });

    test('should sync corner cell collapse all icon status', async () => {
      s2 = createPivotSheet(
        {
          ...s2Options,
          style: {
            rowCell: {
              collapseAll: false,
              collapseFields: {
                'root[&]浙江省': true,
                'root[&]四川省': true,
              },
            },
          },
        },
        { useSimpleData: false },
      );

      await s2.render();

      expectCornerIconName(s2, 'Plus');
      expect(s2.facet.getRowNodes().map(({ id }) => id)).toMatchSnapshot();
    });

    test('should only expand current group row nodes for custom tree', async () => {
      const customRowDataCfg: S2DataConfig = {
        data: CustomGridData,
        fields: customRowGridFields,
      };

      s2 = createPivotSheet({
        ...s2Options,
        style: {
          rowCell: {
            collapseAll: true,
          },
        },
      });

      s2.setDataCfg(customRowDataCfg);
      await s2.render();

      const rowNodes = s2.facet.getRowNodes(0);

      s2.emit(S2Event.ROW_CELL_COLLAPSED__PRIVATE, {
        isCollapsed: false,
        node: rowNodes[0],
      });

      await sleep(500);

      expectCornerIconName(s2, 'Minus');
      expect(s2.facet.getRowNodes().map(({ id }) => id)).toMatchSnapshot();
    });
  });

  test('should support expandDepth for custom tree', async () => {
    const customRowDataCfg: S2DataConfig = {
      data: CustomGridData,
      fields: customRowGridFields,
    };

    s2 = createPivotSheet({
      ...s2Options,
      style: {
        rowCell: {
          expandDepth: 0,
          // expandDepth > collapseAll
          collapseAll: true,
        },
      },
    });

    s2.setDataCfg(customRowDataCfg);
    await s2.render();

    expectCornerIconName(s2, 'Minus');
    expect(s2.facet.getRowNodes().map(({ id }) => id)).toMatchSnapshot();
  });
});
