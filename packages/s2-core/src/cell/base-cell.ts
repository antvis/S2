import { BBox, Group, IShape, Point, SimpleBBox } from '@antv/g-canvas';
import { each, get, includes, isEmpty, keys, pickBy } from 'lodash';
import {
  CellTypes,
  InteractionStateName,
  SHAPE_ATTRS_MAP,
  SHAPE_STYLE_MAP,
} from '@/common/constant';
import {
  FormatResult,
  S2CellType,
  S2Theme,
  StateShapeLayer,
  TextTheme,
} from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';
import {
  getContentArea,
  getTextAndFollowingIconPosition,
} from '@/utils/cell/cell';
import { renderLine, renderText, updateShapeAttr } from '@/utils/g-renders';
import { isMobile } from '@/utils/is-mobile';
import { getEllipsisText, measureTextWidth } from '@/utils/text';

export abstract class BaseCell<T extends SimpleBBox> extends Group {
  // cell's data meta info
  protected meta: T;

  // spreadsheet entrance instance
  protected spreadsheet: SpreadSheet;

  // spreadsheet's theme
  protected theme: S2Theme;

  // background control shape
  protected backgroundShape: IShape;

  // text control shape
  protected textShape: IShape;

  // link text underline shape
  protected linkFieldShape: IShape;

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

  public getIconStyle() {
    return this.theme[this.cellType].icon;
  }

  public getTextAndIconPosition() {
    const textStyle = this.getTextStyle();
    const iconCfg = this.getIconStyle();
    return getTextAndFollowingIconPosition(
      this.getContentArea(),
      textStyle,
      this.actualTextWidth,
      iconCfg,
    );
  }

  /**
   * in case there are more params to be handled
   * @param options any type's rest params
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  protected getStyle(name?: string) {
    return this.theme[name || this.cellType];
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

  protected getIconPosition() {
    return this.getTextAndIconPosition().icon;
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

  protected drawLinkFieldShape(
    showLinkFieldShape: boolean,
    linkFillColor: string,
  ) {
    const { fill } = this.getTextStyle();

    // handle link nodes
    if (showLinkFieldShape) {
      const device = this.spreadsheet.options.style.device;
      let fillColor;

      // 配置了链接跳转
      if (isMobile(device)) {
        fillColor = linkFillColor;
      } else {
        const { minX, maxX, maxY }: BBox = this.textShape.getBBox();
        this.linkFieldShape = renderLine(
          this,
          {
            x1: minX,
            y1: maxY + 1,
            x2: maxX,
            y2: maxY + 1,
          },
          { stroke: fill, lineWidth: 1 },
        );

        fillColor = fill;
      }

      this.textShape.attr({
        fill: fillColor,
        cursor: 'pointer',
        appendInfo: {
          isRowHeaderText: true, // 标记为行头(明细表行头其实就是Data Cell)文本，方便做链接跳转直接识别
          cellData: this.meta,
        },
      });
    }
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
    updateShapeAttr(this.linkFieldShape, SHAPE_STYLE_MAP.opacity, 1);
  }
}
