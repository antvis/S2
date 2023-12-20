import type { Node } from '@antv/s2';
import { CellType, type HeaderActionIcon } from '@/common';
import { getActionIconConfig } from '@/utils/cell/header-cell';

describe('Header Cell Utils Tests', () => {
  describe('getActionIconConfig Tests', () => {
    test('should return config', () => {
      const actionConfig: HeaderActionIcon[] = [
        {
          icons: ['SortUp', 'SortDown'],
          belongsCell: 'rowCell',
          displayCondition: jest.fn().mockReturnValue(true),
        },
        {
          icons: ['DrillDown', 'Star'],
          belongsCell: 'colCell',
        },
      ];

      // 行头 icon 条件返回
      const rowMeta = { id: 'test-col' } as Node;
      const rowConfig = getActionIconConfig(
        actionConfig,
        rowMeta,
        CellType.ROW_CELL,
      );

      expect(rowConfig?.icons).toEqual([
        { name: 'SortUp', position: 'right' },
        { name: 'SortDown', position: 'right' },
      ]);
      expect(rowConfig!.displayCondition).toHaveBeenCalledWith(
        rowMeta,
        'SortUp',
      );
      expect(rowConfig!.displayCondition).toHaveBeenCalledWith(
        rowMeta,
        'SortDown',
      );

      // 列头 icon
      expect(
        getActionIconConfig(
          actionConfig,
          null as unknown as Node,
          CellType.COL_CELL,
        ),
      ).toEqual({
        icons: [
          { name: 'DrillDown', position: 'right' },
          { name: 'Star', position: 'right' },
        ],
        belongsCell: 'colCell',
      });

      // 未命中
      expect(
        getActionIconConfig(
          actionConfig,
          null as unknown as Node,
          CellType.CORNER_CELL,
        ),
      ).toBeUndefined();
    });

    test('should filter invisible icons', () => {
      const actionConfig: HeaderActionIcon[] = [
        {
          icons: ['SortUp', 'SortDown'],
          belongsCell: 'rowCell',
          displayCondition: (_, iconName) => iconName === 'SortDown',
        },
      ];

      const rowConfig = getActionIconConfig(
        actionConfig,
        null as unknown as Node,
        CellType.ROW_CELL,
      );

      expect(rowConfig!.icons).toEqual([
        { name: 'SortDown', position: 'right' },
      ]);
    });
  });
});
