import { clamp } from 'lodash';
import type { IconCondition } from '../../common/interface';
import { parseNumberWithPrecision } from '../formatter';

export const getIconPosition = (condition: IconCondition) =>
  condition?.position ?? 'right';

/*
 * 生成柱状图的的绘制范围，柱状图的生成逻辑都是统一的负左正右的逻辑
 * 分为以下几种情况：
 * 1. maxValue > minValue >=0，柱状图从最左侧开始绘制，范围是 min -- max， 可以认为 0 点此时和 min 重合
 * 0 min                      max
 * | |                        |
 * | +------------------------+
 * | |▉▉▉▉▉▉▉                 |
 * | +------------------------+
 * 2. maxValue > 0 > minValue，柱状图从0点开始绘制，范围是 min -- 0 --  max
 * min          0            max
 *  |           |            |
 *  +-----------|------------+
 *  |    ▉▉▉▉▉▉▉|▉▉▉▉        |
 *  +-----------|------------+
 * 3. 0 >= maxValue > minValue，柱状图从最右侧开始绘制，范围是 min -- max，可以认为 0 点此时和 max 重合
 * min                      max 0
 *  |                        |  |
 *  +------------------------+  |
 *  |             ▉▉▉▉▉▉▉▉▉▉▉|  |
 *  +------------------------+  |
 */
export const getIntervalScale = (minValue = 0, maxValue = 0) => {
  minValue = parseNumberWithPrecision(minValue);
  maxValue = parseNumberWithPrecision(maxValue);

  const allPositiveValue = minValue >= 0;
  const bothPositiveAndNegativeValue = maxValue >= 0 && minValue <= 0;

  const zeroForEitherPositiveOrNegative = allPositiveValue
    ? minValue
    : maxValue;
  const zero = bothPositiveAndNegativeValue
    ? 0
    : zeroForEitherPositiveOrNegative;

  const distance = maxValue - minValue;

  return (current: number) => {
    const zeroScaleForEitherPositiveOrNegative = allPositiveValue ? 0 : 1;
    const zeroScale = bothPositiveAndNegativeValue
      ? clamp(Math.abs(0 - minValue) / distance, 0, 1)
      : zeroScaleForEitherPositiveOrNegative;

    // scale 为负值时，代表方向绘制（g支持的模式）
    const scale = clamp((current - zero) / distance, -1, 1);

    return { zeroScale, scale };
  };
};
