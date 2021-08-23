import { GuiIcon } from '@/common/icons';
import {
  CellBoxCfg,
  Condition,
  ConditionLayer,
  Conditions,
  Formatter,
  IconCfg,
  IconCondition,
  MappingResult,
  SpreadSheetTheme,
  ViewMeta,
} from '@/common/interface';
import { DataItem } from '@/common/interface/s2DataConfig';
import { SpreadSheet } from '@/sheet-type';
import { getIconLayoutPosition } from '@/utils/condition';
import {
  getContentArea,
  getIconPosition,
  getTextAndIconArea,
  getTextPosition,
} from '@/utils/data-cell';
import { renderIcon, renderRect, renderText } from '@/utils/g-renders';
import { getEllipsisText } from '@/utils/text';
import { Group, IShape, SimpleBBox } from '@antv/g-canvas';
import { find, get, isEmpty } from 'lodash';

/**
 * Cell Condition for panelGroup area
 * ----------------------------
 * |                  |       |
 * |interval      text| icon  |
 * |                  |       |
 * ----------------------------
 * There are four conditions to determine how to render
 * 1、background color
 * 2、icon align in right with size
 * 3、interval rect area is interval
 * 4、text area
 */
export class CellCondition extends Group {
  // all condition shapes, including bg, interval, icon, text
  protected conditionShapes = new Map<ConditionLayer, IShape | GuiIcon>();

  constructor(
    protected spreadsheet: SpreadSheet,
    protected meta: ViewMeta,
    protected theme: SpreadSheetTheme,
    protected conditions: Conditions,
  ) {
    super({});
    this.spreadsheet = spreadsheet;
    this.meta = meta;
    this.theme = theme;
    this.conditions = conditions;
    this.initConditions();
  }

  initConditions() {
    this.drawBgShape();
    this.drawIntervalShape();
    this.drawIconShape();
    this.drawTextShape();
  }

  protected getData(): { value: DataItem; formattedValue: DataItem } {
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
   * Mapping value to get condition related attrs
   * @param condition
   */
  protected mappingValue(condition: Condition): MappingResult {
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
    this.conditionShapes.set(
      'text',
      renderText(
        this,
        [this.conditionShapes.get('text') as IShape],
        position.x,
        position.y,
        ellipsisText,
        {
          ...textStyle,
          fill: textFill,
        },
      ),
    );
  }

  /**
   * Draw background condition shape
   */
  protected drawBgShape() {
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
        this.conditionShapes.set(
          'background',
          renderRect(this, {
            x,
            y,
            width,
            height,
            fill,
            stroke,
          }),
        );
      }
    }
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
        this.conditionShapes.set(
          'icon',
          renderIcon(this, {
            ...position,
            type: attrs.icon,
            width: size,
            height: size,
            fill: attrs.fill,
          }),
        );
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
        this.conditionShapes.set(
          'interval',
          renderRect(this, {
            x: x + width * zero,
            y: y + height / 2 - barChartHeight / 2,
            width: width * (current - zero),
            height: barChartHeight,
            fill,
            stroke,
          }),
        );
      }
    }
  }
}
