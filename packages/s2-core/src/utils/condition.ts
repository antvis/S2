import { Condition, Conditions, IconCondition } from '@/common/interface';
import { isNumber } from 'lodash';

export const getIconPosition = (condition: IconCondition) => {
  return condition?.iconPosition ?? 'right';
};

const UP_FILL_COLOR = '#F46649';
const DOWN_FILL_COLOR = '#2AA491';
const UP_ICON = 'CellUp';
const DOWN_ICON = 'CellDown';

const isPositive = (value: number | string): boolean => {
  if (isNumber(value)) {
    return value >= 0;
  }
  return !/^-/.test(value);
};

const generateDerivedValueCondition = (derivedValues: string[] = []) => {
  const iconCondition: IconCondition[] = [];
  const textCondition: Condition[] = [];

  derivedValues.forEach((value) => {
    iconCondition.push({
      field: value,
      iconPosition: 'left',
      mapping(fieldValue: string | number) {
        const positive = isPositive(fieldValue);
        return {
          fill: positive ? UP_FILL_COLOR : DOWN_FILL_COLOR,
          icon: positive ? UP_ICON : DOWN_ICON,
        };
      },
    });
    textCondition.push({
      field: value,
      mapping(fieldValue: string | number) {
        const positive = isPositive(fieldValue);
        return {
          fill: positive ? UP_FILL_COLOR : DOWN_FILL_COLOR,
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

export const updateConditionsByDerivedValues = (
  conditions: Conditions = {},
  derivedValues: string[] = [],
) => {
  if (derivedValues.length === 0) {
    return conditions;
  }

  const { textCondition, iconCondition } = generateDerivedValueCondition(
    derivedValues,
  );

  const updatedConditions: Conditions = {
    text: updateCondition(conditions.text, textCondition),
    icon: updateCondition(conditions.icon, iconCondition),
    interval: conditions.interval,
    background: conditions.background,
  };
  return updatedConditions;
};
