import type { Node } from '@antv/s2';
import { CellTypes, type HeaderActionIcon } from '@/common';
import { getActionIconConfig } from '@/utils/cell/header-cell';

describe('Header Cell Utils Tests', () => {
  describe('getActionIconConfig Tests', () => {
    test('should return config', () => {
      const actionConfig: HeaderActionIcon[] = [
        {
          iconNames: ['SortUp', 'SortDown'],
          belongsCell: 'rowCell',
          displayCondition: jest.fn().mockReturnValue(true),
        },
        {
          iconNames: ['DrillDown', 'Star'],
          belongsCell: 'colCell',
        },
      ];

      // 行头 icon 条件返回
      const rowMeta = { id: 'test-col' } as Node;
      const rowConfig = getActionIconConfig(
        actionConfig,
        rowMeta,
        CellTypes.ROW_CELL,
      );

      expect(rowConfig?.iconNames).toEqual([
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
          CellTypes.COL_CELL,
        ),
      ).toEqual({
        iconNames: [
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
          CellTypes.CORNER_CELL,
        ),
      ).toBeUndefined();
    });

    test('should filter invisible icons', () => {
      const actionConfig: HeaderActionIcon[] = [
        {
          iconNames: ['SortUp', 'SortDown'],
          belongsCell: 'rowCell',
          displayCondition: (_, iconName) => iconName === 'SortDown',
        },
      ];

      const rowConfig = getActionIconConfig(
        actionConfig,
        null as unknown as Node,
        CellTypes.ROW_CELL,
      );

      expect(rowConfig!.iconNames).toEqual([
        { name: 'SortDown', position: 'right' },
      ]);
    });
  });
});
