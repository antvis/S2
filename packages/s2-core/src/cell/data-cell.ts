import { getEllipsisText } from '../utils/text';
import { SimpleBBox, IShape } from '@antv/g-canvas';
import { map, find, get, isEmpty, isNumber } from 'lodash';
import BaseSpreadsheet from '../sheet-type/base-spread-sheet';
import { GuiIcon } from '../common/icons';
import { CellMapping, Condition, Conditions } from '../common/interface';
import {
  renderLine,
  renderRect,
  renderText,
  // updateShapeAttr,
} from '../utils/g-renders';
import { VALUE_FIELD } from '../common/constant';
import { ViewMeta } from '../common/interface';
import { BaseCell } from './base-cell';
import { DerivedCell } from './derived-cell';
import { StateName } from '../state/state';

// default icon size
const ICON_SIZE = 10;
// default icon padding
const ICON_PADDING = 2;

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

  // cell config's conditions(Determine how to render this cell)
  protected conditions: Conditions;

  constructor(meta: ViewMeta, spreadsheet: BaseSpreadsheet) {
    super(meta, spreadsheet);
  }

  public update() {
    const state = this.spreadsheet.getCurrentState();
    const { stateName, cells: selectedCells } = state;
    // 如果当前选择点击选择了行头或者列头，那么与行头列头在一个colIndex或rowIndex的data-cell应该置为selected-state
    if (selectedCells.length) {
      if (stateName === StateName.COL_SELECTED) {
        const currentColIndex = this.meta.colIndex;
        const selectedColIndex = map(
          selectedCells,
          (cell) => cell.getMeta().cellIndex,
        );
        if (selectedColIndex.indexOf(currentColIndex) > -1) {
          this.updateByState(StateName.SELECTED);
        } else {
          this.hideShapeUnderState();
        }
      } else if (stateName === StateName.ROW_SELECTED) {
        // 逻辑和selectedCol一致，row-select和col-select可能会有不同方式，暂时不合并
        const currentRowIndex = this.meta.rowIndex;
        const selectedRowIndex = map(
          selectedCells,
          (cell) => cell.getMeta().rowIndex,
        );
        if (selectedRowIndex.indexOf(currentRowIndex) > -1) {
          this.updateByState(StateName.SELECTED);
        } else {
          this.hideShapeUnderState();
        }
      }
    }
  }

  public getInteractiveBgShape() {
    return this.interactiveBgShape;
  }

  public getData(): { value: number; formattedValue: string } {
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
      value: this.meta.fieldValue,
      formattedValue,
    };
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
    // 更新选中状态
    this.update();
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
   * Get left rest area size by icon condition
   * @private
   */
  private getLeftAreaBBox(): SimpleBBox {
    const { x, y, height, width } = this.meta;
    const iconCondition = this.findFieldCondition(this.conditions?.icon);
    const isIconExist = iconCondition && iconCondition.mapping;
    return {
      x,
      y,
      width: width - (isIconExist ? ICON_SIZE + ICON_PADDING * 2 : 0),
      height,
    };
  }

  /**
   * Find current field related condition
   * @param conditions
   */
  protected findFieldCondition(conditions: Condition[]): Condition {
    return find(conditions, (item) => item.field === this.meta.valueField);
  }

  /**
   * Mapping value to get condition related attrs
   * @param condition
   */
  protected mappingValue(condition: Condition): CellMapping {
    return condition?.mapping(this.meta.fieldValue, get(this.meta.data, [0]));
  }

  /**
   * Draw cell background
   */
  protected drawBackgroundShape() {
    const { x, y, height, width } = this.meta;

    let bgColor = this.theme.view.cell.backgroundColor;
    const stroke = 'transparent';

    const crossColor = this.theme.view.cell.crossColor;
    // 隔行颜色的配置
    if (this.spreadsheet.isSpreadsheetType() && crossColor) {
      if (this.meta.rowIndexHeightExist % 2 === 0) {
        // 偶数行展示灰色背景，因为index是从0开始的
        bgColor = crossColor;
      }
    }
    this.backgroundShape = renderRect(
      x,
      y,
      width,
      height,
      bgColor,
      stroke,
      this,
    );
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
        this.conditionBgShape = renderRect(
          x,
          y,
          width,
          height,
          fill,
          stroke,
          this,
        );
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
    this.activeBorderShape = renderRect(
      x + margin,
      y + margin,
      width - margin * 2,
      height - margin * 2,
      'transparent',
      'transparent',
      this,
    );
    this.stateShapes.push(this.activeBorderShape);
  }

  /**
   * Draw interactive color
   */
  protected drawInteractiveBgShape() {
    const { x, y, height, width } = this.meta;
    const fill = this.theme.view.cell.interactiveBgColor;
    this.interactiveBgShape = renderRect(
      x,
      y,
      width,
      height,
      'transparent',
      'transparent',
      this,
    );
    this.stateShapes.push(this.interactiveBgShape);
  }

  /**
   * Draw icon condition shape
   * @private
   */
  protected drawIconShape() {
    const { x, y, height, width } = this.meta;
    const iconCondition = this.findFieldCondition(this.conditions?.icon);
    if (iconCondition && iconCondition.mapping) {
      const attrs = this.mappingValue(iconCondition);
      const { formattedValue } = this.getData();
      // icon only show when icon not empty and value not null(empty)
      if (!isEmpty(attrs?.icon) && formattedValue) {
        this.iconShape = new GuiIcon({
          type: attrs.icon,
          x: x + width - ICON_PADDING - ICON_SIZE,
          y: y + height / 2 - ICON_SIZE / 2,
          width: ICON_SIZE,
          height: ICON_SIZE,
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
        let scale;
        let zero;
        let current;
        if (attrs.isCompare) {
          // value in range(compare) condition
          scale = this.getIntervalScale(attrs.minValue || 0, attrs.maxValue);
          zero = scale(0); // 零点
          current = scale(this.meta.fieldValue); // 当前数据点
        } else {
          // the other conditions， keep old logic
          // TODO this logic need be changed!!!
          const summaryField = this.meta.valueField;
          const pivot = this.spreadsheet.dataSet.pivot;
          if (pivot) {
            const MIN = summaryField
              ? pivot.getTotals(summaryField, {}, 'MIN')
              : 0;
            const MAX = summaryField
              ? pivot.getTotals(summaryField, {}, 'MAX')
              : 0;
            scale = this.getIntervalScale(MIN, MAX);
            zero = scale(0); // 零点
            current = scale(this.meta.fieldValue); // 当前数据点
          }
        }
        // eslint-disable-next-line no-multi-assign
        stroke = fill = attrs.fill;

        const bgHeight = this.theme.view.cell.intervalBgHeight;
        this.intervalShape = renderRect(
          x + width * zero,
          y + height / 2 - bgHeight / 2,
          width * (current - zero),
          bgHeight,
          fill,
          stroke,
          this,
        );
      }
    }
  }

  protected getDerivedData(derivedValue: string, isTotals = false) {
    const data = this.meta.data;
    if (data) {
      let value;
      if (isTotals) {
        value = get(data, [0, VALUE_FIELD]);
      } else {
        value = get(data, [0, derivedValue]);
      }
      const up = isNumber(value) ? value >= 0 : false;
      const formatter = this.spreadsheet.dataSet.getFieldFormatter(
        derivedValue,
      );
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

  /**
   * Render cell main text and derived text
   */
  protected drawTextShape() {
    const { x, y, height, width } = this.getLeftAreaBBox();
    const { valueField: originField, isTotals } = this.meta;

    if (this.spreadsheet.isDerivedValue(originField)) {
      const data = this.getDerivedData(originField, isTotals);
      // 衍生指标的cell, 需要单独的处理
      this.add(
        new DerivedCell({
          x,
          y,
          height,
          width,
          up: data.up,
          text: data.value,
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
      ? this.theme.view.bolderText
      : this.theme.view.text;
    let textFill = textStyle.fill;
    if (textCondition?.mapping) {
      textFill = this.mappingValue(textCondition)?.fill || textStyle.fill;
    }
    const padding = this.theme.view.cell.padding;
    this.textShape = renderText(
      this.textShape,
      x + width - padding[1],
      y + height / 2,
      getEllipsisText(text || '-', width - padding[3] - padding[1], textStyle),
      textStyle,
      textFill,
      this,
    );
  }

  /**
   * Render cell border controlled by verticalBorder & horizontalBorder
   * @private
   */
  protected drawBorderShape() {
    const { x, y, height, width } = this.meta;
    const borderColor = this.theme.view.cell.borderColor;
    const borderWidth = this.theme.view.cell.borderWidth;

    // horizontal border
    renderLine(x, y, x + width, y, borderColor[0], borderWidth[0], this);

    // vertical border
    renderLine(
      x + width,
      y,
      x + width,
      y + height,
      borderColor[1],
      borderWidth[1],
      this,
    );
  }
}
