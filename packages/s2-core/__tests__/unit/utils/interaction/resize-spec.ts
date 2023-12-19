import { Group } from '@antv/g';
import type { ResizeArea, ResizeInfo } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';
import {
  getResizeAreaAttrs,
  getOrCreateResizeAreaGroupById,
} from '@/utils/interaction/resize';
import {
  ResizeAreaEffect,
  ResizeDirectionType,
} from '@/common/constant/resize';

jest.mock('@/sheet-type');
jest.mock('@/interaction/event-controller');

const MockSpreadSheet = SpreadSheet as unknown as jest.Mock<SpreadSheet>;

describe('Resize Utils Tests', () => {
  const resizeAreaTheme: ResizeArea = {
    background: '#000',
    backgroundOpacity: 1,
    size: 3,
  };

  const commonConfig = {
    offsetX: 0,
    offsetY: 0,
    width: 20,
    height: 20,
    effect: 'cell',
    theme: resizeAreaTheme,
  } as ResizeInfo;

  let s2: SpreadSheet;

  beforeEach(() => {
    MockSpreadSheet.mockClear();

    s2 = new MockSpreadSheet();
    s2.facet = {
      foregroundGroup: new Group(),
    } as any;
  });

  describe('#getResizeAreaAttrs()', () => {
    test('should get resize area append attrs with col field', () => {
      expect(
        getResizeAreaAttrs({
          ...commonConfig,
          type: ResizeDirectionType.Horizontal,
        }),
      ).toStrictEqual({
        style: {
          fill: resizeAreaTheme.background,
          fillOpacity: resizeAreaTheme.backgroundOpacity,
          cursor: `col-resize`,
          width: resizeAreaTheme.size,
          height: undefined,
        },
        appendInfo: {
          isResizeArea: true,
          effect: ResizeAreaEffect.Cell,
          type: ResizeDirectionType.Horizontal,
          offsetX: 0,
          offsetY: 0,
          width: 20,
          height: 20,
          size: 3,
        },
      });
    });

    test('should get resize area append attrs with row field', () => {
      expect(
        getResizeAreaAttrs({
          ...commonConfig,
          type: ResizeDirectionType.Vertical,
        }),
      ).toStrictEqual({
        style: {
          fill: resizeAreaTheme.background,
          fillOpacity: resizeAreaTheme.backgroundOpacity,
          cursor: `row-resize`,
          width: undefined,
          height: resizeAreaTheme.size,
        },
        appendInfo: {
          isResizeArea: true,
          effect: ResizeAreaEffect.Cell,
          type: ResizeDirectionType.Vertical,
          offsetX: 0,
          offsetY: 0,
          width: 20,
          height: 20,
          size: 3,
        },
      });
    });

    test('should merge custom width and height', () => {
      const attrs = getResizeAreaAttrs({
        ...commonConfig,
        type: ResizeDirectionType.Vertical,
        width: 100,
        height: 200,
      });

      expect(attrs.appendInfo.width).toStrictEqual(100);
      expect(attrs.appendInfo.height).toStrictEqual(200);
    });

    test('should merge custom width with row field', () => {
      const attrs = getResizeAreaAttrs({
        ...commonConfig,
        type: ResizeDirectionType.Vertical,
        width: 100,
      });

      expect(attrs.appendInfo.width).toStrictEqual(100);
      expect(attrs.style.height).toStrictEqual(resizeAreaTheme.size);
    });

    test('should merge custom height with col field', () => {
      const attrs = getResizeAreaAttrs({
        ...commonConfig,
        type: ResizeDirectionType.Horizontal,
        height: 100,
      });

      expect(attrs.style.width).toStrictEqual(resizeAreaTheme.size);
      expect(attrs.appendInfo.height).toStrictEqual(100);
    });

    test('should get resize cursor with col field', () => {
      const attrs = getResizeAreaAttrs({
        ...commonConfig,
        type: ResizeDirectionType.Horizontal,
      });

      expect(attrs.style.cursor).toStrictEqual('col-resize');
    });

    test('should get resize cursor with row field', () => {
      const attrs = getResizeAreaAttrs({
        ...commonConfig,
        type: ResizeDirectionType.Vertical,
      });

      expect(attrs.style.cursor).toStrictEqual('row-resize');
    });
  });

  describe('#getResizeAreaGroupById()', () => {
    test('should get new resize area group if prevResizeArea is empty', () => {
      const group = getOrCreateResizeAreaGroupById(s2, 'id');

      expect(group?.add).toBeDefined();
      expect(s2.facet.foregroundGroup.children).toHaveLength(1);
    });

    test('should get prev resize area group if prevResizeArea is exist', () => {
      const groupId = 'id';

      // create multiple group
      getOrCreateResizeAreaGroupById(s2, groupId);
      getOrCreateResizeAreaGroupById(s2, groupId);
      getOrCreateResizeAreaGroupById(s2, groupId);

      // use prev created group, only one resize area group
      expect(s2.facet.foregroundGroup.children).toHaveLength(1);
    });
  });
});
