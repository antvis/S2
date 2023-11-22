import { Group } from '@antv/g';
import type { S2CellType } from '../../common';
import type { Node } from '../layout/node';
import type { BaseHeaderConfig } from './interface';

/**
 * New Base Header for all headers(cornerHeader, rowHeader, colHeader)
 * NOTE: Do not use this.cfg(which lays in group) to get header config,
 * use {@see headerConfig} instead
 */
export abstract class BaseHeader<T extends BaseHeaderConfig> extends Group {
  // header all cells layout
  protected abstract layout(): void;

  // header group offset
  protected abstract offset(): void;

  // header group clip
  protected abstract clip(): void;

  protected abstract getCellInstance(node: Node): S2CellType;

  // protected offset: number;
  protected headerConfig: T;

  protected constructor(config: T) {
    super();
    this.headerConfig = config;
  }

  public getHeaderConfig() {
    return this.headerConfig || ({} as T);
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
   * @param rowHeaderScrollX  hRowScrollbar horizontal offset
   * @param type
   */
  public onRowScrollX(rowHeaderScrollX: number, type: string): void {
    this.headerConfig.scrollX = rowHeaderScrollX;
    this.render(type);
  }

  public clear() {
    super.removeChildren();
  }

  /**
   * Check whether header cell in viewPort
   */
  protected isHeaderCellInViewport = ({
    cellPosition,
    cellSize,
    viewportPosition,
    viewportSize,
  }: {
    cellPosition: number;
    cellSize: number;
    viewportPosition: number;
    viewportSize: number;
  }) =>
    cellPosition + cellSize >= viewportPosition &&
    viewportPosition + viewportSize >= cellPosition;
}
