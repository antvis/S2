import { BBox, Group } from '@antv/g-canvas';
import { get } from 'lodash';
import { calculateInViewIndexes } from './utils';
import { Indexes } from '../utils/indexes';
import { BaseSpreadSheet } from '../sheet-type';
import {
  LayoutResult,
  OffsetConfig,
  SpreadsheetFacetCfg,
} from '../common/interface';
import { DEBUG_HEADER_LAYOUT, DebuggerUtil } from '../common/debug';

export abstract class BaseFacet {
  // spreadsheet instance
  public spreadsheet: BaseSpreadSheet;

  // corner box
  public cornerBBox: BBox;

  // viewport cells box
  public viewportBBox: BBox;

  // background (useless now)
  public backgroundGroup: Group;

  // render viewport cell
  public panelGroup: Group;

  // render header/corner/scrollbar...
  public foregroundGroup: Group;

  public cfg: SpreadsheetFacetCfg;

  public layoutResult: LayoutResult;

  protected destroyed: boolean;

  protected viewCellWidths: number[];

  protected viewCellHeights: number[];

  // x(轴) 列 宽度为0的单元格 index 集合
  protected viewCellWidth0Indexes: number[];

  // y(轴) 行 高度为0的单元格 index 集合
  protected viewCellHeight0Indexes: number[];

  protected constructor(cfg: SpreadsheetFacetCfg) {
    this.cfg = cfg;
    this.spreadsheet = cfg.spreadsheet;
    this.init();
  }

  /**
   * Start render, call from outside
   */
  public render(): void {
    this.renderHeaders();
    this.renderScrollBars();
    this.dynamicRender(false);
  }

  public getSeriesNumberWidth(): number {
    const showSeriesNumber = get(
      this.cfg.spreadsheet,
      'options.showSeriesNumber',
      false,
    );
    return showSeriesNumber
      ? get(this.cfg, 'spreadsheet.theme.header.seriesNumberWidth')
      : 0;
  }

  public destroy() {
    // clear event
    this.unbindEvents();
    this.clearAllGroup();
    this.destroyed = true;
  }

  protected init(): void {
    // layout
    DebuggerUtil.getInstance().debugCallback(DEBUG_HEADER_LAYOUT, () => {
      this.doLayout();
    });

    // all cell's width&height
    const {
      widths,
      heights,
      width0Indexes,
      height0Indexes,
    } = this.calculateViewCellsWH();
    this.viewCellWidths = widths;
    this.viewCellHeights = heights;
    this.viewCellWidth0Indexes = width0Indexes;
    this.viewCellHeight0Indexes = height0Indexes;
    this.cornerBBox = this.calculateCornerBBox();
    this.viewportBBox = this.calculateViewportBBox();

    // group container for header/corner/viewport ...
    this.foregroundGroup = this.initForeGroundContainer();
    this.backgroundGroup = this.initBackgroundContainer();
    this.panelGroup = this.initPanelContainer();

    // add viewport clip
    this.addViewportClip();

    this.bindEvents();

    this.afterInitial();
  }

  /**
   * Clip viewport by specific {@link viewportBBox}
   */
  protected addViewportClip() {
    const { width, height } = this.viewportBBox;
    this.panelGroup.setClip({
      type: 'rect',
      attrs: {
        x: 0,
        y: 0,
        width,
        height,
      },
    });
  }

  /**
   * 计算 x y 方向，视窗内 view 的 index
   * @param scrollX
   * @param scrollY
   * @protected
   */
  public calculateXYIndexes(scrollX: number, scrollY: number): Indexes {
    return calculateInViewIndexes(
      scrollX,
      scrollY,
      this.viewCellWidths,
      this.viewCellHeights,
      this.viewportBBox,
    );
  }

  /** * 子类实现的方法 ** */

  protected abstract initForeGroundContainer();

  protected abstract initBackgroundContainer();

  protected abstract initPanelContainer();

  // 初始布局实例，并执行布局函数
  protected abstract doLayout(): void;

  // 根据布局计算 corner 的位置大小
  protected abstract calculateCornerBBox(): BBox;

  // 根据布局计算 viewport 视窗位置和大小
  protected abstract calculateViewportBBox(): BBox;

  // 计算每一个单元格 view 的大小
  protected abstract calculateViewCellsWH(): {
    widths: number[];
    heights: number[];
    width0Indexes: number[];
    height0Indexes: number[];
    realHeights?: number[];
  };

  // 渲染滚动条
  protected abstract renderScrollBars(): void;

  // 渲染 header 轴
  protected abstract renderHeaders(): void;

  /**
   * 动态渲染
   */
  protected abstract dynamicRender(delay: boolean): void;

  protected abstract afterInitial(): void;

  /**
   * 绑定事件
   */
  protected abstract bindEvents(): void;

  protected abstract unbindEvents(): void;

  protected clearAllGroup() {
    const children = this.panelGroup.cfg.children;
    for (let i = children.length - 1; i >= 0; i--) {
      children[i].remove(false);
    }
    this.foregroundGroup.set('children', []);
    this.backgroundGroup.set('children', []);
  }

  public abstract getCanvasHW();

  public abstract getContentHeight(): number;

  public abstract updateScrollOffset(offsetConfig: OffsetConfig);

  public abstract getScrollOffset(): number[];

  public abstract getPaginationScrollY(): number;
}
