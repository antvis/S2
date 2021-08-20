import { BaseCell } from '@/cell/base-cell';
import { CellTypes, InteractionStateName } from '@/common/constant/interaction';
import { GuiIcon } from '@/common/icons';
import {
  CellBoxCfg,
  CellMapping,
  Condition,
  Conditions,
  Formatter,
  IconCfg,
  IconCondition,
  S2CellType,
  ViewMeta,
  ViewMetaIndex,
} from '@/common/interface';
import { DataItem } from '@/common/interface/s2DataConfig';
import { getIconLayoutPosition } from '@/utils/condition';
import {
  getContentArea,
  getIconPosition,
  getTextAndIconArea,
  getTextPosition,
} from '@/utils/data-cell';
import { renderLine, renderRect, renderText } from '@/utils/g-renders';
import { getEllipsisText } from '@/utils/text';
import { IShape, SimpleBBox } from '@antv/g-canvas';
import { find, first, get, includes, isEmpty, isEqual, map } from 'lodash';

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
  // cell configs conditions(Determine how to render this cell)
  protected conditions: Conditions;

  // condition shapes
  // background color by bg condition
  protected conditionBgShape: IShape;

  // icon condition shape
  protected iconShape: GuiIcon;

  // interval condition shape
  protected intervalShape: IShape;

  public get cellType() {
    return CellTypes.DATA_CELL;
  }

  protected handlePrepareSelect(cells: S2CellType[]) {
    if (includes(cells, this)) {
      this.updateByState(InteractionStateName.PREPARE_SELECT);
    }
  }

  protected handleSelect(cells: S2CellType[]) {
    const currentCellType = cells?.[0]?.cellType;
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
        if (includes(cells, this)) {
          this.updateByState(InteractionStateName.SELECTED);
        } else if (this.spreadsheet.options.selectedCellsSpotlight) {
          this.updateByState(InteractionStateName.UNSELECTED);
        }
        break;
      default:
        break;
    }
  }

  protected handleHover(cells: S2CellType[]) {
    const currentHoverCell = first(cells) as S2CellType;
    if (currentHoverCell.cellType !== CellTypes.DATA_CELL) {
      this.hideInteractionShape();
      return;
    }

    if (this.spreadsheet.options.hoverHighlight) {
      // 如果当前是hover，要绘制出十字交叉的行列样式

      const currentColIndex = this.meta.colIndex;
      const currentRowIndex = this.meta.rowIndex;
      // 当视图内的 cell 行列 index 与 hover 的 cell 一致，绘制hover的十字样式
      if (
        currentColIndex === currentHoverCell?.getMeta().colIndex ||
        currentRowIndex === currentHoverCell?.getMeta().rowIndex
      ) {
        this.updateByState(InteractionStateName.HOVER);
      } else {
        // 当视图内的 cell 行列 index 与 hover 的 cell 不一致，隐藏其他样式
        this.hideInteractionShape();
      }
    }

    if (isEqual(currentHoverCell, this)) {
      this.updateByState(InteractionStateName.HOVER_FOCUS);
    }
  }

  public update() {
    const stateName = this.spreadsheet.interaction.getCurrentStateName();
    const cells = this.spreadsheet.interaction.getActiveCells();

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

  public getData(): { value: DataItem; formattedValue: DataItem } {
    const rowField = this.meta.rowId;
    const rowMeta = this.spreadsheet.dataSet.getFieldMeta(rowField);
    let formatter: Formatter;
    if (rowMeta) {
      // format by row field
      formatter = this.spreadsheet.dataSet.getFieldFormatter(rowField);
    } else {
      // format by value field
      formatter = this.spreadsheet.dataSet.getFieldFormatter(
        this.meta.valueField,
      );
    }
    const formattedValue = formatter(this.meta.fieldValue);
    return {
      value: this.meta.fieldValue as DataItem,
      formattedValue,
    };
  }

  /**
   * @description get cell text style
   * @protected
   */
  protected getTextStyle() {
    const { isTotals } = this.meta;
    const textStyle = isTotals
      ? this.theme.dataCell.bolderText
      : this.theme.dataCell.text;
    return textStyle;
  }

  /**
   * Get content area size that contains icon and text
   * @protected
   */
  protected getContentAreaBBox(): SimpleBBox {
    const { x, y, height, width } = this.meta;
    const { padding } = this.theme.dataCell.cell;
    const textStyle = this.getTextStyle();

    const cfg: CellBoxCfg = {
      x,
      y,
      height,
      width,
      textAlign: textStyle.textAlign,
      textBaseline: textStyle.textBaseline,
      padding,
    };

    return getContentArea(cfg);
  }

  /**
   * @description get text or icon bbox
   * @param {('text' | 'icon')} [type='text']
   */
  protected getBBoxByAreaType(type: 'text' | 'icon' = 'text') {
    const bbox = this.getContentAreaBBox();

    const { size, margin } = this.theme.dataCell.icon;
    const iconCondition: IconCondition = this.findFieldCondition(
      this.conditions?.icon,
    );

    const iconCfg: IconCfg = iconCondition && {
      size,
      margin,
      iconPosition: getIconLayoutPosition(iconCondition),
    };

    return getTextAndIconArea(bbox, iconCfg)[type];
  }

  protected getTextPosition() {
    const textStyle = this.getTextStyle();
    return getTextPosition(this.getBBoxByAreaType(), textStyle);
  }

  protected getIconPosition() {
    const { size } = this.theme.dataCell.icon;
    const textStyle = this.getTextStyle();
    return getIconPosition(
      this.getBBoxByAreaType('icon'),
      size,
      textStyle.textBaseline,
    );
  }

  public setMeta(viewMeta: ViewMeta) {
    super.setMeta(viewMeta);
    this.initCell();
  }

  protected initCell() {
    this.conditions = this.spreadsheet.options?.conditions;
    this.drawBackgroundShape();
    this.drawStateShapes();
    this.drawConditionShapes();
    this.drawTextShape();
    this.drawBorderShape();
    // update the interaction state
    this.update();
  }

  // 根据state要改变样式的shape
  protected drawStateShapes() {
    this.drawInteractiveBgShape();
    this.drawInteractiveBorderShape();
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
   * @param min in current field values
   * @param max in current field values
   */
  protected getIntervalScale(
    min: number,
    max: number,
  ): (currentValue: number) => number {
    const realMin = min >= 0 ? 0 : min;
    const distance = max - realMin;
    return (currentValue: number) => {
      return (currentValue - realMin) / distance;
    };
  }

  /**
   * Mapping value to get condition related attrs
   * @param condition
   */
  protected mappingValue(condition: Condition): CellMapping {
    const value = this.meta.fieldValue as unknown as number;
    return condition?.mapping(value, get(this.meta.data, [0]));
  }

  /**
   * Find current field related condition
   * @param conditions
   */
  protected findFieldCondition(conditions: Condition[]): Condition {
    return find(conditions, (item) => item.field === this.meta.valueField);
  }

  /**
   * Render cell main text and derived text
   */
  protected drawTextShape() {
    const { width } = this.getBBoxByAreaType();
    // 其他常态数据下的cell
    //  the size of text condition is equal with valueFields size
    const textCondition = this.findFieldCondition(this.conditions?.text);

    const { formattedValue: text } = this.getData();

    const textStyle = this.getTextStyle();
    let textFill = textStyle.fill;

    if (textCondition?.mapping) {
      textFill = this.mappingValue(textCondition)?.fill || textStyle.fill;
    }

    const ellipsisText = getEllipsisText(`${text || '-'}`, width, textStyle);

    const position = this.getTextPosition();
    this.textShape = renderText(
      this,
      [this.textShape],
      position.x,
      position.y,
      ellipsisText,
      { ...textStyle, fill: textFill },
    );
  }

  public getBackgroundColor(): string {
    const crossBackgroundColor = this.theme.dataCell.cell.crossBackgroundColor;
    if (
      this.spreadsheet.isPivotMode() &&
      crossBackgroundColor &&
      this.meta.rowIndex % 2 === 0
    ) {
      // 隔行颜色的配置
      // 偶数行展示灰色背景，因为index是从0开始的
      return crossBackgroundColor;
    }

    return this.theme.dataCell.cell.backgroundColor;
  }

  /**
   * Draw cell background
   */
  protected drawBackgroundShape() {
    const { x, y, height, width } = this.meta;
    const stroke = 'transparent';
    const bgColor = this.getBackgroundColor();

    this.backgroundShape = renderRect(this, {
      x,
      y,
      width,
      height,
      fill: bgColor,
      stroke,
    });
  }

  /**
   * Draw background condition shape
   */
  protected drawConditionBgShape() {
    const { x, y, height, width } = this.meta;
    let fill = 'rgba(255, 255, 255, 0)';
    let stroke = 'transparent';
    // 如果存在这个字段的 background 条件格式配置
    const bgCondition = this.findFieldCondition(this.conditions?.background);
    if (bgCondition && bgCondition.mapping) {
      const attrs = this.mappingValue(bgCondition);
      if (attrs) {
        // eslint-disable-next-line no-multi-assign
        stroke = fill = attrs.fill;
        this.conditionBgShape = renderRect(this, {
          x,
          y,
          width,
          height,
          fill,
          stroke,
        });
      }
    }
  }

  /**
   * Draw condition's shapes
   * icon, interval, background
   */
  protected drawConditionShapes() {
    this.drawConditionBgShape();
    this.drawIconShape();
    this.drawIntervalShape();
  }

  /**
   * 绘制hover悬停，刷选的外框
   */
  protected drawInteractiveBorderShape() {
    // 往内缩一个像素，避免和外边框重叠
    const margin = 1;
    const { x, y, height, width } = this.meta;
    this.stateShapes.set(
      'activeBorderShape',
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
    const { x, y, height, width } = this.meta;
    this.stateShapes.set(
      'interactiveBgShape',
      renderRect(this, {
        x,
        y,
        width,
        height,
        fill: 'transparent',
        stroke: 'transparent',
      }),
    );
  }

  /**
   * Draw icon condition shape
   * @private
   */
  protected drawIconShape() {
    const iconCondition: IconCondition = this.findFieldCondition(
      this.conditions?.icon,
    );
    if (iconCondition && iconCondition.mapping) {
      const attrs = this.mappingValue(iconCondition);
      const position = this.getIconPosition();
      const { formattedValue } = this.getData();
      const { size } = this.theme.dataCell.icon;
      // icon only show when icon not empty and value not null(empty)
      if (!isEmpty(attrs?.icon) && formattedValue) {
        this.iconShape = new GuiIcon({
          ...position,
          type: attrs.icon,
          width: size,
          height: size,
          fill: attrs.fill,
        });

        this.add(this.iconShape);
      }
    }
  }

  /**
   * Draw interval condition shape
   * @private
   */
  protected drawIntervalShape() {
    const { x, y, height, width } = this.getContentAreaBBox();

    const intervalCondition = this.findFieldCondition(
      this.conditions?.interval,
    );
    const { formattedValue } = this.getData();
    if (intervalCondition && intervalCondition.mapping && formattedValue) {
      let fill = '#75C0F8';
      let stroke = '#75C0F8';
      const attrs = this.mappingValue(intervalCondition);
      if (attrs) {
        // interval shape exist
        // if (attrs.isCompare) {
        // value in range(compare) condition
        const scale = this.getIntervalScale(
          attrs.minValue || 0,
          attrs.maxValue,
        );
        const zero = scale(0); // 零点
        const fieldValue = this.meta.fieldValue as number;
        const current = scale(fieldValue); // 当前数据点
        // } else {
        // the other conditions， keep old logic
        // TODO this logic need be changed!!!
        // const summaryField = this.meta.valueField;
        // const pivot = this.spreadsheet.dataSet.pivot;
        // if (pivot) {
        //   const MIN = summaryField
        //     ? pivot.getTotals(summaryField, {}, 'MIN')
        //     : 0;
        //   const MAX = summaryField
        //     ? pivot.getTotals(summaryField, {}, 'MAX')
        //     : 0;
        //   scale = this.getIntervalScale(MIN, MAX);
        //   zero = scale(0); // 零点
        //   current = scale(this.meta.fieldValue); // 当前数据点
        // }
        // }
        // eslint-disable-next-line no-multi-assign
        stroke = fill = attrs.fill;

        const barChartHeight = this.theme.dataCell.cell.miniBarChartHeight;
        this.intervalShape = renderRect(this, {
          x: x + width * zero,
          y: y + height / 2 - barChartHeight / 2,
          width: width * (current - zero),
          height: barChartHeight,
          fill,
          stroke,
        });
      }
    }
  }

  // dataCell根据state 改变当前样式，
  private changeRowColSelectState(index: ViewMetaIndex) {
    const currentIndex = get(this.meta, index);
    const nodes = this.spreadsheet.interaction.getState()?.nodes;
    const selectedIndexes = map(nodes, (node) => get(node, index));
    if (includes(selectedIndexes, currentIndex)) {
      this.updateByState(InteractionStateName.SELECTED);
    } else if (this.spreadsheet.options.selectedCellsSpotlight) {
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
    const { x, y, height, width } = this.meta;
    const { cell } = this.theme.dataCell;

    // horizontal border
    renderLine(
      this,
      {
        x1: x,
        y1: y,
        x2: x + width,
        y2: y,
      },
      {
        stroke: cell.horizontalBorderColor,
        lineWidth: cell.horizontalBorderWidth,
        opacity: cell.horizontalBorderColorOpacity,
      },
    );

    // vertical border
    renderLine(
      this,
      {
        x1: x + width,
        y1: y,
        x2: x + width,
        y2: y + height,
      },
      {
        stroke: cell.verticalBorderColor,
        lineWidth: cell.verticalBorderWidth,
        opacity: cell.horizontalBorderColorOpacity,
      },
    );
  }
}
