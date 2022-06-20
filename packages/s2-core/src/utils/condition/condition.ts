import { clamp } from 'lodash';
import type { IconCondition, MappingResult } from '../../common/interface';
import { parseNumberWithPrecision } from '../formatter';

export const getIconPositionCfg = (condition: IconCondition) => {
  return condition?.position ?? 'right';
};

export const normalizeIntervalConditionMappingResult = (
  result: MappingResult,
): MappingResult => {
  return {
    ...result,
    negativeFill: result.negativeFill ?? result.fill,
  };
};

export const getIntervalScale = (
  minValue = 0,
  maxValue = 0,
  enableNegativeInterval = false,
) => {
  minValue = parseNumberWithPrecision(minValue);
  maxValue = parseNumberWithPrecision(maxValue);

  // 只有在 minValue____0____maxValue 这样的区间，才需要真正的区分正负柱状图范围
  const realEnableNegativeInterval =
    enableNegativeInterval && maxValue >= 0 && minValue <= 0;

  const zero = realEnableNegativeInterval ? 0 : minValue;
  const distance = maxValue - minValue;

  return (current: number) => {
    const isNegative = realEnableNegativeInterval && current < 0;

    // 柱状图起始坐标是从这个区间的百分之X开始的，分为以下几种情况：
    // 1. 如果不是开启正负柱状图的情况，一律都是从 0% 开始绘制
    // 2. 否则：
    //    1. 如果当前值是正值，则从0点开始绘制： minValue____[0____current]____maxValue
    //    1. 如果当前值是负值，则从current点开始绘制： minValue___[current____0]____maxValue
    const zeroScale = realEnableNegativeInterval
      ? clamp(Math.abs((current > 0 ? 0 : current) - minValue) / distance, 0, 1)
      : 0;

    const scale = clamp(Math.abs(current - zero) / distance, 0, 1);
    return { isNegative, zeroScale, scale };
  };
};
