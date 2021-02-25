import { BBox, Group, Shape } from '@antv/g-canvas';
import { Wheel } from '@antv/g-gesture';
import { ScrollBar } from '../ui/scrollbar';
import * as d3Ease from 'd3-ease';
import { interpolateArray } from 'd3-interpolate';
import * as d3Timer from 'd3-timer';
import * as _ from 'lodash';
import {
  calculateInViewIndexes,
  optimizeScrollXY,
  translateGroup,
} from './utils';
import { Formatter, Pagination, PlaceHolderMeta } from '../common/interface';
import { diffIndexes, Indexes } from '../utils/indexes';
import { isMobile } from '../utils/is-mobile';
import { BaseCell, DataCell } from '../cell';
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
} from '../common/constant';
import { BaseDataSet, SpreadDataSet } from '../data-set';
import { BaseFacet } from './base-facet';
import {
  Frame,
  ColHeader,
  CornerHeader,
  RowHeader,
  SeriesNumberHeader,
} from './header';
import {
  LayoutResult,
  OffsetConfig,
  SpreadsheetFacetCfg,
  ViewMeta,
} from '../common/interface';
import { Layout } from './layout';
import { Hierarchy } from './layout/hierarchy';
import { Node } from './layout/node';
import { BaseParams } from '../data-set/base-data-set';
import { DEBUG_VIEW_RENDER, DebuggerUtil } from '../common/debug';
import { DataPlaceHolderCell } from '../cell';

interface Point {
  x: number;
  y: number;
}
/**
 * 交叉表自定义分面布局
 */
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

  protected preHideScrollBarHandler;

  protected preRenderHandler;

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

  protected timer: d3Timer.Timer = null;

  // mobileWheel 事件包装
  private mobileWheel: Wheel;

  constructor(cfg: SpreadsheetFacetCfg) {
    super(cfg);
    // 当发生拖拽row-header-width事件时，清空所有滚动条scrollX的值, 见 interaction/row-col-resize.ts
    this.spreadsheet.on('spreadsheet:change-row-header-width', (config) => {
      this.setScrollOffset(0, undefined);
      this.setHRowScrollX(0);
    });
  }

  public getDataset(): BaseDataSet<BaseParams> {
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
    const { x, y, width, height } = this.viewportBBox;
    const seriesNumberWidth = this.getSeriesNumberWidth();
    return new RowHeader({
      width: this.cornerBBox.width,
      height,
      viewportWidth: width,
      viewportHeight: height,
      position: { x: 0, y },
      data: this.layoutResult.rowNodes,
      offset: 0,
      hierarchyType: this.cfg.hierarchyType, // 是否为树状布局
      linkFieldIds: _.get(this.cfg.spreadsheet, 'options.linkFieldIds'),
      seriesNumberWidth,
      spreadsheet: this.spreadsheet,
    });
  }

  public getColHeader(): ColHeader {
    if (this.columnHeader) {
      return this.columnHeader;
    }
    const { x, y, width, height } = this.viewportBBox;
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

  /**
   * 获取内容高度
   */
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
      this.dynamicRender(true);
      if (elapsed > duration) {
        this.timer.stop();
        this.renderAfterScroll();
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
    this.spreadsheet.needUseCacheMeta = true;
    this.dynamicRender(false);
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
      box.height - br.y - _.get(this.cfg, 'spreadsheet.theme.scrollBar.size');

    // 数据量小的时候，width 为实际的数据量大小
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

  // 计算这个 view 分面 cell 占用的宽高序列
  protected calculateViewCellsWH() {
    const { colLeafNodes, rowLeafNodes } = this.layoutResult;

    const width0Indexes = [];
    const widths = _.reduce(
      colLeafNodes,
      (result: number[], node: Node, idx: number) => {
        result.push(_.last(result) + node.width);
        if (node.width === 0) {
          width0Indexes.push(node.cellIndex);
        }
        return result;
      },
      [0],
    );

    const height0Indexes = [];
    const heights = _.reduce(
      rowLeafNodes,
      (result: number[], node: Node, idx: number) => {
        result.push(_.last(result) + node.height);
        if (node.isHide()) {
          height0Indexes.push(node.cellIndex);
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
    };
  }

  protected getCenterBorder(): Frame {
    if (this.centerBorder) {
      return this.centerBorder;
    }
    const { x, y, width, height } = this.viewportBBox;
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
      // 当同时存在行头和panel滚动条时，展示viewport右边的shadow
      showViewPortRightShadow:
        !_.isNil(this.hRowScrollBar) && !_.isNil(this.hScrollBar),
      scrollContainsRowHeader: this.cfg.spreadsheet.isScrollContainsRowHeader(),
      isSpreadsheetType: this.cfg.spreadsheet.isSpreadsheetType(),
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
    // const realHeight = this.layoutResult.rowsHierarchy.height;
    const realHeight = this.getRealHeight();

    // scroll row header separate from the whole canvas
    this.renderRowScrollBar(rowScrollX);

    // render horizontal scroll bar(default not contains row header)
    this.renderHScrollBar(width, realWidth, scrollX);

    // render vertical scroll bar
    this.renderVScrollBar(height, realHeight, scrollY);
  }

  private renderRealCell(indexes: Indexes, placeHolder: boolean) {
    const needDataPlaceHolderCell = this.cfg.needDataPlaceHolderCell;
    const needPlaceHolder = placeHolder && needDataPlaceHolderCell;
    if (!this.preIndexes) {
      this.preIndexes = indexes;
    }
    const preIndexes = needPlaceHolder ? this.preIndexes : null;
    if (!_.isEqual(indexes, preIndexes)) {
      if (needPlaceHolder) {
        this.preIndexes = indexes;
      }
      const { add } = diffIndexes(preIndexes, indexes);
      // 过滤掉宽度/高度 为0的cell
      const newIndexes = add.filter(([i, j]) => {
        return (
          !_.includes(this.viewCellWidth0Indexes, i) &&
          !_.includes(this.viewCellHeight0Indexes, j)
        );
      });
      DebuggerUtil.getInstance().debugCallback(DEBUG_VIEW_RENDER, () => {
        let cacheSize = 0;
        let noCacheSize = 0;
        const { rowLeafNodes, colLeafNodes } = this.layoutResult;
        _.forEach(newIndexes, ([i, j]) => {
          const cacheKey = `${i}-${j}`;
          let cell;
          let viewMeta;
          const row = rowLeafNodes[j];
          const col = colLeafNodes[i];

          if (needPlaceHolder) {
            cell = this.spreadsheet.cellPlaceHolderCache.get(cacheKey);
          } else {
            cell = this.spreadsheet.cellCache.get(cacheKey);
          }
          if (needPlaceHolder) {
            // 是placeHolder场景，且配置了需要显示placeHolder
            viewMeta = {
              x: col.x,
              y: row.y,
              width: col.width,
              height: row.height,
              rowNode: row,
              colNode: col,
              spreadsheet: this.spreadsheet,
            } as PlaceHolderMeta;
          } else {
            // 是否使用meta缓存
            // eslint-disable-next-line no-lonely-if
            if (this.spreadsheet.needUseCacheMeta) {
              viewMeta = this.spreadsheet.viewMetaCache.get(cacheKey);
              if (!viewMeta) {
                // 新增cell的场景可能为viewMeta，重新计算
                viewMeta = this.layoutResult.getViewMeta(j, i);
              } else {
                // 存在缓存，只需要调整cell的宽高度,x,y 信息
                viewMeta.x = col.x;
                viewMeta.y = row.y;
                viewMeta.width = col.width;
                viewMeta.height = row.height;
              }
            } else {
              viewMeta = this.layoutResult.getViewMeta(j, i);
            }
          }
          if (cell) {
            cacheSize++;
            // already cached
            if (viewMeta) {
              cell.set('children', []);
              cell.setMeta(viewMeta);
              this.panelGroup.add(cell);
              if (!placeHolder) {
                // 即使有cell也需要缓存最新的meta值
                this.spreadsheet.viewMetaCache.put(cacheKey, viewMeta);
              }
            }
          } else {
            noCacheSize++;
            // add new cell
            // i = colIndex  j = rowIndex
            if (viewMeta) {
              const newGroup = needPlaceHolder
                ? new DataPlaceHolderCell(viewMeta, this.spreadsheet)
                : this.cfg.dataCell(viewMeta);
              this.panelGroup.add(newGroup);
              if (needPlaceHolder) {
                this.spreadsheet.cellPlaceHolderCache.put(
                  cacheKey,
                  newGroup as DataPlaceHolderCell,
                );
              } else {
                this.spreadsheet.cellCache.put(cacheKey, newGroup as DataCell);
              }
              if (!placeHolder) {
                // 存储非placeHolder的meta
                this.spreadsheet.viewMetaCache.put(cacheKey, viewMeta);
              }
            }
          }
        });
        DebuggerUtil.getInstance().logger(
          `新增单元格个数:${newIndexes.length} 有缓存:${cacheSize} 无缓存:${noCacheSize}`,
        );
      });
      this.spreadsheet.needUseCacheMeta = false;
    }
  }

  /**
   * 动态渲染逻辑, 新增部分只渲染placeHolder
   */
  protected dynamicRender(placeHolder: boolean) {
    const [scrollX, sy, hRowScroll] = this.getScrollOffset();
    const scrollY = sy + this.getDefaultScrollY();
    const indexes = this.calculateXYIndexes(scrollX, scrollY);
    this.renderRealCell(indexes, placeHolder);
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
        x: this.cfg.spreadsheet.freezeRowHeader() ? 0 : scrollX,
        y: scrollY,
        width:
          this.viewportBBox.width +
          (this.cfg.spreadsheet.freezeRowHeader() ? scrollX : 0),
        height: this.viewportBBox.height,
      },
    });
    this.spreadsheet.emit(KEY_CELL_SCROLL, { scrollX, scrollY });
  }

  protected fireReachBorderEvent(scrollX: number, scrollY: number) {
    const colNode = this.spreadsheet
      .getColumnNodes()
      .find(
        (value) =>
          _.includes(this.getScrollColField(), value.field) &&
          scrollX > value.x &&
          scrollX < value.x + value.width,
      );
    const rowNode = this.spreadsheet
      .getRowNodes()
      .find(
        (value) =>
          _.includes(this.getScrollRowField(), value.field) &&
          scrollY > value.y &&
          scrollY < value.y + value.height,
      );
    const reachedBorderId = this.spreadsheet.store.get('lastReachedBorderId', {
      rowId: '',
      colId: '',
    });
    // console.log(scrollY, rowNode, reachedBorderId)
    if (colNode && reachedBorderId.colId !== colNode.id) {
      this.spreadsheet.store.set(
        'lastReachedBorderId',
        _.merge({}, reachedBorderId, {
          colId: colNode.id,
        }),
      );
      this.spreadsheet.emit(KEY_COL_NODE_BORDER_REACHED, colNode);
      // console.log('find colNode', colNode.id)
    }
    if (rowNode && reachedBorderId.rowId !== rowNode.id) {
      this.spreadsheet.store.set(
        'lastReachedBorderId',
        _.merge({}, reachedBorderId, {
          rowId: rowNode.id,
        }),
      );
      this.spreadsheet.emit(KEY_ROW_NODE_BORDER_REACHED, rowNode);
      // console.log('find rowNode', rowNode.id)
    }
  }

  handlePCWheelEvent(ev: WheelEvent & { layerX: number; layerY: number }) {
    this.onWheel(ev);
  }

  /**
   * 监听 view 的 wheel 事件
   */
  protected bindEvents() {
    // 1. 监听 wheel 事件，pc 端的滚动
    (this.spreadsheet.container.get('el') as HTMLElement).addEventListener(
      'wheel',
      this.handlePCWheelEvent.bind(this),
    );

    // 2. 移动端的事件，使用 touch 组装
    this.mobileWheel = new Wheel(this.spreadsheet.container);

    // 监听 view 的 mobile wheel 事件
    this.mobileWheel.on('wheel', (ev) => {
      const originEvent = ev.event;
      const { x, y } = ev;
      // 移动端和PC端的 x,y 偏差大概是三倍(「大数据」算出来的！！),
      // 所以移动端上按下的点位置相对于view坐标，真实的点值 x = x / 3, y = y /3
      this.onWheel({ ...originEvent, layerX: x / 3, layerY: y / 3 });
    });
  }

  protected unbindEvents(): void {
    (this.spreadsheet.container.get('el') as HTMLElement).removeEventListener(
      'wheel',
      this.handlePCWheelEvent.bind(this),
    );
    // 移动端事件
    this.mobileWheel.destroy();
    // 清空所有的滚动值
    this.setHRowScrollX(0);
    this.setHRowScrollX(0);
  }

  protected afterInitial(): void {
    this.emitPagination();
  }

  /**
   * 重写目的是为了考虑rowHeader支持滚动条时, viewport可视区域必须随滚动的横向距离来变化
   * 暂时未考虑 colHeader的滚动 @轻生
   * @param scrollX
   * @param scrollY
   * @param overScan
   */
  protected calculateXYIndexes(
    scrollX: number,
    scrollY: number,
    overScan = 0,
  ): Indexes {
    return calculateInViewIndexes(
      scrollX,
      scrollY,
      this.viewCellWidths,
      this.viewCellHeights,
      this.viewportBBox,
      overScan,
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
    return _.get(this.spreadsheet, 'options.scrollReachNodeField.colField', []);
  }

  private getScrollRowField(): string[] {
    return _.get(this.spreadsheet, 'options.scrollReachNodeField.rowField', []);
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

  private renderVScrollBar(height, realHeight, scrollY) {
    if (height < realHeight) {
      this.vScrollBar = new ScrollBar({
        isHorizontal: false,
        trackLen: height,
        thumbLen: (height / realHeight) * height,
        position: {
          x: this.viewportBBox.maxX - this.scrollBarHeight,
          y: this.viewportBBox.minY,
        },
        thumbOffset: (scrollY * this.viewportBBox.height) / realHeight,
        theme: this.scrollBarTheme,
      });

      this.vScrollBar.on('scroll-change', ({ thumbOffset }) => {
        this.setScrollOffset(
          undefined,
          (thumbOffset / this.vScrollBar.trackLen) * realHeight,
        );
        this.dynamicRender(true);
      });

      this.vScrollBar.on('scroll-finish', () => {
        this.spreadsheet.needUseCacheMeta = true;
        this.dynamicRender(false);
      });

      this.foregroundGroup.add(this.vScrollBar);
    }
  }

  private renderHScrollBar(width, realWidth, scrollX) {
    if (Math.floor(width) < Math.floor(realWidth)) {
      const halfScrollSize =
        _.get(this.cfg, 'spreadsheet.theme.scrollBar.size') / 2;
      // 根据rowHeader是否包含滚动条的配置来确定滚动条的属性设置
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

      // TODO 统一下滑块的计算算法，抽成方法~
      this.hScrollBar = new ScrollBar({
        isHorizontal: true,
        trackLen: finalWidth,
        thumbLen: (finalWidth / finaleRealWidth) * finalWidth,
        // position: this.viewport.bl,
        position: finalPosition,
        thumbOffset: (scrollX * finalWidth) / finaleRealWidth,
        theme: this.scrollBarTheme,
      });
      // 算法: 滑块 / 滑道 = 滑道 / 真实宽度
      // 滑道是指可见的滑动区域，肯定 < 真实宽度/高度

      this.hScrollBar.on('scroll-change', ({ thumbOffset }) => {
        // 对 thumbOffset 转化成实际的位置像素
        this.setScrollOffset(
          (thumbOffset / this.hScrollBar.trackLen) * finaleRealWidth,
          undefined,
        );
        this.dynamicRender(true);
      });

      this.hScrollBar.on('scroll-finish', () => {
        this.spreadsheet.needUseCacheMeta = true;
        this.dynamicRender(false);
      });

      this.foregroundGroup.add(this.hScrollBar);
    }
  }

  private renderRowScrollBar(rowScrollX) {
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

      this.hRowScrollBar.on('scroll-change', ({ thumbOffset }) => {
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
            _.get(this.cfg, 'spreadsheet.theme.scrollBar.size') * 2,
          true,
        );
        this.cornerHeader.onRowScrollX(hRowScrollX, KEY_GROUP_CORNER_RESIZER);
      });
      this.foregroundGroup.add(this.hRowScrollBar);
    }
  }

  // 获取偏移
  private getScrollOffset() {
    return [
      this.spreadsheet.store.get('scrollX', 0),
      this.spreadsheet.store.get('scrollY', 0),
      this.spreadsheet.store.get('hRowScrollX', 0),
    ];
  }

  // 保存偏移
  private setScrollOffset(scrollX: number, scrollY: number) {
    if (!_.isUndefined(scrollX)) {
      this.spreadsheet.store.set('scrollX', scrollX);
    }
    if (!_.isUndefined(scrollY)) {
      this.spreadsheet.store.set('scrollY', scrollY);
    }
  }

  private setHRowScrollX(hScrollX: number) {
    this.spreadsheet.store.set('hRowScrollX', hScrollX);
  }

  private shouldPreventWheelEvent(x: number, y: number) {
    const near = (current, offset): boolean => {
      // 精度问题，所以取 0.99， 0.01
      return (offset > 0 && current >= 0.99) || (offset < 0 && current <= 0.01);
    };

    if (x !== 0) {
      // 左右滑 - 判断 水平滚动，且不接近边缘
      return this.hScrollBar && !near(this.hScrollBar.current(), x);
    }
    if (y !== 0) {
      // 判断 垂直滚动，且不接近边缘
      return this.vScrollBar && !near(this.vScrollBar.current(), y);
    }
  }

  // 滚动的时候，做动态渲染
  private onWheel(event: WheelEvent & { layerX: number; layerY: number }) {
    const { deltaX, deltaY, layerX, layerY } = event;
    const [x, y] = optimizeScrollXY(deltaX, deltaY);

    if (this.shouldPreventWheelEvent(x, y)) {
      event.preventDefault();
    }

    if (x > 0) {
      // 左滑，显示横向滑动条
      if (this.hRowScrollBar) {
        this.hRowScrollBar.updateTheme(this.scrollBarTouchTheme);
      }
      if (this.hScrollBar) {
        this.hScrollBar.updateTheme(this.scrollBarTouchTheme);
      }
    }

    if (y > 0 && this.vScrollBar) {
      // 上滑，显示横向滚动条
      this.vScrollBar.updateTheme(this.scrollBarTouchTheme);
    }
    // 将偏移设置到滚动条中
    // 降低滚轮速度
    if (this.hRowScrollBar) {
      // 当存在独立rowScroller的时候，只有在对应的渲染范围滚动才有效
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
    this.renderAfterScroll();
  }

  private getOptimizedThumbOffsetTop = (deltaY: number) => {
    return (
      this.vScrollBar?.thumbOffset +
      Math.max(-MAX_SCROLL_OFFSET, Math.min(deltaY / 8, MAX_SCROLL_OFFSET))
    );
  };

  private hideScrollBar() {
    if (isMobile()) {
      // only work in mobile
      clearTimeout(this.preHideScrollBarHandler);
      this.preHideScrollBarHandler = setTimeout(() => {
        if (this.hRowScrollBar) {
          this.hRowScrollBar.updateTheme(this.scrollBarTheme);
        }
        if (this.hScrollBar) {
          this.hScrollBar.updateTheme(this.scrollBarTheme);
        }
        if (this.vScrollBar) {
          this.vScrollBar.updateTheme(this.scrollBarTheme);
        }
      }, 1000);
    }
  }

  private renderAfterScroll() {
    clearTimeout(this.preRenderHandler);
    // 200ms内没有发生滚动，就重新渲染
    this.preRenderHandler = setTimeout(() => {
      this.spreadsheet.needUseCacheMeta = true;
      this.dynamicRender(false);
    }, 200);
  }

  private getRealScrollX(scrollX: number, hRowScroll = 0) {
    return this.cfg.spreadsheet.isScrollContainsRowHeader()
      ? scrollX
      : hRowScroll;
  }

  /* 实际的数据宽度 */
  private getRealWidth(): number {
    return _.last(this.viewCellWidths);
  }

  /**
   * 拿到实际的高度：分页高度、总高度
   */
  private getRealHeight(): number {
    const { pagination } = this.cfg;

    // 如果配置了分页
    if (pagination) {
      const { current, pageSize } = pagination;
      const heights = this.viewCellHeights;

      const start = Math.max((current - 1) * pageSize, 0);
      const end = Math.min(current * pageSize, heights.length - 1);

      // 结束位置 - 开始位置 = 高度
      return heights[end] - heights[start];
    }

    // 其他情况，当做不分页处理
    return _.last(this.viewCellHeights);
  }

  /**
   * 计算初始的 y 滚动偏移，包含分页计算
   */
  private getDefaultScrollY(): number {
    const { pagination } = this.cfg;

    // 如果配置了分页
    if (pagination) {
      const { current, pageSize } = pagination;
      const heights = this.viewCellHeights;

      const offset = Math.max((current - 1) * pageSize, 0);

      return heights[offset];
    }

    // 其他情况，当做不分页处理
    return 0;
  }

  private emitPagination() {
    const { pagination } = this.cfg;
    // 配置了分页
    if (pagination) {
      const { current, pageSize } = pagination;
      const rowLeafNodes = _.get(this, 'layoutResult.rowLeafNodes', []);
      const total = rowLeafNodes.length;

      const pageCount = Math.floor((total - 1) / pageSize) + 1;

      // 发送事件
      this.cfg.spreadsheet.emit('spreadsheet:pagination', {
        pageSize,
        pageCount,
        total,
        current,
      });
    }
  }
}
