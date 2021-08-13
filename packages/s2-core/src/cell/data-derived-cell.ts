import { renderRect, renderText } from '@/utils/g-renders';
import {
  find,
  get,
  includes,
  isArray,
  isEmpty,
  isEqual,
  keys,
  merge,
  set,
  slice,
} from 'lodash';
import { SpreadSheet } from 'src/sheet-type';
import { DataCell, DerivedCell } from '.';
import { getEllipsisText } from '../utils/text';

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
      ? get(this.spreadsheet, 'theme.dataCell.bolderText')
      : get(this.spreadsheet, 'theme.dataCell.text');
    let textFill = textStyle.fill;
    if (get(textCondition, 'mapping')) {
      textFill = this.mappingValue(textCondition)?.fill || textStyle.fill;
    }

    const widthInfos = get(
      this.spreadsheet.store.get('col-real-width-info'),
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
      const exist = includes((values as any)?.measures, valueField);
      finalText = text || (exist ? '-' : '');
    }
    const mainText = getEllipsisText(finalText, mainInfo?.width, textStyle);

    if (SpreadSheet.DEBUG_ON) {
      renderRect(this, {
        x: x + mainInfo?.x,
        y: y,
        width: mainInfo?.width,
        height,
        fill: '#ef1',
        stroke: '#ffffffff',
      });
    }

    this.textShape = renderText(
      [this.textShape],
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
    const displayDerivedValues = derivedValue.derivedValueField;
    if (isEmpty(derivedValue?.derivedValueField)) {
      // 没有衍生指标
    } else {
      // 多列平铺
      for (let i = 0; i < displayDerivedValues.length; i += 1) {
        const info = derivedInfos[i] as any;
        const currentDerivedX = x + info?.x;
        const data = this.getDerivedData(displayDerivedValues[i]);
        const dataValue = data.value as string;
        this.add(
          new DerivedCell({
            x: currentDerivedX,
            y,
            height,
            width: info?.width,
            up: data.up,
            text: dataValue,
            spreadsheet: this.spreadsheet,
          }),
        );
      }
    }
  }

  protected initCellRightBorder() {
    set(this.spreadsheet, 'theme.dataCell.cell.verticalBorderColor', true);
  }
}
