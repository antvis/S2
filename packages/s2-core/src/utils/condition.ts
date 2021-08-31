import { DOWN_ICON, UP_ICON } from '@/common/constant';
import {
  Condition,
  Conditions,
  IconCondition,
  IconTheme,
} from '@/common/interface';
import { isEmpty, isNumber } from 'lodash';

export const getIconPositionCfg = (condition: IconCondition) => {
  return condition?.position ?? 'right';
};

export const isPositive = (value: number | string): boolean => {
  if (isNumber(value)) {
    return value >= 0;
  }
  return !/^-/.test(value);
};

/**
 * generate default conditions, including icon condition and text condition
 */
const generateIndicateCondition = (
  values: string[] = [],
  iconTheme: IconTheme,
) => {
  const iconCondition: IconCondition[] = [];
  const textCondition: Condition[] = [];

  values.forEach((value) => {
    iconCondition.push({
      field: value,
      position: 'left',
      mapping(fieldValue: string | number) {
        const positive = isPositive(fieldValue);
        return {
          fill: positive ? iconTheme.upIconColor : iconTheme.downIconColor,
          icon: positive ? UP_ICON : DOWN_ICON,
        };
      },
    });
    textCondition.push({
      field: value,
      mapping(fieldValue: string | number) {
        const positive = isPositive(fieldValue);
        return {
          fill: positive ? iconTheme.upIconColor : iconTheme.downIconColor,
        };
      },
    });
  });
  return { textCondition, iconCondition };
};

/**
 * merge updated conditions into original conditions, if update condition exists in original conditions, the original one has higher priority
 * @param rawCondition conditions in options cfg
 * @param updatedCondition conditions which need to merge into raw conditions, and have lower priority
 * @returns merged conditions
 */
const updateCondition = (
  rawCondition: Condition[] = [],
  updatedCondition: Condition[] = [],
) => {
  const result: Condition[] = [...rawCondition];
  updatedCondition.forEach((condition) => {
    if (!result.find((i) => i.field === condition.field)) {
      result.push(condition);
    }
  });
  return result;
};

/**
 * handle indicateConditionValues in options cfg, map them into default conditions
 * @param conditions conditions in options cfg
 * @param values represent indicateConditionValues in options cfg
 * @param iconTheme semantic color that icon will use
 * @returns merged options
 */
export const updateConditionsByValues = (
  conditions: Conditions = {},
  values: string[] = [],
  iconTheme: IconTheme,
) => {
  if (isEmpty(values)) {
    return conditions;
  }
  const { textCondition, iconCondition } = generateIndicateCondition(
    values,
    iconTheme,
  );

  const updatedConditions: Conditions = {
    text: updateCondition(conditions.text, textCondition),
    icon: updateCondition(conditions.icon, iconCondition),
    interval: conditions.interval,
    background: conditions.background,
  };
  return updatedConditions;
};
