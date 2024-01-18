/* eslint-disable jest/no-conditional-expect */
import * as mockDataConfig from 'tests/data/simple-data.json';
import { createMockCellInfo, getContainer, sleep } from 'tests/util/helpers';
import { get } from 'lodash';
import { ScrollBar, ScrollType } from '../../src/ui/scrollbar';
import type { CellScrollPosition } from './../../src/common/interface/scroll';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import type {
  CellMeta,
  InteractionOptions,
  S2Options,
} from '@/common/interface';
import {
  InteractionStateName,
  InterceptType,
  LayoutWidthType,
  OriginEventType,
  S2Event,
  ScrollbarPositionType,
} from '@/common/constant';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hierarchyType: 'grid',
  // display scroll bar
  style: {
    colCell: {
      height: 60,
    },
    dataCell: {
      width: 100,
      height: 50,
    },
  },
};

describe('Scroll Tests', () => {
  let s2: SpreadSheet;
  let canvas: HTMLCanvasElement;

  const getScrollExpect = () => {
    const onScroll = jest.fn();
    const onRowScroll = jest.fn();

    s2.on(S2Event.GLOBAL_SCROLL, onScroll);
    s2.on(S2Event.ROW_CELL_SCROLL, onRowScroll);

    return () => {
      [onScroll, onRowScroll].forEach((handler) => {
        expect(handler).not.toHaveBeenCalled();
      });
    };
  };

  beforeEach(async () => {
    jest
      .spyOn(SpreadSheet.prototype, 'getCell')
      .mockImplementation(() => createMockCellInfo('testId').mockCell as any);

    s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);
    await s2.render();
    canvas = s2.getCanvasElement();
  });

  afterEach(() => {
    s2.destroy();
    canvas.remove();
  });

  test('should hide tooltip when start scroll', () => {
    const hideTooltipSpy = jest
      .spyOn(s2, 'hideTooltip')
      .mockImplementationOnce(() => {});

    canvas.dispatchEvent(new WheelEvent('wheel', { deltaX: 20, deltaY: 0 }));
    expect(hideTooltipSpy).toHaveBeenCalledTimes(1);
  });

  test('should clear hover timer when start scroll', () => {
    const clearHoverTimerSpy = jest
      .spyOn(s2.interaction, 'clearHoverTimer')
      .mockImplementationOnce(() => {});

    canvas.dispatchEvent(new WheelEvent('wheel', { deltaX: 20, deltaY: 0 }));
    expect(clearHoverTimerSpy).toHaveBeenCalledTimes(1);
  });

  test('should clear hover timer and hide tooltip when drag scroll bar', () => {
    const hideTooltipSpy = jest
      .spyOn(s2, 'hideTooltip')
      .mockImplementationOnce(() => {});

    const clearHoverTimerSpy = jest
      .spyOn(s2.interaction, 'clearHoverTimer')
      .mockImplementationOnce(() => {});

    s2.facet.hScrollBar.emit(ScrollType.ScrollChange, {
      offset: 10,
      updateThumbOffset: 10,
    });

    s2.facet.vScrollBar.emit(ScrollType.ScrollChange, {
      offset: 10,
      updateThumbOffset: 10,
    });

    expect(clearHoverTimerSpy).toHaveBeenCalledTimes(2);
    expect(hideTooltipSpy).toHaveBeenCalledTimes(2);
  });

  test('should not trigger scroll if not scroll over the viewport', () => {
    const expectScroll = getScrollExpect();

    canvas.dispatchEvent(
      new WheelEvent('wheel', { deltaX: 0, deltaY: 20, shiftKey: true }),
    );

    expect(s2.interaction.hasIntercepts([InterceptType.HOVER])).toBeFalsy();
    expectScroll();
  });

  test('should not trigger scroll if scroll over the corner header', () => {
    const expectScroll = getScrollExpect();

    canvas.dispatchEvent(
      new WheelEvent('wheel', {
        deltaX: 20,
        deltaY: 0,
      }),
    );

    expect(s2.interaction.hasIntercepts([InterceptType.HOVER])).toBeFalsy();
    expectScroll();
  });

  test('should scroll if scroll over the row cell', async () => {
    const position: CellScrollPosition = {
      rowHeaderScrollX: 0,
      scrollX: 20,
      scrollY: 0,
    };

    const onScroll = jest.fn();
    const onRowScroll = jest.fn();

    s2.on(S2Event.GLOBAL_SCROLL, onScroll);
    s2.on(S2Event.ROW_CELL_SCROLL, onRowScroll);

    s2.setOptions({ frozen: { rowHeader: true } });
    await s2.render(false);

    // 模拟在行头滚动
    jest
      .spyOn(s2.facet, 'isScrollOverTheCornerArea')
      .mockImplementationOnce(() => true);
    jest
      .spyOn(s2.facet, 'isScrollOverTheViewport')
      .mockImplementationOnce(() => true);

    const wheelEvent = new WheelEvent('wheel', {
      deltaX: position.scrollX,
      deltaY: position.scrollY,
    });

    canvas.dispatchEvent(wheelEvent);

    // wait requestAnimationFrame
    await sleep(200);

    // emit event
    expect(onRowScroll).toHaveBeenCalled();
    expect(onScroll).toHaveBeenCalled();
  });

  test.each([
    {
      type: 'horizontal',
      offset: {
        scrollX: 20,
        scrollY: 0,
      },
      rowHeader: true,
    },
    {
      type: 'vertical',
      offset: {
        scrollX: 0,
        scrollY: 20,
      },
      rowHeader: true,
    },
    {
      type: 'horizontal',
      offset: {
        scrollX: 20,
        scrollY: 0,
      },
      rowHeader: false,
    },
    {
      type: 'vertical',
      offset: {
        scrollX: 0,
        scrollY: 20,
      },
      rowHeader: false,
    },
  ])(
    'should scroll if scroll over the panel viewport by %o',
    async ({ type, offset, rowHeader }) => {
      const onScroll = jest.fn();
      const onRowScroll = jest.fn();

      s2.on(S2Event.GLOBAL_SCROLL, onScroll);
      s2.on(S2Event.ROW_CELL_SCROLL, onRowScroll);

      // toggle rowHeader mode
      s2.setOptions({ frozen: { rowHeader } });
      await s2.render(false);

      const showHorizontalScrollBarSpy = jest
        .spyOn(s2.facet, 'showHorizontalScrollBar')
        .mockImplementationOnce(() => {});

      const showVerticalScrollBarSpy = jest
        .spyOn(s2.facet, 'showVerticalScrollBar')
        .mockImplementationOnce(() => {});

      // mock over the panel viewport
      s2.facet.cornerBBox.maxY = -9999;
      s2.facet.panelBBox.minX = -9999;
      s2.facet.panelBBox.minY = -9999;
      jest
        .spyOn(s2.facet, 'isScrollOverTheViewport')
        .mockImplementationOnce(() => true);

      const wheelEvent = new WheelEvent('wheel', {
        deltaX: offset.scrollX,
        deltaY: offset.scrollY,
      });

      canvas.dispatchEvent(wheelEvent);

      // disable hover event
      expect(s2.interaction.hasIntercepts([InterceptType.HOVER])).toBeTruthy();

      // wait requestAnimationFrame
      await sleep(200);

      // emit event
      expect(onScroll).toHaveBeenCalled();
      expect(onRowScroll).not.toHaveBeenCalled();

      if (rowHeader) {
        // show scrollbar
        expect(
          type === 'vertical'
            ? showVerticalScrollBarSpy
            : showHorizontalScrollBarSpy,
        ).toHaveBeenCalled();
        expect(
          type === 'vertical'
            ? showHorizontalScrollBarSpy
            : showVerticalScrollBarSpy,
        ).not.toHaveBeenCalled();
      }
    },
  );

  test.each([
    {
      type: 'horizontal',
      offset: {
        scrollX: 20,
        scrollY: 0,
      },
    },
    {
      type: 'vertical',
      offset: {
        scrollX: 0,
        scrollY: 20,
      },
    },
  ])(
    'should disable scroll if no scroll bar and scroll over the panel viewport by %o',
    async ({ offset }) => {
      // hide scroll bar
      s2.changeSheetSize(1000, 300);
      await s2.render(false);

      const showHorizontalScrollBarSpy = jest
        .spyOn(s2.facet, 'showHorizontalScrollBar')
        .mockImplementation(() => {});

      const showVerticalScrollBarSpy = jest
        .spyOn(s2.facet, 'showVerticalScrollBar')
        .mockImplementation(() => {});

      const expectScroll = getScrollExpect();

      s2.facet.cornerBBox.maxY = -9999;
      s2.facet.panelBBox.minX = -9999;
      s2.facet.panelBBox.minY = -9999;

      const wheelEvent = new WheelEvent('wheel', {
        deltaX: offset.scrollX,
        deltaY: offset.scrollY,
      });

      canvas.dispatchEvent(wheelEvent);

      // disable hover event
      expect(s2.interaction.hasIntercepts([InterceptType.HOVER])).toBeFalsy();

      // wait requestAnimationFrame
      await sleep(200);

      expect(showHorizontalScrollBarSpy).not.toHaveBeenCalled();
      expect(showVerticalScrollBarSpy).not.toHaveBeenCalled();

      await sleep(200);

      // not emit scroll event
      expectScroll();
    },
  );

  // https://github.com/antvis/S2/issues/904
  test.each([
    {
      type: 'horizontal',
      offset: {
        scrollX: 20,
        scrollY: 0,
      },
    },
    {
      type: 'vertical',
      offset: {
        scrollX: 0,
        scrollY: 20,
      },
    },
  ])(
    'should not clear selected cells when hover cells after scroll by %o',
    async ({ offset }) => {
      const dataCellHover = jest.fn();

      const cellA = createMockCellInfo('cell-a');
      const cellB = createMockCellInfo('cell-b');

      s2.on(S2Event.DATA_CELL_HOVER, dataCellHover);

      s2.facet.cornerBBox.maxY = -9999;
      s2.facet.panelBBox.minX = -9999;
      s2.facet.panelBBox.minY = -9999;

      // selected cells
      s2.interaction.changeState({
        stateName: InteractionStateName.SELECTED,
        cells: [cellA.mockCellMeta, cellB.mockCellMeta] as CellMeta[],
      });

      const wheelEvent = new WheelEvent('wheel', {
        deltaX: offset.scrollX,
        deltaY: offset.scrollY,
      });

      canvas.dispatchEvent(wheelEvent);

      // wait requestAnimationFrame and debounce
      await sleep(1000);

      // emit global canvas hover
      s2.container.emit(OriginEventType.MOUSE_MOVE, { target: {} });

      expect(s2.interaction.getState()).toEqual({
        stateName: InteractionStateName.SELECTED,
        cells: [cellA.mockCellMeta, cellB.mockCellMeta],
      });
    },
  );

  // https://github.com/antvis/S2/issues/2222
  test.each([
    {
      type: 'horizontal',
      offset: {
        scrollX: 20,
        scrollY: 0,
      },
    },
    {
      type: 'vertical',
      offset: {
        scrollX: 0,
        scrollY: 20,
      },
    },
  ])(
    'should trigger hover cells when hover cells after scroll by %o',
    async ({ offset }) => {
      s2.setOptions({
        interaction: {
          hoverAfterScroll: true,
        },
      });

      s2.facet.cornerBBox.maxY = -9999;
      s2.facet.panelBBox.minX = -9999;
      s2.facet.panelBBox.minY = -9999;

      const bbox = s2.getCanvasElement().getBoundingClientRect();
      const mousemoveEvent = new MouseEvent(OriginEventType.POINTER_MOVE, {
        clientX: bbox.left + 100,
        clientY: bbox.top + 100,
      });

      canvas.dispatchEvent(mousemoveEvent);

      s2.container.emit = jest.fn();

      const wheelEvent = new WheelEvent('wheel', {
        deltaX: offset.scrollX,
        deltaY: offset.scrollY,
      });

      canvas.dispatchEvent(wheelEvent);

      // wait requestAnimationFrame and debounce
      await sleep(1000);

      expect(s2.container.emit).toHaveBeenCalledWith(
        OriginEventType.POINTER_MOVE,
        expect.any(Object),
      );
    },
  );

  test('should not trigger scroll event on passive renders', async () => {
    const sheet = new PivotSheet(getContainer(), mockDataConfig, {
      ...s2Options,
    });

    await sheet.render();

    jest.spyOn(sheet.facet as any, 'dynamicRenderCell');
    jest.spyOn(sheet.facet as any, 'emitScrollEvent');

    sheet.facet.startScroll(true);

    expect((sheet.facet as any).dynamicRenderCell).toHaveBeenCalledWith(true);
    expect((sheet.facet as any).emitScrollEvent).not.toHaveBeenCalled();
  });

  test('should render correct scroll position', async () => {
    s2.setOptions({
      interaction: {
        scrollbarPosition: ScrollbarPositionType.CONTENT,
      },
      style: {
        layoutWidthType: LayoutWidthType.Compact,
      },
    });
    s2.changeSheetSize(100, 1000); // 横向滚动条
    await s2.render(false);

    expect(s2.facet.hScrollBar.getBBox().y).toBe(225);
    expect(s2.facet.hRowScrollBar.getBBox().y).toBe(225);

    s2.changeSheetSize(1000, 150); // 纵向滚动条
    await s2.render(false);

    expect(Math.floor(s2.facet.vScrollBar.getBBox().x)).toEqual(195);

    s2.setOptions({
      interaction: {
        scrollbarPosition: ScrollbarPositionType.CANVAS,
      },
    });
    s2.changeSheetSize(100, 1000); // 横向滚动条
    await s2.render(false);

    expect(s2.facet.hScrollBar.getBBox().y).toBe(997);
    expect(s2.facet.hRowScrollBar.getBBox().y).toBe(997);

    s2.changeSheetSize(1000, 200); // 纵向滚动条
    await s2.render(false);

    expect(s2.facet.vScrollBar.getBBox().x).toBe(997);
  });

  // https://github.com/antvis/S2/issues/1659
  test.each([
    {
      name: 'hRowScrollBar',
      key: 'width',
    },
    {
      name: 'hScrollBar',
      key: 'width',
    },
    {
      name: 'vScrollBar',
      key: 'height',
    },
  ] as const)(
    'should render scroll bar real size by canvas BBox',
    async ({ name, key }) => {
      s2.changeSheetSize(200, 200); // 显示横/竖滚动条
      await s2.render(false);

      const scrollBar = s2.facet[name];

      const position = scrollBar['getCoordinatesWithBBoxExtraPadding']();

      expect(
        Math.round(scrollBar.thumbShape.getBBox()[key] as number),
      ).toStrictEqual(Math.round(position.end - position.start));
    },
  );

  test('should render scroll bar does not appear outside the canvas', async () => {
    s2.changeSheetSize(200, 200); // 显示横/竖滚动条
    await s2.render(false);

    s2.updateScrollOffset({
      offsetX: {
        value: 999,
      },
      offsetY: {
        value: 999,
      },
    });

    const { hScrollBar, vScrollBar, panelBBox } = s2.facet;

    expect(
      hScrollBar.thumbLen + hScrollBar.thumbOffset + panelBBox.minX,
    ).toStrictEqual(panelBBox.maxX);
    expect(
      vScrollBar.thumbLen + vScrollBar.thumbOffset + panelBBox.minY,
    ).toStrictEqual(panelBBox.maxY);
  });

  test('should trigger scroll if only contain row header scrollbar', async () => {
    s2.setOptions({
      frozen: {
        rowHeader: true,
      },
      style: {
        layoutWidthType: LayoutWidthType.Compact,
        rowCell: {
          width: 200,
        },
      },
    });

    const onRowCellScroll = jest.fn();

    s2.changeSheetSize(400, 300);
    await s2.render(false);

    jest
      .spyOn(s2.facet, 'isScrollOverTheCornerArea')
      .mockImplementationOnce(() => true);
    jest
      .spyOn(s2.facet, 'isScrollOverTheViewport')
      .mockImplementationOnce(() => true);

    s2.on(S2Event.ROW_CELL_SCROLL, onRowCellScroll);

    const wheelEvent = new WheelEvent('wheel', {
      deltaX: 20,
      deltaY: 0,
    });

    canvas.dispatchEvent(wheelEvent);

    await sleep(200);

    expect(onRowCellScroll).toHaveBeenCalled();
  });

  describe('Scroll Overscroll Behavior Tests', () => {
    const defaultOffset = {
      scrollX: 10,
      scrollY: 10,
    };

    const getConfig = (
      isScrollOverTheViewport: boolean,
      stopScrollChainingTimes: number,
    ) => {
      return {
        isScrollOverTheViewport,
        stopScrollChainingTimes,
        offset: defaultOffset,
      };
    };

    beforeEach(() => {
      document.body.style.overscrollBehavior = '';
      document.body.style.height = '2000px';
      document.body.style.width = '2000px';

      s2.facet.cornerBBox.maxY = -9999;
      s2.facet.panelBBox.minX = -9999;
      s2.facet.panelBBox.minY = -9999;

      window.scrollTo(0, 0);
    });

    it.each([
      {
        overscrollBehavior: 'auto',
        ...getConfig(false, 0),
      },
      {
        overscrollBehavior: 'auto',
        ...getConfig(true, 1),
      },
      {
        overscrollBehavior: 'none',
        ...getConfig(false, 1),
      },
      {
        overscrollBehavior: 'none',
        ...getConfig(true, 1),
      },
      {
        overscrollBehavior: 'contain',
        ...getConfig(false, 1),
      },
      {
        overscrollBehavior: 'contain',
        ...getConfig(true, 1),
      },
    ])(
      'should scroll by overscroll behavior %o',
      async ({
        overscrollBehavior,
        isScrollOverTheViewport,
        stopScrollChainingTimes,
        offset,
      }) => {
        s2.setOptions({
          interaction: {
            overscrollBehavior:
              overscrollBehavior as InteractionOptions['overscrollBehavior'],
          },
        });
        await s2.render(false);

        jest
          .spyOn(s2.facet, 'isScrollOverTheViewport')
          .mockImplementationOnce(() => isScrollOverTheViewport);

        const stopScrollChainingSpy = jest
          .spyOn(s2.facet, 'stopScrollChaining' as any)
          .mockImplementation(() => null);

        const wheelEvent = new WheelEvent('wheel', {
          deltaX: offset.scrollX,
          deltaY: offset.scrollY,
        });

        canvas.dispatchEvent(wheelEvent);

        expect(stopScrollChainingSpy).toHaveBeenCalledTimes(
          stopScrollChainingTimes,
        );

        stopScrollChainingSpy.mockRestore();
      },
    );

    it('should not add property to body when render and destroyed if overscrollBehavior is null', async () => {
      const sheet = new PivotSheet(getContainer(), mockDataConfig, {
        ...s2Options,
        interaction: {
          overscrollBehavior: null,
        },
      });

      await sheet.render();

      expect(
        document.body.style.getPropertyValue('overscroll-behavior'),
      ).toBeFalsy();

      sheet.destroy();

      expect(
        document.body.style.getPropertyValue('overscroll-behavior'),
      ).toBeFalsy();
    });

    test('should scroll horizontally when shift key is held on Windows', async () => {
      s2.setOptions({
        frozen: {
          rowHeader: true,
        },
        style: {
          layoutWidthType: LayoutWidthType.Compact,
          rowCell: {
            width: 200,
          },
        },
      });

      const onScroll = jest.fn((...args) => {
        expect(args[0].rowHeaderScrollX).toBeGreaterThan(0);
        expect(args[0].scrollX).toBe(0);
        expect(args[0].scrollY).toBe(0);
      });

      s2.changeSheetSize(400, 300);
      await s2.render(false);

      jest
        .spyOn(s2.facet, 'isScrollOverTheCornerArea')
        .mockImplementationOnce(() => true);
      jest
        .spyOn(s2.facet, 'isScrollOverTheViewport')
        .mockImplementationOnce(() => true);

      s2.on(S2Event.GLOBAL_SCROLL, onScroll);

      const wheelEvent = new WheelEvent('wheel', {
        deltaX: 0,
        deltaY: 20,
        shiftKey: true,
      });

      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Windows',
        configurable: true,
        writable: true,
      });

      canvas.dispatchEvent(wheelEvent);
      await sleep(200);
      expect(onScroll).toHaveBeenCalled();
    });

    test('should not scroll horizontally when shift key is held on macOS', async () => {
      const onScroll = jest.fn((...args) => {
        expect(args[0].rowHeaderScrollX).toBeGreaterThan(0);
        expect(args[0].scrollX).toBe(0);
        expect(args[0].scrollY).toBe(0);
      });

      const wheelEvent = new WheelEvent('wheel', {
        deltaX: 0,
        deltaY: 20,
        shiftKey: true,
      });

      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mac OS',
        configurable: true,
        writable: true,
      });

      canvas.dispatchEvent(wheelEvent);
      await sleep(200);
      expect(onScroll).not.toHaveBeenCalled();
    });

    it('should not change init body overscrollBehavior style when render and destroyed', async () => {
      document.body.style.overscrollBehavior = 'none';

      const sheet = new PivotSheet(getContainer(), mockDataConfig, {
        ...s2Options,
        interaction: {
          overscrollBehavior: 'contain',
        },
      });

      await sheet.render();

      expect(sheet.store.get('initOverscrollBehavior')).toEqual('none');
      expect(document.body.style.overscrollBehavior).toEqual('none');

      sheet.destroy();

      expect(document.body.style.overscrollBehavior).toEqual('none');
    });

    it.each([
      'auto',
      'contain',
      'none',
    ] as InteractionOptions['overscrollBehavior'][])(
      'should add %s property to body',
      async (overscrollBehavior) => {
        document.body.style.overscrollBehavior = '';

        const sheet = new PivotSheet(getContainer(), mockDataConfig, {
          ...s2Options,
          interaction: {
            overscrollBehavior,
          },
        });

        await sheet.render();

        expect(sheet.store.get('initOverscrollBehavior')).toBeUndefined();
        expect(document.body.style.overscrollBehavior).toEqual(
          overscrollBehavior,
        );

        sheet.destroy();
        expect(document.body.style.overscrollBehavior).toBeFalsy();
      },
    );
  });

  // https://github.com/antvis/S2/issues/1784
  test('should not throw error if scroll over the data cell area and not exist scroll bar', async () => {
    // rowCell 显示滚动条, dataCell 无滚动条, 然后在 dataCell 区域滚动
    s2.setOptions({
      style: {
        rowCell: {
          width: 200,
        },
        dataCell: {
          width: 30,
        },
      },
    });

    await s2.render(false);

    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementationOnce(() => {});

    // dataCell 区域滚动
    const wheelEvent = new WheelEvent('wheel', {
      deltaX: 20,
      deltaY: 0,
      clientX: 225,
      clientY: 1019,
    });

    canvas.dispatchEvent(wheelEvent);

    await sleep(500);

    expect(errorSpy).not.toHaveBeenCalled();
  });

  // https://github.com/antvis/S2/issues/2316
  test('should not throw infinite error if spreadsheet is unmounted during scrolling', async () => {
    s2.setOptions({
      style: {
        rowCell: {
          width: 200,
        },
        dataCell: {
          width: 30,
        },
      },
    });

    await s2.render(false);

    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementationOnce(() => {});

    // 滚动时 unmount 表格实例
    s2.facet.scrollWithAnimation(
      {
        offsetX: {
          value: 10,
          animate: true,
        },
        offsetY: {
          value: 10,
          animate: true,
        },
      },
      200,
    );
    s2.destroy();

    await sleep(500);

    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  // https://github.com/antvis/S2/issues/2376
  test.each(['hScrollBar', 'hRowScrollBar'])(
    'should not reset interaction state after %s scrollbar thumb or track clicked',
    (scrollbarName) => {
      const isMatchElementSpy = jest
        .spyOn(s2.interaction.eventController, 'isMatchElement')
        .mockImplementation(() => true);

      const reset = jest.fn();

      const scrollbar = get(s2.facet, scrollbarName) as ScrollBar;
      const colCell = s2.facet.getColLeafCells()[0]!;

      s2.on(S2Event.GLOBAL_RESET, reset);
      s2.interaction.selectHeaderCell({
        cell: colCell,
      });

      expect(s2.interaction.isSelectedState()).toBeTruthy();

      const { maxX, maxY } = s2.facet?.panelBBox || {};
      const { x, y } = canvas.getBoundingClientRect() || {};

      // 滚动条
      window.dispatchEvent(
        new MouseEvent('click', {
          clientX: x + scrollbar.position.x,
          // 在滚动条内点击
          clientY: y + scrollbar.position.y + scrollbar!.theme!.size! - 2,
        } as MouseEventInit),
      );

      // 滑动轨道
      window.dispatchEvent(
        new MouseEvent('click', {
          // 右下角滑道点击
          clientX: x + maxX - 2,
          clientY: y + maxY + 2,
        } as MouseEventInit),
      );

      expect(s2.interaction.isSelectedState()).toBeTruthy();
      expect(reset).not.toHaveBeenCalled();

      isMatchElementSpy.mockClear();
    },
  );
});
