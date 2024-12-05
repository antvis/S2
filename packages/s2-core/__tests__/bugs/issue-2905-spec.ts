/**
 * 明细表设置rowCell pedding后，row-column-resize交互计算高度计算错误
 * @description spec for issue #2905
 * https://github.com/antvis/S2/issues/2905
 */
import * as mockDataConfig from '../data/data-issue-2905.json';
import { getContainer } from '../util/helpers';
import {
  TableSheet,
  ResizeAreaEffect,
  ResizeDirectionType,
  type ResizeInfo,
  RowColumnResize,
  S2Event,
  type S2Theme,
  type S2Options,
} from '@/index';

const s2Options: S2Options = {
  width: 600,
  height: 480,
};
const s2Theme: S2Theme = {
  rowCell: {
    cell: {
      padding: {
        top: 8,
        bottom: 8,
      },
    },
  },
};

describe('TableSheet Resize With RowCell Padding Tests', () => {
  let rowColumnResizeInstance: RowColumnResize;

  const emitResizeEvent = (
    type: S2Event,
    event: Partial<MouseEvent>,
    resizeInfo?: ResizeInfo,
  ) => {
    rowColumnResizeInstance.spreadsheet.emit(type, {
      originalEvent: event,
      preventDefault() {},
      target: {
        attr: () => ({
          ...resizeInfo,
          isResizeArea: true,
        }),
      },
    } as any);
  };

  test('should update table sheet cell height without padding effect', () => {
    const s2 = new TableSheet(getContainer(), mockDataConfig, s2Options);
    s2.setTheme(s2Theme);
    s2.render();

    rowColumnResizeInstance = new RowColumnResize(s2);

    const resizeInfo = {
      theme: {},
      type: ResizeDirectionType.Vertical,
      offsetX: 0,
      offsetY: 32,
      width: 5,
      height: 32,
      isResizeArea: true,
      effect: ResizeAreaEffect.Cell,
      id: '0',
      resizedWidth: 0,
      resizedHeight: 32,
    } as ResizeInfo;

    emitResizeEvent(S2Event.LAYOUT_RESIZE_MOUSE_DOWN, {}, resizeInfo);
    emitResizeEvent(S2Event.GLOBAL_MOUSE_UP, {}, resizeInfo);
    expect(s2.options.style.cellCfg.height).toBe(32);

    resizeInfo.height = 16;
    emitResizeEvent(S2Event.LAYOUT_RESIZE_MOUSE_DOWN, {}, resizeInfo);
    emitResizeEvent(S2Event.GLOBAL_MOUSE_UP, {}, resizeInfo);
    expect(s2.options.style.cellCfg.height).toBe(16);
  });
});
