import type { IGroup, Point } from '@antv/g-canvas';
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
import { CornerBBox } from './bbox/cornerBbox';
import { PanelBBox } from './bbox/panelBBox';
import {
  calculateInViewIndexes,
  getCellRange,
  optimizeScrollXY,
  translateGroup,
} from './utils';
import {
  S2Event,
  KEY_GROUP_COL_RESIZE_AREA,
  KEY_GROUP_CORNER_RESIZE_AREA,
  KEY_GROUP_ROW_INDEX_RESIZE_AREA,
  KEY_GROUP_ROW_RESIZE_AREA,
  MIN_SCROLL_BAR_HEIGHT,
  InterceptType,
} from '@/common/constant';
import type { S2WheelEvent, ScrollOffset } from '@/common/interface/scroll';
import { getAllPanelDataCell } from '@/utils/getAllPanelDataCell';
import {
  ColHeader,
  CornerHeader,
  Frame,
  RowHeader,
  SeriesNumberHeader,
} from '@/facet/header';
import { ViewCellHeights } from '@/facet/layout/interface';
import { Node } from '@/facet/layout/node';
import { SpreadSheet } from '@/sheet-type';
import { ScrollBar, ScrollType } from '@/ui/scrollbar';
import { isMobile } from '@/utils/is-mobile';
import {
  DebuggerUtil,
  DEBUG_HEADER_LAYOUT,
  DEBUG_VIEW_RENDER,
} from '@/common/debug';
import type {
  Formatter,
  LayoutResult,
  OffsetConfig,
  SpreadSheetFacetCfg,
  ViewMeta,
  S2CellType,
  FrameConfig,
} from '@/common/interface';
import { updateMergedCells } from '@/utils/interaction/merge-cells';
import { PanelIndexes, diffPanelIndexes } from '@/utils/indexes';

export abstract class BaseFacet {
  // spreadsheet instance
  public spreadsheet: SpreadSheet;

  // corner box
  public cornerBBox: CornerBBox;

  // viewport cells box
  public panelBBox: PanelBBox;

  // background (useless now)
  public backgroundGroup: IGroup;

  // render viewport cell
  public panelGroup: IGroup;

  // render header/corner/scrollbar/resize
  public foregroundGroup: IGroup;

  public cfg: SpreadSheetFacetCfg;

  public layoutResult: LayoutResult;

  public viewCellWidths: number[];

  public viewCellHeights: ViewCellHeights;

  protected mobileWheel: Wheel;

  protected timer: d3Timer.Timer;

  protected hScrollBar: ScrollBar;

  protected hRowScrollBar: ScrollBar;

  protected vScrollBar: ScrollBar;

  public rowHeader: RowHeader;

  public columnHeader: ColHeader;

  public cornerHeader: CornerHeader;

  public rowIndexHeader: SeriesNumberHeader;

  public centerFrame: Frame;

  protected scrollFrameId: ReturnType<typeof requestAnimationFrame> = null;

  get scrollBarTheme() {
    return this.spreadsheet.theme.scrollBar;
  }

  get scrollBarSize() {
    return this.scrollBarTheme.size;
  }

  protected preCellIndexes: PanelIndexes;

  public constructor(cfg: SpreadSheetFacetCfg) {
    this.cfg = cfg;
    this.spreadsheet = cfg.spreadsheet;
    this.init();
  }

  hideScrollBar = () => {
    this.hRowScrollBar?.hide();
    this.hScrollBar?.hide();
    this.vScrollBar?.hide();
  };

  delayHideScrollBar = debounce(this.hideScrollBar, 1000);

  delayHideScrollbarOnMobile = () => {
    if (isMobile()) {
      this.delayHideScrollBar();
    }
  };

  showVScrollBar = () => {
    this.vScrollBar?.show();
  };

  showHScrollBar = () => {
    this.hRowScrollBar?.show();
    this.hScrollBar?.show();
  };

  onContainerWheel = () => {
    this.onContainerWheelForPc();
    this.onContainerWheelForMobile();
  };

  onContainerWheelForPc = () => {
    (
      this.spreadsheet.container.get('el') as HTMLCanvasElement
    ).addEventListener('wheel', this.onWheel);
  };

  onContainerWheelForMobile = () => {
    // mock wheel event fo mobile
    this.mobileWheel = new Wheel(this.spreadsheet.container);

    this.mobileWheel.on('wheel', (ev: GestureEvent) => {
      this.spreadsheet.hideTooltip();
      const originEvent = ev.event;
      const { deltaX, deltaY, x, y } = ev;
      // The coordinates of mobile and pc are three times different
      this.onWheel({
        ...originEvent,
        deltaX,
        deltaY,
        layerX: x / 3,
        layerY: y / 3,
      } as unknown as S2WheelEvent);
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
    this.adjustScrollOffset();
    this.renderHeaders();
    this.renderScrollBars();
    this.renderBackground();
    this.dynamicRenderCell(false);
  }

  /**
   * 在每次render, 校验scroll offset是否在合法范围中
   * 比如在滚动条已经滚动到100%的状态的前提下：（ maxAvailableScrollOffsetX = colsHierarchy.width - viewportBBox.width ）
   *     此时changeSize，sheet从 small width 变为 big width
   *     导致后者 viewport 区域更大，其结果就是后者的 maxAvailableScrollOffsetX 更小
   *     此时就需要重置 scrollOffsetX，否则就会导致滚动过多，出现空白区域
   */
  protected adjustScrollOffset() {
    const { scrollX, scrollY } = this.getScrollOffset();
    const { x: newX, y: newY } = this.adjustXAndY(scrollX, scrollY);
    this.setScrollOffset({ scrollX: newX, scrollY: newY });
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
      return heights.getCellOffsetY(offset);
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
      const total = this.viewCellHeights.getTotalLength();

      const pageCount = Math.floor((total - 1) / pageSize) + 1;

      this.cfg.spreadsheet.emit(S2Event.LAYOUT_PAGINATION, {
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

    this.spreadsheet.panelScrollGroup?.setClip({
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
  protected calculateXYIndexes(scrollX: number, scrollY: number): PanelIndexes {
    const indexes = calculateInViewIndexes(
      scrollX,
      scrollY,
      this.viewCellWidths,
      this.viewCellHeights,
      this.panelBBox,
      this.getRealScrollX(this.cornerBBox.width),
    );

    return {
      center: indexes,
    };
  }

  getRealScrollX = (scrollX: number, hRowScroll = 0) => {
    return this.cfg.spreadsheet.isScrollContainsRowHeader()
      ? scrollX
      : hRowScroll;
  };

  protected calculateCornerBBox() {
    this.cornerBBox = new CornerBBox(this, true);
  }

  calculatePanelBBox = () => {
    this.panelBBox = new PanelBBox(this, true);
  };

  getRealWidth = (): number => {
    return last(this.viewCellWidths);
  };

  getCellRange() {
    const { pagination } = this.cfg;
    return getCellRange(this.viewCellHeights, pagination);
  }

  getRealHeight = (): number => {
    const { pagination } = this.cfg;
    const heights = this.viewCellHeights;

    if (pagination) {
      const { start, end } = this.getCellRange();

      return heights.getCellOffsetY(end + 1) - heights.getCellOffsetY(start);
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
        (scrollY / this.viewCellHeights.getTotalHeight()) *
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

    const totalHeight = this.viewCellHeights.getTotalHeight();
    if (y !== undefined) {
      if (y + this.panelBBox.height >= totalHeight) {
        newY = totalHeight - this.panelBBox.height;
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
      this.cornerBBox.width < this.cornerBBox.originalWidth
    ) {
      this.hRowScrollBar = new ScrollBar({
        isHorizontal: true,
        trackLen: this.cornerBBox.width,
        thumbLen:
          (this.cornerBBox.width * this.cornerBBox.width) /
          this.cornerBBox.originalWidth,
        position: {
          x: this.cornerBBox.minX + this.scrollBarSize / 2,
          y: this.panelBBox.maxY,
        },
        thumbOffset:
          (rowScrollX * this.cornerBBox.width) / this.cornerBBox.originalWidth,
        theme: this.scrollBarTheme,
      });

      this.hRowScrollBar.on(ScrollType.ScrollChange, ({ thumbOffset }) => {
        const hRowScrollX =
          (thumbOffset / this.hRowScrollBar.trackLen) *
          this.cornerBBox.originalWidth;
        this.setScrollOffset({ hRowScrollX });
        this.rowHeader.onRowScrollX(hRowScrollX, KEY_GROUP_ROW_RESIZE_AREA);
        this.rowIndexHeader?.onRowScrollX(
          hRowScrollX,
          KEY_GROUP_ROW_INDEX_RESIZE_AREA,
        );
        this.centerFrame.onChangeShadowVisibility(
          hRowScrollX,
          this.cornerBBox.originalWidth -
            this.cornerBBox.width -
            this.scrollBarSize * 2,
          true,
        );
        this.cornerHeader.onRowScrollX(
          hRowScrollX,
          KEY_GROUP_CORNER_RESIZE_AREA,
        );
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
        y: this.panelBBox.maxY,
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
    this.hScrollBar?.updateThumbOffset(
      this.hScrollBar.thumbOffset + deltaX / 8,
    );
  };

  updateHRowScrollBarThumbOffset = (deltaX: number) => {
    this.hRowScrollBar.updateThumbOffset(
      this.hRowScrollBar.thumbOffset + deltaX / 8,
    );
  };

  updateVScrollBarThumbOffset = (deltaY: number) => {
    const offsetTop = this.vScrollBar?.thumbOffset + deltaY / 8;

    this.vScrollBar?.updateThumbOffset(offsetTop);
  };

  isScrollToLeft = (deltaX: number) => {
    if (!this.hScrollBar) {
      return true;
    }
    return deltaX <= 0 && this.hScrollBar?.thumbOffset <= 0;
  };

  isScrollToRight = (deltaX: number) => {
    if (!this.hScrollBar) {
      return true;
    }
    return (
      deltaX >= 0 &&
      this.hScrollBar?.thumbOffset + this.hScrollBar?.thumbLen >=
        this.panelBBox?.width
    );
  };

  isScrollToTop = (deltaY: number) => {
    if (!this.vScrollBar) {
      return true;
    }
    return deltaY <= 0 && this.vScrollBar?.thumbOffset <= 0;
  };

  isScrollToBottom = (deltaY: number) => {
    if (!this.vScrollBar) {
      return true;
    }
    return (
      deltaY >= 0 &&
      this.vScrollBar?.thumbOffset + this.vScrollBar?.thumbLen >=
        this.panelBBox?.height
    );
  };

  isVerticalScrollInTheViewport = (deltaY: number) => {
    return !this.isScrollToTop(deltaY) && !this.isScrollToBottom(deltaY);
  };

  isHorizontalScrollInTheViewport = (deltaX: number) => {
    return !this.isScrollToLeft(deltaX) && !this.isScrollToRight(deltaX);
  };

  /**
    在当前表格滚动分两种情况:
    1. 当前表格无滚动条: 无需阻止外部容器滚动
    2. 当前表格有滚动条:
      - 未滚动到顶部或底部: 当前表格滚动, 阻止外部容器滚动
      - 滚动到顶部或底部: 恢复外部容器滚动
  */
  isScrollInTheViewport = (deltaX: number, deltaY: number) => {
    if (deltaY !== 0) {
      return this.isVerticalScrollInTheViewport(deltaY);
    }
    if (deltaX !== 0) {
      return this.isHorizontalScrollInTheViewport(deltaX);
    }
    return false;
  };

  onWheel = (event: S2WheelEvent) => {
    const ratio = this.cfg.interaction.scrollSpeedRatio;
    const { deltaX, deltaY, layerX, layerY } = event;
    const [optimizedDeltaX, optimizedDeltaY] = optimizeScrollXY(
      deltaX,
      deltaY,
      ratio,
    );

    this.spreadsheet.hideTooltip();
    this.spreadsheet.interaction.clearHoverTimer();

    if (!this.isScrollInTheViewport(optimizedDeltaX, optimizedDeltaY)) {
      return;
    }

    event.preventDefault?.();
    this.spreadsheet.interaction.addIntercepts([InterceptType.HOVER]);

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
          deltaX,
          deltaY: optimizedDeltaX,
        });

        this.updateHRowScrollBarThumbOffsetWhenOverTheCorner({
          layerX,
          layerY,
          deltaX,
          deltaY: optimizedDeltaX,
        });
      } else if (this.hScrollBar) {
        this.updateHScrollBarThumbOffset(optimizedDeltaX);
      }

      this.updateVScrollBarThumbOffset(optimizedDeltaY);
      this.delayHideScrollbarOnMobile();
    });
  };

  protected clip(scrollX: number, scrollY: number) {
    this.spreadsheet.panelScrollGroup?.setClip({
      type: 'rect',
      attrs: {
        x: this.cfg.spreadsheet.isFreezeRowHeader() ? scrollX : 0,
        y: scrollY,
        width:
          this.panelBBox.width +
          (this.cfg.spreadsheet.isFreezeRowHeader() ? 0 : scrollX),
        height: this.panelBBox.height,
      },
    });
  }

  /**
   * Translate panelGroup, rowHeader, cornerHeader, columnHeader ect
   * according to new scroll offset
   * @param scrollX
   * @param scrollY
   * @param hRowScroll
   * @protected
   */
  protected translateRelatedGroups(
    scrollX: number,
    scrollY: number,
    hRowScroll: number,
  ) {
    translateGroup(
      this.spreadsheet.panelScrollGroup,
      this.cornerBBox.width - scrollX,
      this.cornerBBox.height - scrollY,
    );
    this.rowHeader.onScrollXY(
      this.getRealScrollX(scrollX, hRowScroll),
      scrollY,
      KEY_GROUP_ROW_RESIZE_AREA,
    );
    this.rowIndexHeader?.onScrollXY(
      this.getRealScrollX(scrollX, hRowScroll),
      scrollY,
      KEY_GROUP_ROW_INDEX_RESIZE_AREA,
    );
    this.cornerHeader.onCorScroll(
      this.getRealScrollX(scrollX, hRowScroll),
      KEY_GROUP_CORNER_RESIZE_AREA,
    );
    this.centerFrame.onChangeShadowVisibility(
      scrollX,
      this.getRealWidth() - this.panelBBox.width,
      false,
    );
    this.centerFrame.onBorderScroll(this.getRealScrollX(scrollX));
    this.columnHeader.onColScroll(scrollX, KEY_GROUP_COL_RESIZE_AREA);
  }

  addCell = (cell: S2CellType<ViewMeta>) => {
    const { panelScrollGroup } = this.spreadsheet;

    panelScrollGroup?.add(cell);
  };

  realCellRender = (scrollX: number, scrollY: number) => {
    const indexes = this.calculateXYIndexes(scrollX, scrollY);
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
          this.addCell(cell);
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
  debounceRenderCell = (scrollX: number, scrollY: number) => {
    this.realCellRender(scrollX, scrollY);
  };

  protected init(): void {
    // layout
    DebuggerUtil.getInstance().debugCallback(DEBUG_HEADER_LAYOUT, () => {
      this.layoutResult = this.doLayout();
      this.spreadsheet.emit(
        S2Event.LAYOUT_AFTER_HEADER_LAYOUT,
        this.layoutResult,
      );
    });

    // all cell's width&height
    this.calculateCellWidthHeight();
    this.calculateCornerBBox();
    this.calculatePanelBBox();

    this.clipPanelGroup();
    this.bindEvents();
    // this.removeResizeIntercept();
  }

  protected renderBackground() {
    const { width, height } = this.getCanvasHW();
    const color = get(this.cfg, 'spreadsheet.theme.background.color') as string;
    const opacity = get(
      this.cfg,
      'spreadsheet.theme.background.opacity',
    ) as number;

    this.backgroundGroup.addShape('rect', {
      attrs: {
        fill: color,
        opacity,
        x: 0,
        y: 0,
        width,
        height,
      },
    });
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
        hierarchyType: this.cfg.hierarchyType,
        linkFields: get(this.cfg.spreadsheet, 'options.linkFields'),
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
        cornerWidth: this.cornerBBox.width,
        height: this.cornerBBox.height,
        viewportWidth: width,
        viewportHeight: height,
        position: { x, y: 0 },
        data: this.layoutResult.colNodes,
        scrollContainsRowHeader:
          this.cfg.spreadsheet.isScrollContainsRowHeader(),
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
      const frameCfg: FrameConfig = {
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
        scrollContainsRowHeader:
          this.cfg.spreadsheet.isScrollContainsRowHeader(),
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
    let scrollY = sy + this.getPaginationScrollY();
    const maxScrollY =
      this.viewCellHeights.getTotalHeight() - this.panelBBox.height;

    if (scrollY > maxScrollY) {
      scrollY = maxScrollY;
    }

    if (delay) {
      this.debounceRenderCell(scrollX, scrollY);
    } else {
      this.realCellRender(scrollX, scrollY);
    }

    this.translateRelatedGroups(scrollX, scrollY, hRowScrollX);
    this.clip(scrollX, scrollY);

    this.spreadsheet.emit(S2Event.LAYOUT_CELL_SCROLL, { scrollX, scrollY });
    this.onAfterScroll();
  }

  protected onAfterScroll = debounce(() => {
    this.spreadsheet.interaction.removeIntercepts([InterceptType.HOVER]);
  }, 300);

  protected abstract doLayout(): LayoutResult;

  protected abstract getViewCellHeights(
    layoutResult: LayoutResult,
  ): ViewCellHeights;
}
