import { getEllipsisText } from '../utils/text';
import * as _ from 'lodash';
import BaseSpreadsheet from '../sheet-type/base-spread-sheet';
import { renderRect, renderText, updateShapeAttr } from '../utils/g-renders';
import { DerivedCell, DataCell } from '.';
import { KEY_COL_REAL_WIDTH_INFO } from '../common/constant';

/**
 * 决策形态的data-cell
 * 主要是新增衍生指标的实现
 */
export class StrategyDataCell extends DataCell {
  protected initCell() {
    this.initCellRightBorder();
    super.initCell();
  }

  protected initTextShape() {
    const { x, y, height, width, valueField, isTotals, colQuery } = this.meta;

    //  the size of text condition is equal with valueFields size
    const textCondition = this.findFieldCondition(this.conditions?.text);

    // 主指标的条件格式
    const { formattedValue: text } = this.getData();
    const textStyle = isTotals
      ? _.get(this.spreadsheet, 'theme.view.bolderText')
      : _.get(this.spreadsheet, 'theme.view.text');
    let textFill = textStyle.fill;
    if (_.get(textCondition, 'mapping')) {
      textFill = this.mappingValue(textCondition)?.fill || textStyle.fill;
    }

    const widthInfos = _.get(
      this.spreadsheet.store.get(KEY_COL_REAL_WIDTH_INFO),
      'widthInfos',
    );
    const key = _.find(_.keys(widthInfos), (wi) =>
      _.isEqual(JSON.parse(wi), colQuery),
    ) as any;
    const infos = _.get(widthInfos, key);
    const mainInfo = _.get(infos, 0);
    // 1、绘制主指标
    const mainX = x + mainInfo?.x + mainInfo?.width;
    const mainY = y + height / 2;
    const values = this.spreadsheet.dataCfg.fields.values;
    let finalText = text || (_.isArray(values) ? '-' : '');
    if (_.isArray(values)) {
      // 行维度存在的情况
      finalText = text || '-';
    } else {
      const exsis = _.includes(values?.measures, valueField);
      finalText = text || (exsis ? '-' : '');
    }
    const mainText = getEllipsisText(finalText, mainInfo?.width, textStyle);

    if (BaseSpreadsheet.DEBUG_ON) {
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
      _.merge({}, textStyle, {
        textAlign: 'end',
      }),
      textFill,
      this,
    );

    // 2、绘制衍生指标
    const derivedInfos = _.slice(infos, 1);
    const derivedValue = this.spreadsheet.getDerivedValue(valueField);
    const derivedValues = derivedValue.derivedValueField;
    const displayDerivedValues = derivedValue.displayDerivedValueField;
    if (_.isEmpty(derivedValue?.derivedValueField)) {
      // 没有衍生指标
    } else {
      // 多列平铺
      for (let i = 0; i < displayDerivedValues.length; i++) {
        const info = derivedInfos[i] as any;
        const currentDerivedX = x + info.x;
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
    _.set(this.spreadsheet, 'theme.view.cell.verticalBorder', true);
  }
}
