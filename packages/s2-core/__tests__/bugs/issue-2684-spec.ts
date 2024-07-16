/**
 * 透视表维值含有 "-", 复制数据时表头缺失
 * @description spec for issue #2684
 * https://github.com/antvis/S2/issues/2684
 */

import type { CellMeta, S2Options, SpreadSheet } from '@/index';
import { isEmpty } from 'lodash';
import { InteractionStateName } from '../../src';
import { getSelectedData } from '../../src/utils/export/copy';
import * as mockDataConfig from '../data/data-issue-2684.json';
import { createPivotSheet } from '../util/helpers';

const s2Options: S2Options = {
  width: 600,
  height: 480,
  interaction: {
    copy: {
      enable: true,
      withHeader: true,
      withFormat: true,
    },
    brushSelection: {
      dataCell: true,
      rowCell: true,
      colCell: true,
    },
    multiSelection: true,
  },
};

describe('PivotSheet Special Dimension Values Copy Tests', () => {
  let s2: SpreadSheet;

  beforeEach(async () => {
    s2 = createPivotSheet(s2Options);
    s2.setDataCfg(mockDataConfig);
    await s2.render();
  });

  test('should correctly copy data with header', () => {
    const { rowLeafNodes, colLeafNodes } = s2.facet.getLayoutResult();
    const cells = s2.facet.getDataCells().map((cell) => {
      const meta = cell.getMeta();
      const colId = String(colLeafNodes[meta.colIndex].id);
      const rowId = isEmpty(rowLeafNodes)
        ? String(meta.rowIndex)
        : String(rowLeafNodes[meta.rowIndex].id);

      return { ...meta, colId, rowId };
    }) as unknown as CellMeta[];

    s2.interaction.changeState({
      cells,
      stateName: InteractionStateName.SELECTED,
    });

    const data = getSelectedData(s2);

    expect(data).toMatchSnapshot();
  });
});
