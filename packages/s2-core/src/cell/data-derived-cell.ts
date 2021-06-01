import { getEllipsisText } from '../utils/text';
import {
  get,
  isEmpty,
  slice,
  find,
  keys,
  isEqual,
  set,
  merge,
  includes,
  isArray,
} from 'lodash';
import { renderRect, renderText } from '../utils/g-renders';
import { DerivedCell, DataCell } from ".";
import { KEY_COL_REAL_WIDTH_INFO } from '../common/constant';
import { SpreadSheet } from "src/sheet-type";

/**
 * Data with derived data cell
 * |----------|------------|
 * | main data|derived data|
 * |----------|------------|
 */
export class DataDerivedCell extends DataCell {
  protected initCell() {
    this.initCellRightBorder();
    super.initCell();
  }

  protected drawTextShape() {
    const { x, y, height, valueField, isTotals, colQuery } = this.meta;

    //  the size of text condition is equal with valueFields size
    const textCondition = this.findFieldCondition(this.conditions?.text);

    // 主指标的条件格式
    const { formattedValue: text } = this.getData();
    const textStyle = isTotals
      ? get(this.spreadsheet, 'theme.view.bolderText')
      : get(this.spreadsheet, 'theme.view.text');
    let textFill = textStyle.fill;
    if (get(textCondition, 'mapping')) {
      textFill = this.mappingValue(textCondition)?.fill || textStyle.fill;
    }

    const widthInfos = get(
      this.spreadsheet.store.get(KEY_COL_REAL_WIDTH_INFO),
      'widthInfos',
    );
    const key = find(keys(widthInfos), (wi) =>
      isEqual(JSON.parse(wi), colQuery),
    ) as any;
    const infos = get(widthInfos, key);
    const mainInfo = get(infos, 0);
    // 1、绘制主指标
    const mainX = x + mainInfo?.x + mainInfo?.width;
    const mainY = y + height / 2;
    const values = this.spreadsheet.dataCfg.fields.values;
    let finalText;
    if (isArray(values)) {
      // 行维度存在的情况
      finalText = text || '-';
    } else {
      const exist = includes(values?.measures, valueField);
      finalText = text || (exist ? '-' : '');
    }
    const mainText = getEllipsisText(finalText, mainInfo?.width, textStyle);

    if (SpreadSheet.DEBUG_ON) {
      renderRect(
        x + mainInfo?.x,
        y,
        mainInfo?.width,
        height,
        '#ef1',
        '#ffffffff',
        this,
      );
    }

    this.textShape = renderText(
      this.textShape,
      mainX,
      mainY,
      mainText,
      merge({}, textStyle, {
        textAlign: 'end',
      }),
      textFill,
      this,
    );

    // 2、绘制衍生指标
    const derivedInfos = slice(infos, 1);
    const derivedValue = this.spreadsheet.getDerivedValue(valueField);
    const displayDerivedValues = derivedValue.displayDerivedValueField;
    if (isEmpty(derivedValue?.derivedValueField)) {
      // 没有衍生指标
    } else {
      // 多列平铺
      for (let i = 0; i < displayDerivedValues.length; i += 1) {
        const info = derivedInfos[i] as any;
        const currentDerivedX = x + info?.x;
        const data = this.getDerivedData(displayDerivedValues[i]);
        this.add(
          new DerivedCell({
            x: currentDerivedX,
            y,
            height,
            width: info?.width,
            up: data.up,
            text: data.value,
            spreadsheet: this.spreadsheet,
          }),
        );
      }
    }
  }

  protected initCellRightBorder() {
    set(this.spreadsheet, 'theme.view.cell.verticalBorder', true);
  }
}
