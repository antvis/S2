import { BaseCell } from '@/cell/base-cell';
import { DerivedCell } from '@/cell/derived-cell';
import { VALUE_FIELD } from '@/common/constant';
import { CellTypes, InteractionStateName } from '@/common/constant/interaction';
import { GuiIcon } from '@/common/icons';
import {
  CellMapping,
  Condition,
  Conditions,
  S2CellType,
  ViewMeta,
} from '@/common/interface';
import { DataItem } from '@/common/interface/s2DataConfig';
import { renderLine, renderRect, renderText } from '@/utils/g-renders';
import {
  getDerivedDataState,
  getEllipsisText,
  getTextPosition,
} from '@/utils/text';
import { IShape, SimpleBBox } from '@antv/g-canvas';
import { find, first, get, includes, isEmpty, map } from 'lodash';
import type { SpreadSheet } from 'src/sheet-type';

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
  // 3、condition shapes
  // background color by bg condition
  protected conditionBgShape: IShape;

  // icon condition shape
  protected iconShape: GuiIcon;

  // interval condition shape
  protected intervalShape: IShape;

  // 4、render main text
  protected textShape: IShape;

  // 5、brush-select prepareSelect border
  protected activeBorderShape: IShape;

  // cell configs conditions(Determine how to render this cell)
  protected conditions: Conditions;

  constructor(meta: ViewMeta, spreadsheet: SpreadSheet) {
    super(meta, spreadsheet);
  }

  protected handleSelect(cells: S2CellType[]) {
    // 如果当前选择点击选择了行头或者列头，那么与行头列头在一个colIndex或rowIndex的data-cell应该置为selected-state
    // 二者操作一致，function合并
    const currentCellType = cells?.[0]?.cellType;
    if (currentCellType === CellTypes.COL_CELL) {
      this.changeCellStyleByState('colIndex', InteractionStateName.SELECTED);
      return;
    }
    if (currentCellType === CellTypes.ROW_CELL) {
      this.changeCellStyleByState('rowIndex', InteractionStateName.SELECTED);
    }
  }

  protected handleHover(cells: S2CellType[]) {
    // 如果当前是hover，要绘制出十字交叉的行列样式
    const currentHoverCell = first(cells) as S2CellType;
    if (currentHoverCell.cellType !== CellTypes.DATA_CELL) {
      this.hideShapeUnderState();
      return;
    }
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
      this.hideShapeUnderState();
    }
  }

  public update() {
    const stateName = this.spreadsheet.interaction.getCurrentStateName();
    const cells = this.spreadsheet.interaction.getActiveCells();

    if (isEmpty(cells)) {
      return;
    }

    switch (stateName) {
      case InteractionStateName.SELECTED:
        this.handleSelect(cells);
        break;
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
    let formatter;
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

  public getInteractiveBgShape() {
    return this.interactiveBgShape;
  }

  /**
   * Get left rest area size by icon condition
   * @protected
   */
  protected getLeftAreaBBox(): SimpleBBox {
    const { x, y, height, width } = this.meta;
    const { icon } = this.theme.dataCell;
    const iconCondition = this.findFieldCondition(this.conditions?.icon);
    const isIconExist = iconCondition && iconCondition.mapping;
    return {
      x,
      y,
      width: width - (isIconExist ? icon.size + icon.margin?.left : 0),
      height,
    };
  }

  public setMeta(viewMeta: ViewMeta) {
    super.setMeta(viewMeta);
    this.initCell();
  }

  public setCellsSpotlight() {
    if (
      this.spreadsheet.options.selectedCellsSpotlight &&
      this.spreadsheet.interaction.isSelectedState() &&
      !this.spreadsheet.interaction.isSelectedCell(this)
    ) {
      this.setBgColorOpacity();
    }
  }

  protected initCell() {
    this.cellType = this.getCellType();
    this.conditions = this.spreadsheet.options?.conditions;
    this.drawBackgroundShape();
    this.drawStateShapes();
    this.drawConditionShapes();
    this.drawTextShape();
    this.drawBorderShape();
    // 更新选中状态
    this.update();
    this.setCellsSpotlight();
  }

  protected getCellType() {
    return CellTypes.DATA_CELL;
  }

  // 根据state要改变样式的shape
  protected drawStateShapes() {
    this.drawInteractiveBgShape();
    this.drawActiveBorderShape();
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
    const { x, y, height, width } = this.getLeftAreaBBox();

    const { valueField: originField, isTotals } = this.meta;

    if (this.spreadsheet.isDerivedValue(originField)) {
      const data = this.getDerivedData(originField, isTotals);
      const dataValue = data.value as string;
      // TODO 衍生指标改造完后可去掉
      // 衍生指标的cell, 需要单独的处理
      this.add(
        new DerivedCell({
          x,
          y,
          height,
          width,
          up: data.up,
          text: dataValue,
          spreadsheet: this.spreadsheet,
        }),
      );
      return;
    }
    // 其他常态数据下的cell
    //  the size of text condition is equal with valueFields size
    const textCondition = this.findFieldCondition(this.conditions?.text);

    const { formattedValue: text } = this.getData();
    const textStyle = isTotals
      ? this.theme.dataCell.bolderText
      : this.theme.dataCell.text;
    let textFill = textStyle.fill;
    if (textCondition?.mapping) {
      textFill = this.mappingValue(textCondition)?.fill || textStyle.fill;
    }
    const padding = this.theme.dataCell.cell.padding;
    const ellipsisText = getEllipsisText(
      `${text || '-'}`,
      width - padding?.left - padding?.right,
      textStyle,
    );
    const cellBoxCfg = {
      x,
      y,
      height,
      width,
      textAlign: textStyle.textAlign,
      textBaseline: textStyle.textBaseline,
      padding,
    };
    const position = getTextPosition(cellBoxCfg);
    this.textShape = renderText(
      [this.textShape],
      position.x,
      position.y,
      ellipsisText,
      textStyle,
      this,
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
  protected drawActiveBorderShape() {
    // 往内缩一个像素，避免和外边框重叠
    const margin = 1;
    const { x, y, height, width } = this.meta;
    this.activeBorderShape = renderRect(this, {
      x: x + margin,
      y: y + margin,
      width: width - margin * 2,
      height: height - margin * 2,
      fill: 'transparent',
      stroke: 'transparent',
    });
    this.stateShapes.push(this.activeBorderShape);
  }

  /**
   * Draw interactive color
   */
  protected drawInteractiveBgShape() {
    const { x, y, height, width } = this.meta;
    this.interactiveBgShape = renderRect(this, {
      x,
      y,
      width,
      height,
      fill: 'transparent',
      stroke: 'transparent',
    });
    this.stateShapes.push(this.interactiveBgShape);
  }

  /**
   * Draw icon condition shape
   * @private
   */
  protected drawIconShape() {
    const { x, y, height, width } = this.meta;
    const { icon } = this.theme.dataCell;
    const iconCondition = this.findFieldCondition(this.conditions?.icon);
    if (iconCondition && iconCondition.mapping) {
      const attrs = this.mappingValue(iconCondition);
      const { formattedValue } = this.getData();
      // icon only show when icon not empty and value not null(empty)
      if (!isEmpty(attrs?.icon) && formattedValue) {
        this.iconShape = new GuiIcon({
          type: attrs.icon,
          x: x + width - icon.margin.left - icon.size,
          y: y + height / 2 - icon.size / 2,
          width: icon.size,
          height: icon.size,
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
    const { x, y, height, width } = this.getLeftAreaBBox();

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

  protected getDerivedData(derivedValue: string, isTotals = false) {
    const data = this.meta.data;
    if (data) {
      let value: string | number;
      if (isTotals) {
        value = get(data, [0, VALUE_FIELD]);
      } else {
        value = get(data, [0, derivedValue]);
      }
      const up = getDerivedDataState(value);
      const formatter =
        this.spreadsheet.dataSet.getFieldFormatter(derivedValue);
      return {
        value: formatter ? formatter(value) : value,
        up,
      };
    }
    return {
      value: '',
      up: false,
    };
  }

  // dataCell根据state 改变当前样式，
  private changeCellStyleByState(
    index: 'colIndex' | 'rowIndex',
    stateName: InteractionStateName,
  ) {
    const cells = this.spreadsheet.interaction.getActiveCells();
    const currentIndex = get(this.meta, index);
    const selectedIndexes = map(cells, (cell) => get(cell?.getMeta(), index));
    if (includes(selectedIndexes, currentIndex)) {
      this.updateByState(stateName);
      requestAnimationFrame(() => {
        this.resetOpacity();
        this.spreadsheet.container.draw();
      });
    } else {
      this.hideShapeUnderState();
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
      x,
      y,
      x + width,
      y,
      cell.horizontalBorderColor,
      cell.horizontalBorderWidth,
      this,
      cell.horizontalBorderColorOpacity,
    );

    // vertical border
    renderLine(
      x + width,
      y,
      x + width,
      y + height,
      cell.verticalBorderColor,
      cell.verticalBorderWidth,
      this,
      cell.horizontalBorderColorOpacity,
    );
  }
}
