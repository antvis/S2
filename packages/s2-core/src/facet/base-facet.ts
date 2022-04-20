import type { IElement, IGroup } from '@antv/g-canvas';
import { GestureEvent, Wheel } from '@antv/g-gesture';
import { interpolateArray } from 'd3-interpolate';
import { timer, Timer } from 'd3-timer';
import { Group } from '@antv/g-canvas';
import { debounce, each, find, get, isUndefined, last, reduce } from 'lodash';
import { CornerBBox } from './bbox/cornerBBox';
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
  ScrollbarPositionType,
} from '@/common/constant';
import type { S2WheelEvent, ScrollOffset } from '@/common/interface/scroll';
import { getAllChildCells } from '@/utils/get-all-child-cells';
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
import {
  LayoutResult,
  OffsetConfig,
  SpreadSheetFacetCfg,
  ViewMeta,
  S2CellType,
  FrameConfig,
} from '@/common/interface';
import { updateMergedCells } from '@/utils/interaction/merge-cell';
import { PanelIndexes, diffPanelIndexes } from '@/utils/indexes';
import { DataCell } from '@/cell';

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

  protected timer: Timer;

  public hScrollBar: ScrollBar;

  public hRowScrollBar: ScrollBar;

  public vScrollBar: ScrollBar;

  public rowHeader: RowHeader;

  public columnHeader: ColHeader;

  public cornerHeader: CornerHeader;

  public rowIndexHeader: SeriesNumberHeader;

  public centerFrame: Frame;

  protected abstract doLayout(): LayoutResult;

  public abstract getViewCellHeights(
    layoutResult: LayoutResult,
  ): ViewCellHeights;

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

  showVerticalScrollBar = () => {
    this.vScrollBar?.show();
  };

  showHorizontalScrollBar = () => {
    this.hRowScrollBar?.show();
    this.hScrollBar?.show();
  };

  onContainerWheel = () => {
    this.onContainerWheelForPc();
    this.onContainerWheelForMobile();
  };

  onContainerWheelForPc = () => {
    const canvas = this.spreadsheet.container.get('el') as HTMLCanvasElement;
    canvas?.addEventListener('wheel', this.onWheel);
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
        layerX: x,
        layerY: y,
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
   *     此时changeSheetSize，sheet从 small width 变为 big width
   *     导致后者 viewport 区域更大，其结果就是后者的 maxAvailableScrollOffsetX 更小
   *     此时就需要重置 scrollOffsetX，否则就会导致滚动过多，出现空白区域
   */
  protected adjustScrollOffset() {
    const { scrollX, scrollY, hRowScrollX } = this.getAdjustedScrollOffset(
      this.getScrollOffset(),
    );
    this.setScrollOffset({
      scrollX,
      scrollY,
      hRowScrollX,
    });
  }

  public getSeriesNumberWidth(): number {
    const { showSeriesNumber } = this.cfg;
    return showSeriesNumber
      ? this.spreadsheet.theme.rowCell.seriesNumberWidth
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
    cancelAnimationFrame(this.scrollFrameId);
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

  private unbindEvents = () => {
    const canvas = this.spreadsheet.container.get('el') as HTMLElement;
    canvas?.removeEventListener('wheel', this.onWheel);
    this.mobileWheel.destroy();
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
   * @public
   */
  public calculateXYIndexes(scrollX: number, scrollY: number): PanelIndexes {
    const { viewportHeight: height, viewportWidth: width } = this.panelBBox;

    const indexes = calculateInViewIndexes(
      scrollX,
      scrollY,
      this.viewCellWidths,
      this.viewCellHeights,
      {
        width,
        height,
        x: 0,
        y: 0,
      },
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

  protected calculatePanelBBox = () => {
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
    const children = this.panelGroup.getChildren() || [];
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

  scrollWithAnimation = (
    offsetConfig: OffsetConfig,
    duration = 200,
    cb?: () => void,
  ) => {
    const { scrollX: adjustedScrollX, scrollY: adjustedScrollY } =
      this.getAdjustedScrollOffset({
        scrollX: offsetConfig.offsetX.value || 0,
        scrollY: offsetConfig.offsetY.value || 0,
      });
    if (this.timer) {
      this.timer.stop();
    }
    const oldOffset = Object.values(this.getScrollOffset());
    const newOffset: number[] = [
      adjustedScrollX === undefined ? oldOffset[0] : adjustedScrollX,
      adjustedScrollY === undefined ? oldOffset[1] : adjustedScrollY,
    ];
    const interpolate = interpolateArray(oldOffset, newOffset);
    this.timer = timer((elapsed) => {
      const ratio = Math.min(elapsed / duration, 1);
      const [scrollX, scrollY] = interpolate(ratio);
      this.setScrollOffset({ scrollX, scrollY });
      this.startScroll(adjustedScrollX, adjustedScrollY);
      if (elapsed > duration) {
        this.timer.stop();
        cb?.();
      }
    });
  };

  scrollImmediately = (offsetConfig: OffsetConfig) => {
    const { scrollX, scrollY } = this.getAdjustedScrollOffset({
      scrollX: offsetConfig.offsetX.value || 0,
      scrollY: offsetConfig.offsetY.value || 0,
    });
    this.setScrollOffset({ scrollX, scrollY });
    this.startScroll(scrollX, scrollY);
  };

  startScroll = (newX: number, newY: number) => {
    const { scrollX, scrollY } = this.getScrollOffset();
    if (newX !== undefined) {
      this.hScrollBar?.onlyUpdateThumbOffset(
        this.getScrollBarOffset(scrollX, this.hScrollBar),
      );
    }
    if (newY !== undefined) {
      this.vScrollBar?.onlyUpdateThumbOffset(
        this.getScrollBarOffset(scrollY, this.vScrollBar),
      );
    }
    this.dynamicRenderCell();
  };

  getRendererHeight = () => {
    const { start, end } = this.getCellRange();
    return (
      this.viewCellHeights.getCellOffsetY(end + 1) -
      this.viewCellHeights.getCellOffsetY(start)
    );
  };

  private getAdjustedRowScrollX = (hRowScrollX: number): number => {
    if (hRowScrollX + this.cornerBBox.width >= this.cornerBBox.originalWidth) {
      return this.cornerBBox.originalWidth - this.cornerBBox.width;
    }
    return hRowScrollX;
  };

  private getAdjustedScrollX = (scrollX: number): number => {
    const colsHierarchyWidth = this.layoutResult.colsHierarchy.width;
    const panelWidth = this.panelBBox.width;
    if (
      scrollX + panelWidth >= colsHierarchyWidth &&
      colsHierarchyWidth > panelWidth
    ) {
      return colsHierarchyWidth - panelWidth;
    }
    return Math.max(0, scrollX);
  };

  private getAdjustedScrollY = (scrollY: number): number => {
    const rendererHeight = this.getRendererHeight();
    const panelHeight = this.panelBBox.height;
    if (
      scrollY + panelHeight >= rendererHeight &&
      rendererHeight > panelHeight
    ) {
      return rendererHeight - panelHeight;
    }
    // 当数据为空时，rendererHeight 可能为 0，此时 scrollY 为负值，需要调整为 0。
    if (scrollY < 0) {
      return 0;
    }
    return Math.max(0, scrollY);
  };

  private getAdjustedScrollOffset = ({
    scrollX,
    scrollY,
    hRowScrollX,
  }: ScrollOffset): ScrollOffset => {
    return {
      scrollX: this.getAdjustedScrollX(scrollX),
      scrollY: this.getAdjustedScrollY(scrollY),
      hRowScrollX: this.getAdjustedRowScrollX(hRowScrollX),
    };
  };

  renderRowScrollBar = (rowScrollX: number) => {
    if (
      !this.cfg.spreadsheet.isScrollContainsRowHeader() &&
      this.cornerBBox.width < this.cornerBBox.originalWidth
    ) {
      const maxOffset = this.cornerBBox.originalWidth - this.cornerBBox.width;
      const { maxY } = this.getScrollbarPosition();
      const thumbLen =
        (this.cornerBBox.width * this.cornerBBox.width) /
        this.cornerBBox.originalWidth;
      this.hRowScrollBar = new ScrollBar({
        isHorizontal: true,
        trackLen: this.cornerBBox.width,
        thumbLen,
        position: {
          x: this.cornerBBox.minX + this.scrollBarSize / 2,
          y: maxY,
        },
        thumbOffset:
          (rowScrollX * (this.cornerBBox.width - thumbLen)) / maxOffset,
        theme: this.scrollBarTheme,
        scrollTargetMaxOffset: maxOffset,
      });

      this.hRowScrollBar.on(ScrollType.ScrollChange, ({ offset }) => {
        const newOffset = this.getValidScrollBarOffset(offset, maxOffset);
        const hRowScrollX = newOffset;
        this.setScrollOffset({ hRowScrollX });
        this.rowHeader?.onRowScrollX(hRowScrollX, KEY_GROUP_ROW_RESIZE_AREA);
        this.rowIndexHeader?.onRowScrollX(
          hRowScrollX,
          KEY_GROUP_ROW_INDEX_RESIZE_AREA,
        );
        this.cornerHeader.onRowScrollX(
          hRowScrollX,
          KEY_GROUP_CORNER_RESIZE_AREA,
        );
        this.hRowScrollBar.updateThumbOffset(
          this.getScrollBarOffset(newOffset, this.hRowScrollBar),
          false,
        );
      });
      this.foregroundGroup.add(this.hRowScrollBar);
    }
  };

  getValidScrollBarOffset = (offset: number, maxOffset: number) => {
    if (offset > maxOffset) {
      return maxOffset;
    }
    if (offset < 0) {
      return 0;
    }
    return offset;
  };

  renderHScrollBar = (width: number, realWidth: number, scrollX: number) => {
    if (Math.floor(width) < Math.floor(realWidth)) {
      const halfScrollSize = this.scrollBarSize / 2;

      const { maxY } = this.getScrollbarPosition();
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
        y: maxY,
      };
      const finaleRealWidth =
        realWidth +
        (this.cfg.spreadsheet.isScrollContainsRowHeader()
          ? this.cornerBBox.width
          : 0);
      const maxOffset = finaleRealWidth - finalWidth;
      const thumbLen = (finalWidth / finaleRealWidth) * finalWidth;

      // TODO abstract
      this.hScrollBar = new ScrollBar({
        isHorizontal: true,
        trackLen: finalWidth,
        thumbLen,
        // position: this.viewport.bl,
        position: finalPosition,
        thumbOffset: (scrollX * (finalWidth - thumbLen)) / maxOffset,
        theme: this.scrollBarTheme,
        scrollTargetMaxOffset: maxOffset,
      });

      this.hScrollBar.on(
        ScrollType.ScrollChange,
        ({ offset, updateThumbOffset }) => {
          const newScrollX = this.getValidScrollBarOffset(offset, maxOffset);
          if (updateThumbOffset) {
            this.hScrollBar.updateThumbOffset(
              this.getScrollBarOffset(newScrollX, this.hScrollBar),
              false,
            );
          }

          this.setScrollOffset({
            scrollX: newScrollX,
          });
          this.dynamicRenderCell();
        },
      );

      this.foregroundGroup.add(this.hScrollBar);
    }
  };

  private getScrollbarPosition = () => {
    const { maxX, maxY } = this.panelBBox;
    const { width, height } = this.getCanvasHW();
    const isContentMode =
      this.spreadsheet.options.interaction.scrollbarPosition ===
      ScrollbarPositionType.CONTENT;

    return {
      maxX: (isContentMode ? maxX : width) - this.scrollBarSize,
      maxY: isContentMode ? maxY : height - this.scrollBarSize,
    };
  };

  renderVScrollBar = (height: number, realHeight: number, scrollY: number) => {
    if (height < realHeight) {
      const thumbHeight = Math.max(
        (height / realHeight) * height,
        MIN_SCROLL_BAR_HEIGHT,
      );
      const maxOffset = realHeight - height;
      const { maxX } = this.getScrollbarPosition();

      this.vScrollBar = new ScrollBar({
        isHorizontal: false,
        trackLen: height,
        thumbLen: thumbHeight,
        thumbOffset: (scrollY * (height - thumbHeight)) / maxOffset,
        position: {
          x: maxX,
          y: this.panelBBox.minY,
        },
        theme: this.scrollBarTheme,
        scrollTargetMaxOffset: maxOffset,
      });

      this.vScrollBar.on(
        ScrollType.ScrollChange,
        ({ offset, updateThumbOffset }) => {
          const newScrollY = this.getValidScrollBarOffset(offset, maxOffset);
          if (updateThumbOffset) {
            this.vScrollBar.updateThumbOffset(
              this.getScrollBarOffset(newScrollY, this.vScrollBar),
              false,
            );
          }

          this.setScrollOffset({ scrollY: newScrollY });
          this.dynamicRenderCell();
        },
      );

      this.foregroundGroup.add(this.vScrollBar);
    }
  };

  // (滑动 offset / 最大 offset（滚动对象真正长度 - 轨道长）) = (滑块 offset / 最大滑动距离（轨道长 - 滑块长）)
  getScrollBarOffset = (offset: number, scrollbar: ScrollBar) => {
    const { trackLen, thumbLen, scrollTargetMaxOffset } = scrollbar;
    return (offset * (trackLen - thumbLen)) / scrollTargetMaxOffset;
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

  updateHorizontalRowScrollOffset = ({ offset, layerX, layerY }) => {
    // 在行头区域滚动时 才更新行头水平滚动条
    if (this.isScrollOverTheCornerArea({ layerX, layerY })) {
      this.hRowScrollBar?.emitScrollChange(offset);
    }
  };

  updateHorizontalScrollOffset = ({ offset, layerX, layerY }) => {
    // 1.行头没有滚动条 2.在数值区域滚动时 才更新数值区域水平滚动条
    if (
      !this.hRowScrollBar ||
      this.isScrollOverThePanelArea({ layerX, layerY })
    ) {
      this.hScrollBar?.emitScrollChange(offset);
    }
  };

  isScrollToLeft = (deltaX: number) => {
    if (!this.hScrollBar) {
      return true;
    }

    const isScrollRowHeaderToLeft =
      !this.hRowScrollBar || this.hRowScrollBar.thumbOffset <= 0;

    const isScrollPanelToLeft = deltaX <= 0 && this.hScrollBar.thumbOffset <= 0;

    return isScrollPanelToLeft && isScrollRowHeaderToLeft;
  };

  isScrollToRight = (deltaX: number) => {
    if (!this.hScrollBar) {
      return true;
    }

    const viewportWidth = this.spreadsheet.isFrozenRowHeader()
      ? this.panelBBox?.width
      : this.panelBBox?.maxX;

    const isScrollRowHeaderToRight =
      !this.hRowScrollBar ||
      this.hRowScrollBar.thumbOffset + this.hRowScrollBar.thumbLen >=
        this.cornerBBox.width;

    const isScrollPanelToRight =
      this.hScrollBar.thumbOffset + this.hScrollBar.thumbLen >= viewportWidth;

    return deltaX >= 0 && isScrollPanelToRight && isScrollRowHeaderToRight;
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

  isVerticalScrollOverTheViewport = (deltaY: number) => {
    return !this.isScrollToTop(deltaY) && !this.isScrollToBottom(deltaY);
  };

  isHorizontalScrollOverTheViewport = (deltaX: number) => {
    return !this.isScrollToLeft(deltaX) && !this.isScrollToRight(deltaX);
  };

  /**
    在当前表格滚动分两种情况:
    1. 当前表格无滚动条: 无需阻止外部容器滚动
    2. 当前表格有滚动条:
      - 未滚动到顶部或底部: 当前表格滚动, 阻止外部容器滚动
      - 滚动到顶部或底部: 恢复外部容器滚动
  */
  isScrollOverTheViewport = (
    deltaX: number,
    deltaY: number,
    layerY: number,
  ) => {
    const isScrollOverTheHeader = layerY <= this.cornerBBox.maxY;
    // 光标在角头或列头时, 不触发表格自身滚动
    if (isScrollOverTheHeader) {
      return false;
    }
    if (deltaY !== 0) {
      return this.isVerticalScrollOverTheViewport(deltaY);
    }
    if (deltaX !== 0) {
      return this.isHorizontalScrollOverTheViewport(deltaX);
    }
    return false;
  };

  cancelScrollFrame = () => {
    if (isMobile() && this.scrollFrameId) {
      return false;
    }
    cancelAnimationFrame(this.scrollFrameId);
    return true;
  };

  clearScrollFrameIdOnMobile = () => {
    if (isMobile()) {
      this.scrollFrameId = null;
    }
  };

  onWheel = (event: S2WheelEvent) => {
    const ratio = this.spreadsheet.options.interaction.scrollSpeedRatio;
    const { deltaX, deltaY, layerX, layerY } = event;
    const [optimizedDeltaX, optimizedDeltaY] = optimizeScrollXY(
      deltaX,
      deltaY,
      ratio,
    );

    this.spreadsheet.hideTooltip();
    this.spreadsheet.interaction.clearHoverTimer();

    if (
      !this.isScrollOverTheViewport(optimizedDeltaX, optimizedDeltaY, layerY)
    ) {
      return;
    }

    event?.preventDefault?.();
    this.spreadsheet.interaction.addIntercepts([InterceptType.HOVER]);

    if (!this.cancelScrollFrame()) {
      return;
    }

    this.scrollFrameId = requestAnimationFrame(() => {
      const {
        scrollX: currentScrollX,
        scrollY: currentScrollY,
        hRowScrollX,
      } = this.getScrollOffset();

      if (optimizedDeltaX !== 0) {
        this.showHorizontalScrollBar();
        this.updateHorizontalRowScrollOffset({
          layerX,
          layerY,
          offset: optimizedDeltaX + hRowScrollX,
        });
        this.updateHorizontalScrollOffset({
          layerX,
          layerY,
          offset: optimizedDeltaX + currentScrollX,
        });
      }

      if (optimizedDeltaY !== 0) {
        this.showVerticalScrollBar();
        this.vScrollBar?.emitScrollChange(optimizedDeltaY + currentScrollY);
      }

      this.delayHideScrollbarOnMobile();
      this.clearScrollFrameIdOnMobile();
    });
  };

  protected clip(scrollX: number, scrollY: number) {
    const isFrozenRowHeader = this.cfg.spreadsheet.isFrozenRowHeader();
    this.spreadsheet.panelScrollGroup?.setClip({
      type: 'rect',
      attrs: {
        x: isFrozenRowHeader ? scrollX : 0,
        y: scrollY,
        width: this.panelBBox.width + (isFrozenRowHeader ? 0 : scrollX),
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
    this.rowHeader?.onScrollXY(
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
    DebuggerUtil.getInstance().logger(
      'renderIndex:',
      this.preCellIndexes,
      indexes,
    );
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
      const allCells = getAllChildCells(
        this.panelGroup.getChildren() as IElement[],
        DataCell,
      );
      // remove cell from panelCell
      each(remove, ([i, j]) => {
        const findOne = find(
          allCells,
          (cell) => cell.get('name') === `${i}-${j}`,
        );
        findOne?.remove(true);
      });
      updateMergedCells(this.spreadsheet);
      DebuggerUtil.getInstance().logger(
        `Render Cell Panel: ${allCells?.length}, Add: ${add?.length}, Remove: ${remove?.length}`,
      );
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

  protected init() {
    // layout
    DebuggerUtil.getInstance().debugCallback(DEBUG_HEADER_LAYOUT, () => {
      this.layoutResult = this.doLayout();
      this.saveInitColumnLeafNodes(this.layoutResult.colLeafNodes);
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
    if (seriesNumberWidth > 0 && !this.rowIndexHeader) {
      this.rowIndexHeader = this.getSeriesNumberHeader();
    }
    this.cornerHeader = this.getCornerHeader();
    this.centerFrame = this.getCenterFrame();

    if (this.rowIndexHeader) {
      this.foregroundGroup.add(this.rowIndexHeader);
    }
    if (this.rowHeader) {
      this.foregroundGroup.add(this.rowHeader);
    }
    this.foregroundGroup.add(this.columnHeader);
    this.foregroundGroup.add(this.cornerHeader);
    this.foregroundGroup.add(this.centerFrame);
  }

  protected getRowHeader(): RowHeader {
    if (!this.rowHeader) {
      const { y, viewportHeight, viewportWidth, height } = this.panelBBox;
      const seriesNumberWidth = this.getSeriesNumberWidth();
      return new RowHeader({
        width: this.cornerBBox.width,
        height,
        viewportWidth,
        viewportHeight,
        position: { x: 0, y },
        data: this.layoutResult.rowNodes,
        hierarchyType: this.cfg.hierarchyType,
        linkFields: this.cfg.spreadsheet.options?.interaction?.linkFields ?? [],
        seriesNumberWidth,
        spreadsheet: this.spreadsheet,
      });
    }
    return this.rowHeader;
  }

  protected getColHeader(): ColHeader {
    if (!this.columnHeader) {
      const { x, width, viewportHeight, viewportWidth } = this.panelBBox;
      return new ColHeader({
        width,
        cornerWidth: this.cornerBBox.width,
        height: this.cornerBBox.height,
        viewportWidth,
        viewportHeight,
        position: { x, y: 0 },
        data: this.layoutResult.colNodes,
        scrollContainsRowHeader:
          this.cfg.spreadsheet.isScrollContainsRowHeader(),
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
      const { viewportWidth, viewportHeight } = this.panelBBox;
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
        viewportWidth,
        viewportHeight,
        showViewportLeftShadow: false,
        showViewportRightShadow: false,
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

    const maxScrollY = Math.max(
      0,
      this.viewCellHeights.getTotalHeight() - this.panelBBox.viewportHeight,
    );

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
    const { interaction } = this.spreadsheet;
    // 如果是选中单元格状态, 则继续保留 hover 拦截, 避免滚动后 hover 清空已选单元格
    if (!interaction.isSelectedState()) {
      this.spreadsheet.interaction.removeIntercepts([InterceptType.HOVER]);
    }
  }, 300);

  protected saveInitColumnLeafNodes(columnNodes: Node[] = []) {
    const { store, options } = this.spreadsheet;
    const { hiddenColumnFields } = options.interaction;

    // 当前显示的 + 被隐藏的
    const originalColumnsLength =
      columnNodes.length + hiddenColumnFields.length;
    const initColumnLeafNodes = store.get('initColumnLeafNodes', []);

    if (originalColumnsLength !== initColumnLeafNodes.length) {
      store.set('initColumnLeafNodes', columnNodes);
    }
  }
}
