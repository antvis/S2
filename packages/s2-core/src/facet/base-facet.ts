import { BBox, Group, IGroup, Point } from '@antv/g-canvas';
import * as _ from 'lodash';
import {
  calculateInViewIndexes,
  optimizeScrollXY,
  translateGroup,
} from './utils';
import { diffIndexes, Indexes } from '@/utils/indexes';
import {
  Formatter,
  LayoutResult,
  OffsetConfig,
  SpreadSheetFacetCfg,
} from '../common/interface';
import {
  DEBUG_HEADER_LAYOUT,
  DEBUG_VIEW_RENDER,
  DebuggerUtil,
} from '../common/debug';
import { SpreadSheet } from 'src/sheet-type';
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
import { Node } from 'src/facet/layout/node';
import { ViewCellHeights } from 'src/facet/layout/interface';
import { Hierarchy } from 'src/facet/layout/hierarchy';
import { Wheel } from '@antv/g-gesture';
import * as d3Timer from 'd3-timer';
import { interpolateArray } from 'd3-interpolate';
import { ScrollBar, ScrollType } from 'src/ui/scrollbar';
import { getTheme } from 'src/theme';
import { isMobile } from 'src/utils/is-mobile';
import {
  ColHeader,
  CornerHeader,
  Frame,
  RowHeader,
  SeriesNumberHeader,
} from 'src/facet/header';
import { BaseCell } from 'src/cell';
import { updateMergedCells } from 'src/utils/interactions/merge-cells';
import { CellScrollPosition } from 'src/common/interface/events';

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

  protected wheelEvent: null | (() => any);

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

  protected scrollBarSize = getTheme('default').scrollBar.size;

  protected scrollBarTheme = {
    default: {
      thumbColor: isMobile() ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.15)',
      size: isMobile() ? this.scrollBarSize / 2 : this.scrollBarSize,
    },
  };

  hideScrollBar = _.debounce(() => {
    // only work in mobile
    if (isMobile()) {
      this.hRowScrollBar?.updateTheme(this.scrollBarTheme);
      this.hScrollBar?.updateTheme(this.scrollBarTheme);
      this.vScrollBar?.updateTheme(this.scrollBarTheme);
    }
  }, 1000);

  protected scrollBarTouchTheme = {
    default: {
      thumbColor: 'rgba(0,0,0,0.15)',
      size: isMobile() ? this.scrollBarSize / 2 : this.scrollBarSize,
    },
  };

  protected preCellIndexes: Indexes;

  public constructor(cfg: SpreadSheetFacetCfg) {
    this.cfg = cfg;
    this.spreadsheet = cfg.spreadsheet;
    this.init();
  }

  handlePCWheelEvent(ev: WheelEvent & { layerX: number; layerY: number }) {
    this.onWheel(ev);
  }

  bindEvents = () => {
    if (!this.wheelEvent) {
      this.wheelEvent = this.handlePCWheelEvent.bind(this);
    }
    (this.spreadsheet.container.get('el') as HTMLElement).addEventListener(
      'wheel',
      this.wheelEvent,
    );

    // mock wheel event fo mobile
    this.mobileWheel = new Wheel(this.spreadsheet.container);

    this.mobileWheel.on('wheel', (ev) => {
      const originEvent = ev.event;
      const { deltaX, deltaY, x, y } = ev;
      // The coordinates of mobile and pc are three times different
      this.onWheel({
        ...originEvent,
        deltaX,
        deltaY,
        layerX: x / 3,
        layerY: y / 3,
      });
    });

    this.emitPaginationEvent();
  };

  /**
   * Start render, call from outside
   */
  public render(): void {
    this.renderHeaders();
    this.renderScrollBars();
    this.dynamicRenderCell(false);
  }

  public getSeriesNumberWidth(): number {
    const showSeriesNumber = _.get(
      this.cfg.spreadsheet,
      'options.showSeriesNumber',
      false,
    );
    return showSeriesNumber
      ? _.get(this.cfg, 'spreadsheet.theme.header.seriesNumberWidth')
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
  }

  setScrollOffset = (scrollX: number, scrollY: number, hScrollX: number) => {
    if (!_.isUndefined(scrollX)) {
      this.spreadsheet.store.set('scrollX', Math.floor(scrollX));
    }
    if (!_.isUndefined(scrollY)) {
      this.spreadsheet.store.set('scrollY', Math.floor(scrollY));
    }

    if (!_.isUndefined(hScrollX)) {
      this.spreadsheet.store.set('hRowScrollX', Math.floor(hScrollX));
    }
  };

  getScrollOffset = (): [number, number, number] => {
    return [
      this.spreadsheet.store.get('scrollX', 0),
      this.spreadsheet.store.get('scrollY', 0),
      this.spreadsheet.store.get('hRowScrollX', 0),
    ];
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
      this.wheelEvent,
    );
    this.mobileWheel.destroy();
    this.setScrollOffset(undefined, undefined, 0);
    this.setScrollOffset(undefined, undefined, 0);
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
        y: 0,
        width,
        height,
      },
    });
  };

  calculateCellWidthHeight = () => {
    const { colLeafNodes } = this.layoutResult;
    const widths = _.reduce(
      colLeafNodes,
      (result: number[], node: Node) => {
        result.push(_.last(result) + node.width);
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
  calculateXYIndexes = (scrollX: number, scrollY: number): Indexes => {
    return calculateInViewIndexes(
      scrollX,
      scrollY,
      this.viewCellWidths,
      this.viewCellHeights,
      this.panelBBox,
      this.getRealScrollX(this.cornerBBox.width),
    );
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
    let renderWidth;
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
      x: corner.maxX,
      y: corner.maxY,
    };
    const box = this.getCanvasHW();
    let width = box.width - br.x;
    let height =
      box.height - br.y - _.get(this.cfg, 'spreadsheet.theme.scrollBar.size');

    const realWidth = this.getRealWidth();
    const realHeight = this.getRealHeight();

    width = Math.min(width, realWidth);
    height = Math.min(height, realHeight);
    this.panelBBox = {
      x: br.x,
      y: br.y,
      width,
      height,
      maxX: br.x + width,
      maxY: br.y + height,
      minX: br.x,
      minY: br.y,
    };
  };

  getRealWidth = (): number => {
    return _.last(this.viewCellWidths);
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
      children[i].remove();
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
    const oldOffset = this.getScrollOffset();
    const newOffset = [
      newX === undefined ? oldOffset[0] : newX,
      newY === undefined ? oldOffset[1] : newY,
    ];
    const interpolate = interpolateArray(oldOffset, newOffset);
    this.timer = d3Timer.timer((elapsed) => {
      const ratio = Math.min(elapsed / duration, 1);
      const [scrollX, scrollY] = interpolate(ratio);
      this.setScrollOffset(scrollX, scrollY, undefined);
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
    this.setScrollOffset(newX, newY, undefined);
    this.startScroll(newX, newY);
  };

  startScroll = (newX: number, newY: number) => {
    const [scrollX, scrollY] = this.getScrollOffset();
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
        this.setScrollOffset(undefined, undefined, hRowScrollX);
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
        this.setScrollOffset(
          (thumbOffset / this.hScrollBar.trackLen) * finaleRealWidth,
          undefined,
          undefined,
        );
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
        this.setScrollOffset(undefined, getOffsetTop(thumbOffset), undefined);
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

  getOptimizedThumbOffsetTop = (deltaY: number) => {
    return (
      this.vScrollBar?.thumbOffset +
      Math.max(-MAX_SCROLL_OFFSET, Math.min(deltaY / 8, MAX_SCROLL_OFFSET))
    );
  };

  onWheel = (event: WheelEvent & { layerX: number; layerY: number }) => {
    const { deltaX, deltaY, layerX, layerY } = event;
    const [x, y] = optimizeScrollXY(deltaX, deltaY);

    if (this.shouldPreventWheelEvent(x, y)) {
      event.preventDefault();
    }

    if (x > 0) {
      // Scroll left, show scroll bar
      this.hRowScrollBar?.updateTheme(this.scrollBarTouchTheme);
      this.hScrollBar?.updateTheme(this.scrollBarTouchTheme);
    }

    if (y > 0) {
      // Scroll top, show scroll bar
      this.vScrollBar?.updateTheme(this.scrollBarTouchTheme);
    }
    // Optimize scroll speed
    if (this.hRowScrollBar) {
      // When rowScrollBar is exists, scrolling is only valid at the corresponding render range
      if (
        layerX > this.panelBBox.minX &&
        layerX < this.panelBBox.maxX &&
        layerY > this.panelBBox.minY &&
        layerY < this.panelBBox.maxY &&
        this.hScrollBar
      ) {
        this.hScrollBar.updateThumbOffset(this.hScrollBar.thumbOffset + x / 8);
      }
      if (
        layerX > this.cornerBBox.minX &&
        layerX < this.cornerBBox.maxX &&
        layerY > this.cornerBBox.minY &&
        layerY < this.cornerBBox.maxY + this.panelBBox.height
      ) {
        this.hRowScrollBar.updateThumbOffset(
          this.hRowScrollBar.thumbOffset + x / 8,
        );
      }
    } else if (this.hScrollBar) {
      this.hScrollBar.updateThumbOffset(this.hScrollBar.thumbOffset + x / 8);
    }
    this.vScrollBar?.updateThumbOffset(this.getOptimizedThumbOffsetTop(y));
    this.hideScrollBar();
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
    translateGroup(
      this.panelGroup,
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
    this.panelGroup.setClip({
      type: 'rect',
      attrs: {
        x: this.cfg.spreadsheet.freezeRowHeader() ? scrollX : 0,
        y: scrollY,
        width:
          this.panelBBox.width +
          (this.cfg.spreadsheet.freezeRowHeader() ? 0 : scrollX),
        height: this.panelBBox.height,
      },
    });
  };

  realCellRender = (scrollX: number, scrollY: number) => {
    const indexes = this.calculateXYIndexes(scrollX, scrollY);
    // DebuggerUtil.getInstance().logger(
    //   'renderIndex:',
    //   this.preCellIndexes,
    //   indexes,
    // );
    const { add, remove } = diffIndexes(this.preCellIndexes, indexes);

    DebuggerUtil.getInstance().debugCallback(DEBUG_VIEW_RENDER, () => {
      // add new cell in panelCell
      _.each(add, ([i, j]) => {
        const viewMeta = this.layoutResult.getCellMeta(j, i);
        if (viewMeta) {
          const cell = this.cfg.dataCell(viewMeta);
          // mark cell for removing
          cell.set('name', `${i}-${j}`);
          this.panelGroup.add(cell);
        }
      });
      const allCells = _.filter(
        this.panelGroup.getChildren(),
        (child) => child instanceof BaseCell,
      );
      // remove cell from panelCell
      _.each(remove, ([i, j]) => {
        const findOne = _.find(
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
  debounceRenderCell = _.debounce((scrollX: number, scrollY: number) => {
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
    const [scrollX, scrollY, rowScrollX] = this.getScrollOffset();
    const { width, height } = this.panelBBox;
    const realWidth = this.layoutResult.colsHierarchy.width;
    const realHeight = this.getRealHeight();

    // scroll row header separate from the whole canvas
    this.renderRowScrollBar(rowScrollX);

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
        linkFieldIds: _.get(this.cfg.spreadsheet, 'options.linkFieldIds'),
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
        showCornerRightShadow: !_.isNil(this.hRowScrollBar),
        // When both a row header and a panel scroll bar exist, show viewport shadow
        showViewPortRightShadow:
          !_.isNil(this.hRowScrollBar) && !_.isNil(this.hScrollBar),
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
    const [scrollX, sy, hRowScroll] = this.getScrollOffset();
    const scrollY = sy + this.getPaginationScrollY();
    if (delay) {
      this.debounceRenderCell(scrollX, scrollY);
    } else {
      this.realCellRender(scrollX, scrollY);
    }
    this.translateRelatedGroups(scrollX, scrollY, hRowScroll);

    const cellScrollData: CellScrollPosition = { scrollX, scrollY };
    this.spreadsheet.emit(KEY_CELL_SCROLL, cellScrollData);
  }

  protected abstract doLayout(): LayoutResult;

  protected abstract getViewCellHeights(
    layoutResult: LayoutResult,
  ): ViewCellHeights;
}
