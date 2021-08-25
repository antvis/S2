import { Indexes, PanelIndexes, diffPanelIndexes } from '@/utils/indexes';
import { updateMergedCells } from '@/utils/interaction/merge-cells';
import type { BBox, IGroup, Point } from '@antv/g-canvas';
import type { GestureEvent } from '@antv/g-gesture';
import { Wheel } from '@antv/g-gesture';
import { interpolateArray } from 'd3-interpolate';
import * as d3Timer from 'd3-timer';
import { Group } from '@antv/g-canvas';
import {
  debounce,
  each,
  find,
  get,
  isNil,
  isUndefined,
  last,
  reduce,
} from 'lodash';
import {
  KEY_AFTER_HEADER_LAYOUT,
  KEY_CELL_SCROLL,
  KEY_GROUP_COL_RESIZER,
  KEY_GROUP_CORNER_RESIZER,
  KEY_GROUP_ROW_INDEX_RESIZER,
  KEY_GROUP_ROW_RESIZER,
  KEY_PAGINATION,
  MAX_SCROLL_OFFSET,
  MIN_SCROLL_BAR_HEIGHT,
} from 'src/common/constant';
import type { CellScrollPosition } from 'src/common/interface/events';
import type { S2WheelEvent, ScrollOffset } from 'src/common/interface/scroll';
import { getAllPanelDataCell } from 'src/utils/getAllPanelDataCell';
import {
  ColHeader,
  CornerHeader,
  Frame,
  RowHeader,
  SeriesNumberHeader,
} from 'src/facet/header';
import { Hierarchy } from 'src/facet/layout/hierarchy';
import { ViewCellHeights } from 'src/facet/layout/interface';
import { Node } from 'src/facet/layout/node';
import { SpreadSheet } from 'src/sheet-type';
import { getTheme } from 'src/theme';
import { ScrollBar, ScrollType } from 'src/ui/scrollbar';
import { isMobile } from 'src/utils/is-mobile';
import {
  DebuggerUtil,
  DEBUG_HEADER_LAYOUT,
  DEBUG_VIEW_RENDER,
} from '../common/debug';
import type {
  Formatter,
  LayoutResult,
  OffsetConfig,
  SpreadSheetFacetCfg,
} from '../common/interface';
import {
  calculateInViewIndexes,
  optimizeScrollXY,
  translateGroup,
  translateGroupX,
  translateGroupY,
} from './utils';

// TODO: 这里的主题不应该用 default 吧, 代码里面都是写死的 defaultDataConfig

const THEME = getTheme({ name: 'default' });

export abstract class BaseFacet {
  // spreadsheet instance
  public spreadsheet: SpreadSheet;

  // corner box
  public cornerBBox: BBox;

  // viewport cells box
  public panelBBox: BBox;

  // background (useless now)
  public backgroundGroup: IGroup;

  // render viewport cell
  public panelGroup: IGroup;

  // render header/corner/scrollbar...
  public foregroundGroup: IGroup;

  public cfg: SpreadSheetFacetCfg;

  public layoutResult: LayoutResult;

  public viewCellWidths: number[];

  public viewCellHeights: ViewCellHeights;

  public cornerWidth: number;

  protected mobileWheel: Wheel;

  protected timer: d3Timer.Timer;

  protected hScrollBar: ScrollBar;

  protected hRowScrollBar: ScrollBar;

  protected vScrollBar: ScrollBar;

  protected rowHeader: RowHeader;

  protected columnHeader: ColHeader;

  protected cornerHeader: CornerHeader;

  protected rowIndexHeader: SeriesNumberHeader;

  protected centerFrame: Frame;

  protected scrollFrameId: ReturnType<typeof requestAnimationFrame> = null;

  protected scrollBarSize = getTheme({ name: 'default' }).scrollBar.size;

  protected scrollBarTheme = {
    default: {
      thumbColor: isMobile()
        ? THEME.scrollBar.mobileThumbColor
        : THEME.scrollBar.thumbColor,
      size: isMobile() ? this.scrollBarSize / 2 : this.scrollBarSize,
    },
  };

  protected scrollBarTouchTheme = {
    default: {
      thumbColor: THEME.scrollBar.thumbColor,
      size: isMobile() ? this.scrollBarSize / 2 : this.scrollBarSize,
    },
  };

  hideScrollBar = () => {
    this.hRowScrollBar?.updateTheme(this.scrollBarTheme);
    this.hScrollBar?.updateTheme(this.scrollBarTheme);
    this.vScrollBar?.updateTheme(this.scrollBarTheme);
  };

  delayHideScrollBar = debounce(this.hideScrollBar, 1000);

  delayHideScrollbarOnMobile = () => {
    if (isMobile()) {
      this.delayHideScrollBar();
    }
  };

  protected preCellIndexes: PanelIndexes;

  public constructor(cfg: SpreadSheetFacetCfg) {
    this.cfg = cfg;
    this.spreadsheet = cfg.spreadsheet;
    this.init();
  }

  onContainerWheel = () => {
    this.onContainerWheelForPc();
    this.onContainerWheelForMobile();
  };

  onContainerWheelForPc = () => {
    (this.spreadsheet.container.get(
      'el',
    ) as HTMLCanvasElement).addEventListener('wheel', this.onWheel);
  };

  onContainerWheelForMobile = () => {
    // mock wheel event fo mobile
    this.mobileWheel = new Wheel(this.spreadsheet.container);

    this.mobileWheel.on('wheel', (ev: GestureEvent) => {
      const originEvent = ev.event;
      const { deltaX, deltaY, x, y } = ev;
      // The coordinates of mobile and pc are three times different
      this.onWheel(({
        ...originEvent,
        deltaX,
        deltaY,
        layerX: x / 3,
        layerY: y / 3,
      } as unknown) as S2WheelEvent);
    });
  };

  bindEvents = () => {
    this.onContainerWheel();
    this.emitPaginationEvent();
  };

  /**
   * Start render, call from outside
   */
  public render() {
    this.renderHeaders();
    this.renderScrollBars();
    this.renderFrozenPanelCornerGroup();
    this.initFrozenGroupPosition();
    this.dynamicRenderCell(false);
  }

  public getSeriesNumberWidth(): number {
    const showSeriesNumber = get(
      this.cfg.spreadsheet,
      'options.showSeriesNumber',
      false,
    );
    return showSeriesNumber
      ? (get(this.cfg, 'spreadsheet.theme.rowCell.seriesNumberWidth') as number)
      : 0;
  }

  public getCanvasHW(): { width: number; height: number } {
    return {
      width: this.cfg.width,
      height: this.cfg.height,
    };
  }

  public getContentHeight(): number {
    const { rowsHierarchy, colsHierarchy } = this.layoutResult;
    return rowsHierarchy.height + colsHierarchy.height;
  }

  public updateScrollOffset(offsetConfig: OffsetConfig) {
    if (offsetConfig.offsetX.value !== undefined) {
      if (offsetConfig.offsetX.animate) {
        this.scrollWithAnimation(offsetConfig);
      } else {
        this.scrollImmediately(offsetConfig);
      }
      return;
    }

    if (offsetConfig.offsetY.value !== undefined) {
      if (offsetConfig.offsetY.animate) {
        this.scrollWithAnimation(offsetConfig);
      } else {
        this.scrollImmediately(offsetConfig);
      }
    }
  }

  public getPaginationScrollY(): number {
    const { pagination } = this.cfg;
    if (pagination) {
      const { current, pageSize } = pagination;
      const heights = this.viewCellHeights;
      const offset = Math.max((current - 1) * pageSize, 0);
      return heights.getCellHeight(offset);
    }
    return 0;
  }

  public destroy() {
    this.unbindEvents();
    this.clearAllGroup();
    this.preCellIndexes = null;
  }

  setScrollOffset = (scrollOffset: ScrollOffset) => {
    Object.keys(scrollOffset).forEach((key: keyof ScrollOffset) => {
      const offset = scrollOffset[key];
      if (!isUndefined(offset)) {
        this.spreadsheet.store.set<keyof ScrollOffset>(key, Math.floor(offset));
      }
    });
  };

  getScrollOffset = (): ScrollOffset => {
    const { store } = this.spreadsheet;
    return {
      scrollX: store.get<keyof ScrollOffset>('scrollX', 0),
      scrollY: store.get<keyof ScrollOffset>('scrollY', 0),
      hRowScrollX: store.get<keyof ScrollOffset>('hRowScrollX', 0),
    };
  };

  emitPaginationEvent = () => {
    const { pagination } = this.cfg;
    if (pagination) {
      const { current, pageSize } = pagination;
      const rowLeafNodes = this.layoutResult.rowLeafNodes;
      const total = rowLeafNodes.length;

      const pageCount = Math.floor((total - 1) / pageSize) + 1;

      this.cfg.spreadsheet.emit(KEY_PAGINATION, {
        pageSize,
        pageCount,
        total,
        current,
      });
    }
  };

  unbindEvents = () => {
    (this.spreadsheet.container.get('el') as HTMLElement).removeEventListener(
      'wheel',
      this.onWheel,
    );
    this.mobileWheel.destroy();
    this.setScrollOffset({ hRowScrollX: 0 });
  };

  clipPanelGroup = () => {
    this.foregroundGroup = this.spreadsheet.foregroundGroup;
    this.backgroundGroup = this.spreadsheet.backgroundGroup;
    this.panelGroup = this.spreadsheet.panelGroup;
    const { width, height } = this.panelBBox;
    this.panelGroup.setClip({
      type: 'rect',
      attrs: {
        x: 0,
        y: this.cornerBBox.height,
        width,
        height,
      },
    });
  };

  calculateCellWidthHeight = () => {
    const { colLeafNodes } = this.layoutResult;
    const widths = reduce(
      colLeafNodes,
      (result: number[], node: Node) => {
        result.push(last(result) + node.width);
        return result;
      },
      [0],
    );

    this.viewCellWidths = widths;
    this.viewCellHeights = this.getViewCellHeights(this.layoutResult);
  };

  /**
   * The purpose of this rewrite is to take into account that when rowHeader supports scrollbars
   the panel viewable area must vary with the horizontal distance of the scroll
   * @param scrollX
   * @param scrollY
   * @protected
   */
  calculateXYIndexes = (scrollX: number, scrollY: number): PanelIndexes => {
    const {
      frozenColCount,
      frozenRowCount,
      frozenTrailingColCount,
      frozenTrailingRowCount,
    } = this.spreadsheet.options;

    const dataLength = this.viewCellHeights.getTotalLength();
    const colLength = this.layoutResult.colLeafNodes.length;

    const indexes = calculateInViewIndexes(
      scrollX,
      scrollY,
      this.viewCellWidths,
      this.viewCellHeights,
      this.panelBBox,
      this.getRealScrollX(this.cornerBBox.width),
    );

    const centerIndexes: Indexes = [...indexes];

    if (centerIndexes[0] < frozenColCount) {
      centerIndexes[0] = frozenColCount;
    }

    if (
      frozenTrailingColCount > 0 &&
      centerIndexes[1] >= colLength - frozenTrailingColCount
    ) {
      centerIndexes[1] = colLength - frozenTrailingColCount - 1;
    }

    if (centerIndexes[2] < frozenRowCount) {
      centerIndexes[2] = frozenRowCount;
    }
    if (
      frozenTrailingRowCount > 0 &&
      centerIndexes[3] >= dataLength - frozenTrailingRowCount
    ) {
      centerIndexes[3] = dataLength - frozenTrailingRowCount - 1;
    }

    const frozenRowIndexes: Indexes = [...indexes];
    frozenRowIndexes[0] = frozenColCount;
    frozenRowIndexes[2] = 0;
    frozenRowIndexes[3] = frozenRowCount - 1;

    const frozenColIndexes: Indexes = [...indexes];
    frozenColIndexes[0] = 0;
    frozenColIndexes[1] = frozenColCount - 1;
    frozenColIndexes[2] = centerIndexes[2];
    frozenColIndexes[3] = centerIndexes[3];

    const frozenTrailingRowIndexes: Indexes = [...indexes];
    frozenTrailingRowIndexes[0] = centerIndexes[0];
    frozenTrailingRowIndexes[1] = centerIndexes[1];
    frozenTrailingRowIndexes[2] = dataLength - frozenTrailingRowCount;
    frozenTrailingRowIndexes[3] = dataLength - 1;

    const frozenTrailingColIndexes: Indexes = [...indexes];
    frozenTrailingColIndexes[0] = colLength - frozenTrailingColCount;
    frozenTrailingColIndexes[1] = colLength - 1;
    frozenTrailingColIndexes[2] = centerIndexes[2];
    frozenTrailingColIndexes[3] = centerIndexes[3];

    return {
      center: centerIndexes,
      frozenRow: frozenRowIndexes,
      frozenCol: frozenColIndexes,
      frozenTrailingCol: frozenTrailingColIndexes,
      frozenTrailingRow: frozenTrailingRowIndexes,
    };
  };

  getRealScrollX = (scrollX: number, hRowScroll = 0) => {
    return this.cfg.spreadsheet.isScrollContainsRowHeader()
      ? scrollX
      : hRowScroll;
  };

  calculateCornerBBox = () => {
    const { rowsHierarchy, colsHierarchy } = this.layoutResult;

    const leftWidth = rowsHierarchy.width + this.getSeriesNumberWidth();
    const height = colsHierarchy.height;

    this.cornerWidth = leftWidth;
    let renderWidth = leftWidth;
    if (!this.cfg.spreadsheet.isScrollContainsRowHeader()) {
      renderWidth = this.getCornerWidth(leftWidth, colsHierarchy);
    }
    if (!this.cfg.spreadsheet.isPivotMode()) {
      renderWidth = 0;
    }

    this.cornerBBox = {
      x: 0,
      y: 0,
      width: renderWidth,
      height,
      maxX: renderWidth,
      maxY: height,
      minX: 0,
      minY: 0,
    };
  };

  getCornerWidth = (leftWidth: number, colsHierarchy: Hierarchy): number => {
    const box = this.getCanvasHW();
    const leftMaxRatio = 0.5;
    const maxRightWidth = box.width * (1 - leftMaxRatio);
    const rightWidth = box.width - leftWidth;
    let renderWidth: number;
    if (!this.spreadsheet.isHierarchyTreeType()) {
      if (
        colsHierarchy.width > rightWidth &&
        colsHierarchy.width <= maxRightWidth
      ) {
        renderWidth = leftWidth - (maxRightWidth - colsHierarchy.width);
      } else if (colsHierarchy.width <= rightWidth) {
        renderWidth = leftWidth;
      } else {
        renderWidth = Math.min(leftWidth, box.width * leftMaxRatio);
      }
      if (
        box.width - renderWidth > colsHierarchy.width &&
        this.spreadsheet.isColAdaptive()
      ) {
        renderWidth += box.width - renderWidth - colsHierarchy.width;
      }
    } else {
      // tree mode
      renderWidth = leftWidth;
    }
    return renderWidth;
  };

  calculatePanelBBox = () => {
    const corner = this.cornerBBox;
    const br = {
      x: Math.floor(corner.maxX),
      y: Math.floor(corner.maxY),
    };
    const box = this.getCanvasHW();
    let width = box.width - br.x;
    let height =
      box.height -
      br.y -
      (get(this.cfg, 'spreadsheet.theme.scrollBar.size') as number);

    const realWidth = this.getRealWidth();
    const realHeight = this.getRealHeight();

    width = Math.floor(Math.min(width, realWidth));
    height = Math.floor(Math.min(height, realHeight));

    this.panelBBox = {
      x: br.x,
      y: br.y,
      width,
      height,
      maxX: br.x + width,
      maxY: br.y + height,
      minX: br.x,
      minY: br.y,
    } as BBox;
  };

  getRealWidth = (): number => {
    return last(this.viewCellWidths);
  };

  getRealHeight = (): number => {
    const { pagination } = this.cfg;
    const heights = this.viewCellHeights;

    if (pagination) {
      const { current, pageSize } = pagination;

      const start = Math.max((current - 1) * pageSize, 0);
      const end = Math.min(current * pageSize, heights.getTotalLength() - 1);

      return heights.getCellHeight(end) - heights.getCellHeight(start);
    }
    return heights.getTotalHeight();
  };

  clearAllGroup = () => {
    const children = this.panelGroup.cfg.children;
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];
      if (child instanceof Group) {
        child.set('children', []);
      } else {
        children[i].remove();
      }
    }
    this.foregroundGroup.set('children', []);
    this.backgroundGroup.set('children', []);
  };

  scrollWithAnimation = (offsetConfig: OffsetConfig) => {
    const { x: newX, y: newY } = this.adjustXAndY(
      offsetConfig.offsetX.value,
      offsetConfig.offsetY.value,
    );
    if (this.timer) {
      this.timer.stop();
    }
    const duration = 200;
    const oldOffset = Object.values(this.getScrollOffset());
    const newOffset: number[] = [
      newX === undefined ? oldOffset[0] : newX,
      newY === undefined ? oldOffset[1] : newY,
    ];
    const interpolate = interpolateArray(oldOffset, newOffset);
    this.timer = d3Timer.timer((elapsed) => {
      const ratio = Math.min(elapsed / duration, 1);
      const [scrollX, scrollY] = interpolate(ratio);
      this.setScrollOffset({ scrollX, scrollY });
      this.startScroll(newX, newY);
      if (elapsed > duration) {
        this.timer.stop();
      }
    });
  };

  scrollImmediately = (offsetConfig: OffsetConfig) => {
    const { x: newX, y: newY } = this.adjustXAndY(
      offsetConfig.offsetX.value,
      offsetConfig.offsetY.value,
    );
    this.setScrollOffset({ scrollX: newX, scrollY: newY });
    this.startScroll(newX, newY);
  };

  startScroll = (newX: number, newY: number) => {
    const { scrollX, scrollY } = this.getScrollOffset();
    if (newX !== undefined) {
      this.hScrollBar?.onlyUpdateThumbOffset(
        (scrollX / this.layoutResult.colsHierarchy.width) *
          this.hScrollBar.trackLen,
      );
    }
    if (newY !== undefined) {
      this.vScrollBar?.onlyUpdateThumbOffset(
        (scrollY / this.layoutResult.rowsHierarchy.height) *
          this.vScrollBar.trackLen,
      );
    }
    this.dynamicRenderCell();
  };

  adjustXAndY = (x: number, y: number): Point => {
    let newX = x;
    let newY = y;
    if (x !== undefined) {
      if (x + this.panelBBox.width >= this.layoutResult.colsHierarchy.width) {
        newX = this.layoutResult.colsHierarchy.width - this.panelBBox.width;
      }
    }
    if (y !== undefined) {
      if (y + this.panelBBox.height >= this.layoutResult.rowsHierarchy.height) {
        newY = this.layoutResult.rowsHierarchy.height - this.panelBBox.height;
      }
    }
    return {
      x: newX,
      y: newY,
    };
  };

  renderRowScrollBar = (rowScrollX: number) => {
    if (
      !this.cfg.spreadsheet.isScrollContainsRowHeader() &&
      this.cornerBBox.width < this.cornerWidth
    ) {
      this.hRowScrollBar = new ScrollBar({
        isHorizontal: true,
        trackLen: this.cornerBBox.width - this.scrollBarSize / 2,
        thumbLen:
          (this.cornerBBox.width * this.cornerBBox.width) / this.cornerWidth,
        position: {
          x: this.cornerBBox.minX + this.scrollBarSize / 2,
          y: this.panelBBox.maxY - this.scrollBarSize / 2,
        },
        thumbOffset: (rowScrollX * this.cornerBBox.width) / this.cornerWidth,
        theme: this.scrollBarTheme,
      });

      this.hRowScrollBar.on(ScrollType.ScrollChange, ({ thumbOffset }) => {
        const hRowScrollX =
          (thumbOffset / this.hRowScrollBar.trackLen) * this.cornerWidth;
        this.setScrollOffset({ hRowScrollX });
        this.rowHeader.onRowScrollX(hRowScrollX, KEY_GROUP_ROW_RESIZER);
        this.rowIndexHeader?.onRowScrollX(
          hRowScrollX,
          KEY_GROUP_ROW_INDEX_RESIZER,
        );
        this.centerFrame.onChangeShadowVisibility(
          hRowScrollX,
          this.cornerWidth - this.cornerBBox.width - this.scrollBarSize * 2,
          true,
        );
        this.cornerHeader.onRowScrollX(hRowScrollX, KEY_GROUP_CORNER_RESIZER);
      });
      this.foregroundGroup.add(this.hRowScrollBar);
    }
  };

  renderHScrollBar = (width: number, realWidth: number, scrollX: number) => {
    if (Math.floor(width) < Math.floor(realWidth)) {
      const halfScrollSize = this.scrollBarSize / 2;
      const finalWidth =
        width +
        (this.cfg.spreadsheet.isScrollContainsRowHeader()
          ? this.cornerBBox.width
          : 0);
      const finalPosition = {
        x:
          this.panelBBox.minX +
          (this.cfg.spreadsheet.isScrollContainsRowHeader()
            ? -this.cornerBBox.width + halfScrollSize
            : halfScrollSize),
        y: this.panelBBox.maxY - this.scrollBarSize / 2,
      };
      const finaleRealWidth =
        realWidth +
        (this.cfg.spreadsheet.isScrollContainsRowHeader()
          ? this.cornerBBox.width
          : 0);

      // TODO abstract
      this.hScrollBar = new ScrollBar({
        isHorizontal: true,
        trackLen: finalWidth,
        thumbLen: (finalWidth / finaleRealWidth) * finalWidth,
        // position: this.viewport.bl,
        position: finalPosition,
        thumbOffset: (scrollX * finalWidth) / finaleRealWidth,
        theme: this.scrollBarTheme,
      });

      this.hScrollBar.on(ScrollType.ScrollChange, ({ thumbOffset }) => {
        const offsetLeft =
          (thumbOffset / this.hScrollBar.trackLen) * finaleRealWidth;
        this.setScrollOffset({
          scrollX: offsetLeft,
        });
        this.dynamicRenderCell();
      });

      this.foregroundGroup.add(this.hScrollBar);
    }
  };

  renderVScrollBar = (height: number, realHeight: number, scrollY: number) => {
    if (height < realHeight) {
      const thumbHeight = Math.max(
        (height / realHeight) * height,
        MIN_SCROLL_BAR_HEIGHT,
      );
      const getOffsetTop = (scrollTop: number) =>
        (scrollTop / (height - thumbHeight)) *
        (realHeight - this.panelBBox.height);

      this.vScrollBar = new ScrollBar({
        isHorizontal: false,
        trackLen: height,
        thumbLen: thumbHeight,
        thumbOffset: (scrollY * this.panelBBox.height) / realHeight,
        position: {
          x: this.panelBBox.maxX - this.scrollBarSize,
          y: this.panelBBox.minY,
        },
        theme: this.scrollBarTheme,
      });

      this.vScrollBar.on(ScrollType.ScrollChange, ({ thumbOffset }) => {
        this.setScrollOffset({ scrollY: getOffsetTop(thumbOffset) });
        this.dynamicRenderCell();
      });

      this.foregroundGroup.add(this.vScrollBar);
    }
  };

  shouldPreventWheelEvent = (x: number, y: number) => {
    const near = (current: number, offset: number): boolean => {
      // precision
      return (offset > 0 && current >= 0.99) || (offset < 0 && current <= 0.01);
    };

    if (x !== 0) {
      return this.hScrollBar && !near(this.hScrollBar.current(), x);
    }
    if (y !== 0) {
      return this.vScrollBar && !near(this.vScrollBar.current(), y);
    }
  };

  showVScrollBar = () => {
    this.vScrollBar?.updateTheme(this.scrollBarTouchTheme);
  };

  showHScrollBar = () => {
    this.hRowScrollBar?.updateTheme(this.scrollBarTouchTheme);
    this.hScrollBar?.updateTheme(this.scrollBarTouchTheme);
  };

  isScrollOverThePanelArea = ({ layerX, layerY }: Partial<S2WheelEvent>) => {
    return (
      layerX > this.panelBBox.minX &&
      layerX < this.panelBBox.maxX &&
      layerY > this.panelBBox.minY &&
      layerY < this.panelBBox.maxY
    );
  };

  isScrollOverTheCornerArea = ({ layerX, layerY }: Partial<S2WheelEvent>) => {
    return (
      layerX > this.cornerBBox.minX &&
      layerX < this.cornerBBox.maxX &&
      layerY > this.cornerBBox.minY &&
      layerY < this.cornerBBox.maxY + this.panelBBox.height
    );
  };

  updateHScrollBarThumbOffsetWhenOverThePanel = (
    wheelEvent: Partial<S2WheelEvent>,
  ) => {
    if (this.isScrollOverThePanelArea(wheelEvent)) {
      this.updateHScrollBarThumbOffset(wheelEvent.deltaX);
    }
  };

  updateHRowScrollBarThumbOffsetWhenOverTheCorner = (
    wheelEvent: Partial<S2WheelEvent>,
  ) => {
    if (this.isScrollOverTheCornerArea(wheelEvent)) {
      this.updateHRowScrollBarThumbOffset(wheelEvent.deltaX);
    }
  };

  updateHScrollBarThumbOffset = (deltaX: number) => {
    this.hScrollBar.updateThumbOffset(this.hScrollBar.thumbOffset + deltaX / 8);
  };

  updateHRowScrollBarThumbOffset = (deltaX: number) => {
    this.hRowScrollBar.updateThumbOffset(
      this.hRowScrollBar.thumbOffset + deltaX / 8,
    );
  };

  updateVScrollBarThumbOffset = (deltaY: number) => {
    const offsetTop =
      this.vScrollBar?.thumbOffset +
      Math.max(-MAX_SCROLL_OFFSET, Math.min(deltaY / 8, MAX_SCROLL_OFFSET));

    this.vScrollBar?.updateThumbOffset(offsetTop);
  };

  isScrollToTop = (deltaY: number) => {
    return deltaY <= 0 && this.vScrollBar?.thumbOffset <= 0;
  };

  isScrollToBottom = (deltaY: number) => {
    return (
      deltaY >= 0 &&
      this.vScrollBar?.thumbOffset + this.vScrollBar?.thumbLen >=
        this.panelBBox?.height
    );
  };

  onWheel = (event: S2WheelEvent) => {
    const { deltaX, deltaY, layerX, layerY } = event;
    const [optimizedDeltaX, optimizedDeltaY] = optimizeScrollXY(deltaX, deltaY);

    // 如果已经滚动在顶部或底部, 则无需触发滚动事件, 减少单元格重绘
    // TODO: 这里需要迁移 spreadsheet 的逻辑
    if (
      optimizedDeltaY > 0 &&
      (this.isScrollToTop(optimizedDeltaY) ||
        this.isScrollToBottom(optimizedDeltaY))
    ) {
      return;
    }

    if (this.shouldPreventWheelEvent(optimizedDeltaX, optimizedDeltaY)) {
      event.preventDefault?.();
    }

    cancelAnimationFrame(this.scrollFrameId);

    this.scrollFrameId = requestAnimationFrame(() => {
      if (optimizedDeltaX > 0) {
        this.showHScrollBar();
      }

      if (optimizedDeltaY > 0) {
        this.showVScrollBar();
      }

      if (this.hRowScrollBar) {
        // When rowScrollBar is exists, scrolling is only valid at the corresponding render range
        this.updateHScrollBarThumbOffsetWhenOverThePanel({
          layerX,
          layerY,
          deltaY: optimizedDeltaX,
        });

        this.updateHRowScrollBarThumbOffsetWhenOverTheCorner({
          layerX,
          layerY,
          deltaY: optimizedDeltaX,
        });
      } else if (this.hScrollBar) {
        this.updateHScrollBarThumbOffset(optimizedDeltaX);
      }

      this.updateVScrollBarThumbOffset(optimizedDeltaY);
      this.delayHideScrollbarOnMobile();
    });
  };

  /**
   * Translate panelGroup, rowHeader, cornerHeader, columnHeader ect
   * according to new scroll offset
   * @param scrollX
   * @param scrollY
   * @param hRowScroll
   * @private
   */
  translateRelatedGroups = (
    scrollX: number,
    scrollY: number,
    hRowScroll: number,
  ) => {
    const { frozenRowCount } = this.spreadsheet.options;

    translateGroupX(
      this.spreadsheet.frozenRowGroup,
      this.cornerBBox.width - scrollX,
    );
    translateGroupX(
      this.spreadsheet.frozenTrailingRowGroup,
      this.cornerBBox.width - scrollX,
    );
    translateGroupY(
      this.spreadsheet.frozenColGroup,
      this.cornerBBox.height - scrollY,
    );
    translateGroupY(
      this.spreadsheet.frozenTrailingColGroup,
      this.cornerBBox.height - scrollY,
    );

    translateGroup(
      this.spreadsheet.panelScrollGroup,
      this.cornerBBox.width - scrollX,
      this.cornerBBox.height - scrollY,
    );
    this.rowHeader.onScrollXY(
      this.getRealScrollX(scrollX, hRowScroll),
      scrollY,
      KEY_GROUP_ROW_RESIZER,
    );
    this.rowIndexHeader?.onScrollXY(
      this.getRealScrollX(scrollX, hRowScroll),
      scrollY,
      KEY_GROUP_ROW_INDEX_RESIZER,
    );
    this.cornerHeader.onCorScroll(
      this.getRealScrollX(scrollX, hRowScroll),
      KEY_GROUP_CORNER_RESIZER,
    );
    this.centerFrame.onChangeShadowVisibility(
      scrollX,
      this.getRealWidth() - this.panelBBox.width,
      false,
    );
    this.centerFrame.onBorderScroll(this.getRealScrollX(scrollX));
    this.columnHeader.onColScroll(
      scrollX,
      this.cfg.spreadsheet.isScrollContainsRowHeader()
        ? this.cornerBBox.width
        : undefined,
      KEY_GROUP_COL_RESIZER,
    );
    this.spreadsheet.panelScrollGroup.setClip({
      type: 'rect',
      attrs: {
        x: this.cfg.spreadsheet.freezeRowHeader() ? scrollX : 0,
        y: scrollY + this.getTotalHeightForRange(0, frozenRowCount - 1),
        width:
          this.panelBBox.width +
          (this.cfg.spreadsheet.freezeRowHeader() ? 0 : scrollX),
        height: this.panelBBox.height,
      },
    });
  };

  getTotalHeightForRange = (start: number, end: number) => {
    if (end < 0) return 0;
    let totalHeight = 0;
    for (let index = start; index < end + 1; index++) {
      const height = this.viewCellHeights.getCellHeight(index);
      totalHeight += height;
    }
    return totalHeight;
  };

  protected initFrozenGroupPosition = () => {
    translateGroup(
      this.spreadsheet.frozenRowGroup,
      this.cornerBBox.width,
      this.cornerBBox.height,
    );
    translateGroup(
      this.spreadsheet.frozenColGroup,
      this.cornerBBox.width,
      this.cornerBBox.height,
    );
    translateGroup(
      this.spreadsheet.frozenTrailingColGroup,
      this.cornerBBox.width,
      this.cornerBBox.height,
    );
    translateGroup(
      this.spreadsheet.frozenTopLeftGroup,
      this.cornerBBox.width,
      this.cornerBBox.height,
    );
    translateGroup(
      this.spreadsheet.frozenTopRightGroup,
      this.cornerBBox.width,
      this.cornerBBox.height,
    );
  };

  protected renderFrozenPanelCornerGroup = () => {
    const {
      frozenRowCount,
      frozenColCount,
      frozenTrailingRowCount,
      frozenTrailingColCount,
    } = this.spreadsheet.options;
    const dataLength = this.viewCellHeights.getTotalLength();
    const colLength = this.layoutResult.colLeafNodes.length;

    for (let i = 0; i < frozenColCount; i++) {
      for (let j = 0; j < frozenRowCount; j++) {
        const viewMeta = this.layoutResult.getCellMeta(j, i);
        if (viewMeta) {
          const cell = this.cfg.dataCell(viewMeta);
          this.spreadsheet.frozenTopLeftGroup.add(cell);
        }
      }

      if (frozenTrailingRowCount > 0) {
        for (let j = 0; j < frozenTrailingRowCount; j++) {
          const index = dataLength - 1 - j;
          const viewMeta = this.layoutResult.getCellMeta(index, i);
          if (viewMeta) {
            const cell = this.cfg.dataCell(viewMeta);
            this.spreadsheet.frozenBottomLeftGroup.add(cell);
          }
        }
      }
    }

    for (let i = 0; i < frozenTrailingColCount; i++) {
      const colIndex = colLength - 1 - i;
      for (let j = 0; j < frozenRowCount; j++) {
        const viewMeta = this.layoutResult.getCellMeta(j, colIndex);
        if (viewMeta) {
          const cell = this.cfg.dataCell(viewMeta);
          this.spreadsheet.frozenTopRightGroup.add(cell);
        }
      }

      if (frozenTrailingRowCount > 0) {
        for (let j = 0; j < frozenTrailingRowCount; j++) {
          const index = dataLength - 1 - j;
          const viewMeta = this.layoutResult.getCellMeta(index, colIndex);
          if (viewMeta) {
            const cell = this.cfg.dataCell(viewMeta);
            this.spreadsheet.frozenBottomRightGroup.add(cell);
          }
        }
      }
    }
  };

  realCellRender = (scrollX: number, scrollY: number) => {
    const {
      frozenRowCount,
      frozenColCount,
      frozenTrailingRowCount,
      frozenTrailingColCount,
    } = this.spreadsheet.options;
    const indexes = this.calculateXYIndexes(scrollX, scrollY);
    const dataLength = this.viewCellHeights.getTotalLength();
    const colLength = this.layoutResult.colsHierarchy.getLeaves().length;
    // DebuggerUtil.getInstance().logger(
    //   'renderIndex:',
    //   this.preCellIndexes,
    //   indexes,
    // );

    const { add, remove } = diffPanelIndexes(this.preCellIndexes, indexes);

    DebuggerUtil.getInstance().debugCallback(DEBUG_VIEW_RENDER, () => {
      // add new cell in panelCell
      each(add, ([i, j]) => {
        const viewMeta = this.layoutResult.getCellMeta(j, i);
        if (viewMeta) {
          const cell = this.cfg.dataCell(viewMeta);
          // mark cell for removing
          cell.set('name', `${i}-${j}`);
          if (j <= frozenRowCount - 1) {
            this.spreadsheet.frozenRowGroup.add(cell);
          } else if (
            frozenTrailingRowCount > 0 &&
            j >= dataLength - frozenTrailingRowCount
          ) {
            this.spreadsheet.frozenTrailingRowGroup.add(cell);
          } else if (i <= frozenColCount - 1) {
            this.spreadsheet.frozenColGroup.add(cell);
          } else if (
            frozenTrailingColCount > 0 &&
            i >= colLength - frozenTrailingColCount
          ) {
            this.spreadsheet.frozenTrailingColGroup.add(cell);
          } else {
            this.spreadsheet.panelScrollGroup.add(cell);
          }
        }
      });
      const allCells = getAllPanelDataCell(this.panelGroup.getChildren());
      // remove cell from panelCell
      each(remove, ([i, j]) => {
        const findOne = find(
          allCells,
          (cell) => cell.get('name') === `${i}-${j}`,
        );
        findOne?.remove(true);
      });
      updateMergedCells(this.spreadsheet);
      // DebuggerUtil.getInstance().logger(
      //   `Render Cell Panel: ${allCells?.length}, Add: ${add?.length}, Remove: ${remove?.length}`,
      // );
    });
    this.preCellIndexes = indexes;
  };

  /**
   * How long about the delay period, need be re-considered,
   * for now only delay, oppose to immediately
   * @private
   */
  debounceRenderCell = debounce((scrollX: number, scrollY: number) => {
    this.realCellRender(scrollX, scrollY);
  });

  protected init(): void {
    // layout
    DebuggerUtil.getInstance().debugCallback(DEBUG_HEADER_LAYOUT, () => {
      this.layoutResult = this.doLayout();
      this.spreadsheet.emit(KEY_AFTER_HEADER_LAYOUT, this.layoutResult);
    });

    // all cell's width&height
    this.calculateCellWidthHeight();
    this.calculateCornerBBox();
    this.calculatePanelBBox();

    this.clipPanelGroup();
    this.bindEvents();
  }

  /**
   * Render all scrollbars, default horizontal scrollbar only control viewport
   * area(it means not contains row header)
   * 1. individual row scrollbar
   * 2. horizontal scroll bar(can control whether contains row header)
   * 3. vertical scroll bar
   */
  protected renderScrollBars() {
    const { scrollX, scrollY, hRowScrollX } = this.getScrollOffset();
    const { width, height } = this.panelBBox;
    const realWidth = this.layoutResult.colsHierarchy.width;
    const realHeight = this.getRealHeight();

    // scroll row header separate from the whole canvas
    this.renderRowScrollBar(hRowScrollX);

    // render horizontal scroll bar(default not contains row header)
    this.renderHScrollBar(width, realWidth, scrollX);

    // render vertical scroll bar
    this.renderVScrollBar(height, realHeight, scrollY);
  }

  /**
   * Render all headers in {@link #foregroundGroup}, contains:
   * 1. row header
   * 2. col header
   * 3. center frame
   * 4. corner header
   * 5. series number header
   */
  protected renderHeaders() {
    const seriesNumberWidth = this.getSeriesNumberWidth();

    this.rowHeader = this.getRowHeader();
    this.columnHeader = this.getColHeader();
    if (seriesNumberWidth > 0) {
      this.rowIndexHeader = this.getSeriesNumberHeader();
      this.foregroundGroup.add(this.rowIndexHeader);
    }
    this.cornerHeader = this.getCornerHeader();
    this.centerFrame = this.getCenterFrame();

    this.foregroundGroup.add(this.rowHeader);
    this.foregroundGroup.add(this.columnHeader);
    this.foregroundGroup.add(this.cornerHeader);
    this.foregroundGroup.add(this.centerFrame);
  }

  protected getRowHeader(): RowHeader {
    if (!this.rowHeader) {
      const { y, width, height } = this.panelBBox;
      const seriesNumberWidth = this.getSeriesNumberWidth();
      return new RowHeader({
        width: this.cornerBBox.width,
        height,
        viewportWidth: width,
        viewportHeight: height,
        position: { x: 0, y },
        data: this.layoutResult.rowNodes,
        offset: 0,
        hierarchyType: this.cfg.hierarchyType,
        linkFieldIds: get(this.cfg.spreadsheet, 'options.linkFieldIds'),
        seriesNumberWidth,
        spreadsheet: this.spreadsheet,
      });
    }
    return this.rowHeader;
  }

  protected getColHeader(): ColHeader {
    if (!this.columnHeader) {
      const { x, width, height } = this.panelBBox;
      return new ColHeader({
        width,
        height: this.cornerBBox.height,
        viewportWidth: width,
        viewportHeight: height,
        position: { x, y: 0 },
        data: this.layoutResult.colNodes,
        scrollContainsRowHeader: this.cfg.spreadsheet.isScrollContainsRowHeader(),
        offset: 0,
        formatter: (field: string): Formatter =>
          this.cfg.dataSet.getFieldFormatter(field),
        sortParam: this.cfg.spreadsheet.store.get('sortParam'),
        spreadsheet: this.spreadsheet,
      });
    }
    return this.columnHeader;
  }

  protected getCornerHeader(): CornerHeader {
    if (!this.cornerHeader) {
      return CornerHeader.getCornerHeader(
        this.panelBBox,
        this.cornerBBox,
        this.getSeriesNumberWidth(),
        this.cfg,
        this.layoutResult,
        this.spreadsheet,
      );
    }
    return this.cornerHeader;
  }

  protected getSeriesNumberHeader(): SeriesNumberHeader {
    return SeriesNumberHeader.getSeriesNumberHeader(
      this.panelBBox,
      this.getSeriesNumberWidth(),
      this.layoutResult.rowsHierarchy.getNodes(0),
      this.spreadsheet,
      this.cornerBBox.width,
    );
  }

  protected getCenterFrame(): Frame {
    if (!this.centerFrame) {
      const { width, height } = this.panelBBox;
      const cornerWidth = this.cornerBBox.width;
      const cornerHeight = this.cornerBBox.height;
      const frame = this.cfg?.frame;
      const frameCfg = {
        position: {
          x: this.cornerBBox.x,
          y: this.cornerBBox.y,
        },
        width: cornerWidth,
        height: cornerHeight,
        viewportWidth: width,
        viewportHeight: height,
        showCornerRightShadow: !isNil(this.hRowScrollBar),
        // When both a row header and a panel scroll bar exist, show viewport shadow
        showViewPortRightShadow:
          !isNil(this.hRowScrollBar) && !isNil(this.hScrollBar),
        scrollContainsRowHeader: this.cfg.spreadsheet.isScrollContainsRowHeader(),
        isPivotMode: this.cfg.spreadsheet.isPivotMode(),
        spreadsheet: this.cfg.spreadsheet,
      };
      return frame ? frame(frameCfg) : new Frame(frameCfg);
    }
    return this.centerFrame;
  }

  /**
   * When scroll behavior happened, only render one time in a period,
   * but render immediately in initiate
   * @param delay debounce render cell
   * @protected
   */
  protected dynamicRenderCell(delay = true) {
    const { scrollX, scrollY: sy, hRowScrollX } = this.getScrollOffset();
    const scrollY = sy + this.getPaginationScrollY();

    if (delay) {
      this.debounceRenderCell(scrollX, scrollY);
    } else {
      this.realCellRender(scrollX, scrollY);
    }

    this.translateRelatedGroups(scrollX, scrollY, hRowScrollX);

    const cellScrollData: CellScrollPosition = { scrollX, scrollY };
    this.spreadsheet.emit(KEY_CELL_SCROLL, cellScrollData);
  }

  protected abstract doLayout(): LayoutResult;

  protected abstract getViewCellHeights(
    layoutResult: LayoutResult,
  ): ViewCellHeights;
}
