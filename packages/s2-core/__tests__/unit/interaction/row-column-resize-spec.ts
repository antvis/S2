import {
  Group,
  DisplayObject,
  type RectStyleProps,
  type ParsedRectStyleProps,
  Path,
  FederatedPointerEvent,
} from '@antv/g';
import { get, pick } from 'lodash';
import { createMockCellInfo } from '../../util/helpers';
import type { BBox } from '@/engine/interface';
import { RootInteraction } from '@/interaction/root';
import {
  PivotSheet,
  ResizeAreaEffect,
  ResizeDirectionType,
  type ResizeInfo,
  RESIZE_END_GUIDE_LINE_ID,
  RESIZE_MASK_ID,
  RESIZE_START_GUIDE_LINE_ID,
  RowColumnResize,
  S2Event,
  type S2Options,
  SpreadSheet,
  type ThemeCfg,
  Node,
  type ViewMeta,
  type S2DataConfig,
  type ResizeParams,
  ResizeType,
} from '@/index';
import type { BaseFacet } from '@/facet/base-facet';
import { CustomRect } from '@/engine';

jest.mock('@/interaction/event-controller');
jest.mock('@/facet');
jest.mock('@/interaction/root');
jest.mock('@/utils/tooltip');

const MockRootInteraction =
  RootInteraction as unknown as jest.Mock<RootInteraction>;

describe('Interaction Row Column Resize Tests', () => {
  let rowColumnResizeInstance: RowColumnResize;
  let s2: SpreadSheet;
  let mockRootInteraction: RootInteraction;

  const s2Options: S2Options = {
    width: 300,
    height: 200,
    interaction: {
      resize: {
        colResizeType: ResizeType.ALL,
        rowResizeType: ResizeType.ALL,
      },
    },
  };

  const emitResizeEvent = (
    type: S2Event,
    event: Partial<FederatedPointerEvent | PointerEvent>,
    resizeInfo?: ResizeInfo,
  ) => {
    rowColumnResizeInstance.spreadsheet.emit(type, {
      ...event,
      preventDefault() {},
      target: new CustomRect(
        {},
        {
          ...resizeInfo,
          isResizeArea: true,
        },
      ),
    } as any);
  };

  const getStartGuideLine = () =>
    rowColumnResizeInstance.resizeReferenceGroup?.getElementById(
      RESIZE_START_GUIDE_LINE_ID,
    ) as DisplayObject;

  const getEndGuideLine = () =>
    rowColumnResizeInstance.resizeReferenceGroup?.getElementById(
      RESIZE_END_GUIDE_LINE_ID,
    ) as DisplayObject;

  const getResizeMask = () =>
    rowColumnResizeInstance.resizeReferenceGroup?.getElementById(
      RESIZE_MASK_ID,
    ) as DisplayObject;

  const emitResize = (
    directionType: ResizeDirectionType,
    effect: ResizeAreaEffect,
    meta?: Partial<ViewMeta>,
  ) => {
    const resizeInfo: ResizeInfo = {
      theme: {},
      type: directionType,
      offsetX: 2,
      offsetY: 2,
      width: 5,
      height: 2,
      isResizeArea: true,
      effect,
      size: 3,
      meta: {
        ...meta,
        rowId: '0',
        rowIndex: 0,
        field: 'testField',
        id: 'testFieldId',
      } as ResizeInfo['meta'],
    };

    emitResizeEvent(
      S2Event.LAYOUT_RESIZE_MOUSE_DOWN,
      {
        offsetX: 10,
        offsetY: 20,
      },
      resizeInfo,
    );

    emitResizeEvent(
      S2Event.GLOBAL_MOUSE_UP,
      {
        offsetX: 30,
        offsetY: 30,
      },
      resizeInfo,
    );

    return resizeInfo;
  };

  beforeEach(() => {
    MockRootInteraction.mockClear();

    s2 = new PivotSheet(
      document.createElement('div'),
      null as unknown as S2DataConfig,
      s2Options,
    );
    mockRootInteraction = new MockRootInteraction(s2);
    s2.facet = {
      foregroundGroup: new Group(),
      panelBBox: {
        maxX: s2Options.width,
        maxY: s2Options.height,
      } as BBox,
      destroy: jest.fn(),
      render: jest.fn(),
      getColNodes: () => [],
    } as unknown as BaseFacet;
    s2.interaction = mockRootInteraction;
    rowColumnResizeInstance = new RowColumnResize(s2);
    s2.render = jest.fn();
    s2.tooltip.container = document.createElement('div');
    s2.hideTooltip = jest.fn();
    s2.interaction.reset = jest.fn();
    s2.interaction.getActiveRowCells = () => [
      createMockCellInfo('test-row-cell').mockCell,
    ];
    s2.interaction.getActiveColCells = () => [
      createMockCellInfo('test-col-cell').mockCell,
    ];

    // 模拟多选
    jest
      .spyOn(Node, 'getAllLeaveNodes')
      .mockImplementationOnce(() => [
        createMockCellInfo('test-cell-a').getNode(),
        createMockCellInfo('test-cell-b').getNode(),
      ]);
  });

  test('should register events', () => {
    expect(rowColumnResizeInstance.bindEvents).toBeDefined();
  });

  test('should init resize group', () => {
    emitResizeEvent(S2Event.LAYOUT_RESIZE_MOUSE_DOWN, {});

    const maskAttrs: Partial<RectStyleProps> = {
      x: 0,
      y: 0,
      width: s2Options.width,
      height: s2Options.height,
    };
    const maskAppendInfo = {
      isResizeArea: true,
      isResizeMask: true,
    };

    const pickMaskAttrs = (attrs: ParsedRectStyleProps) =>
      pick(attrs, Object.keys(maskAttrs));

    const resizeMask = getResizeMask() as CustomRect;

    const startGuideLine = getStartGuideLine() as Path;
    const endGuideLine = getEndGuideLine();

    // add resize group
    expect(rowColumnResizeInstance.resizeReferenceGroup).toBeDefined();
    // add start guide line
    expect(startGuideLine).not.toBeUndefined();
    // add end guide line
    expect(endGuideLine).not.toBeUndefined();
    // add resize mask
    expect(resizeMask).not.toBeUndefined();

    // style
    expect(startGuideLine.parsedStyle.lineDash).toEqual([3, 3]);
    expect(startGuideLine.parsedStyle.stroke).toBeColor('#326EF4');
    expect(startGuideLine.parsedStyle.lineWidth).toEqual(3);

    expect(pickMaskAttrs(resizeMask!.parsedStyle)).toEqual(maskAttrs);
    expect(get(resizeMask!.parsedStyle.fill, 'alpha')).toEqual(0);
    expect(pick(resizeMask!.appendInfo, Object.keys(maskAppendInfo))).toEqual(
      maskAppendInfo,
    );
  });

  test('should update resize guide line position when col cell mouse down', () => {
    const resizeInfo = {
      theme: {},
      type: ResizeDirectionType.Horizontal,
      offsetX: 2,
      offsetY: 2,
      width: 5,
      height: 2,
      isResizeArea: true,
      effect: ResizeAreaEffect.Cell,
      size: 3,
    } as ResizeInfo;

    emitResizeEvent(
      S2Event.LAYOUT_RESIZE_MOUSE_DOWN,
      {
        offsetX: 10,
        offsetY: 20,
        clientX: 10,
        clientY: 20,
      },
      resizeInfo,
    );

    expect(s2.store.get('resized')).toBeFalsy();
    expect(rowColumnResizeInstance.resizeStartPosition).toStrictEqual({
      offsetX: 10,
      clientX: 10,
    });
    expect(getStartGuideLine().attr('path')).toStrictEqual([
      ['M', 3.5, 2],
      ['L', 3.5, s2Options.height],
    ]);
    expect(getEndGuideLine().attr('path')).toStrictEqual([
      ['M', 5.5, 2],
      ['L', 5.5, s2Options.height],
    ]);
  });

  test('should rerender by resize col cell', () => {
    const resize = jest.fn();
    const colWidthResize = jest.fn();

    s2.on(S2Event.LAYOUT_RESIZE, resize);
    s2.on(S2Event.LAYOUT_RESIZE_COL_WIDTH, colWidthResize);

    const resizeInfo: ResizeInfo = {
      theme: {},
      type: ResizeDirectionType.Horizontal,
      offsetX: 2,
      offsetY: 2,
      width: 20,
      height: 0,
      isResizeArea: true,
      effect: ResizeAreaEffect.Cell,
      resizedWidth: 40,
      resizedHeight: 0,
      size: 3,
      meta: {
        field: 'testField',
        id: 'testFieldId',
      } as ResizeInfo['meta'],
    };

    emitResizeEvent(
      S2Event.LAYOUT_RESIZE_MOUSE_DOWN,
      {
        offsetX: 10,
        offsetY: 20,
      },
      resizeInfo,
    );

    // show resize cursor
    expect(getResizeMask().attr('cursor')).toEqual('col-resize');

    emitResizeEvent(
      S2Event.LAYOUT_RESIZE_MOUSE_MOVE,
      {
        offsetX: 30,
        offsetY: 20,
      },
      resizeInfo,
    );

    emitResizeEvent(
      S2Event.GLOBAL_MOUSE_UP,
      {
        offsetX: 30,
        offsetY: 20,
      },
      resizeInfo,
    );

    // emit resize event
    const resizeDetail: ResizeParams = {
      info: resizeInfo,
      style: {
        colCell: {
          width: resizeInfo.resizedWidth!,
          widthByField: {
            [resizeInfo.meta.field!]: resizeInfo.resizedWidth!,
          },
        },
      },
    };

    expect(resize).toHaveBeenLastCalledWith(resizeDetail);
    expect(colWidthResize).toHaveBeenLastCalledWith(resizeDetail);

    // update style options
    expect(s2.options.style!.colCell).toMatchSnapshot();

    // mark resized flag for rerender
    expect(s2.store.get('resized')).toBeTruthy();

    // render
    expect(s2.render).toHaveBeenCalledTimes(1);

    // destroy resize reference group
    expect(rowColumnResizeInstance.resizeReferenceGroup).toBeNull();

    // reset resize position
    expect(rowColumnResizeInstance.resizeStartPosition).toEqual({});
  });

  test('should update resize guide line position when row cell mouse down', () => {
    const resizeInfo = {
      theme: {},
      type: ResizeDirectionType.Vertical,
      offsetX: 2,
      offsetY: 2,
      width: 5,
      height: 2,
      isResizeArea: true,
      effect: ResizeAreaEffect.Cell,
      size: 3,
    } as ResizeInfo;

    emitResizeEvent(
      S2Event.LAYOUT_RESIZE_MOUSE_DOWN,
      {
        offsetX: 10,
        offsetY: 20,
        clientX: 10,
        clientY: 20,
      },
      resizeInfo,
    );

    expect(rowColumnResizeInstance.resizeStartPosition).toStrictEqual({
      offsetY: 20,
      clientY: 20,
    });
    expect(getStartGuideLine().attr('path')).toStrictEqual([
      ['M', 2, 3.5],
      ['L', s2Options.width, 3.5],
    ]);
    expect(getEndGuideLine().attr('path')).toStrictEqual([
      ['M', 2, 2.5],
      ['L', s2Options.width, 2.5],
    ]);
  });

  test('should rerender by resize row cell', () => {
    const resize = jest.fn();
    const rowWidthResize = jest.fn();

    s2.on(S2Event.LAYOUT_RESIZE, resize);
    s2.on(S2Event.LAYOUT_RESIZE_ROW_HEIGHT, rowWidthResize);

    const resizeInfo: ResizeInfo = {
      theme: {},
      type: ResizeDirectionType.Vertical,
      offsetX: 2,
      offsetY: 2,
      width: 5,
      height: 2,
      isResizeArea: true,
      effect: ResizeAreaEffect.Cell,
      resizedWidth: 0,
      resizedHeight: 2,
      size: 3,
      meta: {
        field: 'testField',
      } as Node,
    };

    emitResizeEvent(
      S2Event.LAYOUT_RESIZE_MOUSE_DOWN,
      {
        offsetX: 10,
        offsetY: 20,
      },
      resizeInfo,
    );

    // show resize cursor
    expect(getResizeMask().attr('cursor')).toEqual('row-resize');

    emitResizeEvent(
      S2Event.GLOBAL_MOUSE_UP,
      {
        offsetX: 30,
        offsetY: 30,
      },
      resizeInfo,
    );

    // emit resize event
    const resizeDetail: ResizeParams = {
      info: resizeInfo,
      style: {
        rowCell: {
          height: 2,
          heightByField: {
            [resizeInfo.meta.field!]: 2,
          },
        },
      },
    };

    expect(resize).toHaveBeenLastCalledWith(resizeDetail);
    expect(rowWidthResize).toHaveBeenLastCalledWith(resizeDetail);

    // update style options
    expect(s2.options.style!.rowCell).toMatchSnapshot();
    expect(s2.options.style!.dataCell).toMatchSnapshot();

    // mark resized flag for rerender
    expect(s2.store.get('resized')).toBeTruthy();

    // render
    expect(s2.render).toHaveBeenCalledTimes(1);

    // destroy resize reference group
    expect(rowColumnResizeInstance.resizeReferenceGroup).toBeNull();

    // reset resize position
    expect(rowColumnResizeInstance.resizeStartPosition).toEqual({});
  });

  test('should get horizontal cell resize style', () => {
    const resizeInfo = emitResize(
      ResizeDirectionType.Horizontal,
      ResizeAreaEffect.Cell,
    );

    expect(s2.options.style!.colCell!.widthByField).toEqual({
      [resizeInfo.meta.field!]: resizeInfo.width,
    });
  });

  test('should get horizontal tree resize style', () => {
    const resize = jest.fn();
    const treeWidthResize = jest.fn();

    s2.on(S2Event.LAYOUT_RESIZE_TREE_WIDTH, treeWidthResize);
    s2.on(S2Event.LAYOUT_RESIZE, resize);

    const resizeInfo = emitResize(
      ResizeDirectionType.Horizontal,
      ResizeAreaEffect.Tree,
    );

    const newResizeInfo: ResizeParams = {
      info: { ...resizeInfo, resizedWidth: 5, resizedHeight: 0 },
      style: {
        rowCell: {
          width: 5,
        },
      },
    };

    expect(resize).toHaveBeenCalledWith(newResizeInfo);
    expect(treeWidthResize).toHaveBeenCalledWith(newResizeInfo);
    expect(s2.options.style!.rowCell!.width).toEqual(resizeInfo.width);
  });

  test('should get horizontal filed resize style', () => {
    const resize = jest.fn();
    const rowWidthResize = jest.fn();

    s2.on(S2Event.LAYOUT_RESIZE_ROW_WIDTH, rowWidthResize);
    s2.on(S2Event.LAYOUT_RESIZE, resize);

    const resizeInfo = emitResize(
      ResizeDirectionType.Horizontal,
      ResizeAreaEffect.Field,
    );

    const newResizeInfo: ResizeParams = {
      info: { ...resizeInfo, resizedWidth: 5, resizedHeight: 0 },
      style: {
        rowCell: {
          widthByField: {
            [resizeInfo.meta.field!]: 5,
          },
        },
      },
    };

    expect(resize).toHaveBeenCalledWith(newResizeInfo);
    expect(rowWidthResize).toHaveBeenCalledWith(newResizeInfo);
    expect(s2.options.style!.rowCell!.widthByField).toEqual({
      [resizeInfo.meta.field!]: resizeInfo.width,
    });
  });

  test('should get horizontal series resize style', () => {
    const resize = jest.fn();
    const seriesWidthResize = jest.fn();

    s2.on(S2Event.LAYOUT_RESIZE_SERIES_WIDTH, seriesWidthResize);
    s2.on(S2Event.LAYOUT_RESIZE, resize);

    const resizeInfo = emitResize(
      ResizeDirectionType.Horizontal,
      ResizeAreaEffect.Series,
    );

    const newResizeInfo = {
      info: { ...resizeInfo, resizedWidth: 5, resizedHeight: 0 },
      style: undefined,
    };

    expect(resize).toHaveBeenCalledWith(newResizeInfo);
    expect(seriesWidthResize).toHaveBeenCalledWith(newResizeInfo);
    expect(s2.theme.rowCell!.seriesNumberWidth).toEqual(resizeInfo.width);
  });

  // https://github.com/antvis/S2/issues/1538
  test('should not reset theme palette after resize series', () => {
    const palette: ThemeCfg['palette'] = {
      basicColors: Array.from({ length: 10 }).fill('red') as string[],
      semanticColors: {
        red: 'red',
        green: 'green',
        yellow: 'yellow',
      },
    };

    s2.setThemeCfg({
      palette,
    });

    emitResize(ResizeDirectionType.Horizontal, ResizeAreaEffect.Series);

    expect(s2.theme.background!.color).toEqual('red');
  });

  test('should get vertical cell resize style', () => {
    emitResize(ResizeDirectionType.Vertical, ResizeAreaEffect.Cell);

    expect(s2.options.style!.rowCell).toMatchSnapshot();
    expect(s2.options.style!.colCell).toMatchSnapshot();
    expect(s2.options.style!.dataCell).toMatchSnapshot();
  });

  test('should get vertical filed resize style', () => {
    const resizeInfo = emitResize(
      ResizeDirectionType.Vertical,
      ResizeAreaEffect.Field,
    );

    expect(s2.options.style!.colCell!.heightByField).toEqual({
      [resizeInfo.meta.field!]: resizeInfo.height,
    });
  });

  test('should get vertical custom filed resize style', () => {
    jest.spyOn(s2, 'isCustomColumnFields').mockImplementationOnce(() => true);
    jest
      .spyOn(s2.facet, 'getColNodes')
      .mockImplementationOnce(() => [
        createMockCellInfo('test-a', { level: 0 }).getNode(),
        createMockCellInfo('test-b', { level: 0 }).getNode(),
        createMockCellInfo('test-c', { level: 1 }).getNode(),
      ]);

    const resizeInfo = emitResize(
      ResizeDirectionType.Vertical,
      ResizeAreaEffect.Field,
      { level: 0 },
    );

    // 获取同 level 的 style
    expect(s2.options.style!.colCell!.heightByField).toEqual({
      'test-a': resizeInfo.height,
      'test-b': resizeInfo.height,
    });
  });

  test('should not reset interaction and hidden tooltip when resize start', () => {
    const resizeInfo = {
      theme: {},
      type: ResizeDirectionType.Vertical,
      offsetX: 2,
      offsetY: 2,
      width: 5,
      height: 2,
      isResizeArea: true,
      effect: ResizeAreaEffect.Cell,
      size: 3,
    } as ResizeInfo;

    emitResizeEvent(
      S2Event.LAYOUT_RESIZE_MOUSE_DOWN,
      {
        offsetX: 10,
        offsetY: 20,
      },
      resizeInfo,
    );
    expect(s2.interaction.reset).toHaveBeenCalledTimes(0);
    expect(s2.hideTooltip).toHaveBeenCalledTimes(1);
  });

  test('should not update col width after resized if resize disabled', () => {
    s2.setOptions({
      interaction: {
        resize: {
          disable: () => true,
        },
      },
    });

    const resizeInfo = emitResize(
      ResizeDirectionType.Horizontal,
      ResizeAreaEffect.Field,
    );

    expect(s2.options.style!.rowCell!.widthByField).toEqual({
      [resizeInfo.meta.field!]: resizeInfo.width,
    });
  });

  test('should get horizontal filed resize style by field for current resize type', () => {
    s2.setOptions({
      interaction: {
        resize: {
          colResizeType: ResizeType.CURRENT,
        },
      },
    });

    emitResize(ResizeDirectionType.Horizontal, ResizeAreaEffect.Cell);

    expect(s2.options.style!.colCell).toMatchSnapshot();
  });

  test('should get vertical filed resize style by field for current resize type', () => {
    s2.setOptions({
      interaction: {
        resize: {
          rowResizeType: ResizeType.CURRENT,
        },
      },
    });

    emitResize(ResizeDirectionType.Vertical, ResizeAreaEffect.Cell);

    expect(s2.options.style!.rowCell).toMatchSnapshot();
  });

  test('should set no drop cursor and gray guide line if disable resize', () => {
    const disable = jest.fn(() => true);

    s2.setOptions({
      interaction: {
        resize: {
          disable,
        },
      },
    });

    const resizeInfo = {
      theme: {},
      type: ResizeDirectionType.Vertical,
      offsetX: 2,
      offsetY: 2,
      width: 5,
      height: 2,
      isResizeArea: true,
      effect: ResizeAreaEffect.Cell,
      resizedHeight: 0,
      resizedWidth: 0,
      size: 3,
    } as ResizeInfo;

    emitResizeEvent(
      S2Event.LAYOUT_RESIZE_MOUSE_DOWN,
      {
        offsetX: 10,
        offsetY: 20,
        clientX: 10,
        clientY: 20,
      },
      resizeInfo,
    );

    emitResizeEvent(
      S2Event.LAYOUT_RESIZE_MOUSE_MOVE,
      {
        offsetX: 20,
        offsetY: 20,
        clientX: 20,
        clientY: 20,
      },
      resizeInfo,
    );

    expect(getResizeMask().attr('cursor')).toEqual('no-drop');
    expect(getEndGuideLine().attr('stroke')).toEqual('rgba(0,0,0,0.25)');
    expect(disable).toHaveBeenCalledWith({
      ...resizeInfo,
      resizedWidth: 0,
      resizedHeight: 20,
    });

    emitResizeEvent(
      S2Event.GLOBAL_MOUSE_UP,
      {
        offsetX: 20,
        offsetY: 20,
      },
      resizeInfo,
    );

    expect(getResizeMask()).toBeFalsy();
  });

  test('should get vertical filed resize style for table mode', () => {
    jest.spyOn(s2, 'isTableMode').mockImplementationOnce(() => true);
    jest
      .spyOn(s2.facet, 'getColNodes')
      .mockImplementationOnce(() => [
        createMockCellInfo('test-a', { level: 0 }).getNode(),
        createMockCellInfo('test-b', { level: 0 }).getNode(),
        createMockCellInfo('test-c', { level: 0 }).getNode(),
      ]);

    const resizeInfo = emitResize(
      ResizeDirectionType.Vertical,
      ResizeAreaEffect.Field,
      { level: 0 },
    );

    // 所有子节点都应该被设置高度
    expect(s2.options.style!.colCell!.heightByField).toEqual({
      'test-a': resizeInfo.height,
      'test-b': resizeInfo.height,
      'test-c': resizeInfo.height,
    });
  });

  test('should get vertical filed resize style by rowId for table mode', () => {
    jest.spyOn(s2, 'isTableMode').mockImplementationOnce(() => true);

    emitResize(ResizeDirectionType.Vertical, ResizeAreaEffect.Cell);

    expect(s2.options.style!.rowCell).toMatchSnapshot();
  });

  test('should get horizontal filed resize style by field for current resize type and table mode', () => {
    s2.options.interaction = {
      resize: {
        colResizeType: ResizeType.CURRENT,
      },
    };
    jest.spyOn(s2, 'isTableMode').mockImplementationOnce(() => true);

    emitResize(ResizeDirectionType.Horizontal, ResizeAreaEffect.Cell);

    expect(s2.options.style!.colCell).toMatchSnapshot();
  });

  test('should get horizontal filed resize style by field for all resize type and table mode', () => {
    s2.options.interaction = {
      resize: {
        colResizeType: ResizeType.ALL,
      },
    };
    jest.spyOn(s2, 'isTableMode').mockImplementationOnce(() => true);

    emitResize(ResizeDirectionType.Horizontal, ResizeAreaEffect.Cell);

    expect(s2.options.style!.colCell).toMatchSnapshot();
  });

  // https://github.com/antvis/S2/issues/2574
  test('should get horizontal filed resize style by field for selected resize type', () => {
    s2.setOptions({
      interaction: {
        resize: {
          rowResizeType: ResizeType.SELECTED,
          colResizeType: ResizeType.SELECTED,
        },
      },
    });

    emitResize(ResizeDirectionType.Horizontal, ResizeAreaEffect.Cell);

    expect(s2.options.style!.colCell).toMatchSnapshot();
  });

  // https://github.com/antvis/S2/issues/2574
  test('should get vertical filed resize style by field for selected resize type', () => {
    s2.setOptions({
      interaction: {
        resize: {
          rowResizeType: ResizeType.SELECTED,
          colResizeType: ResizeType.SELECTED,
        },
      },
    });

    emitResize(ResizeDirectionType.Vertical, ResizeAreaEffect.Cell);

    expect(s2.options.style!.rowCell).toMatchSnapshot();
  });
});
