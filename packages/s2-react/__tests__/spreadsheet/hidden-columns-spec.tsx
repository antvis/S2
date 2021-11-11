/* eslint-disable no-console */
import { act } from 'react-dom/test-utils';
import { S2Event } from '@antv/s2';
import { data } from '../data/mock-dataset.json';
import { getContainer } from '../util/helpers';
import { TableSheet } from '@/components/sheets/table-sheet';

describe('hidden columns spec', () => {
  act(() => {
    const s2DataConfig = {
      fields: {
        columns: ['province', 'city', 'type', 'sub_type', 'number'],
      },
      data,
    };

    const s2options = {
      width: 800,
      height: 600,
      hiddenColumnFields: ['city'],
      tooltip: {
        operation: {
          hiddenColumns: true,
        },
      },
    };
    const s2 = new TableSheet(getContainer(), s2DataConfig, s2options);

    s2.on(S2Event.LAYOUT_TABLE_COL_EXPANDED, (cell) => {
      console.log('列头展开', cell);
    });
    s2.on(
      S2Event.LAYOUT_TABLE_COL_HIDDEN,
      (currentHiddenColumnsInfo, hiddenColumnsDetail) => {
        console.log('列头隐藏', currentHiddenColumnsInfo, hiddenColumnsDetail);
      },
    );

    s2.render();
  });
  test('should pass test', () => {
    // just for placeholder when run test:live
    expect(1).toBe(1);
  });
});
