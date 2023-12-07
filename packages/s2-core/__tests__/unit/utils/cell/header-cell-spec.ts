import type { Node } from '../../../../src';
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
      expect(rowConfig).toEqual(actionConfig[0]);
      expect(rowConfig.displayCondition).toBeCalledWith(rowMeta, 'SortUp');
      expect(rowConfig.displayCondition).toBeCalledWith(rowMeta, 'SortDown');

      // 列头 icon
      expect(
        getActionIconConfig(actionConfig, null, CellTypes.COL_CELL),
      ).toEqual(actionConfig[1]);

      // 未命中
      expect(
        getActionIconConfig(actionConfig, null, CellTypes.CORNER_CELL),
      ).toBeUndefined();
    });

    test('should filter invisible icons', () => {
      const actionConfig: HeaderActionIcon[] = [
        {
          iconNames: ['SortUp', 'SortDown'],
          belongsCell: 'rowCell',
          displayCondition: (meta, iconName) => iconName === 'SortDown',
        },
      ];

      const rowConfig = getActionIconConfig(
        actionConfig,
        null,
        CellTypes.ROW_CELL,
      );
      expect(rowConfig.iconNames).toEqual(['SortDown']);
    });
  });
});
