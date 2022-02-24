/**
 * @description spec for issue #720
 * https://github.com/antvis/S2/issues/720
 * Sync row scroll offset when corner cell resized
 *
 */
import { getContainer } from 'tests/util/helpers';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { S2Event } from '../../src/common/constant';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import { S2Options } from '@/common/interface';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  style: {
    colCfg: {
      height: 60,
    },
    cellCfg: {
      width: 100,
      height: 50,
    },
  },
};

describe('Sync Row Scroll Offset Tests', () => {
  let s2: SpreadSheet;

  beforeEach(() => {
    s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);
    s2.render();
  });

  test('should not reset row scroll bar offset when resize end', () => {
    s2.store.set('hRowScrollX', 20);
    s2.render(false);

    s2.emit(S2Event.LAYOUT_RESIZE_MOUSE_DOWN, {
      originalEvent: {},
      preventDefault() {},
      target: {
        attr: () => ({
          isResizeArea: true,
        }),
      },
    } as any);

    s2.emit(S2Event.GLOBAL_MOUSE_UP, {
      preventDefault() {},
      target: {
        attr: () => ({
          isResizeArea: true,
        }),
      },
    } as any);

    expect(s2.store.get('hRowScrollX')).not.toEqual(0);
  });
});
