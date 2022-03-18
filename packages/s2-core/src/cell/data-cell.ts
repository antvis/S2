import type { IShape, Point } from '@antv/g-canvas';
import { clamp, findLast, first, get, isEmpty, isEqual } from 'lodash';
import { BaseCell } from '@/cell/base-cell';
import {
  CellTypes,
  InteractionStateName,
  SHAPE_STYLE_MAP,
} from '@/common/constant/interaction';
import { GuiIcon } from '@/common/icons';
import {
  Condition,
  Conditions,
  FormatResult,
  Formatter,
  IconCfg,
  IconCondition,
  MappingResult,
  CellMeta,
  TextTheme,
  ViewMeta,
  ViewMetaIndexType,
  CellBorderPosition,
} from '@/common/interface';
import { getMaxTextWidth, getBorderPositionAndStyle } from '@/utils/cell/cell';
import { includeCell } from '@/utils/cell/data-cell';
import { getIconPositionCfg } from '@/utils/condition/condition';
import {
  renderIcon,
  renderLine,
  renderRect,
  updateShapeAttr,
} from '@/utils/g-renders';
import { parseNumberWithPrecision } from '@/utils/formatter';

/**
 * DataCell for panelGroup area
 * ----------------------------
 * |                  |       |
 * |interval      text| icon  |
 * |                  |       |
 * ----------------------------
 * There are four conditions(]{@see BaseCell.conditions}) to determine how to render
 * 1、background color
 * 2、icon align in right with size {@link ICON_SIZE}
 * 3、left rect area is interval(in left) and text(in right)
 */
export class DataCell extends BaseCell<ViewMeta> {
  protected conditions: Conditions;

  protected conditionIntervalShape: IShape;

  protected conditionIconShape: GuiIcon;

  public get cellType() {
    return CellTypes.DATA_CELL;
  }

  protected handlePrepareSelect(cells: CellMeta[]) {
    if (includeCell(cells, this)) {
      this.updateByState(InteractionStateName.PREPARE_SELECT);
    }
  }

  protected handleSelect(cells: CellMeta[]) {
    const currentCellType = cells?.[0]?.type;
    switch (currentCellType) {
      // 列多选
      case CellTypes.COL_CELL:
        this.changeRowColSelectState('colIndex');
        break;
      // 行多选
      case CellTypes.ROW_CELL:
        this.changeRowColSelectState('rowIndex');
        break;
      // 单元格单选/多选
      case CellTypes.DATA_CELL:
        if (includeCell(cells, this)) {
          this.updateByState(InteractionStateName.SELECTED);
        } else if (
          this.spreadsheet.options.interaction.selectedCellsSpotlight
        ) {
          this.updateByState(InteractionStateName.UNSELECTED);
        }
        break;
      default:
        break;
    }
  }

  protected handleHover(cells: CellMeta[]) {
    const currentHoverCell = first(cells) as CellMeta;
    if (currentHoverCell.type !== CellTypes.DATA_CELL) {
      this.hideInteractionShape();
      return;
    }

    if (this.spreadsheet.options.interaction.hoverHighlight) {
      // 如果当前是hover，要绘制出十字交叉的行列样式
      const currentColIndex = this.meta.colIndex;
      const currentRowIndex = this.meta.rowIndex;
      // 当视图内的 cell 行列 index 与 hover 的 cell 一致，绘制hover的十字样式
      if (
        currentColIndex === currentHoverCell?.colIndex ||
        currentRowIndex === currentHoverCell?.rowIndex
      ) {
        this.updateByState(InteractionStateName.HOVER);
      } else {
        // 当视图内的 cell 行列 index 与 hover 的 cell 不一致，隐藏其他样式
        this.hideInteractionShape();
      }
    }

    if (isEqual(currentHoverCell.id, this.getMeta().id)) {
      this.updateByState(InteractionStateName.HOVER_FOCUS);
    }
  }

  public update() {
    const stateName = this.spreadsheet.interaction.getCurrentStateName();
    const cells = this.spreadsheet.interaction.getCells();

    if (stateName === InteractionStateName.ALL_SELECTED) {
      this.updateByState(InteractionStateName.SELECTED);
      return;
    }

    if (isEmpty(cells) || !stateName) {
      return;
    }

    switch (stateName) {
      case InteractionStateName.PREPARE_SELECT:
        this.handlePrepareSelect(cells);
        break;
      case InteractionStateName.SELECTED:
        this.handleSelect(cells);
        break;
      case InteractionStateName.HOVER_FOCUS:
      case InteractionStateName.HOVER:
        this.handleHover(cells);
        break;
      default:
        break;
    }
  }

  public setMeta(viewMeta: ViewMeta) {
    super.setMeta(viewMeta);
    this.initCell();
  }

  protected initCell() {
    this.conditions = this.spreadsheet.options.conditions;
    this.drawBackgroundShape();
    this.drawInteractiveBgShape();
    this.drawConditionIntervalShape();
    this.drawInteractiveBorderShape();
    this.drawTextShape();
    this.drawConditionIconShapes();
    this.drawBorderShape();
    this.update();
  }

  protected getTextStyle(): TextTheme {
    const { isTotals } = this.meta;
    const textStyle = isTotals
      ? this.theme.dataCell.bolderText
      : this.theme.dataCell.text;

    // get text condition's fill result
    let fill = textStyle.fill;
    const textCondition = this.findFieldCondition(this.conditions?.text);
    if (textCondition?.mapping) {
      fill = this.mappingValue(textCondition)?.fill;
    }

    return { ...textStyle, fill };
  }

  public getIconStyle(): IconCfg | undefined {
    const { size, margin } = this.theme.dataCell.icon;
    const iconCondition: IconCondition = this.findFieldCondition(
      this.conditions?.icon,
    );

    const iconCfg: IconCfg = iconCondition &&
      iconCondition.mapping && {
        size,
        margin,
        position: getIconPositionCfg(iconCondition),
      };
    return iconCfg;
  }

  protected getFormattedFieldValue(): FormatResult {
    const { rowId, valueField, fieldValue, data } = this.meta;
    const rowMeta = this.spreadsheet.dataSet.getFieldMeta(rowId);
    let formatter: Formatter;
    if (rowMeta) {
      // format by row field
      formatter = this.spreadsheet.dataSet.getFieldFormatter(rowId);
    } else {
      // format by value field
      formatter = this.spreadsheet.dataSet.getFieldFormatter(valueField);
    }
    const formattedValue = formatter(fieldValue, data);
    return {
      value: fieldValue,
      formattedValue,
    };
  }

  protected getMaxTextWidth(): number {
    const { width } = this.getContentArea();
    return getMaxTextWidth(width, this.getIconStyle());
  }

  protected getTextPosition(): Point {
    return this.getTextAndIconPosition().text;
  }

  protected drawConditionIconShapes() {
    const iconCondition: IconCondition = this.findFieldCondition(
      this.conditions?.icon,
    );
    if (iconCondition && iconCondition.mapping) {
      const attrs = this.mappingValue(iconCondition);
      const position = this.getIconPosition();
      const { formattedValue } = this.getFormattedFieldValue();
      const { size } = this.theme.dataCell.icon;
      if (!isEmpty(attrs?.icon) && formattedValue) {
        this.conditionIconShape = renderIcon(this, {
          ...position,
          name: attrs.icon,
          width: size,
          height: size,
          fill: attrs.fill,
        });
      }
    }
  }

  /**
   * 计算柱图的 scale 函数（两种情况）
   *
   * min_________x_____0___________________________max
   * |<----r---->|
   *
   * 0_________________min_________x_______________max
   * |<-------------r------------->|
   *
   * @param minValue in current field values
   * @param max in current field values
   */
  private getIntervalScale(minValue = 0, maxValue = 0) {
    minValue = parseNumberWithPrecision(minValue);
    maxValue = parseNumberWithPrecision(maxValue);

    const realMin = minValue >= 0 ? 0 : minValue;
    const distance = maxValue - realMin || 1;
    return (current: number) =>
      // max percentage shouldn't be greater than 100%
      // min percentage shouldn't be less than 0%
      clamp((current - realMin) / distance, 0, 1);
  }

  /**
   * Draw interval condition shape
   * @private
   */
  protected drawConditionIntervalShape() {
    const { x, y, height, width } = this.getCellArea();
    const { formattedValue } = this.getFormattedFieldValue();

    const intervalCondition = this.findFieldCondition(
      this.conditions?.interval,
    );

    if (intervalCondition && intervalCondition.mapping && formattedValue) {
      const attrs = this.mappingValue(intervalCondition);
      if (!attrs) {
        return;
      }
      const { minValue, maxValue } = attrs.isCompare
        ? attrs
        : this.spreadsheet.dataSet.getValueRangeByField(this.meta.valueField);
      const fieldValue = parseNumberWithPrecision(
        this.meta.fieldValue as number,
      );
      // 对于超出设定范围的值不予显示
      if (fieldValue < minValue || fieldValue > maxValue) {
        return;
      }

      const scale = this.getIntervalScale(minValue, maxValue);
      const zero = scale(0); // 零点
      const current = scale(fieldValue); // 当前数据点

      const barChartHeight = this.getStyle().cell.miniBarChartHeight;
      const barChartFillColor = this.getStyle().cell.miniBarChartFillColor;
      const fill = attrs.fill ?? barChartFillColor;

      this.conditionIntervalShape = renderRect(this, {
        x: x + width * zero,
        y: y + height / 2 - barChartHeight / 2,
        width: width * (current - zero),
        height: barChartHeight,
        fill,
      });
    }
  }

  public getBackgroundColor() {
    const crossBackgroundColor = this.getStyle().cell.crossBackgroundColor;

    let backgroundColor = this.getStyle().cell.backgroundColor;
    const strokeColor = 'transparent';
    if (
      this.spreadsheet.isPivotMode() &&
      crossBackgroundColor &&
      this.meta.rowIndex % 2 === 0
    ) {
      // 隔行颜色的配置
      // 偶数行展示灰色背景，因为index是从0开始的
      backgroundColor = crossBackgroundColor;
    }

    // get background condition fill color
    const bgCondition = this.findFieldCondition(this.conditions?.background);
    if (bgCondition && bgCondition.mapping) {
      const attrs = this.mappingValue(bgCondition);
      if (attrs) {
        backgroundColor = attrs.fill;
      }
    }
    return { backgroundColor, strokeColor };
  }

  /**
   * Draw cell background
   */
  protected drawBackgroundShape() {
    const { backgroundColor: fill, strokeColor: stroke } =
      this.getBackgroundColor();

    this.backgroundShape = renderRect(this, {
      ...this.getCellArea(),
      fill,
      stroke,
    });
  }

  /**
   * 绘制hover悬停，刷选的外框
   */
  protected drawInteractiveBorderShape() {
    // 往内缩一个像素，避免和外边框重叠
    const margin = 1;
    const { x, y, height, width } = this.getCellArea();
    this.stateShapes.set(
      'interactiveBorderShape',
      renderRect(this, {
        x: x + margin,
        y: y + margin,
        width: width - margin * 2,
        height: height - margin * 2,
        fill: 'transparent',
        stroke: 'transparent',
      }),
    );
  }

  /**
   * Draw interactive color
   */
  protected drawInteractiveBgShape() {
    this.stateShapes.set(
      'interactiveBgShape',
      renderRect(this, {
        ...this.getCellArea(),
        fill: 'transparent',
        stroke: 'transparent',
      }),
    );
  }

  // dataCell根据state 改变当前样式，
  private changeRowColSelectState(indexType: ViewMetaIndexType) {
    const { interaction } = this.spreadsheet;
    const currentIndex = get(this.meta, indexType);
    const { nodes = [], cells = [] } = interaction.getState();
    const isEqualIndex = [...nodes, ...cells].find(
      (cell) => get(cell, indexType) === currentIndex,
    );
    if (isEqualIndex) {
      this.updateByState(InteractionStateName.SELECTED);
    } else if (this.spreadsheet.options.interaction.selectedCellsSpotlight) {
      this.updateByState(InteractionStateName.UNSELECTED);
    } else {
      this.hideInteractionShape();
    }
  }

  /**
   * Render cell border controlled by verticalBorder & horizontalBorder
   * @private
   */
  protected drawBorderShape() {
    [CellBorderPosition.BOTTOM, CellBorderPosition.RIGHT].forEach((type) => {
      const { position, style } = getBorderPositionAndStyle(
        type,
        this.getCellArea(),
        this.getStyle().cell,
      );

      renderLine(this, position, style);
    });
  }

  /**
   * Find current field related condition
   * @param conditions
   */
  protected findFieldCondition(conditions: Condition[]): Condition {
    return findLast(conditions, (item) => {
      return item.field instanceof RegExp
        ? item.field.test(this.meta.valueField)
        : item.field === this.meta.valueField;
    });
  }

  /**
   * Mapping value to get condition related attrs
   * @param condition
   */
  protected mappingValue(condition: Condition): MappingResult {
    const value = this.meta.fieldValue as unknown as number;
    return condition?.mapping(value, this.meta.data);
  }

  public updateByState(stateName: InteractionStateName) {
    super.updateByState(stateName, this);

    if (stateName === InteractionStateName.UNSELECTED) {
      const stateStyles = get(
        this.theme,
        `${this.cellType}.cell.interactionState.${stateName}`,
      );
      if (stateStyles) {
        updateShapeAttr(
          this.conditionIntervalShape,
          SHAPE_STYLE_MAP.backgroundOpacity,
          stateStyles.backgroundOpacity,
        );

        updateShapeAttr(
          this.conditionIconShape as unknown as IShape,
          SHAPE_STYLE_MAP.opacity,
          stateStyles.opacity,
        );
      }
    }
  }

  public clearUnselectedState() {
    super.clearUnselectedState();

    updateShapeAttr(
      this.conditionIntervalShape,
      SHAPE_STYLE_MAP.backgroundOpacity,
      1,
    );

    updateShapeAttr(
      this.conditionIconShape as unknown as IShape,
      SHAPE_STYLE_MAP.opacity,
      1,
    );
  }

  protected drawLeftBorder() {
    const { position, style } = getBorderPositionAndStyle(
      CellBorderPosition.LEFT,
      this.getCellArea(),
      this.getStyle().cell,
    );
    renderLine(this, position, style);
  }
}
