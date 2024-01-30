import type {
  DisplayObject,
  Image,
  Line,
  PointLike,
  Polygon,
  Rect,
  Text,
  TextStyleProps,
} from '@antv/g';
import { Group } from '@antv/g';
import {
  each,
  get,
  includes,
  isArray,
  isBoolean,
  isFunction,
  isNumber,
  keys,
  pickBy,
  sumBy,
} from 'lodash';
import {
  CellType,
  DEFAULT_FONT_COLOR,
  InteractionStateName,
  REVERSE_FONT_COLOR,
  SHAPE_ATTRS_MAP,
  SHAPE_STYLE_MAP,
} from '../common/constant';
import type { GuiIcon } from '../common/icons/gui-icon';
import {
  CellBorderPosition,
  CellClipBox,
  type CellTextWordWrapStyle,
  type Condition,
  type ConditionMappingResult,
  type Conditions,
  type DefaultCellTheme,
  type FormatResult,
  type HeaderActionNameOptions,
  type IconCondition,
  type IconPosition,
  type InteractionStateTheme,
  type InternalFullyCellTheme,
  type InternalFullyTheme,
  type RenderTextShapeOptions,
  type ResizeArea,
  type ResizeInteractionOptions,
  type S2CellType,
  type StateShapeLayer,
  type TextTheme,
} from '../common/interface';
import type { ViewMeta } from '../common/interface/basic';
import type { SimpleBBox } from '../engine';
import type { CustomText } from '../engine/CustomText';
import type { Node } from '../facet/layout/node';
import type { SpreadSheet } from '../sheet-type';
import {
  getBorderPositionAndStyle,
  getCellBoxByType,
} from '../utils/cell/cell';
import {
  getIconTotalWidth,
  type GroupedIcons,
} from '../utils/cell/header-cell';
import { shouldReverseFontColor } from '../utils/color';
import { getIconPosition } from '../utils/condition/condition';
import {
  renderIcon,
  renderLine,
  renderRect,
  renderText,
  updateShapeAttr,
} from '../utils/g-renders';
import { checkIsLinkField } from '../utils/interaction/link-field';
import { isMobile } from '../utils/is-mobile';
import {
  getDisplayText,
  getEmptyPlaceholder as getEmptyPlaceholderInner,
} from '../utils/text';

export abstract class BaseCell<T extends SimpleBBox> extends Group {
  // cell's data meta info
  protected meta: T;

  // spreadsheet entrance instance
  protected spreadsheet: SpreadSheet;

  // spreadsheet's theme
  protected theme: InternalFullyTheme;

  // background control shape
  protected backgroundShape: Rect | Polygon | Image;

  // text control shape
  protected textShape: CustomText;

  protected textShapes: CustomText[] = [];

  // link text underline shape
  protected linkFieldShape: Line;

  protected actualText: string;

  protected originalText: string;

  protected conditions: Conditions;

  protected conditionIntervalShape: Rect | undefined;

  protected conditionIconShape: GuiIcon;

  protected conditionIconShapes: GuiIcon[] = [];

  protected groupedIcons: GroupedIcons;

  // interactive control shapes, unify read and manipulate operations
  protected stateShapes = new Map<StateShapeLayer, DisplayObject>();

  /* -------------------------------------------------------------------------- */
  /*           abstract functions that must be implemented by subtype           */
  /* -------------------------------------------------------------------------- */

  /**
   * Return the type of the cell
   */
  public abstract get cellType(): CellType;

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

  protected abstract getIconPosition(): PointLike;

  protected abstract findFieldCondition<Con extends Condition>(
    conditions?: Con[],
  ): Con | undefined;

  protected abstract mappingValue<Result>(
    condition: Condition<Result>,
  ): ConditionMappingResult<Result>;

  protected abstract getBackgroundColor(): {
    backgroundColor: string | undefined;
    backgroundColorOpacity: number | undefined;
    intelligentReverseTextColor: boolean;
  };

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
    this.groupedIcons = { left: [], right: [] };
    this.handleRestOptions(...restOptions);
    if (this.shouldInit()) {
      this.initCell();
    }
  }

  /**
   * in case there are more params to be handled
   * @param options any type's rest params
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected handleRestOptions(...options: unknown[]) {}

  /* -------------------------------------------------------------------------- */
  /*                common functions that will be used in subtype               */
  /* -------------------------------------------------------------------------- */

  public getMeta(): T {
    return this.meta;
  }

  public setMeta(viewMeta: T) {
    this.meta = viewMeta;
  }

  public getIconStyle() {
    return this.theme[this.cellType]?.icon;
  }

  public isShallowRender() {
    return false;
  }

  public getCellTextWordWrapStyle(cellType?: CellType): CellTextWordWrapStyle {
    const { wordWrap, maxLines, textOverflow } = (this.spreadsheet.options
      ?.style?.[cellType || this.cellType] || {}) as CellTextWordWrapStyle;

    return {
      wordWrap,
      maxLines,
      textOverflow,
    };
  }

  /**
   * 获取实际渲染的文本 (含省略号)
   */
  public getActualText(): string {
    return this.actualText;
  }

  /**
   * 实际渲染的文本宽度, 如果是多行文本, 取最大的一行宽度
   */
  public getActualTextWidth(): number {
    return this.textShape?.getComputedTextLength() || 0;
  }

  /**
   * 实际渲染的文本宽度, 如果是多行文本, 取每一行文本高度的总和
   * @alias getMultiLineActualTextHeight
   */
  public getActualTextHeight(): number {
    return this.getMultiLineActualTextHeight();
  }

  /**
   * 获取实际渲染的多行文本 (含省略号)
   */
  public getMultiLineActualTexts(): string[] {
    return this.textShape?.parsedStyle.metrics?.lines || [];
  }

  /**
   * 实际渲染的多行文本宽度 (每一行文本宽度的总和)
   */
  public getMultiLineActualTextWidth(): number {
    return sumBy(this.getTextLineBoundingRects(), 'width') || 0;
  }

  /**
   * 实际渲染的多行文本高度 (每一行文本高度的总和)
   * @alias getActualTextHeight
   */
  public getMultiLineActualTextHeight(): number {
    return sumBy(this.getTextLineBoundingRects(), 'height') || 0;
  }

  /**
   * 获取原始的文本 (不含省略号)
   */
  public getOriginalText(): string {
    return this.originalText;
  }

  /**
   * 文本是否溢出 (有省略号)
   */
  public isTextOverflowing() {
    return this.textShape?.isOverflowing();
  }

  /**
   * 是否是多行文本
   */
  public isMultiLineText() {
    return this.getTextLineBoundingRects().length > 1;
  }

  /**
   * 获取单元格空值占位符
   */
  public getEmptyPlaceholder() {
    const {
      options: { placeholder },
    } = this.spreadsheet;

    return getEmptyPlaceholderInner(this, placeholder);
  }

  /**
   * 获取文本包围盒
   */
  public getTextLineBoundingRects() {
    return this.textShape?.getLineBoundingRects() || [];
  }

  /**
   * 获取单元格展示的数值
   */
  public getFieldValue() {
    return this.getFormattedFieldValue().formattedValue;
  }

  protected shouldInit() {
    const { width, height } = this.meta;

    return width > 0 && height > 0;
  }

  public getStyle<K extends keyof InternalFullyTheme = CellType>(
    name?: K,
  ): InternalFullyTheme[K] | InternalFullyCellTheme {
    return get(this.theme, name || this.cellType);
  }

  public getLinkFieldShape() {
    return this.linkFieldShape;
  }

  public getBackgroundShape() {
    return this.backgroundShape;
  }

  public getStateShapes() {
    return this.stateShapes;
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

  public getBBoxByType(type = CellClipBox.BORDER_BOX): SimpleBBox {
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

      renderLine(this, { ...position, ...style });
    });
  }

  /**
   * 绘制 hover 悬停，刷选的外框
   */
  protected drawInteractiveBorderShape() {
    this.stateShapes.set(
      'interactiveBorderShape',
      renderRect(this, {
        ...this.getBBoxByType(CellClipBox.PADDING_BOX),
        visibility: 'hidden',
        pointerEvents: 'none',
      }),
    );
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
        pointerEvents: 'none',
      }),
    );
  }

  protected drawBackgroundShape() {
    const { backgroundColor, backgroundColorOpacity } =
      this.getBackgroundColor();

    this.backgroundShape = renderRect(this, {
      ...this.getBBoxByType(),
      fill: backgroundColor,
      fillOpacity: backgroundColorOpacity,
    });
  }

  public renderTextShape(
    style: TextStyleProps,
    options?: RenderTextShapeOptions,
  ): CustomText {
    const text = getDisplayText(style.text, this.getEmptyPlaceholder());
    const shallowRender = options?.shallowRender || this.isShallowRender();

    this.textShape = renderText({
      group: this,
      textShape: shallowRender ? undefined : this.textShape,
      style: {
        ...style,
        text,
      },
    });

    this.addTextShape(this.textShape);

    if (shallowRender) {
      return this.textShape;
    }

    // 兼容多行文本
    const actualText = this.getMultiLineActualTexts().join('');

    this.actualText = actualText;
    this.originalText = text;

    return this.textShape;
  }

  public updateTextPosition(position?: PointLike) {
    const defaultPosition = this.getTextPosition();

    this.textShape?.attr('x', position?.x ?? defaultPosition?.x);
    this.textShape?.attr('y', position?.y ?? defaultPosition?.y);
  }

  public drawTextShape() {
    // G 遵循浏览器的规范, 空间不足以展示省略号时, 会裁剪文字, 而不是展示省略号 https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow#ellipsis
    const maxTextWidth = Math.max(this.getMaxTextWidth(), 0);
    const textStyle = this.getTextStyle();

    // 在坐标计算 (getTextPosition) 之前, 预渲染一次, 提前生成 textShape, 获得文字宽度, 用于计算 icon 绘制坐标
    this.renderTextShape({
      ...textStyle,
      x: 0,
      y: 0,
      text: this.getFieldValue(),
      wordWrapWidth: maxTextWidth,
    });

    if (this.isShallowRender()) {
      return;
    }

    this.updateTextPosition();
  }

  protected drawLinkFieldShape(
    showLinkFieldShape: boolean,
    linkFillColor: string,
  ) {
    if (!showLinkFieldShape) {
      return;
    }

    const { device } = this.spreadsheet.options;

    // 配置了链接跳转
    if (!isMobile(device)) {
      const textStyle = this.getTextStyle();
      const position = this.getTextPosition();
      const actualTextWidth = this.getActualTextWidth();

      // 默认居左，其他align方式需要调整
      let startX = position.x;

      if (textStyle.textAlign === 'center') {
        startX -= actualTextWidth / 2;
      } else if (textStyle.textAlign === 'right') {
        startX -= actualTextWidth;
      }

      const { bottom: maxY } = this.textShape.getBBox();

      this.linkFieldShape = renderLine(this, {
        x1: startX,
        y1: maxY + 1,
        // 不用 bbox 的 maxX，因为 g-base 文字宽度预估偏差较大
        x2: startX + actualTextWidth,
        y2: maxY + 1,
        stroke: linkFillColor,
        lineWidth: 1,
      });
    }

    this.textShape.style.fill = linkFillColor;
    this.textShape.style.cursor = 'pointer';
    this.textShape.appendInfo = {
      // 标记为行头(明细表行头其实就是 Data Cell)文本，方便做链接跳转直接识别
      isLinkFieldText: true,
      cellData: this.meta,
    };
  }

  // 要被子类覆写，返回颜色字符串
  protected getLinkFieldStyle(): string {
    return this.getTextStyle().linkTextFill!;
  }

  protected drawLinkField(meta: Node | ViewMeta) {
    const { linkFields = [] } = this.spreadsheet.options.interaction!;
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
    ) as unknown as InteractionStateTheme;

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
    const attrs = this.getIconConditionResult();

    if (attrs) {
      const position = this.getIconPosition();
      const { size } = this.getStyle()!.icon!;

      this.conditionIconShape = renderIcon(this, {
        ...position,
        name: attrs?.name!,
        width: size,
        height: size,
        fill: attrs?.fill,
      });
      this.addConditionIconShape(this.conditionIconShape);
    }
  }

  public getTextConditionMappingResult() {
    const textCondition = this.findFieldCondition(this.conditions?.text);

    if (textCondition?.mapping) {
      return this.mappingValue(textCondition);
    }

    return null;
  }

  public getContainConditionMappingResultTextStyle(
    style: TextTheme | undefined,
  ) {
    // 优先级：默认字体颜色（已经根据背景反色后的） < 主题配置文字样式 < 条件格式文字样式
    const defaultTextFill = this.getDefaultTextFill(style!.fill!);
    const conditionStyle = this.getTextConditionMappingResult();

    return {
      ...style,
      ...conditionStyle,
      fill: conditionStyle?.fill || defaultTextFill,
    };
  }

  /**
   * 获取默认字体颜色：根据字段标记背景颜色，设置字体颜色
   * @param textStyle
   * @private
   */
  protected getDefaultTextFill(textFill: string) {
    const { backgroundColor, intelligentReverseTextColor } =
      this.getBackgroundColor();

    // text 默认为黑色，当背景颜色亮度过低时，修改 text 为白色
    if (
      shouldReverseFontColor(backgroundColor as string) &&
      textFill === DEFAULT_FONT_COLOR &&
      intelligentReverseTextColor
    ) {
      textFill = REVERSE_FONT_COLOR;
    }

    return textFill || '';
  }

  public getBackgroundConditionFill() {
    // get background condition fill color
    const bgCondition = this.findFieldCondition(this.conditions?.background!);

    if (bgCondition?.mapping!) {
      const attrs = this.mappingValue(bgCondition);

      if (attrs) {
        return {
          backgroundColor: attrs.fill,
          intelligentReverseTextColor:
            attrs.intelligentReverseTextColor || false,
        };
      }
    }

    return {
      intelligentReverseTextColor: false,
    };
  }

  public getIconConditionResult(): HeaderActionNameOptions | undefined {
    const iconCondition = this.findFieldCondition(
      this.conditions?.icon,
    ) as IconCondition;

    if (iconCondition?.mapping!) {
      const attrs = this.mappingValue(iconCondition);

      if (attrs && attrs.icon) {
        return {
          name: attrs.icon,
          position: getIconPosition(iconCondition),
          fill: attrs.fill,
          isConditionIcon: true,
        };
      }
    }
  }

  protected getActionAndConditionIconWidth(position?: IconPosition) {
    const { left, right } = this.groupedIcons;
    const iconStyle = this.getStyle()!.icon!;

    if (!position) {
      return (
        getIconTotalWidth(left, iconStyle) + getIconTotalWidth(right, iconStyle)
      );
    }

    return getIconTotalWidth(this.groupedIcons[position], iconStyle);
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
