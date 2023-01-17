import type {
  DisplayObject,
  Line,
  PointLike,
  Polygon,
  Rect,
  Text,
} from '@antv/g';
import { Group } from '@antv/g';
import {
  each,
  get,
  includes,
  isArray,
  isBoolean,
  isEmpty,
  isFunction,
  isNumber,
  keys,
  pickBy,
} from 'lodash';
import type { SimpleBBox } from '../engine';
import {
  CellTypes,
  InteractionStateName,
  SHAPE_ATTRS_MAP,
  SHAPE_STYLE_MAP,
} from '../common/constant';
import {
  type CellThemes,
  type DefaultCellTheme,
  type FormatResult,
  type ResizeInteractionOptions,
  type ResizeArea,
  type S2CellType,
  type S2Theme,
  type StateShapeLayer,
  type TextTheme,
  type Conditions,
  type Condition,
  type MappingResult,
  CellClipBox,
  CellBorderPosition,
  type InteractionStateTheme,
} from '../common/interface';
import type { SpreadSheet } from '../sheet-type';
import {
  getBorderPositionAndStyle,
  getCellBoxByType,
  getTextAndFollowingIconPosition,
} from '../utils/cell/cell';
import {
  renderIcon,
  renderLine,
  renderRect,
  renderText,
  updateShapeAttr,
} from '../utils/g-renders';
import { isMobile } from '../utils/is-mobile';
import { getEllipsisText, getEmptyPlaceholder } from '../utils/text';
import type { GuiIcon } from '../common/icons/gui-icon';
import type { CustomText } from '../engine/CustomText';

export abstract class BaseCell<T extends SimpleBBox> extends Group {
  // cell's data meta info
  protected meta: T;

  // spreadsheet entrance instance
  protected spreadsheet: SpreadSheet;

  // spreadsheet's theme
  protected theme: S2Theme;

  // background control shape
  protected backgroundShape: Rect | Polygon;

  // text control shape
  protected textShape: CustomText;

  protected textShapes: CustomText[] = [];

  // link text underline shape
  protected linkFieldShape: Line;

  // actualText
  protected actualText: string;

  // actual text width after be ellipsis
  protected actualTextWidth = 0;

  protected conditions: Conditions;

  protected conditionIntervalShape: Rect | undefined;

  protected conditionIconShape: GuiIcon;

  protected conditionIconShapes: GuiIcon[] = [];

  // interactive control shapes, unify read and manipulate operations
  protected stateShapes = new Map<StateShapeLayer, DisplayObject>();

  public constructor(
    meta: T,
    spreadsheet: SpreadSheet,
    ...restOptions: unknown[]
  ) {
    super({});
    this.meta = meta;
    this.spreadsheet = spreadsheet;
    this.theme = spreadsheet.theme;
    this.conditions = this.spreadsheet.options.conditions!;
    this.handleRestOptions(...restOptions);
    if (this.shouldInit()) {
      this.initCell();
    }
  }

  public getMeta(): T {
    return this.meta;
  }

  public setMeta(viewMeta: T) {
    this.meta = viewMeta;
  }

  public getIconStyle() {
    return this.theme[this.cellType]?.icon;
  }

  public getTextAndIconPosition(iconCount = 1) {
    const textTheme = this.getTextStyle();
    const iconTheme = this.getIconStyle();

    return getTextAndFollowingIconPosition({
      bbox: this.getBBoxByType(CellClipBox.CONTENT_BOX),
      textStyle: textTheme,
      textWidth: this.actualTextWidth,
      iconStyle: iconTheme,
      iconCount,
    });
  }

  public getActualText() {
    return this.actualText;
  }

  public getFieldValue() {
    return this.getFormattedFieldValue().formattedValue;
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

  protected abstract getBorderPositions(): CellBorderPosition[];

  protected abstract getTextStyle(): TextTheme;

  protected abstract getFormattedFieldValue(): FormatResult;

  protected abstract getMaxTextWidth(): number;

  protected abstract getTextPosition(): PointLike;

  protected abstract findFieldCondition(
    conditions: Condition[] | undefined,
  ): Condition | undefined;

  protected abstract mappingValue(
    condition: Condition,
  ): MappingResult | undefined | null;

  /* -------------------------------------------------------------------------- */
  /*                common functions that will be used in subtype               */
  /* -------------------------------------------------------------------------- */

  protected shouldInit() {
    const { width, height } = this.meta;

    return width > 0 && height > 0;
  }

  public getStyle<K extends keyof S2Theme = keyof CellThemes>(
    name?: K,
  ): DefaultCellTheme | S2Theme[K] {
    return get(this.theme, name || this.cellType);
  }

  public getLinkFieldShape() {
    return this.linkFieldShape;
  }

  protected getResizeAreaStyle(): ResizeArea {
    return this.getStyle('resizeArea') as ResizeArea;
  }

  protected shouldDrawResizeAreaByType(
    type: keyof ResizeInteractionOptions,
    cell: S2CellType,
  ) {
    const { resize } = this.spreadsheet.options.interaction!;

    if (isBoolean(resize)) {
      return resize;
    }

    if (isFunction(resize?.visible)) {
      return resize?.visible(cell);
    }

    return resize?.[type];
  }

  public getBBoxByType(type = CellClipBox.BORDER_BOX) {
    const bbox: SimpleBBox = {
      x: this.meta.x,
      y: this.meta.y,
      height: this.meta.height,
      width: this.meta.width,
    };

    const cellStyle = (this.getStyle() ||
      this.theme.dataCell) as DefaultCellTheme;

    return getCellBoxByType(
      bbox,
      this.getBorderPositions(),
      cellStyle?.cell!,
      type,
    );
  }

  public drawBorders() {
    this.getBorderPositions().forEach((type) => {
      const { position, style } = getBorderPositionAndStyle(
        type,
        this.getBBoxByType(),
        this.getStyle()?.cell!,
      );

      renderLine(this, position, style);
    });
  }

  /**
   * 绘制hover悬停，刷选的外框
   */
  protected drawInteractiveBorderShape() {
    this.stateShapes.set(
      'interactiveBorderShape',
      renderRect(this, {
        ...this.getBBoxByType(CellClipBox.PADDING_BOX),
        visibility: 'hidden',
      }),
    );
  }

  protected abstract getBackgroundColor(): {
    backgroundColor: string | undefined;
    backgroundColorOpacity: number | undefined;
  };

  protected drawBackgroundShape() {
    const { backgroundColor, backgroundColorOpacity } =
      this.getBackgroundColor();

    this.backgroundShape = renderRect(this, {
      ...this.getBBoxByType(),
      fill: backgroundColor,
      fillOpacity: backgroundColorOpacity,
    });
  }

  /**
   * 交互使用的背景色
   */
  protected drawInteractiveBgShape() {
    this.stateShapes.set(
      'interactiveBgShape',
      renderRect(this, {
        ...this.getBBoxByType(),
        visibility: 'hidden',
      }),
    );
  }

  protected getIconPosition(iconCount = 1) {
    return this.getTextAndIconPosition(iconCount).icon;
  }

  protected drawTextShape() {
    const { formattedValue } = this.getFormattedFieldValue();
    const maxTextWidth = this.getMaxTextWidth();
    const textStyle = this.getTextStyle();
    const {
      options: { placeholder },
      measureTextWidth,
    } = this.spreadsheet;
    const emptyPlaceholder = getEmptyPlaceholder(this, placeholder);
    const ellipsisText = getEllipsisText({
      measureTextWidth,
      text: formattedValue,
      maxWidth: maxTextWidth,
      fontParam: textStyle,
      placeholder: emptyPlaceholder,
    });

    this.actualText = ellipsisText;
    this.actualTextWidth = measureTextWidth(ellipsisText, textStyle);
    const position = this.getTextPosition();

    this.textShape = renderText(this, [this.textShape], {
      x: position.x,
      y: position.y,
      text: ellipsisText,
      ...textStyle,
    }) as CustomText;
    this.textShapes.push(this.textShape);
  }

  protected drawLinkFieldShape(
    showLinkFieldShape: boolean,
    linkFillColor: string,
  ) {
    if (!showLinkFieldShape) {
      return;
    }

    const device = this.spreadsheet.options.device;

    // 配置了链接跳转
    if (!isMobile(device)) {
      const textStyle = this.getTextStyle();
      const position = this.getTextPosition();

      // 默认居左，其他align方式需要调整
      let startX = position.x;

      if (textStyle.textAlign === 'center') {
        startX -= this.actualTextWidth / 2;
      } else if (textStyle.textAlign === 'right') {
        startX -= this.actualTextWidth;
      }

      const { bottom: maxY } = this.textShape.getBBox();

      this.linkFieldShape = renderLine(
        this,
        {
          x1: startX,
          y1: maxY + 1,
          // 不用 bbox 的 maxX，因为 g-base 文字宽度预估偏差较大
          x2: startX + this.actualTextWidth,
          y2: maxY + 1,
        },
        { stroke: linkFillColor, lineWidth: 1 },
      );
    }

    this.textShape.style.fill = linkFillColor;
    this.textShape.style.cursor = 'pointer';
    this.textShape.appendInfo = {
      // 标记为行头(明细表行头其实就是Data Cell)文本，方便做链接跳转直接识别
      isLinkFieldText: true,
      cellData: this.meta,
    };
  }

  // 根据当前state来更新cell的样式
  public updateByState(stateName: InteractionStateName, cell: S2CellType) {
    this.spreadsheet.interaction.setInteractedCells(cell);
    const stateStyles = get(
      this.theme,
      `${this.cellType}.cell.interactionState.${stateName}`,
    ) as InteractionStateTheme;

    each(stateStyles, (style, styleKey) => {
      const targetShapeNames = keys(
        pickBy(SHAPE_ATTRS_MAP, (attrs) => includes(attrs, styleKey)),
      ) as StateShapeLayer[];

      targetShapeNames.forEach((shapeName) => {
        const isStateShape = this.stateShapes.has(shapeName);
        const shapeGroup = isStateShape
          ? this.stateShapes.get(shapeName)
          : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            (this[shapeName] as DisplayObject);

        // 兼容多列文本 (MultiData)
        const shapes = !isArray(shapeGroup) ? [shapeGroup] : shapeGroup;

        // stateShape 默认 visible 为 false
        if (isStateShape) {
          shapes.forEach((shape) => {
            shape.setAttribute('visibility', 'visible');
          });
        }

        // 根据 borderWidth 更新 borderShape 大小 https://github.com/antvis/S2/pull/705
        if (
          shapeName === 'interactiveBorderShape' &&
          styleKey === 'borderWidth'
        ) {
          if (isNumber(style)) {
            const marginStyle = this.getInteractiveBorderShapeStyle(style);

            each(marginStyle, (currentStyle, currentStyleKey) => {
              updateShapeAttr(shapes, currentStyleKey, currentStyle);
            });
          }
        }

        // @ts-ignore
        updateShapeAttr(shapes, SHAPE_STYLE_MAP[styleKey], style);
      });
    });
  }

  protected getInteractiveBorderShapeStyle<T>(borderSize: T & number) {
    const { x, y, height, width } = this.getBBoxByType(CellClipBox.PADDING_BOX);

    const halfSize = borderSize / 2;

    return {
      x: x + halfSize,
      y: y + halfSize,
      width: width - borderSize,
      height: height - borderSize,
    };
  }

  public hideInteractionShape() {
    this.stateShapes.forEach((shape: DisplayObject) => {
      updateShapeAttr(shape, SHAPE_STYLE_MAP.backgroundOpacity, 0);
      updateShapeAttr(shape, SHAPE_STYLE_MAP.backgroundColor, 'transparent');
      updateShapeAttr(shape, SHAPE_STYLE_MAP.borderOpacity, 0);
      updateShapeAttr(shape, SHAPE_STYLE_MAP.borderWidth, 1);
      updateShapeAttr(shape, SHAPE_STYLE_MAP.borderColor, 'transparent');
    });
  }

  public clearUnselectedState() {
    updateShapeAttr(this.backgroundShape, SHAPE_STYLE_MAP.backgroundOpacity, 1);
    updateShapeAttr(this.textShapes, SHAPE_STYLE_MAP.textOpacity, 1);
    updateShapeAttr(this.linkFieldShape, SHAPE_STYLE_MAP.opacity, 1);
  }

  public getTextShape(): CustomText {
    return this.textShape;
  }

  public getTextShapes(): CustomText[] {
    return this.textShapes || [this.textShape];
  }

  public addTextShape(textShape: CustomText | Text) {
    if (!textShape) {
      return;
    }

    this.textShapes.push(textShape as CustomText);
  }

  public getConditionIconShape(): GuiIcon {
    return this.conditionIconShape;
  }

  public getConditionIconShapes(): GuiIcon[] {
    return this.conditionIconShapes || [this.conditionIconShape];
  }

  public addConditionIconShape(iconShape: GuiIcon) {
    if (!iconShape) {
      return;
    }

    this.conditionIconShapes.push(iconShape);
  }

  public resetTextAndConditionIconShapes() {
    this.textShapes = [];
    this.conditionIconShapes = [];
  }

  public get cellConditions() {
    return this.conditions;
  }

  public drawConditionIconShapes() {
    const iconCondition = this.findFieldCondition(this.conditions?.icon);

    if (iconCondition?.mapping!) {
      const attrs = this.mappingValue(iconCondition);
      const position = this.getIconPosition();
      const { size } = this.theme.dataCell!.icon!;

      if (!isEmpty(attrs?.icon)) {
        this.conditionIconShape = renderIcon(this, {
          ...position,
          name: attrs?.icon!,
          width: size,
          height: size,
          fill: attrs?.fill,
        });
        this.addConditionIconShape(this.conditionIconShape);
      }
    }
  }

  public getTextConditionFill(textStyle: TextTheme) {
    // get text condition's fill result
    let fillResult = textStyle.fill;
    const textCondition = this.findFieldCondition(this.conditions?.text);

    if (textCondition?.mapping) {
      fillResult = this.mappingValue(textCondition)?.fill || textStyle.fill;
    }

    return fillResult;
  }
}
