import { isNull, isUndefined } from 'lodash';
import {
  NODE_ID_SEPARATOR,
  NULL_SYMBOL_ID,
  ROOT_NODE_ID,
  UNDEFINED_SYMBOL_ID,
} from '../../common/constant';

/**
 * Row and column header node id generator.
 */

export const generateId = (...ids: string[]): string => {
  return ids
    .map((value) => {
      if (isUndefined(value)) {
        return UNDEFINED_SYMBOL_ID;
      }

      if (isNull(value)) {
        return NULL_SYMBOL_ID;
      }

      return String(value);
    })
    .join(NODE_ID_SEPARATOR);
};

export const resolveId = (id = '') => {
  return id
    .split(NODE_ID_SEPARATOR)
    .reduce<(string | null | undefined)[]>((result, current) => {
      if (current === ROOT_NODE_ID) {
        return result;
      }

      if (current === NULL_SYMBOL_ID) {
        result.push(null);
      } else if (current === UNDEFINED_SYMBOL_ID) {
        result.push(undefined);
      } else {
        result.push(current);
      }

      return result;
    }, []);
};
