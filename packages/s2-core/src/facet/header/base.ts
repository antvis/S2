import { Group, type PointLike } from '@antv/g';
import type { SortParam } from '../../common/interface';
import type { Node } from '../layout/node';
import type { SpreadSheet } from '../../sheet-type';

/**
 * Base header config interface
 */
export interface BaseHeaderConfig {
  // group's scroll x value
  scrollX?: number;
  // group's scroll y value
  scrollY?: number;
  // group's width
  width: number;
  // group's height
  height: number;
  // group's original width without clip
  originalWidth?: number;
  // group's original height without clip
  originalHeight?: number;
  // group's container's width
  viewportWidth: number;
  // group's container's height
  viewportHeight: number;
  // group's top-left point
  position: PointLike;
  // group's all nodes
  data: Node[];
  // spreadsheet entrance instance
  spreadsheet: SpreadSheet;
  // leaf node sort params
  sortParam?: SortParam;
}

/**
 * New Base Header for all headers(cornerHeader, rowHeader, colHeader)
 * NOTE: Do not use this.cfg(which lays in group) to get header config,
 * use {@see headerConfig} instead
 */
export abstract class BaseHeader<T extends BaseHeaderConfig> extends Group {
  // protected offset: number;
  protected headerConfig: T;

  protected constructor(cfg: T) {
    // TODO: 修改为不传递 cfg 到 group
    super();
    this.headerConfig = cfg;
  }

  /**
   * 清空热区，为重绘做准备，防止热区重复渲染
   * @param type 当前重绘的header类型
   */
  protected clearResizeAreaGroup(type: string) {
    const foregroundGroup = this.parentNode as Group;
    const resizerGroup = foregroundGroup?.getElementById<Group>(type);
    resizerGroup?.removeChildren();
  }

  // start render header
  public render(type: string): void {
    // clear resize group
    this.clearResizeAreaGroup(type);
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

  // header all cells layout
  protected abstract layout();

  // header group offset
  protected abstract offset();

  // header group clip
  protected abstract clip();

  public clear() {
    super.removeChildren();
  }

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
