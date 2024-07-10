import { isNull, isUndefined } from 'lodash';
import type { SimpleData } from '../../common';
import {
  NODE_ID_SEPARATOR,
  NULL_SYMBOL_ID,
  ROOT_NODE_ID,
  UNDEFINED_SYMBOL_ID,
} from '../../common/constant';

/**
 * 维值转为字符串时, 如果是null/undefined, 则添加标记, 便于转回来.
 * null/undefined => "$$null$$/$$undefined$$"
 */
export const generateNillString = (value: SimpleData) => {
  if (isUndefined(value)) {
    return UNDEFINED_SYMBOL_ID;
  }

  if (isNull(value)) {
    return NULL_SYMBOL_ID;
  }

  return String(value);
};

/**
 * 维值如果含有空值标记, 则转换为 null/undefined.
 * "$$null$$/$$undefined$$"" => null/undefined
 */
export const resolveNillString = (value: string) => {
  if (value === NULL_SYMBOL_ID) {
    return null;
  }

  if (value === UNDEFINED_SYMBOL_ID) {
    return undefined;
  }

  return value;
};

export const generateId = (...ids: SimpleData[]): string => {
  return ids.map(generateNillString).join(NODE_ID_SEPARATOR);
};

export const resolveId = (id = '') => {
  return id.split(NODE_ID_SEPARATOR).reduce<SimpleData[]>((result, current) => {
    if (current === ROOT_NODE_ID) {
      return result;
    }

    result.push(resolveNillString(current));

    return result;
  }, []);
};
