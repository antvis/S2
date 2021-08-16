import {
  CellTypes,
  InteractionStateName,
  SHAPE_ATTRS_MAP,
  SHAPE_STYLE_MAP,
} from '@/common/constant';
import { SpreadSheetTheme } from '@/common/interface';
import { Group, IShape } from '@antv/g-canvas';
import { each, findKey, get, includes } from 'lodash';
import type { SpreadSheet } from '../sheet-type';
import { updateShapeAttr } from '../utils/g-renders';

export abstract class BaseCell<T> extends Group {
  // used to determine the cell type
  public cellType: CellTypes;

  // cell's data meta info
  protected meta: T;

  // spreadsheet entrance instance
  protected spreadsheet: SpreadSheet;

  // spreadsheet's theme
  protected theme: SpreadSheetTheme;

  // background control by icon condition
  protected backgroundShape: IShape;

  protected textShape: IShape;

  // render interactive background,
  protected interactiveBgShape: IShape;

  // 需要根据state改变样式的shape集合
  // 需要这个属性的原因是在state clear时知道具体哪些shape要hide。不然只能手动改，比较麻烦
  protected stateShapes: IShape[] = [];

  // protected actionIcons: GuiIcon[];

  public constructor(
    meta: T,
    spreadsheet: SpreadSheet,
    ...restOptions: unknown[]
  ) {
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
  public abstract update(): void;

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
  protected handleRestOptions(...options: any) {
    // default do nothing
  }

  /**
   * Determine how to render this cell area
   */
  protected abstract initCell(): void;

  /**
   * Return the type of the cell
   */
  protected abstract getCellType(): CellTypes;

  // 根据当前state来更新cell的样式
  public updateByState(stateName: InteractionStateName) {
    const stateStyles = get(this.theme, `${this.cellType}.cell.${stateName}`);
    each(stateStyles, (style, styleKey) => {
      if (styleKey) {
        const currentShape = findKey(SHAPE_ATTRS_MAP, (attrs) =>
          includes(attrs, styleKey),
        );
        if (!currentShape) return;
        updateShapeAttr(this[currentShape], SHAPE_STYLE_MAP[styleKey], style);
        this.showShapeUnderState(currentShape);
      }
    });
  }

  public showShapeUnderState(currentShape: string) {
    this.setFillOpacity(this[currentShape], 1);
    this.setStrokeOpacity(this[currentShape], 1);
  }

  public hideShapeUnderState() {
    this.stateShapes.forEach((shape: IShape) => {
      this.setFillOpacity(shape, 0);
      this.setStrokeOpacity(shape, 0);
    });
  }

  public setFillOpacity(shape: IShape, opacity: number) {
    updateShapeAttr(shape, 'fillOpacity', opacity);
  }

  public setStrokeOpacity(shape: IShape, opacity: number) {
    updateShapeAttr(shape, 'strokeOpacity', opacity);
  }

  public resetOpacity() {
    this.setBgColorOpacity(1);
  }

  public setBgColorOpacity(
    opacity: string | number = this.theme.dataCell?.cell?.unSelected?.opacity ||
      1,
  ) {
    updateShapeAttr(this.backgroundShape, SHAPE_STYLE_MAP.opacity, opacity);
    updateShapeAttr(this.textShape, SHAPE_STYLE_MAP.opacity, opacity);
  }
}
