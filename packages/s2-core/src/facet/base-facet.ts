import { Group, type FederatedPointerEvent as GraphEvent, Rect } from '@antv/g';
import { interpolateArray } from 'd3-interpolate';
import { timer, type Timer } from 'd3-timer';
import {
  clamp,
  debounce,
  each,
  find,
  get,
  isFunction,
  isUndefined,
  last,
  reduce,
} from 'lodash';
import { DataCell } from '../cell';
import {
  InterceptType,
  KEY_GROUP_COL_RESIZE_AREA,
  KEY_GROUP_CORNER_RESIZE_AREA,
  KEY_GROUP_ROW_INDEX_RESIZE_AREA,
  KEY_GROUP_ROW_RESIZE_AREA,
  MIN_SCROLL_BAR_HEIGHT,
  S2Event,
  ScrollbarPositionType,
} from '../common/constant';
import {
  DebuggerUtil,
  DEBUG_HEADER_LAYOUT,
  DEBUG_VIEW_RENDER,
} from '../common/debug';
import type {
  CellCustomWidth,
  FrameConfig,
  GridInfo,
  LayoutResult,
  OffsetConfig,
  S2CellType,
  SpreadSheetFacetCfg,
  ViewMeta,
} from '../common/interface';
import type {
  ScrollOffset,
  CellScrollPosition,
  CellScrollOffset,
} from '../common/interface/scroll';
import type { SpreadSheet } from '../sheet-type';
import { ScrollBar, ScrollType } from '../ui/scrollbar';
import { getAdjustedRowScrollX, getAdjustedScrollOffset } from '../utils/facet';
import { getAllChildCells } from '../utils/get-all-child-cells';
import { getColsForGrid, getRowsForGrid } from '../utils/grid';
import { diffPanelIndexes, type PanelIndexes } from '../utils/indexes';
import { isMobile } from '../utils/is-mobile';
import { DEFAULT_PAGE_INDEX } from '../common/constant/pagination';
import MobileWheel from './mobile/Wheel';
import { CornerBBox } from './bbox/cornerBBox';
import { PanelBBox } from './bbox/panelBBox';
import {
  ColHeader,
  CornerHeader,
  Frame,
  RowHeader,
  SeriesNumberHeader,
} from './header';
import type { ViewCellHeights } from './layout/interface';
import type { Node } from './layout/node';
import {
  calculateInViewIndexes,
  getCellRange,
  optimizeScrollXY,
  translateGroup,
} from './utils';

export abstract class BaseFacet {
  // spreadsheet instance
  public spreadsheet: SpreadSheet;

  // corner box
  public cornerBBox: CornerBBox;

  // viewport cells box
  public panelBBox: PanelBBox;

  // background (useless now)
  public backgroundGroup: Group;

  // render viewport cell
  public panelGroup: Group;

  // render header/corner/scrollbar/resize
  public foregroundGroup: Group;

  public cfg: SpreadSheetFacetCfg;

  public layoutResult: LayoutResult;

  public viewCellWidths: number[];

  public viewCellHeights: ViewCellHeights;

  protected mobileWheel: MobileWheel;

  protected timer: Timer;

  public hScrollBar: ScrollBar;

  public hRowScrollBar: ScrollBar;

  public vScrollBar: ScrollBar;

  public rowHeader: RowHeader;

  public columnHeader: ColHeader;

  public cornerHeader: CornerHeader;

  public rowIndexHeader: SeriesNumberHeader;

  public centerFrame: Frame;

  public gridInfo: GridInfo;

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

  protected getCellCustomWidth(node: Node, width: CellCustomWidth) {
    return isFunction(width) ? width?.(node) : width;
  }

  protected getCellDraggedWidth(node: Node): number {
    const { colCfg } = this.cfg;
    return get(colCfg?.widthByFieldValue, `${node.value}`, node.width);
  }

  hideScrollBar = () => {
    // TODO: 替换为新方法
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
    if (isMobile()) {
      this.onContainerWheelForMobile();
    } else {
      this.onContainerWheelForPc();
    }
  };

  onContainerWheelForPc = () => {
    const canvas = this.spreadsheet.getCanvasElement();
    canvas?.addEventListener('wheel', this.onWheel);
  };

  onContainerWheelForMobile = () => {
    this.mobileWheel = new MobileWheel(this.spreadsheet.container);
    this.mobileWheel.on('wheel', (ev) => {
      this.spreadsheet.hideTooltip();
      const originEvent = ev.event;
      const { deltaX, deltaY, x, y } = ev;
      // The coordinates of mobile and pc are three times different
      this.onWheel({
        ...originEvent,
        deltaX,
        deltaY,
        offsetX: x,
        offsetY: y,
      } as unknown as WheelEvent);
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
    this.dynamicRenderCell();
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
    if (offsetConfig.offsetX?.value !== undefined) {
      if (offsetConfig.offsetX?.animate) {
        this.scrollWithAnimation(offsetConfig);
      } else {
        this.scrollImmediately(offsetConfig);
      }
      return;
    }

    if (offsetConfig.offsetY?.value !== undefined) {
      if (offsetConfig.offsetY?.animate) {
        this.scrollWithAnimation(offsetConfig);
      } else {
        this.scrollImmediately(offsetConfig);
      }
    }
  }

  public getPaginationScrollY(): number {
    const { pagination } = this.cfg;
    if (pagination) {
      const { current = DEFAULT_PAGE_INDEX, pageSize } = pagination;
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
      const { current = DEFAULT_PAGE_INDEX, pageSize } = pagination;
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
    const canvas = this.spreadsheet.getCanvasElement();
    canvas?.removeEventListener('wheel', this.onWheel);
    this.mobileWheel?.destroy();
  };

  clipPanelGroup = () => {
    this.foregroundGroup = this.spreadsheet.foregroundGroup;
    this.backgroundGroup = this.spreadsheet.backgroundGroup;
    this.panelGroup = this.spreadsheet.panelGroup;
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
    const children = this.panelGroup.children;
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];
      if (child instanceof Group) {
        child.removeChildren();
      } else {
        children[i].remove();
      }
    }
    this.foregroundGroup.removeChildren();
    this.backgroundGroup.removeChildren();
  };

  scrollWithAnimation = (
    offsetConfig: OffsetConfig = {},
    duration = 200,
    cb?: () => void,
  ) => {
    const { scrollX: adjustedScrollX, scrollY: adjustedScrollY } =
      this.getAdjustedScrollOffset({
        scrollX: offsetConfig.offsetX?.value || 0,
        scrollY: offsetConfig.offsetY?.value || 0,
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
      this.startScroll();
      if (elapsed > duration) {
        this.timer.stop();
        cb?.();
      }
    });
  };

  scrollImmediately = (offsetConfig: OffsetConfig = {}) => {
    const { scrollX, scrollY } = this.getAdjustedScrollOffset({
      scrollX: offsetConfig.offsetX?.value || 0,
      scrollY: offsetConfig.offsetY?.value || 0,
    });
    this.setScrollOffset({ scrollX, scrollY });
    this.startScroll();
  };

  /**
   *
   * @param skipSrollEvent 如为true则不触发S2Event.GLOBAL_SCROLL
   */
  startScroll = (skipSrollEvent = false) => {
    const { scrollX, scrollY } = this.getScrollOffset();

    this.hScrollBar?.onlyUpdateThumbOffset(
      this.getScrollBarOffset(scrollX, this.hScrollBar),
    );

    this.vScrollBar?.onlyUpdateThumbOffset(
      this.getScrollBarOffset(scrollY, this.vScrollBar),
    );
    this.dynamicRenderCell(skipSrollEvent);
  };

  getRendererHeight = () => {
    const { start, end } = this.getCellRange();
    return (
      this.viewCellHeights.getCellOffsetY(end + 1) -
      this.viewCellHeights.getCellOffsetY(start)
    );
  };

  private getAdjustedScrollOffset = ({
    scrollX,
    scrollY,
    hRowScrollX,
  }: ScrollOffset): ScrollOffset => {
    return {
      scrollX: getAdjustedScrollOffset(
        scrollX,
        this.layoutResult.colsHierarchy.width,
        this.panelBBox.width,
      ),
      scrollY: getAdjustedScrollOffset(
        scrollY,
        this.getRendererHeight(),
        this.panelBBox.height,
      ),
      hRowScrollX: getAdjustedRowScrollX(hRowScrollX, this.cornerBBox),
    };
  };

  renderRowScrollBar = (rowScrollX: number) => {
    if (
      !this.cfg.spreadsheet.isScrollContainsRowHeader() &&
      this.cornerBBox.width < this.cornerBBox.originalWidth
    ) {
      const maxOffset = this.cornerBBox.originalWidth - this.cornerBBox.width;
      const { maxY } = this.getScrollbarPosition();
      const { verticalBorderWidth } = this.spreadsheet.theme.splitLine;

      const thumbSize =
        (this.cornerBBox.width * this.cornerBBox.width) /
        this.cornerBBox.originalWidth;

      // 行头有分割线, 滚动条应该预留分割线的宽度
      const displayThumbSize = thumbSize - verticalBorderWidth;

      this.hRowScrollBar = new ScrollBar({
        isHorizontal: true,
        trackLen: this.cornerBBox.width,
        thumbLen: displayThumbSize,
        position: {
          x: this.cornerBBox.minX + this.scrollBarSize / 2,
          y: maxY,
        },
        thumbOffset:
          (rowScrollX * (this.cornerBBox.width - thumbSize)) / maxOffset,
        theme: this.scrollBarTheme,
        scrollTargetMaxOffset: maxOffset,
      });

      this.hRowScrollBar.addEventListener(
        ScrollType.ScrollChange,
        ({ offset }) => {
          const newOffset = this.getValidScrollBarOffset(offset, maxOffset);
          const hRowScrollX = Math.floor(newOffset);
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

          const scrollBarOffsetX = this.getScrollBarOffset(
            hRowScrollX,
            this.hRowScrollBar,
          );

          const position: CellScrollPosition = {
            scrollX: scrollBarOffsetX,
            scrollY: 0,
          };

          this.hRowScrollBar.updateThumbOffset(scrollBarOffsetX, false);
          this.spreadsheet.emit(S2Event.ROW_CELL_SCROLL, position);
          this.spreadsheet.emit(S2Event.GLOBAL_SCROLL, position);
        },
      );
      this.foregroundGroup.appendChild(this.hRowScrollBar);
    }
  };

  getValidScrollBarOffset = (offset: number, maxOffset: number) => {
    return clamp(offset, 0, maxOffset);
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
        position: finalPosition,
        thumbOffset: (scrollX * (finalWidth - thumbLen)) / maxOffset,
        theme: this.scrollBarTheme,
        scrollTargetMaxOffset: maxOffset,
      });

      this.hScrollBar.addEventListener(
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

      this.foregroundGroup.appendChild(this.hScrollBar);
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

      this.vScrollBar.addEventListener(
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

      this.foregroundGroup.appendChild(this.vScrollBar);
    }
  };

  // (滑动 offset / 最大 offset（滚动对象真正长度 - 轨道长）) = (滑块 offset / 最大滑动距离（轨道长 - 滑块长）)
  getScrollBarOffset = (offset: number, scrollbar: ScrollBar) => {
    const { trackLen, thumbLen, scrollTargetMaxOffset } = scrollbar;
    return (offset * (trackLen - thumbLen)) / scrollTargetMaxOffset;
  };

  isScrollOverThePanelArea = ({ offsetX, offsetY }: CellScrollOffset) => {
    return (
      offsetX > this.panelBBox.minX &&
      offsetX < this.panelBBox.maxX &&
      offsetY > this.panelBBox.minY &&
      offsetY < this.panelBBox.maxY
    );
  };

  isScrollOverTheCornerArea = ({ offsetX, offsetY }: CellScrollOffset) => {
    return (
      offsetX > this.cornerBBox.minX &&
      offsetX < this.cornerBBox.maxX &&
      offsetY > this.cornerBBox.minY &&
      offsetY < this.cornerBBox.maxY + this.panelBBox.height
    );
  };

  updateHorizontalRowScrollOffset = ({
    offset,
    offsetX,
    offsetY,
  }: CellScrollOffset) => {
    // 在行头区域滚动时 才更新行头水平滚动条
    if (this.isScrollOverTheCornerArea({ offsetX, offsetY })) {
      this.hRowScrollBar?.emitScrollChange(offset);
    }
  };

  updateHorizontalScrollOffset = ({
    offset,
    offsetX,
    offsetY,
  }: CellScrollOffset) => {
    // 1.行头没有滚动条 2.在数值区域滚动时 才更新数值区域水平滚动条
    if (
      !this.hRowScrollBar ||
      this.isScrollOverThePanelArea({ offsetX, offsetY })
    ) {
      this.hScrollBar?.emitScrollChange(offset);
    }
  };

  isScrollToLeft = ({ deltaX, offsetX, offsetY }: CellScrollOffset) => {
    if (!this.hScrollBar && !this.hRowScrollBar) {
      return true;
    }

    const isScrollRowHeaderToLeft =
      !this.hRowScrollBar ||
      this.isScrollOverThePanelArea({ offsetY, offsetX }) ||
      this.hRowScrollBar.thumbOffset <= 0;

    const isScrollPanelToLeft =
      !this.hScrollBar || this.hScrollBar.thumbOffset <= 0;

    return deltaX <= 0 && isScrollPanelToLeft && isScrollRowHeaderToLeft;
  };

  isScrollToRight = ({ deltaX, offsetX, offsetY }: CellScrollOffset) => {
    if (!this.hScrollBar && !this.hRowScrollBar) {
      return true;
    }

    const viewportWidth = this.spreadsheet.isFrozenRowHeader()
      ? this.panelBBox?.width
      : this.panelBBox?.maxX;

    const isScrollRowHeaderToRight =
      !this.hRowScrollBar ||
      this.isScrollOverThePanelArea({ offsetY, offsetX }) ||
      this.hRowScrollBar?.thumbOffset + this.hRowScrollBar?.thumbLen >=
        this.cornerBBox.width;

    const isScrollPanelToRight =
      (this.hRowScrollBar &&
        this.isScrollOverTheCornerArea({ offsetX, offsetY })) ||
      this.hScrollBar?.thumbOffset + this.hScrollBar?.thumbLen >= viewportWidth;

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

  isHorizontalScrollOverTheViewport = (scrollOffset: CellScrollOffset) => {
    return (
      !this.isScrollToLeft(scrollOffset) && !this.isScrollToRight(scrollOffset)
    );
  };

  /**
    在当前表格滚动分两种情况:
    1. 当前表格无滚动条: 无需阻止外部容器滚动
    2. 当前表格有滚动条:
      - 未滚动到顶部或底部: 当前表格滚动, 阻止外部容器滚动
      - 滚动到顶部或底部: 恢复外部容器滚动
  */
  isScrollOverTheViewport = (scrollOffset: CellScrollOffset) => {
    const { deltaY, deltaX, offsetY } = scrollOffset;
    const isScrollOverTheHeader = offsetY <= this.cornerBBox.maxY;
    // 光标在角头或列头时, 不触发表格自身滚动
    if (isScrollOverTheHeader) {
      return false;
    }
    if (deltaY !== 0) {
      return this.isVerticalScrollOverTheViewport(deltaY);
    }
    if (deltaX !== 0) {
      return this.isHorizontalScrollOverTheViewport(scrollOffset);
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

  /**
    https://developer.mozilla.org/zh-CN/docs/Web/CSS/overscroll-behavior
    阻止外部容器滚动: 表格是虚拟滚动, 这里按照标准模拟浏览器的 [overscroll-behavior] 实现
    1. auto => 只有在滚动到表格顶部或底部时才触发外部容器滚动
    1. contain => 默认的滚动边界行为不变（“触底”效果或者刷新），但是临近的滚动区域不会被滚动链影响到
    2. none => 临近滚动区域不受到滚动链影响，而且默认的滚动到边界的表现也被阻止
    所以只要不为 `auto`, 或者表格内, 都需要阻止外部容器滚动
  */
  private stopScrollChainingIfNeeded = (event: WheelEvent) => {
    const { interaction } = this.spreadsheet.options;

    if (interaction.overscrollBehavior !== 'auto') {
      this.stopScrollChaining(event);
    }
  };

  private stopScrollChaining = (event: WheelEvent) => {
    event?.preventDefault?.();
    // 移动端的 prevent 存在于 originalEvent上
    (event as unknown as GraphEvent)?.originalEvent?.preventDefault?.();
  };

  onWheel = (event: WheelEvent) => {
    const { interaction } = this.spreadsheet.options;
    const { deltaX, deltaY, offsetX, offsetY } = event;
    const [optimizedDeltaX, optimizedDeltaY] = optimizeScrollXY(
      deltaX,
      deltaY,
      interaction.scrollSpeedRatio,
    );

    this.spreadsheet.hideTooltip();
    this.spreadsheet.interaction.clearHoverTimer();

    if (
      !this.isScrollOverTheViewport({
        deltaX: optimizedDeltaX,
        deltaY: optimizedDeltaY,
        offsetX,
        offsetY,
      })
    ) {
      this.stopScrollChainingIfNeeded(event);
      return;
    }

    this.stopScrollChaining(event);

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
          offsetX,
          offsetY,
          offset: optimizedDeltaX + hRowScrollX,
        });
        this.updateHorizontalScrollOffset({
          offsetX,
          offsetY,
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
    panelScrollGroup?.appendChild(cell);
    this.spreadsheet.emit(S2Event.LAYOUT_CELL_MOUNTED, cell);
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
          cell.name = `${i}-${j}`;
          this.addCell(cell);
        }
      });
      const allCells = getAllChildCells(
        this.panelGroup.children,
        DataCell,
      ) as DataCell[];
      // remove cell from panelCell
      each(remove, ([i, j]) => {
        const findOne = find(allCells, (cell) => cell.name === `${i}-${j}`);
        findOne?.remove();
      });

      DebuggerUtil.getInstance().logger(
        `Render Cell Panel: ${allCells?.length}, Add: ${add?.length}, Remove: ${remove?.length}`,
      );
    });
    this.preCellIndexes = indexes;
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
    const { color, opacity } = this.spreadsheet.theme.background;

    this.backgroundGroup.appendChild(
      new Rect({
        style: {
          fill: color,
          opacity,
          x: 0,
          y: 0,
          width,
          height,
        },
      }),
    );
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
      this.foregroundGroup.appendChild(this.rowIndexHeader);
    }
    if (this.rowHeader) {
      this.foregroundGroup.appendChild(this.rowHeader);
    }
    this.foregroundGroup.appendChild(this.columnHeader);
    this.foregroundGroup.appendChild(this.cornerHeader);
    this.foregroundGroup.appendChild(this.centerFrame);
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

  protected getGridInfo = () => {
    const [colMin, colMax, rowMin, rowMax] = this.preCellIndexes.center;
    const cols = getColsForGrid(colMin, colMax, this.layoutResult.colLeafNodes);
    const rows = getRowsForGrid(rowMin, rowMax, this.viewCellHeights);

    return {
      cols,
      rows,
    };
  };

  public updatePanelScrollGroup() {
    this.gridInfo = this.getGridInfo();
    this.spreadsheet.panelScrollGroup.update(this.gridInfo);
  }

  /**
   *
   * @param skipSrollEvent: 如true则不触发GLOBAL_SCROLL事件
   * During scroll behavior, first call to this method fires immediately and then on interval.
   * @protected
   */
  protected dynamicRenderCell(skipSrollEvent?: boolean) {
    const {
      scrollX,
      scrollY: originalScrollY,
      hRowScrollX,
    } = this.getScrollOffset();
    const defaultScrollY = originalScrollY + this.getPaginationScrollY();
    const scrollY = getAdjustedScrollOffset(
      defaultScrollY,
      this.viewCellHeights.getTotalHeight(),
      this.panelBBox.viewportHeight,
    );

    this.spreadsheet.hideTooltip();
    this.spreadsheet.interaction.clearHoverTimer();

    this.realCellRender(scrollX, scrollY);
    this.updatePanelScrollGroup();
    this.translateRelatedGroups(scrollX, scrollY, hRowScrollX);

    if (!skipSrollEvent) {
      this.emitScrollEvent({ scrollX, scrollY });
    }
    this.onAfterScroll();
  }

  private emitScrollEvent(position: CellScrollPosition) {
    /** @deprecated 请使用 S2Event.GLOBAL_SCROLL 代替 */
    this.spreadsheet.emit(S2Event.LAYOUT_CELL_SCROLL, position);
    this.spreadsheet.emit(S2Event.GLOBAL_SCROLL, position);
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
