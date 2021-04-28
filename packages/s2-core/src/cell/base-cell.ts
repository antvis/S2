import { Group, IShape } from '@antv/g-canvas';
import { BaseSpreadSheet, SpreadSheetTheme } from '..';
import { updateShapeAttr } from '../utils/g-renders';
import * as shapeStyle from '../state/shapeStyleMap';
import { get, each, findKey, includes } from 'lodash';
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

  // 3、需要根据state改变样式的shape集合
  // 需要这个属性的原因是在state clear时知道具体哪些shape要hide。不然只能手动改，比较麻烦
  protected stateShapes: IShape[] = [];

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

  // 根据当前state来更新cell的样式
  public updateByState(stateName) {
    const { stateTheme } = this.theme;
    const originCellType = this.spreadsheet.getCellType(this);
    // DataCell => dataCell
    // theme的key首字母是小写
    const cellType = `${originCellType
      .charAt(0)
      .toLowerCase()}${originCellType.slice(1)}`;
    const stateStyles = get(stateTheme, [cellType, stateName]);
    each(stateStyles, (style, styleKey) => {
      if (styleKey) {
        // 找到对应的shape，并且找到cssStyple对应的shapestyle
        const currentShape = findKey(shapeStyle.shapeAttrsMap, (attrs) =>
          includes(attrs, styleKey),
        );
        updateShapeAttr(
          this[currentShape],
          shapeStyle.shapeStyleMap[styleKey],
          style,
        );
        this.showShapeUnderState(currentShape);
      }
    });
  }

  public showShapeUnderState(currentShape) {
    this.setFillOpacity(this[currentShape], 1);
    this.setStrokeOpacity(this[currentShape], 1);
  }

  public hideShapeUnderState() {
    this.stateShapes.forEach((shape: IShape) => {
      this.setFillOpacity(shape, 0);
      this.setStrokeOpacity(shape, 0);
    });
  }

  public setFillOpacity(shape, opacity) {
    updateShapeAttr(shape, 'fillOpacity', opacity);
  }

  public setStrokeOpacity(shape, opacity) {
    updateShapeAttr(shape, 'strokeOpacity', opacity);
  }
}
