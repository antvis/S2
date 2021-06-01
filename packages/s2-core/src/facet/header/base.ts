import { Group, Point } from '@antv/g-canvas';
import { Node, SpreadSheet } from '../../index';

export const HIT_AREA = 10;

/**
 * Base header config interface
 */
export interface BaseHeaderConfig {
  // group's transform info(x | y)
  offset: number;
  // group's scroll x value
  scrollX?: number;
  // group's scroll y value
  scrollY?: number;
  // group's width
  width: number;
  // group's height
  height: number;
  // group's container's width
  viewportWidth: number;
  // group's container's height
  viewportHeight: number;
  // group's top-left point
  position: Point;
  // group's all nodes
  data: Node[];
  // spreadsheet entrance instance
  spreadsheet: SpreadSheet;
}

/**
 * Create By Bruce Too
 * On 2019-09-24
 * New Base Header for all headers(cornerHeader, rowHeader, colHeader)
 * NOTE: Do not use this.cfg(which lays in group) to get header config,
 * use {@see headerConfig} instead
 */
export abstract class BaseHeader<T extends BaseHeaderConfig> extends Group {
  // header cell resize rect group
  public resizer: Group;

  // protected offset: number;
  protected headerConfig: T;

  protected constructor(cfg: T) {
    super(cfg);
    this.headerConfig = cfg;
  }

  /**
   * 清空热区，为重绘做准备，防止热区重复渲染
   * @param type 当前重绘的header类型
   */
  protected clearResizerGroup(type: string) {
    const foregroundGroup = this.get('parent');
    const resizerGroup = foregroundGroup?.findById(type);
    resizerGroup?.remove();
  }

  // start render header
  public render(type: string): void {
    // clear resize group
    this.clearResizerGroup(type);
    // clear self first
    this.clear();
    // draw by new data
    this.layout();
    // offset group
    this.offset();
    // clip group
    this.clip();
  }

  /**
   * Scroll header group's x,y
   * @param scrollX hScrollBar horizontal offset
   * @param scrollY hScrollBar vertical offset
   * @param type
   */
  public onScrollXY(scrollX: number, scrollY: number, type: string): void {
    this.headerConfig.scrollX = scrollX;
    this.headerConfig.offset = scrollY;
    this.headerConfig.scrollY = scrollY;
    this.render(type);
  }

  /**
   * Only call when hRowScrollBar scrolls
   * @param rowScrollX  hRowScrollbar horizontal offset
   * @param type
   */
  public onRowScrollX(rowScrollX: number, type: string): void {
    this.headerConfig.scrollX = rowScrollX;
    this.render(type);
  }

  public addHotspot(config: any[]) {
    const resizer: Group = this.get('parent').addGroup();
    resizer.set('name', 'resizer');
    // eslint-disable-next-line no-restricted-syntax
    for (const o of config) {
      resizer.addShape('rect', o);
    }
    this.resizer = resizer;
  }

  // header all cells layout
  protected abstract layout();

  // header group offset
  protected abstract offset();

  // header group clip
  protected abstract clip();

  /**
   * Check whether header cell in viewPort
   * @param gridPos
   * @param gridSize
   * @param viewportPos
   * @param viewportSize
   */
  protected isHeaderCellInViewport = (
    gridPos,
    gridSize,
    viewportPos,
    viewportSize,
  ) => {
    return (
      gridPos + gridSize >= viewportPos && viewportPos + viewportSize >= gridPos
    );
  };
}
