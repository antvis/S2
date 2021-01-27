import { measureTextWidth, measureTextWidthRoughly } from '../../../utils/text';
import * as _ from '@antv/util';
import { DEFAULT_PADDING, VALUE_FIELD } from '../../../common/constant';
import { DefaultTheme } from '../../../theme';
import { SORT_ICON_SIZE } from './add-detail-type-sort-icon';

const MIN_TEXT_WIDTH = 60;
// 总计没有统计我们策略里面，总计一般情况下不会多余4位数，所以手动增加padding适应总计。
// 36 = 16 + 20（视觉体验优化 + 单位 / icon + ...）
const MAX_TEXT_PADDING = 36;

/**
 * 当前列中，最长文字的宽度为当列宽度。如果小于最小宽度（MIN_TEXT_WIDTH: 60），则为最小宽度。
 * 总计没有统计我们策略里面，总计一般情况下不会多余4位数，所以手动增加padding适应总计。
 * |-------| --------- text -------------|-------|
 * |padding| <---------- textWidth ------------->|
 * @param current Hierarchy
 * @param records { $$column$$,$$value$$,area,city,date,order_amt,province,sub_type,type }
 * @param colLabel 当列的label值
 * @param isSpreadsheetType
 * @return number
 */
export default function getColMaxTextWidth(
  current,
  records,
  colLabel,
  isSpreadsheetType,
  dataset,
) {
  const { isLeaf, isTotals } = current;
  let formatter;
  const textStyle =
    isLeaf && !isTotals
      ? DefaultTheme.header.text
      : DefaultTheme.header.bolderText;

  // 性能优化：由于同列量级相同，故取前50行比较取字符最长的。
  if (isSpreadsheetType) {
    // 交叉表
    const maxTextRecord = _.maxBy(records.slice(0, 50), (record) => {
      // 20191218 修复 record[VALUE_FIELD] = null 问题
      return ((record && record[VALUE_FIELD]) || '').length;
    });
    if (maxTextRecord) {
      formatter = dataset.getFieldFormatter(current.value);
      const maxValue = formatter(maxTextRecord[VALUE_FIELD] || '');
      // console.log(colLabel, maxValue);
      const maxLabel =
        _.get(colLabel, 'length', 0) > maxValue.toString().length
          ? colLabel
          : maxValue.toString();
      const maxTextRecordWidth = measureTextWidth(maxLabel, textStyle);
      const colWidth = maxTextRecordWidth + MAX_TEXT_PADDING;
      return Math.max(MIN_TEXT_WIDTH, colWidth);
    }
  } else {
    // 明细表
    // eslint-disable-next-line no-lonely-if
    if (records) {
      const maxDimValue = _.maxBy(records.slice(0, 50), (dimValue) => {
        return _.get(dimValue, 'length', 0);
      });
      if (maxDimValue) {
        formatter = dataset.getFieldFormatter(current.field);
        const maxValue = formatter(maxDimValue || '');
        const maxLabel =
          _.get(colLabel, 'length', 0) > maxValue.length ? colLabel : maxValue;
        const maxTextRecordWidth = measureTextWidth(
          maxLabel,
          DefaultTheme.header.text,
        );
        const colWidth =
          maxTextRecordWidth +
          MAX_TEXT_PADDING +
          SORT_ICON_SIZE +
          DEFAULT_PADDING;
        return Math.max(MIN_TEXT_WIDTH, colWidth);
      }
    }
  }
  // text没有记录的时候还是要用colLabel计算
  return Math.max(
    MIN_TEXT_WIDTH,
    measureTextWidthRoughly(colLabel, DefaultTheme.header.text) +
      MAX_TEXT_PADDING,
  );
}
