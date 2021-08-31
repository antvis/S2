import {
  CellTypes,
  InteractionStateName,
  SHAPE_ATTRS_MAP,
  SHAPE_STYLE_MAP,
} from '@/common/constant';
import {
  FormatResult,
  SpreadSheetTheme,
  StateShapeLayer,
  TextTheme,
} from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';
import { getContentArea } from '@/utils/cell/cell';
import { renderText, updateShapeAttr } from '@/utils/g-renders';
import { getEllipsisText, measureTextWidth } from '@/utils/text';
import { Group, IShape, Point, SimpleBBox } from '@antv/g-canvas';
import { each, get, includes, isEmpty, keys, pickBy } from 'lodash';

export abstract class BaseCell<T extends SimpleBBox> extends Group {
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

  // actual text width after be ellipsis
  protected actualTextWidth = 0;

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

  /* -------------------------------------------------------------------------- */
  /*           abstract functions that must be implemented by subtype           */
  /* -------------------------------------------------------------------------- */

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

  protected abstract getTextStyle(): TextTheme;

  protected abstract getFormattedFieldValue(): FormatResult;

  protected abstract getMaxTextWidth(): number;

  protected abstract getTextPosition(): Point;

  /* -------------------------------------------------------------------------- */
  /*                common functions that will be used in subtype               */
  /* -------------------------------------------------------------------------- */

  protected getStyle() {
    return this.theme[this.cellType];
  }

  protected getCellArea() {
    const { x, y, height, width } = this.meta;
    return { x, y, height, width };
  }

  // get content area that exclude padding
  protected getContentArea() {
    const { padding } = this.theme.dataCell.cell;
    return getContentArea(this.getCellArea(), padding);
  }

  protected drawTextShape() {
    const { formattedValue } = this.getFormattedFieldValue();
    const maxTextWidth = this.getMaxTextWidth();
    const textStyle = this.getTextStyle();
    const ellipsisText = getEllipsisText(
      `${formattedValue ?? '-'}`,
      maxTextWidth,
      textStyle,
    );

    this.actualTextWidth = measureTextWidth(ellipsisText, textStyle);
    const position = this.getTextPosition();
    this.textShape = renderText(
      this,
      [this.textShape],
      position.x,
      position.y,
      ellipsisText,
      textStyle,
    );
  }

  // 根据当前state来更新cell的样式
  public updateByState(stateName: InteractionStateName, cell: S2CellType) {
    this.spreadsheet.interaction.setInteractedCells(cell);
    const stateStyles = get(
      this.theme,
      `${this.cellType}.cell.interactionState.${stateName}`,
    );
    each(stateStyles, (style, styleKey) => {
      const targetShapeNames = keys(
        pickBy(SHAPE_ATTRS_MAP, (attrs) => includes(attrs, styleKey)),
      );
      if (isEmpty(targetShapeNames)) {
        return;
      }
      targetShapeNames.forEach((shapeName: StateShapeLayer) => {
        const shape = this.stateShapes.has(shapeName)
          ? this.stateShapes.get(shapeName)
          : this[shapeName];
        updateShapeAttr(shape, SHAPE_STYLE_MAP[styleKey], style);
      });
    });
  }

  public hideInteractionShape() {
    this.stateShapes.forEach((shape: IShape) => {
      updateShapeAttr(shape, SHAPE_STYLE_MAP.backgroundOpacity, 0);
      updateShapeAttr(shape, SHAPE_STYLE_MAP.backgroundColor, 'transparent');
      updateShapeAttr(shape, SHAPE_STYLE_MAP.borderOpacity, 0);
      updateShapeAttr(shape, SHAPE_STYLE_MAP.borderColor, 'transparent');
    });
  }

  public clearUnselectedState() {
    updateShapeAttr(this.backgroundShape, SHAPE_STYLE_MAP.backgroundOpacity, 1);
    updateShapeAttr(this.textShape, SHAPE_STYLE_MAP.textOpacity, 1);
  }
}
