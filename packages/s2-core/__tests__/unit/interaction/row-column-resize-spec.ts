import { BBox, Group, IShape, ShapeAttrs } from '@antv/g-canvas';
import { pick } from 'lodash';
import { RootInteraction } from '@/interaction/root';
import {
  PivotSheet,
  ResizeAreaEffect,
  ResizeDirectionType,
  ResizeInfo,
  RESIZE_END_GUIDE_LINE_ID,
  RESIZE_MASK_ID,
  RESIZE_START_GUIDE_LINE_ID,
  RowColumnResize,
  S2Event,
  S2Options,
  SpreadSheet,
} from '@/index';
import { BaseFacet } from '@/facet/base-facet';

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
  };

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

  const getStartGuideLine = () => {
    return rowColumnResizeInstance.resizeReferenceGroup.findById(
      RESIZE_START_GUIDE_LINE_ID,
    ) as IShape;
  };

  const getEndGuideLine = () => {
    return rowColumnResizeInstance.resizeReferenceGroup.findById(
      RESIZE_END_GUIDE_LINE_ID,
    ) as IShape;
  };

  const getResizeMask = () => {
    return rowColumnResizeInstance.resizeReferenceGroup.findById(
      RESIZE_MASK_ID,
    ) as IShape;
  };

  const emitResize = (
    directionType: ResizeDirectionType,
    effect: ResizeAreaEffect,
  ) => {
    const resizeInfo = {
      theme: {},
      type: directionType,
      offsetX: 2,
      offsetY: 2,
      width: 5,
      height: 2,
      isResizeArea: true,
      effect,
      id: 'testId',
    } as ResizeInfo;

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

    s2 = new PivotSheet(document.createElement('div'), null, s2Options);
    mockRootInteraction = new MockRootInteraction(s2);
    s2.facet = {
      panelBBox: {
        maxX: s2Options.width,
        maxY: s2Options.height,
      } as BBox,
      destroy: jest.fn(),
      render: jest.fn(),
    } as unknown as BaseFacet;
    s2.foregroundGroup = new Group('');
    s2.interaction = mockRootInteraction;
    rowColumnResizeInstance = new RowColumnResize(s2);
    s2.render = jest.fn();
    s2.tooltip.container = document.createElement('div');
    s2.hideTooltip = jest.fn();
  });

  test('should register events', () => {
    expect(rowColumnResizeInstance.bindEvents).toBeDefined();
  });

  test('should init resize group', () => {
    emitResizeEvent(S2Event.LAYOUT_RESIZE_MOUSE_DOWN, {});

    const guideLineAttrs: ShapeAttrs = {
      lineDash: [3, 3],
      stroke: '#326EF4',
      strokeWidth: 3,
      fillOpacity: 1,
    };

    const maskAttrs: ShapeAttrs = {
      appendInfo: {
        isResizeArea: true,
      },
      x: 0,
      y: 0,
      width: s2Options.width,
      height: s2Options.height,
      fill: 'transparent',
    };

    const pickAttrs = (attrs: ShapeAttrs) =>
      pick(attrs, Object.keys(guideLineAttrs));

    const pickMaskAttrs = (attrs: ShapeAttrs) =>
      pick(attrs, Object.keys(maskAttrs));

    const resizeMask =
      rowColumnResizeInstance.resizeReferenceGroup.findById(RESIZE_MASK_ID);

    const startGuideLine = getStartGuideLine();
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
    expect(pickAttrs(startGuideLine.attr())).toEqual(guideLineAttrs);
    expect(pickAttrs(endGuideLine.attr())).toEqual(guideLineAttrs);
    expect(pickMaskAttrs(resizeMask.attr())).toEqual(maskAttrs);
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
      id: '',
    } as ResizeInfo;
    emitResizeEvent(
      S2Event.LAYOUT_RESIZE_MOUSE_DOWN,
      {
        offsetX: 10,
        offsetY: 20,
      },
      resizeInfo,
    );

    expect(s2.store.get('resized')).toBeFalsy();
    expect(rowColumnResizeInstance.resizeStartPosition).toStrictEqual({
      offsetX: 10,
    });
    expect(getStartGuideLine().attr('path')).toStrictEqual([
      ['M', 2, 2],
      ['L', 2, s2Options.height],
    ]);
    expect(getEndGuideLine().attr('path')).toStrictEqual([
      ['M', 7, 2],
      ['L', 7, s2Options.height],
    ]);
  });

  test('should rerender by resize col cell', () => {
    const resize = jest.fn();
    const colWidthResize = jest.fn();

    s2.on(S2Event.LAYOUT_RESIZE, resize);
    s2.on(S2Event.LAYOUT_RESIZE_COL_WIDTH, colWidthResize);

    const resizeInfo = {
      theme: {},
      type: ResizeDirectionType.Horizontal,
      offsetX: 2,
      offsetY: 2,
      width: 5,
      height: 2,
      isResizeArea: true,
      effect: ResizeAreaEffect.Cell,
      id: '',
    } as ResizeInfo;

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
      S2Event.GLOBAL_MOUSE_UP,
      {
        offsetX: 30,
        offsetY: 20,
      },
      resizeInfo,
    );

    // emit resize event
    const resizeDetail = {
      info: resizeInfo,
      style: {
        colCfg: {
          widthByFieldValue: {
            [resizeInfo.id]: 5,
          },
        },
      },
    };
    expect(resize).toHaveBeenLastCalledWith(resizeDetail);
    expect(colWidthResize).toHaveBeenLastCalledWith(resizeDetail);

    // update style options
    expect(s2.options.style.colCfg).toEqual({
      height: 30,
      heightByField: {},
      widthByFieldValue: {
        [resizeInfo.id]: 5,
      },
    });

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
      id: '',
    } as ResizeInfo;
    emitResizeEvent(
      S2Event.LAYOUT_RESIZE_MOUSE_DOWN,
      {
        offsetX: 10,
        offsetY: 20,
      },
      resizeInfo,
    );

    expect(rowColumnResizeInstance.resizeStartPosition).toStrictEqual({
      offsetY: 20,
    });
    expect(getStartGuideLine().attr('path')).toStrictEqual([
      ['M', 2, 2],
      ['L', s2Options.width, 2],
    ]);
    expect(getEndGuideLine().attr('path')).toStrictEqual([
      ['M', 2, 4],
      ['L', s2Options.width, 4],
    ]);
  });

  test('should rerender by resize row cell', () => {
    const resize = jest.fn();
    const rowWidthResize = jest.fn();

    s2.on(S2Event.LAYOUT_RESIZE, resize);
    s2.on(S2Event.LAYOUT_RESIZE_ROW_HEIGHT, rowWidthResize);

    const resizeInfo = {
      theme: {},
      type: ResizeDirectionType.Vertical,
      offsetX: 2,
      offsetY: 2,
      width: 5,
      height: 2,
      isResizeArea: true,
      effect: ResizeAreaEffect.Cell,
      id: '',
    } as ResizeInfo;

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
    const resizeDetail = {
      info: resizeInfo,
      style: {
        cellCfg: {
          height: 2,
        },
      },
    };
    expect(resize).toHaveBeenLastCalledWith(resizeDetail);
    expect(rowWidthResize).toHaveBeenLastCalledWith(resizeDetail);

    // update style options
    expect(s2.options.style.cellCfg).toEqual({
      width: 96,
      height: 2,
    });

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

    expect(s2.options.style.colCfg.widthByFieldValue).toEqual({
      [resizeInfo.id]: resizeInfo.width,
    });
  });

  test('should get horizontal tree resize style', () => {
    const resizeInfo = emitResize(
      ResizeDirectionType.Horizontal,
      ResizeAreaEffect.Tree,
    );

    expect(s2.options.style.rowCfg.treeRowsWidth).toEqual(resizeInfo.width);
  });

  test('should get horizontal filed resize style', () => {
    const resizeInfo = emitResize(
      ResizeDirectionType.Horizontal,
      ResizeAreaEffect.Field,
    );

    expect(s2.options.style.rowCfg.widthByField).toEqual({
      [resizeInfo.id]: resizeInfo.width,
    });
  });

  test('should get horizontal series resize style', () => {
    const resizeInfo = emitResize(
      ResizeDirectionType.Horizontal,
      ResizeAreaEffect.Series,
    );

    expect(s2.theme.rowCell.seriesNumberWidth).toEqual(resizeInfo.width);
  });

  test('should get vertical cell resize style', () => {
    const resizeInfo = emitResize(
      ResizeDirectionType.Vertical,
      ResizeAreaEffect.Cell,
    );

    expect(s2.options.style.cellCfg).toEqual({
      width: 96,
      height: resizeInfo.height,
    });
  });

  test('should get vertical filed resize style', () => {
    const resizeInfo = emitResize(
      ResizeDirectionType.Vertical,
      ResizeAreaEffect.Field,
    );

    expect(s2.options.style.colCfg.heightByField).toEqual({
      [resizeInfo.id]: resizeInfo.height,
    });
  });

  test('should hidden tooltip when resize start', () => {
    const resizeInfo = {
      theme: {},
      type: ResizeDirectionType.Vertical,
      offsetX: 2,
      offsetY: 2,
      width: 5,
      height: 2,
      isResizeArea: true,
      effect: ResizeAreaEffect.Cell,
      id: '',
    } as ResizeInfo;

    emitResizeEvent(
      S2Event.LAYOUT_RESIZE_MOUSE_DOWN,
      {
        offsetX: 10,
        offsetY: 20,
      },
      resizeInfo,
    );
    expect(s2.hideTooltip).toHaveBeenCalledTimes(1);
  });
});
