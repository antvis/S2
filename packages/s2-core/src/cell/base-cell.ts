import { Group, IShape } from '@antv/g-canvas';
import { BaseSpreadSheet, SpreadSheetTheme } from '..';

/**
 * Create By Bruce Too
 * On 2019-10-12
 * Base cell for all nodes, contains in rowHeader,
 * colHeader, cornerHeader, cellArea
 */

export abstract class BaseCell<T> extends Group {
  // cell's data meta info
  protected meta: T;

  // spreadsheet entrance instance
  protected spreadsheet: BaseSpreadSheet;

  // spreadsheet's theme
  protected theme: SpreadSheetTheme;

  // 1、background control by icon condition
  protected backgroundShape: IShape;

  // 2、render interactive background,
  protected interactiveBgShape: IShape;

  public constructor(meta: T, spreadsheet: BaseSpreadSheet, ...restOptions) {
    super({});
    this.meta = meta;
    this.spreadsheet = spreadsheet;
    this.theme = spreadsheet.theme;
    this.handleRestOptions(...restOptions);
    this.initCell();
  }

  /**
   * Update cell's selected state
   */
  public abstract update();

  public getMeta(): T {
    return this.meta;
  }

  public setMeta(viewMeta: T) {
    this.meta = viewMeta;
  }

  /**
   * in case there are more params to be handled
   * @param options any type's rest params
   */
  protected handleRestOptions(...options) {
    // default do nothing
  }

  /**
   * Determine how to render this cell area
   */
  protected abstract initCell();
}
