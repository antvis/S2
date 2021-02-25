import { Group, IShape } from '@antv/g-canvas';
import { BaseSpreadSheet, SpreadSheetTheme } from '..';
import { updateShapeAttr } from '../utils/g-renders';
import { DataCell, ColCell, CornerCell, RowCell } from "./";
import * as shapeStyle from '../state/shapeStyleMap';
import _ from 'lodash';

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

  public updateByState(stateName) {
    const { themeByState } = this.theme;
    const stateStyles = _.get(themeByState, [this.getCellType(), stateName])
    _.each(stateStyles, (style, styleKey) => {
      if(styleKey) {
        // 找到对应的shape，并且找到cssStyple对应的shapestyle
        const currentShape = _.findKey(shapeStyle.shapeAttrsMap, attrs => attrs.indexOf(styleKey) > -1);
        updateShapeAttr(this[currentShape], shapeStyle.shapeStyleMap[styleKey], style);
        this.setFillOpacity(this[currentShape], 1);
      }
    })
  }

  public setFillOpacity(shape, opacity) {
    updateShapeAttr(shape, 'fillOpacity', opacity);
  }

  // 获取当前类型
  private getCellType() {
    if (this instanceof DataCell) {
      return 'dataCell';
    }
    if (this instanceof RowCell) {
      return 'rowCell';
    }
    if (this instanceof ColCell) {
      return 'colCell';
    }
    if (this instanceof CornerCell) {
      return 'cornerCell';
    }
  }
}
