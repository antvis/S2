import {
  CellTypes,
  InteractionStateName,
  SHAPE_ATTRS_MAP,
  SHAPE_STYLE_MAP,
} from '@/common/constant';
import { InteractionStateTheme, SpreadSheetTheme } from '@/common/interface';
import { Group, IShape } from '@antv/g-canvas';
import { each, findKey, get, includes, toNumber } from 'lodash';
import { SpreadSheet } from '../sheet-type';
import {
  updateFillOpacity,
  updateShapeAttr,
  updateStrokeOpacity,
} from '../utils/g-renders';
import { StateShapeLayer } from './../common/interface/interaction';

export abstract class BaseCell<T> extends Group {
  // cell's data meta info
  protected meta: T;

  // spreadsheet entrance instance
  protected spreadsheet: SpreadSheet;

  // spreadsheet's theme
  protected theme: SpreadSheetTheme;

  // background control shape
  protected backgroundShape: IShape;

  // text control shape
  protected textShape: IShape;

  // interactive control shapes, unify read and manipulate operations
  protected stateShapes = new Map<StateShapeLayer, IShape>();

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
  protected handleRestOptions(...options: unknown[]) {
    // default do nothing
  }

  /**
   * Return the type of the cell
   */
  public abstract get cellType(): CellTypes;

  /**
   * Determine how to render this cell area
   */
  protected abstract initCell(): void;

  /**
   * Update cell's selected state
   */
  public abstract update(): void;

  /* -------------------------------------------------------------------------- */
  /*                common functions that will be used in subtype               */
  /* -------------------------------------------------------------------------- */

  // 根据当前state来更新cell的样式
  public updateByState(stateName: InteractionStateName) {
    const stateStyles = get(
      this.theme,
      `${this.cellType}.cell.interactionState.${stateName}`,
    );
    each(stateStyles, (style, styleKey) => {
      const currentShape = findKey(SHAPE_ATTRS_MAP, (attrs) =>
        includes(attrs, styleKey),
      ) as StateShapeLayer | undefined;

      if (!currentShape || !this.stateShapes.has(currentShape)) {
        return;
      }

      updateShapeAttr(
        this.stateShapes.get(currentShape),
        SHAPE_STYLE_MAP[styleKey],
        style,
      );
      this.showShapeUnderState(currentShape);
    });
  }

  private showShapeUnderState(currentShape: StateShapeLayer) {
    updateFillOpacity(this.stateShapes.get(currentShape), 1);
    updateStrokeOpacity(this.stateShapes.get(currentShape), 1);
  }

  public hideShapeUnderState() {
    this.stateShapes.forEach((shape: IShape) => {
      updateFillOpacity(shape, 0);
      updateStrokeOpacity(shape, 0);
    });
  }

  public resetOpacity() {
    this.setBgColorOpacity(1);
  }

  public setBgColorOpacity(
    opacity: InteractionStateTheme['opacity'] = this.theme.dataCell?.cell
      ?.outOfTheSpotlight?.opacity,
  ) {
    updateFillOpacity(this.backgroundShape, toNumber(opacity));
    updateFillOpacity(this.textShape, toNumber(opacity));
  }
}
