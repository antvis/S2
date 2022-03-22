/* eslint-disable jest/no-conditional-expect */
import * as mockDataConfig from 'tests/data/simple-data.json';
import { createMockCellInfo, getContainer, sleep } from 'tests/util/helpers';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import { CellMeta, S2Options } from '@/common/interface';
import {
  InteractionStateName,
  InterceptType,
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
    colCfg: {
      height: 60,
    },
    cellCfg: {
      width: 100,
      height: 50,
    },
  },
};

describe('Scroll By Group Tests', () => {
  let s2: SpreadSheet;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    jest
      .spyOn(SpreadSheet.prototype, 'getCell')
      .mockImplementation(() => createMockCellInfo('testId').mockCell as any);

    s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);
    s2.render();
    canvas = s2.container.get('el') as HTMLCanvasElement;
  });

  afterEach(() => {
    s2 = null;
    canvas = null;
  });

  test('should hide tooltip when start scroll', () => {
    const hideTooltipSpy = jest
      .spyOn(s2, 'hideTooltip')
      .mockImplementation(() => {});

    canvas.dispatchEvent(new WheelEvent('wheel', { deltaX: 20, deltaY: 0 }));
    expect(hideTooltipSpy).toHaveBeenCalledTimes(1);
  });

  test('should clear hover timer when start scroll', () => {
    const clearHoverTimerSpy = jest
      .spyOn(s2.interaction, 'clearHoverTimer')
      .mockImplementation(() => {});

    canvas.dispatchEvent(new WheelEvent('wheel', { deltaX: 20, deltaY: 0 }));
    expect(clearHoverTimerSpy).toHaveBeenCalledTimes(1);
  });

  test('should not trigger scroll if not scroll over the viewport', () => {
    const onScroll = jest.fn();
    s2.on(S2Event.LAYOUT_CELL_SCROLL, onScroll);

    canvas.dispatchEvent(new WheelEvent('wheel', { deltaX: 20, deltaY: 20 }));

    expect(s2.interaction.hasIntercepts([InterceptType.HOVER])).toBeFalsy();
    expect(onScroll).not.toHaveBeenCalled();
  });

  test('should not trigger scroll if scroll over the corner header', () => {
    const onScroll = jest.fn();
    s2.on(S2Event.LAYOUT_CELL_SCROLL, onScroll);

    canvas.dispatchEvent(
      new WheelEvent('wheel', {
        deltaX: 20,
        deltaY: 0,
      }),
    );

    expect(s2.interaction.hasIntercepts([InterceptType.HOVER])).toBeFalsy();
    expect(onScroll).not.toHaveBeenCalled();
  });

  test.each([
    {
      type: 'horizontal',
      offset: {
        scrollX: 20,
        scrollY: 0,
      },
      frozenRowHeader: true,
    },
    {
      type: 'vertical',
      offset: {
        scrollX: 0,
        scrollY: 20,
      },
      frozenRowHeader: true,
    },
    {
      type: 'horizontal',
      offset: {
        scrollX: 20,
        scrollY: 0,
      },
      frozenRowHeader: false,
    },
    {
      type: 'vertical',
      offset: {
        scrollX: 0,
        scrollY: 20,
      },
      frozenRowHeader: false,
    },
  ])(
    'should scroll if scroll over the panel viewport by %o',
    async ({ type, offset, frozenRowHeader }) => {
      // toggle frozenRowHeader mode
      s2.setOptions({ frozenRowHeader });
      s2.render(false);

      const showHorizontalScrollBarSpy = jest
        .spyOn(s2.facet, 'showHorizontalScrollBar')
        .mockImplementation(() => {});

      const showVerticalScrollBarSpy = jest
        .spyOn(s2.facet, 'showVerticalScrollBar')
        .mockImplementation(() => {});

      // mock over the panel viewport
      s2.facet.cornerBBox.maxY = -9999;
      s2.facet.panelBBox.minX = -9999;
      s2.facet.panelBBox.minY = -9999;
      jest
        .spyOn(s2.facet, 'isScrollOverTheViewport')
        .mockImplementation(() => true);

      const wheelEvent = new WheelEvent('wheel', {
        deltaX: offset.scrollX,
        deltaY: offset.scrollY,
      });

      canvas.dispatchEvent(wheelEvent);

      // disable hover event
      expect(s2.interaction.hasIntercepts([InterceptType.HOVER])).toBeTruthy();

      // wait requestAnimationFrame
      await sleep(200);

      if (frozenRowHeader) {
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
      s2.render(false);

      const showHorizontalScrollBarSpy = jest
        .spyOn(s2.facet, 'showHorizontalScrollBar')
        .mockImplementation(() => {});

      const showVerticalScrollBarSpy = jest
        .spyOn(s2.facet, 'showVerticalScrollBar')
        .mockImplementation(() => {});

      const onScroll = jest.fn();
      s2.on(S2Event.LAYOUT_CELL_SCROLL, onScroll);

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
      // emit scroll event
      expect(onScroll).not.toHaveBeenCalled();
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

  test('should render correct scroll position', () => {
    s2.setOptions({
      interaction: {
        scrollbarPosition: ScrollbarPositionType.CONTENT,
      },
      style: {
        layoutWidthType: 'compact',
      },
    });
    s2.changeSheetSize(100, 1000); // 横向滚动条
    s2.render(false);
    expect(s2.facet.hScrollBar.getCanvasBBox().y).toBe(220);
    expect(s2.facet.hRowScrollBar.getCanvasBBox().y).toBe(220);

    s2.changeSheetSize(1000, 150); // 纵向滚动条
    s2.render(false);
    expect(s2.facet.vScrollBar.getCanvasBBox().x).toBe(189);

    s2.setOptions({
      interaction: {
        scrollbarPosition: ScrollbarPositionType.CANVAS,
      },
    });
    s2.changeSheetSize(100, 1000); // 横向滚动条
    s2.render(false);
    expect(s2.facet.hScrollBar.getCanvasBBox().y).toBe(994);
    expect(s2.facet.hRowScrollBar.getCanvasBBox().y).toBe(994);

    s2.changeSheetSize(1000, 200); // 纵向滚动条
    s2.render(false);
    expect(s2.facet.vScrollBar.getCanvasBBox().x).toBe(994);
  });
});
