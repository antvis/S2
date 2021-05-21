import { BBox } from '@antv/g-canvas';
import { Wheel } from '@antv/g-gesture';
import { ScrollBar, ScrollType } from '../ui/scrollbar';
import { interpolateArray } from 'd3-interpolate';
import * as d3Timer from 'd3-timer';
import {
  get,
  reduce,
  last,
  merge,
  includes,
  isNil,
  each,
  isUndefined,
  debounce,
  filter,
  find,
} from 'lodash';
import {
  calculateInViewIndexes,
  optimizeScrollXY,
  translateGroup,
} from './utils';
import { Formatter } from '../common/interface';
import { diffIndexes, Indexes } from '../utils/indexes';
import { isMobile } from '../utils/is-mobile';
import { BaseCell } from '../cell';
import {
  KEY_AFTER_HEADER_LAYOUT,
  KEY_COL_NODE_BORDER_REACHED,
  KEY_ROW_NODE_BORDER_REACHED,
  KEY_CELL_SCROLL,
  KEY_GROUP_ROW_RESIZER,
  KEY_GROUP_ROW_INDEX_RESIZER,
  KEY_GROUP_CORNER_RESIZER,
  KEY_GROUP_COL_RESIZER,
  MAX_SCROLL_OFFSET,
  MIN_SCROLL_BAR_HEIGHT,
} from '../common/constant';
import { BaseDataSet } from '../data-set';
import { BaseFacet } from './base-facet';
import {
  Frame,
  ColHeader,
  CornerHeader,
  RowHeader,
  SeriesNumberHeader,
} from './header';
import { OffsetConfig, SpreadsheetFacetCfg } from '../common/interface';
import { Layout } from './layout';
import { Hierarchy } from './layout/hierarchy';
import { Node } from './layout/node';
import { DEBUG_VIEW_RENDER, DebuggerUtil } from '../common/debug';

interface Point {
  x: number;
  y: number;
}

export class SpreadsheetFacet extends BaseFacet {
  public cfg: SpreadsheetFacetCfg;

  protected hScrollBar: ScrollBar;

  protected hRowScrollBar: ScrollBar;

  protected vScrollBar: ScrollBar;

  protected rowHeader: RowHeader;

  protected columnHeader: ColHeader;

  protected cornerHeader: CornerHeader;

  protected rowIndexHeader: SeriesNumberHeader;

  protected centerBorder: Frame;

  protected preIndexes: Indexes;

  protected realCornerWidth: number;

  protected scrollBarHeight = 8;

  protected scrollBarTheme = {
    default: {
      thumbColor: isMobile() ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.15)',
      size: isMobile() ? this.scrollBarHeight / 2 : this.scrollBarHeight,
    },
  };

  protected scrollBarTouchTheme = {
    default: {
      thumbColor: 'rgba(0,0,0,0.15)',
      size: isMobile() ? this.scrollBarHeight / 2 : this.scrollBarHeight,
    },
  };

  protected timer: d3Timer.Timer;

  private mobileWheel: Wheel;

  private wheelEvent: null | (() => any);

  constructor(cfg: SpreadsheetFacetCfg) {
    super(cfg);
    // clear scrollX when emit change-row-header-width event, see: interaction/row-col-resize.ts
    this.spreadsheet.on('spreadsheet:change-row-header-width', () => {
      this.setScrollOffset(0, undefined);
      this.setHRowScrollX(0);
    });
  }

  public getDataset(): BaseDataSet {
    return this.cfg.dataSet;
  }

  public getCanvasHW() {
    if (this.spreadsheet) {
      return {
        width: this.cfg.width,
        height: this.cfg.height,
      };
    }
  }

  public getRowHeader(): RowHeader {
    if (this.rowHeader) {
      return this.rowHeader;
    }
    const { y, width, height } = this.viewportBBox;
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

  public getColHeader(): ColHeader {
    if (this.columnHeader) {
      return this.columnHeader;
    }
    const { x, width, height } = this.viewportBBox;
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

  public getContentHeight(): number {
    const { rowsHierarchy, colsHierarchy } = this.layoutResult;
    return rowsHierarchy.height + colsHierarchy.height;
  }

  public getCornerHeader(): CornerHeader {
    if (this.cornerHeader) {
      return this.cornerHeader;
    }
    return CornerHeader.getCornerHeader(
      this.viewportBBox,
      this.cornerBBox,
      this.getSeriesNumberWidth(),
      this.cfg,
      this.layoutResult,
      this.spreadsheet,
    );
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

  protected scrollWithAnimation(offsetConfig: OffsetConfig) {
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
      this.setScrollOffset(scrollX, scrollY);
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
      this.dynamicRender();
      if (elapsed > duration) {
        this.timer.stop();
      }
    });
  }

  protected scrollImmediately(offsetConfig: OffsetConfig) {
    const { x: newX, y: newY } = this.adjustXAndY(
      offsetConfig.offsetX.value,
      offsetConfig.offsetY.value,
    );
    this.setScrollOffset(newX, newY);
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
    this.dynamicRender();
  }

  protected adjustXAndY(x: number, y: number): Point {
    let newX = x;
    let newY = y;
    if (x !== undefined) {
      if (
        x + this.viewportBBox.width >=
        this.layoutResult.colsHierarchy.width
      ) {
        newX = this.layoutResult.colsHierarchy.width - this.viewportBBox.width;
      }
    }
    if (y !== undefined) {
      if (
        y + this.viewportBBox.height >=
        this.layoutResult.rowsHierarchy.height
      ) {
        newY =
          this.layoutResult.rowsHierarchy.height - this.viewportBBox.height;
      }
    }
    return {
      x: newX,
      y: newY,
    };
  }

  protected doLayout(): void {
    this.layoutResult = this.getLayout().doLayout();
    this.spreadsheet.emit(KEY_AFTER_HEADER_LAYOUT, this.layoutResult);
  }

  protected getLayout(): Layout {
    return new Layout(this);
  }

  protected calculateCornerBBox(): BBox {
    const layoutResult = this.layoutResult;
    const { rowsHierarchy, colsHierarchy } = layoutResult;

    const leftWidth = rowsHierarchy.width + this.getSeriesNumberWidth();
    const height = colsHierarchy.height;

    this.realCornerWidth = leftWidth;
    let renderWidth = leftWidth;
    if (!this.cfg.spreadsheet.isScrollContainsRowHeader()) {
      renderWidth = this.getCornerWidth(leftWidth, colsHierarchy);
    }
    return {
      x: 0,
      y: 0,
      width: renderWidth,
      height,
      maxX: renderWidth,
      maxY: height,
      minX: 0,
      minY: 0,
    };
  }

  protected calculateViewportBBox(): BBox {
    const corner = this.cornerBBox;
    const br = {
      x: corner.maxX,
      y: corner.maxY,
    };
    const box = this.getCanvasHW();
    let width = box.width - br.x;
    let height =
      box.height - br.y - get(this.cfg, 'spreadsheet.theme.scrollBar.size');

    const realWidth = this.getRealWidth();
    const realHeight = this.getRealHeight();

    width = Math.min(width, realWidth);
    height = Math.min(height, realHeight);

    return {
      x: br.x,
      y: br.y,
      width,
      height,
      maxX: br.x + width,
      maxY: br.y + height,
      minX: br.x,
      minY: br.y,
    };
  }

  protected calculateViewCellsWH() {
    const { colLeafNodes, rowLeafNodes } = this.layoutResult;

    const width0Indexes = [];
    const widths = reduce(
      colLeafNodes,
      (result: number[], node: Node) => {
        result.push(last(result) + node.width);
        if (node.width === 0) {
          width0Indexes.push(node.colIndex);
        }
        return result;
      },
      [0],
    );

    const height0Indexes = [];
    const heights = reduce(
      rowLeafNodes,
      (result: number[], node: Node) => {
        result.push(last(result) + node.height);
        if (node.isHide()) {
          height0Indexes.push(node.colIndex);
        }
        return result;
      },
      [0],
    );

    // 下钻开启分页后补充空节点
    // 需要把高度为0的补充结点过滤
    const nodes = rowLeafNodes.filter((value) => value.height !== 0);
    const realHeights = reduce(
      nodes,
      (result: number[], node: Node) => {
        result.push(last(result) + node.height);
        if (node.isHide()) {
          height0Indexes.push(node.colIndex);
        }
        return result;
      },
      [0],
    );

    return {
      widths,
      heights,
      width0Indexes,
      height0Indexes,
      realHeights,
    };
  }

  protected getCenterBorder(): Frame {
    if (this.centerBorder) {
      return this.centerBorder;
    }
    const { width, height } = this.viewportBBox;
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

  protected getSeriesNumberHeader(): SeriesNumberHeader {
    return SeriesNumberHeader.getSeriesNumberHeader(
      this.viewportBBox,
      this.getSeriesNumberWidth(),
      this.layoutResult.rowsHierarchy.getNodes(0),
      this.spreadsheet,
      this.cornerBBox.width,
    );
  }

  /**
   * Render all headers in {@link #foregroundGroup}, contains:
   * 1. row header
   * 2. col header
   * 3. center border(weird name @fixme @哦豁)
   * 4. corner header
   * 5. series number header
   */
  protected renderHeaders(): void {
    const seriesNumberWidth = this.getSeriesNumberWidth();

    this.rowHeader = this.getRowHeader();
    this.columnHeader = this.getColHeader();
    if (seriesNumberWidth > 0) {
      this.rowIndexHeader = this.getSeriesNumberHeader();
      this.foregroundGroup.add(this.rowIndexHeader);
    }
    this.cornerHeader = this.getCornerHeader();
    this.centerBorder = this.getCenterBorder();

    this.foregroundGroup.add(this.rowHeader);
    this.foregroundGroup.add(this.columnHeader);
    this.foregroundGroup.add(this.cornerHeader);
    this.foregroundGroup.add(this.centerBorder);
  }

  /**
   * Render all scrollbars, default horizontal scrollbar only control viewport
   * area(it means not contains row header)
   * 1. individual row scrollbar
   * 2. horizontal scroll bar(can control whether contains row header)
   * 3. vertical scroll bar
   */
  protected renderScrollBars(): void {
    const [scrollX, scrollY, rowScrollX] = this.getScrollOffset();
    const { width, height } = this.viewportBBox;
    const realWidth = this.layoutResult.colsHierarchy.width;
    const realHeight = this.getRealHeight();

    // scroll row header separate from the whole canvas
    this.renderRowScrollBar(rowScrollX);

    // render horizontal scroll bar(default not contains row header)
    this.renderHScrollBar(width, realWidth, scrollX);

    // render vertical scroll bar
    this.renderVScrollBar(height, realHeight, scrollY);
  }

  private realCellRender(scrollX: number, scrollY: number) {
    const indexes = this.calculateXYIndexes(scrollX, scrollY);
    const { add, remove } = diffIndexes(this.preIndexes, indexes);
    // Filter cells with width/height of zero
    // TODO brucetoo check if viewCellWidth0Indexes needed
    const newIndexes = add.filter(([i, j]) => {
      return (
        !includes(this.viewCellWidth0Indexes, i) &&
        !includes(this.viewCellHeight0Indexes, j)
      );
    });
    DebuggerUtil.getInstance().debugCallback(DEBUG_VIEW_RENDER, () => {
      // add new cell in panelCell
      each(newIndexes, ([i, j]) => {
        const viewMeta = this.layoutResult.getViewMeta(j, i);
        if (viewMeta) {
          const cell = this.cfg.dataCell(viewMeta);
          // mark cell for removing
          cell.set('name', `${i}-${j}`);
          this.panelGroup.add(cell);
        }
      });
      const allCells = filter(
        this.panelGroup.getChildren(),
        (child) => child instanceof BaseCell,
      );
      // remove cell from panelCell
      each(remove, ([i, j]) => {
        const findOne = find(
          allCells,
          (cell) => cell.get('name') === `${i}-${j}`,
        );
        findOne?.remove(true);
      });
      DebuggerUtil.getInstance().logger(
        `Render Cell Panel: ${allCells?.length}, Add: ${newIndexes?.length}, Remove: ${remove?.length}`,
      );
    });
    this.preIndexes = indexes;
  }

  /**
   * How long about the delay period, need be re-considered,
   * for now only delay, oppose to immediately
   * @private
   */
  private debounceRenderCell = debounce((scrollX: number, scrollY: number) => {
    this.realCellRender(scrollX, scrollY);
  });

  /**
   * When scroll behavior happened, only render one time in a period,
   * but render immediately in initiate
   * @param delay debounce render cell
   * @protected
   */
  protected dynamicRender(delay = true) {
    const [scrollX, sy, hRowScroll] = this.getScrollOffset();
    const scrollY = sy + this.getPaginationScrollY();
    if (delay) {
      this.debounceRenderCell(scrollX, scrollY);
    } else {
      this.realCellRender(scrollX, scrollY);
    }
    this.translateRelatedGroups(scrollX, scrollY, hRowScroll);
    this.spreadsheet.emit(KEY_CELL_SCROLL, { scrollX, scrollY });
  }

  /**
   * Translate panelGroup, rowHeader, cornerHeader, columnHeader ect
   * according to new scroll offset
   * @param scrollX
   * @param scrollY
   * @param hRowScroll
   * @private
   */
  private translateRelatedGroups(
    scrollX: number,
    scrollY: number,
    hRowScroll: number,
  ) {
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
    this.centerBorder.onChangeShadowVisibility(
      scrollX,
      this.getRealWidth() - this.viewportBBox.width,
      false,
    );
    this.centerBorder.onBorderScroll(this.getRealScrollX(scrollX));
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
          this.viewportBBox.width +
          (this.cfg.spreadsheet.freezeRowHeader() ? 0 : scrollX),
        height: this.viewportBBox.height,
      },
    });
  }

  protected fireReachBorderEvent(scrollX: number, scrollY: number) {
    const colNode = this.spreadsheet
      .getColumnNodes()
      .find(
        (value) =>
          includes(this.getScrollColField(), value.field) &&
          scrollX > value.x &&
          scrollX < value.x + value.width,
      );
    const rowNode = this.spreadsheet
      .getRowNodes()
      .find(
        (value) =>
          includes(this.getScrollRowField(), value.field) &&
          scrollY > value.y &&
          scrollY < value.y + value.height,
      );
    const reachedBorderId = this.spreadsheet.store.get('lastReachedBorderId', {
      rowId: '',
      colId: '',
    });
    if (colNode && reachedBorderId.colId !== colNode.id) {
      this.spreadsheet.store.set(
        'lastReachedBorderId',
        merge({}, reachedBorderId, {
          colId: colNode.id,
        }),
      );
      this.spreadsheet.emit(KEY_COL_NODE_BORDER_REACHED, colNode);
    }
    if (rowNode && reachedBorderId.rowId !== rowNode.id) {
      this.spreadsheet.store.set(
        'lastReachedBorderId',
        merge({}, reachedBorderId, {
          rowId: rowNode.id,
        }),
      );
      this.spreadsheet.emit(KEY_ROW_NODE_BORDER_REACHED, rowNode);
    }
  }

  handlePCWheelEvent(ev: WheelEvent & { layerX: number; layerY: number }) {
    this.onWheel(ev);
  }

  protected bindEvents() {
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
  }

  protected unbindEvents(): void {
    (this.spreadsheet.container.get('el') as HTMLElement).removeEventListener(
      'wheel',
      this.wheelEvent,
    );
    this.mobileWheel.destroy();
    this.setHRowScrollX(0);
    this.setHRowScrollX(0);
  }

  protected afterInitial(): void {
    this.emitPagination();
  }

  /**
   * The purpose of this rewrite is to take into account that when rowHeader supports scrollbars
    the viewport viewable area must vary with the horizontal distance of the scroll
   * @param scrollX
   * @param scrollY
   */
  public calculateXYIndexes(scrollX: number, scrollY: number): Indexes {
    return calculateInViewIndexes(
      scrollX,
      scrollY,
      this.viewCellWidths,
      this.viewCellHeights,
      this.viewportBBox,
      this.getRealScrollX(this.cornerBBox.width),
    );
  }

  protected initBackgroundContainer() {
    return this.spreadsheet.backgroundGroup;
  }

  protected initForeGroundContainer() {
    return this.spreadsheet.foregroundGroup;
  }

  protected initPanelContainer() {
    return this.spreadsheet.panelGroup;
  }

  private getScrollColField(): string[] {
    return get(this.spreadsheet, 'options.scrollReachNodeField.colField', []);
  }

  private getScrollRowField(): string[] {
    return get(this.spreadsheet, 'options.scrollReachNodeField.rowField', []);
  }

  private getCornerWidth(leftWidth: number, colsHierarchy: Hierarchy): number {
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
  }

  private renderVScrollBar(
    height: number,
    realHeight: number,
    scrollY: number,
  ) {
    if (height < realHeight) {
      const thumbHeight = Math.max(
        (height / realHeight) * height,
        MIN_SCROLL_BAR_HEIGHT,
      );
      const getOffsetTop = (scrollTop: number) =>
        (scrollTop / (height - thumbHeight)) *
        (realHeight - this.viewportBBox.height);

      this.vScrollBar = new ScrollBar({
        isHorizontal: false,
        trackLen: height,
        thumbLen: thumbHeight,
        thumbOffset: (scrollY * this.viewportBBox.height) / realHeight,
        position: {
          x: this.viewportBBox.maxX - this.scrollBarHeight,
          y: this.viewportBBox.minY,
        },
        theme: this.scrollBarTheme,
      });

      this.vScrollBar.on(ScrollType.ScrollChange, ({ thumbOffset }) => {
        this.setScrollOffset(undefined, getOffsetTop(thumbOffset));
        this.dynamicRender();
      });

      this.foregroundGroup.add(this.vScrollBar);
    }
  }

  private renderHScrollBar(width: number, realWidth: number, scrollX: number) {
    if (Math.floor(width) < Math.floor(realWidth)) {
      const halfScrollSize =
        get(this.cfg, 'spreadsheet.theme.scrollBar.size') / 2;
      const finalWidth =
        width +
        (this.cfg.spreadsheet.isScrollContainsRowHeader()
          ? this.cornerBBox.width
          : 0);
      const finalPosition = {
        x:
          this.viewportBBox.minX +
          (this.cfg.spreadsheet.isScrollContainsRowHeader()
            ? -this.cornerBBox.width + halfScrollSize
            : halfScrollSize),
        y: this.viewportBBox.maxY - this.scrollBarHeight / 2,
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
        );
        this.dynamicRender();
      });

      this.foregroundGroup.add(this.hScrollBar);
    }
  }

  private renderRowScrollBar(rowScrollX: number) {
    if (
      !this.cfg.spreadsheet.isScrollContainsRowHeader() &&
      this.cornerBBox.width < this.realCornerWidth
    ) {
      this.hRowScrollBar = new ScrollBar({
        isHorizontal: true,
        trackLen: this.cornerBBox.width - this.scrollBarHeight / 2,
        thumbLen:
          (this.cornerBBox.width * this.cornerBBox.width) /
          this.realCornerWidth,
        position: {
          x: this.cornerBBox.minX + this.scrollBarHeight / 2,
          y: this.viewportBBox.maxY - this.scrollBarHeight / 2,
        },
        thumbOffset:
          (rowScrollX * this.cornerBBox.width) / this.realCornerWidth,
        theme: this.scrollBarTheme,
      });

      this.hRowScrollBar.on(ScrollType.ScrollChange, ({ thumbOffset }) => {
        const hRowScrollX =
          (thumbOffset / this.hRowScrollBar.trackLen) * this.realCornerWidth;
        this.setHRowScrollX(hRowScrollX);
        this.rowHeader.onRowScrollX(hRowScrollX, KEY_GROUP_ROW_RESIZER);
        this.rowIndexHeader?.onRowScrollX(
          hRowScrollX,
          KEY_GROUP_ROW_INDEX_RESIZER,
        );
        this.centerBorder.onChangeShadowVisibility(
          hRowScrollX,
          this.realCornerWidth -
            this.cornerBBox.width -
            get(this.cfg, 'spreadsheet.theme.scrollBar.size') * 2,
          true,
        );
        this.cornerHeader.onRowScrollX(hRowScrollX, KEY_GROUP_CORNER_RESIZER);
      });
      this.foregroundGroup.add(this.hRowScrollBar);
    }
  }

  public getScrollOffset(): [number, number, number] {
    return [
      this.spreadsheet.store.get('scrollX', 0),
      this.spreadsheet.store.get('scrollY', 0),
      this.spreadsheet.store.get('hRowScrollX', 0),
    ];
  }

  private setScrollOffset(scrollX: number, scrollY: number) {
    if (!isUndefined(scrollX)) {
      this.spreadsheet.store.set('scrollX', Math.floor(scrollX));
    }
    if (!isUndefined(scrollY)) {
      this.spreadsheet.store.set('scrollY', Math.floor(scrollY));
    }
  }

  private setHRowScrollX(hScrollX: number) {
    this.spreadsheet.store.set('hRowScrollX', Math.floor(hScrollX));
  }

  private shouldPreventWheelEvent(x: number, y: number) {
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
  }

  private onWheel(event: WheelEvent & { layerX: number; layerY: number }) {
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
        layerX > this.viewportBBox.minX &&
        layerX < this.viewportBBox.maxX &&
        layerY > this.viewportBBox.minY &&
        layerY < this.viewportBBox.maxY &&
        this.hScrollBar
      ) {
        this.hScrollBar.updateThumbOffset(this.hScrollBar.thumbOffset + x / 8);
      }
      if (
        layerX > this.cornerBBox.minX &&
        layerX < this.cornerBBox.maxX &&
        layerY > this.cornerBBox.minY &&
        layerY < this.cornerBBox.maxY + this.viewportBBox.height
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
  }

  private getOptimizedThumbOffsetTop = (deltaY: number) => {
    return (
      this.vScrollBar?.thumbOffset +
      Math.max(-MAX_SCROLL_OFFSET, Math.min(deltaY / 8, MAX_SCROLL_OFFSET))
    );
  };

  private hideScrollBar = debounce(() => {
    // only work in mobile
    if (isMobile()) {
      this.hRowScrollBar?.updateTheme(this.scrollBarTheme);
      this.hScrollBar?.updateTheme(this.scrollBarTheme);
      this.vScrollBar?.updateTheme(this.scrollBarTheme);
    }
  }, 1000);

  private getRealScrollX(scrollX: number, hRowScroll = 0) {
    return this.cfg.spreadsheet.isScrollContainsRowHeader()
      ? scrollX
      : hRowScroll;
  }

  private getRealWidth(): number {
    return last(this.viewCellWidths);
  }

  private getRealHeight(): number {
    const { pagination } = this.cfg;

    if (pagination) {
      const { current, pageSize } = pagination;
      const heights = this.calculateViewCellsWH().realHeights;

      const start = Math.max((current - 1) * pageSize, 0);
      const end = Math.min(current * pageSize, heights.length - 1);

      // end position - start position = height
      return heights[end] - heights[start];
    }

    return last(this.viewCellHeights);
  }

  /**
   * if pagination exist, adjust scrollY
   * @private
   */
  public getPaginationScrollY(): number {
    const { pagination } = this.cfg;

    if (pagination) {
      const { current, pageSize } = pagination;
      const heights = this.calculateViewCellsWH().realHeights;

      const offset = Math.max((current - 1) * pageSize, 0);

      return heights[offset];
    }

    return 0;
  }

  private emitPagination() {
    const { pagination } = this.cfg;
    if (pagination) {
      const { current, pageSize } = pagination;
      const rowLeafNodes = get(this, 'layoutResult.rowLeafNodes', []);
      const total = rowLeafNodes.length;

      const pageCount = Math.floor((total - 1) / pageSize) + 1;

      this.cfg.spreadsheet.emit('spreadsheet:pagination', {
        pageSize,
        pageCount,
        total,
        current,
      });
    }
  }
}
