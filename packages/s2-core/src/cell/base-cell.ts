import type { BBox, IShape, Point, SimpleBBox } from '@antv/g-canvas';
import { Group } from '@antv/g-canvas';
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
import {
  CellTypes,
  InteractionStateName,
  SHAPE_ATTRS_MAP,
  SHAPE_STYLE_MAP,
} from '../common/constant';
import type {
  CellThemes,
  DefaultCellTheme,
  FormatResult,
  ResizeInteractionOptions,
  ResizeArea,
  S2CellType,
  S2Theme,
  StateShapeLayer,
  TextTheme,
  Conditions,
  Condition,
  MappingResult,
  IconCondition,
  InteractionStateTheme,
} from '../common/interface';
import type { SpreadSheet } from '../sheet-type';
import {
  getContentArea,
  getTextAndFollowingIconPosition,
} from '../utils/cell/cell';
import {
  renderIcon,
  renderLine,
  renderText,
  updateShapeAttr,
} from '../utils/g-renders';
import { isMobile } from '../utils/is-mobile';
import { getEllipsisText, getEmptyPlaceholder } from '../utils/text';
import type { GuiIcon } from '../common/icons/gui-icon';
import { checkIsLinkField } from '../utils/interaction/link-field';
import type { Node } from '../facet/layout/node';
import type { ViewMeta } from '../common/interface/basic';

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

  protected textShapes: IShape[] = [];

  // link text underline shape
  protected linkFieldShape: IShape;

  // actualText
  protected actualText: string;

  // actual text width after be ellipsis
  protected actualTextWidth = 0;

  protected conditions: Conditions;

  protected conditionIntervalShape: IShape;

  protected conditionIconShape: GuiIcon;

  protected conditionIconShapes: GuiIcon[] = [];

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
    this.conditions = this.spreadsheet.options.conditions;
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
    return this.theme[this.cellType].icon;
  }

  public getTextAndIconPosition(iconCount = 1) {
    const textStyle = this.getTextStyle();
    const iconCfg = this.getIconStyle();
    return getTextAndFollowingIconPosition(
      this.getContentArea(),
      textStyle,
      this.actualTextWidth,
      iconCfg,
      iconCount,
    );
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

  protected abstract getTextStyle(): TextTheme;

  protected abstract getFormattedFieldValue(): FormatResult;

  protected abstract getMaxTextWidth(): number;

  protected abstract getTextPosition(): Point;

  protected abstract findFieldCondition(conditions: Condition[]): Condition;

  protected abstract mappingValue(condition: Condition): MappingResult;

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

  protected getResizeAreaStyle(): ResizeArea {
    return this.getStyle('resizeArea') as ResizeArea;
  }

  protected shouldDrawResizeAreaByType(
    type: keyof ResizeInteractionOptions,
    cell: S2CellType,
  ) {
    const { resize } = this.spreadsheet.options.interaction;

    if (isBoolean(resize)) {
      return resize;
    }

    if (isFunction(resize.visible)) {
      return resize.visible(cell);
    }

    return resize[type];
  }

  public getCellArea() {
    const { x, y, height, width } = this.meta;
    return { x, y, height, width };
  }

  // get content area that exclude padding
  public getContentArea() {
    const cellStyle = (this.getStyle() ||
      this.theme.dataCell) as DefaultCellTheme;
    const { padding } = cellStyle?.cell;
    return getContentArea(this.getCellArea(), padding);
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
    this.textShape = renderText(
      this,
      [this.textShape],
      position.x,
      position.y,
      ellipsisText,
      textStyle,
    );
    this.textShapes.push(this.textShape);
  }

  protected drawLinkFieldShape(
    showLinkFieldShape: boolean,
    linkFillColor: string,
  ) {
    if (!showLinkFieldShape) {
      return;
    }

    const device = this.spreadsheet.options.style.device;
    // 配置了链接跳转
    if (!isMobile(device)) {
      const textStyle = this.getTextStyle();
      const position = this.getTextPosition();

      let startX = position.x; // 默认居左，其他align方式需要调整
      if (textStyle.textAlign === 'center') {
        startX -= this.actualTextWidth / 2;
      } else if (textStyle.textAlign === 'right') {
        startX -= this.actualTextWidth;
      }

      const { maxY }: BBox = this.textShape.getBBox();
      this.linkFieldShape = renderLine(
        this,
        {
          x1: startX,
          y1: maxY + 1,
          x2: startX + this.actualTextWidth, // 不用 bbox 的 maxX，因为 g-base 文字宽度预估偏差较大
          y2: maxY + 1,
        },
        { stroke: linkFillColor, lineWidth: 1 },
      );
    }

    this.textShape.attr({
      fill: linkFillColor,
      cursor: 'pointer',
      appendInfo: {
        isLinkFieldText: true, // 标记为行头(明细表行头其实就是Data Cell)文本，方便做链接跳转直接识别
        cellData: this.meta,
      },
    });
  }

  // 要被子类覆写，返回颜色字符串
  protected getLinkFieldStyle(): string {
    return this.getTextStyle().linkTextFill;
  }

  protected drawLinkField(meta: Node | ViewMeta) {
    const { linkFields = [] } = this.spreadsheet.options.interaction;
    const linkTextFill = this.getLinkFieldStyle();
    const isLinkField = checkIsLinkField(linkFields, meta);
    this.drawLinkFieldShape(isLinkField, linkTextFill);
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
      );
      targetShapeNames.forEach((shapeName: StateShapeLayer) => {
        const isStateShape = this.stateShapes.has(shapeName);
        const shapeGroup = isStateShape
          ? this.stateShapes.get(shapeName)
          : (this[shapeName] as IShape | IShape[]);

        // 兼容多列文本 (MultiData)
        const shapes = !isArray(shapeGroup) ? [shapeGroup] : shapeGroup;

        // stateShape 默认 visible 为 false
        if (isStateShape) {
          shapes.forEach((shape) => {
            shape.set('visible', true);
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

        updateShapeAttr(shapes, SHAPE_STYLE_MAP[styleKey], style);
      });
    });
  }

  protected getInteractiveBorderShapeStyle<T>(style: T & number) {
    const { x, y, height, width } = this.getCellArea();

    const { horizontalBorderWidth, verticalBorderWidth } =
      this.theme.dataCell.cell;

    return {
      x: x + verticalBorderWidth / 2 + style / 2,
      y: y + horizontalBorderWidth / 2 + style / 2,
      width: width - verticalBorderWidth - style,
      height: height - horizontalBorderWidth - style,
    };
  }

  public hideInteractionShape() {
    this.stateShapes.forEach((shape: IShape) => {
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

  public getTextShape(): IShape {
    return this.textShape;
  }

  public getTextShapes(): IShape[] {
    return this.textShapes || [this.textShape];
  }

  public addTextShape(textShape: IShape) {
    if (!textShape) {
      return;
    }
    this.textShapes.push(textShape);
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
    const iconCondition: IconCondition = this.findFieldCondition(
      this.conditions?.icon,
    );
    if (iconCondition && iconCondition.mapping) {
      const attrs = this.mappingValue(iconCondition);
      const position = this.getIconPosition();
      const { size } = this.theme.dataCell.icon;
      if (!isEmpty(attrs?.icon)) {
        this.conditionIconShape = renderIcon(this, {
          ...position,
          name: attrs.icon,
          width: size,
          height: size,
          fill: attrs.fill,
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

  protected getCrossBackgroundColor(rowIndex: number) {
    const { crossBackgroundColor, backgroundColorOpacity } =
      this.getStyle().cell;

    if (crossBackgroundColor && rowIndex % 2 === 0) {
      // 隔行颜色的配置
      // 偶数行展示灰色背景，因为index是从0开始的
      return { backgroundColorOpacity, backgroundColor: crossBackgroundColor };
    }

    return {
      backgroundColorOpacity,
      backgroundColor: this.getStyle().cell.backgroundColor,
    };
  }
}
