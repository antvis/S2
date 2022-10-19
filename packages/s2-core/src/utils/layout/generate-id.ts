import { isNull, isUndefined } from 'lodash';
import {
  ID_SEPARATOR,
  NULL_SYMBOL_ID,
  ROOT_ID,
  UNDEFINED_SYMBOL_ID,
} from '../../common/constant';
/**
 * Row and column header node id generator.
 * @param parentId
 * @param value
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
    .join(ID_SEPARATOR);
};

export const resolveId = (id = '') => {
  return id.split(ID_SEPARATOR).reduce((result, current) => {
    if (current === ROOT_ID) {
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
