import { isEmpty, isNil } from 'lodash';
import type { Fields } from '../../common/interface';

export const getCellPadding = () => {
  const padding = [12, 4, 12, 4];
  const left = isNil(padding[3]) ? 0 : padding[3];
  const right = isNil(padding[1]) ? 0 : padding[1];
  const top = isNil(padding[0]) ? 0 : padding[0];
  const bottom = isNil(padding[2]) ? 0 : padding[2];
  return {
    left,
    right,
    top,
    bottom,
  };
};

/**
 * fields 的 rows、columns、values、customTreeItems 值都为空时，返回 true
 * @param {Fields} fields
 * @return {boolean}
 */
export const areAllFieldsEmpty = (fields: Fields) => {
  return (
    isEmpty(fields.rows) &&
    isEmpty(fields.columns) &&
    isEmpty(fields.values) &&
    isEmpty(fields.customTreeItems)
  );
};
