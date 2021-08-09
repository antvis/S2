import {
  Condition,
  Conditions,
  IconCondition,
  IconTheme,
} from '@/common/interface';
import { isNumber } from 'lodash';

export const getIconLayoutPosition = (condition: IconCondition) => {
  return condition?.iconPosition ?? 'right';
};

const UP_ICON = 'CellUp';
const DOWN_ICON = 'CellDown';

export const isPositive = (value: number | string): boolean => {
  if (isNumber(value)) {
    return value >= 0;
  }
  return !/^-/.test(value);
};

const generateDefaultCondition = (
  values: string[] = [],
  iconTheme: IconTheme,
) => {
  const iconCondition: IconCondition[] = [];
  const textCondition: Condition[] = [];

  values.forEach((value) => {
    iconCondition.push({
      field: value,
      iconPosition: 'left',
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

const updateCondition = (
  rawCondition: Condition[] = [],
  updatedCondition: Condition[] = [],
) => {
  const result: Condition[] = updatedCondition;
  rawCondition.forEach((condition) => {
    if (!result.find((i) => i.field === condition.field)) {
      result.push(condition);
    }
  });
  return result;
};

export const updateConditionsByValues = (
  conditions: Conditions = {},
  values: string[] = [],
  iconTheme: IconTheme,
) => {
  if (values.length === 0) {
    return conditions;
  }

  const { textCondition, iconCondition } = generateDefaultCondition(
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
